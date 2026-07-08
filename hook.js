(function () {
  if (window.__xbypassHookInstalled) {
    return;
  }
  window.__xbypassHookInstalled = true;

  function applyAgeAssuranceOverride(state) {
    if (!state || typeof state !== 'object') {
      return state;
    }
    try {
      const featureSwitch = state.featureSwitch || (state.featureSwitch = {});
      const overrides = featureSwitch.customOverrides || (featureSwitch.customOverrides = {});
      overrides.rweb_age_assurance_flow_enabled = false;
    } catch (e) {
      // Ignore malformed state; page should still load.
    }
    return state;
  }

  let value = applyAgeAssuranceOverride(window.__INITIAL_STATE__);

  Object.defineProperty(window, '__INITIAL_STATE__', {
    configurable: true,
    enumerable: true,
    set(newValue) {
      value = applyAgeAssuranceOverride(newValue);
    },
    get() {
      return value;
    },
  });
})();
