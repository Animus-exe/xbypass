const api = globalThis.browser ?? globalThis.chrome;

function isXUrl(urlString) {
  if (!urlString) {
    return false;
  }
  let url;
  try {
    url = new URL(urlString);
  } catch {
    return false;
  }
  const host = url.hostname;
  return (
    host === 'x.com' ||
    host === 'twitter.com' ||
    host.endsWith('.x.com') ||
    host.endsWith('.twitter.com')
  );
}

api.action.onClicked.addListener(async (tab) => {
  if (!tab?.id || !isXUrl(tab.url)) {
    return;
  }

  try {
    await api.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['inject.js'],
      world: 'MAIN',
    });
  } catch (err) {
    console.error('X Bypass: failed to inject selfie helper', err);
  }
});
