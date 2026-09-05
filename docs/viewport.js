// Keep the whole mobile workspace inside the currently visible browser area.
// iOS can pan that area after keyboard focus or restoring a browser tab.
(() => {
  const root = document.documentElement;
  const mobile = window.matchMedia('(max-width: 899px)');
  const viewport = window.visualViewport;
  const properties = ['--app-viewport-top', '--app-viewport-left', '--app-viewport-height', '--app-viewport-width'];
  let frame = 0;

  const sync = () => {
    frame = 0;
    if (!mobile.matches) {
      properties.forEach(property => root.style.removeProperty(property));
    } else {
      const bounds = [viewport?.offsetTop || 0, viewport?.offsetLeft || 0,
        viewport?.height || window.innerHeight, viewport?.width || window.innerWidth];
      bounds.forEach((value, index) => root.style.setProperty(properties[index], Math.max(0, value) + 'px'));
    }
    window.dispatchEvent(new Event('dolce:viewportchange'));
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(sync); };

  viewport?.addEventListener('resize', schedule, {passive: true});
  viewport?.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule, {passive: true});
  window.addEventListener('pageshow', schedule);
  window.addEventListener('orientationchange', schedule);
  document.addEventListener('visibilitychange', schedule);
  document.addEventListener('focusin', schedule);
  document.addEventListener('focusout', schedule);
  mobile.addEventListener('change', schedule);
  sync();
})();
