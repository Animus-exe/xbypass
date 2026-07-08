(() => {
if (window.__xbypassInjected) {
  return;
}
window.__xbypassInjected = true;

let authHeaders;

// Create a dummy container to hold the modal HTML
const terminalContainer = document.createElement('span');

// Use innerHTML to build the modal. IDs are added for easy selection.
terminalContainer.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
        <div style="background: #222; border-radius: 10px; box-shadow: 0 4px 32px rgba(0,0,0,0.8); width: 75vw; height: 50vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px;">
            <textarea readonly style="width: 100%; height: 100%; background: #000; color: #00FF00; font-family: monospace; font-size: 1.1em; border: none; resize: none; outline: none; padding: 10px; box-sizing: border-box;"></textarea>
            <button disabled style="background-color: white; border: white 5px solid; border-radius: 5px; width: 100%; text-align: center;">...</button>
            <input type="file" style="display: none" accept="image/jpeg">
        </div>
    </div>
`;

// Append the modal to the body and get handles to the elements
const mountRoot = document.body || document.documentElement;
mountRoot.appendChild(terminalContainer);
let logBox = terminalContainer.querySelector('textarea');
let actionButton = terminalContainer.querySelector('button');

let filePickerInput = terminalContainer.querySelector('input[type="file"]');
filePickerInput.onchange = async function() {
    actionButton.disabled = true;
    if (filePickerInput.files.length == 1) {
        const file = filePickerInput.files[0];
        filePickerInput.value = '';
        performValidation(file);
    } else {
        actionButton.disabled = false;
    }
}

function appendLog(line) {
    if (logBox.value) {
        logBox.value += '\n' + line;
    } else {
        logBox.value = line;
    }
    logBox.scrollTo(0, 1e6);
}

appendLog('Installing XMLHttpRequest hook');

const originalXhrOpen = XMLHttpRequest.prototype.open;
const originalXhrSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

XMLHttpRequest.prototype.open = function (method, url, ...args) {
    if (url.toString().endsWith('/graphql/viewer_context.json')) {
        this._requestHeaders = {};
    }
    return originalXhrOpen.apply(this, [method, url, ...args]);
};

XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
    if (this._requestHeaders && header.toLowerCase() != 'content-type') {
        this._requestHeaders[header] = value;
    }
    return originalXhrSetRequestHeader.apply(this, [header, value]);
};

XMLHttpRequest.prototype.send = function () {
    if (this._requestHeaders && window._onXhrIntercepted) {
        window._onXhrIntercepted(this._requestHeaders);
        window._onXhrIntercepted = null;
    }
    // Do not really perform calls, to avoid the app from refreshing the bearer token while we work
};

appendLog('Waiting for authentication headers');

window._onXhrIntercepted = (headers) => {
    window._onXhrIntercepted = null;
    authHeaders = headers;
    appendLog('Got headers! Pick an image now');

    actionButton.disabled = false;
    actionButton.onclick = () => {
        filePickerInput.click();
    };
    actionButton.innerText = "Pick a selfie image";
}

async function uploadImage(image) {
    appendLog('Uploading image...')

    appendLog(' - Initializing...')
    let initResponse;
    try {
        initResponse = await fetch(`https://upload.x.com/i/media/upload.json?command=INIT&total_bytes=${image.size}&media_type=${encodeURIComponent(image.type)}&media_category=tweet_image`, {
            method: "POST",
            headers: authHeaders,
            credentials: 'include'
        });
        initResponse = await initResponse.json();
    } catch (e) {
        appendLog(`Failed to initialize upload: ${e}. Aborting.`);
        console.error('Failed to initialize upload', e);
        actionButton.disabled = false;
        return;
    }

    const mediaId = initResponse.media_id_string;
    if (!mediaId) {
        appendLog(`Failed to get media ID from init: ${JSON.stringify(initResponse)}`);
        actionButton.disabled = false;
        return;
    }

    appendLog(` - Initialized, media ID: ${mediaId}. Uploading...`);
    const appendFormData = new FormData();
    appendFormData.append('media', image);
    appendFormData.append('command', 'APPEND');
    appendFormData.append('media_id', mediaId);
    appendFormData.append('segment_index', '0');

    try {
        await fetch("https://upload.x.com/i/media/upload.json", {
            method: "POST",
            headers: authHeaders,
            body: appendFormData,
            credentials: 'include'
        });
    } catch (e) {
        appendLog(`Failed to append image data: ${e}. Aborting.`);
        console.error('Failed to append image data', e);
        return null;
    }

    appendLog(' - Finalizing...');
    try {
        await fetch(`https://upload.x.com/i/media/upload.json?command=FINALIZE&media_id=${mediaId}`, {
            method: "POST",
            headers: authHeaders,
            credentials: 'include'
        });
    } catch (e) {
        appendLog(`Failed to finalize upload: ${e}. Aborting.`);
        console.error('Failed to finalize upload', e);
        return null;
    }
    appendLog('Successfully uploaded');
    return mediaId;
}

async function performValidation(image) {
    appendLog('------');

    const mediaId = await uploadImage(image);
    if (!mediaId) {
        processFailed();
        return false;
    }

    let selfieRequest;
    try {
        selfieRequest = await fetch("https://x.com/i/api/graphql/PNS64VQh2A8sOThhLUZGww/StartSelfieAgeVerificationMutation", {
            headers: {
                ...authHeaders,
                'content-type': 'application/json'
            },
            body: `{"variables":{"imageId":"${mediaId}"}}`,
            method: "POST",
            credentials: 'include'
        });
        selfieRequest = await selfieRequest.json();
    } catch (e) {
        appendLog(`Fetch failed ${e}. Aborting.`);
        console.error('Fetch failed', e);
        processFailed();
        return;
    }

    let selfieErrors = selfieRequest.data?.start_selfie_age_verification?.errors;
    if (selfieErrors && selfieErrors.length) {
        appendLog('Backend reported errors:');
        for (const line of selfieErrors) {
            appendLog(' - ' + line);
        }
        processFailed();
        return;
    }

    const transactionId = selfieRequest.data?.start_selfie_age_verification?.transaction_id;
    if (!transactionId) {
        appendLog('Backend reported no error but also no transaction ID?')
        processFailed();
        return;
    }
    appendLog(`Transaction ID: ${transactionId}. Waiting for result...`);

    setTimeout(() => {
        checkTransactionResult(transactionId, 0);
    }, 1000);
}

async function checkTransactionResult(transactionId, attempt) {
    appendLog(`Fetching status, attempt ${attempt}...`);

    let resultRequest;
    try {
        resultRequest = await fetch("https://x.com/i/api/graphql/sHACVgKhyAr4KlpWm3_MMw/StartSelfieAgeVerificationStatus", {
            headers: {
                ...authHeaders,
                'content-type': 'application/json'
            },
            body: `{"variables":{"transactionId":"${transactionId}"}}`,
            method: "POST",
            credentials: 'include'
        });
        resultRequest = await resultRequest.json();
    } catch (e) {
        appendLog('Fetch failed: ' + e + ". Aborting.");
        console.error('Fetch failed', e);
        processFailed();
        return;
    }

    const status = resultRequest.data?.selfie_age_verification_status?.status;
    appendLog(`Current status: ${status}`);
    if (status == 'Processing') {
        setTimeout(() => {
            checkTransactionResult(transactionId, attempt + 1);
        }, 1000);
        return;
    } else if (status == 'Completed') {
        const ageVerified = resultRequest.data?.selfie_age_verification_status?.age_verified;
        appendLog(`Age verified: ${ageVerified}`);
        if (ageVerified) {
            appendLog('***************');
            appendLog('*** SUCCESS ***');
            appendLog('***************');
            actionButton.innerText = 'Reload page';
            actionButton.onclick = () => {
                location.reload();
            }
            actionButton.disabled = false;
        } else {
            processFailed();
        }
    } else {
        appendLog('Unknown status. Aborting.')
        processFailed();
    }
}

function processFailed() {
    actionButton.disabled = false;
    appendLog('The process failed. You can choose now another image and retry.');
}

})();
