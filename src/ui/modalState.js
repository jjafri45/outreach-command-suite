(function (root) {
  'use strict';
  function createModalState(doc, options = {}) {
    const gmail = () => doc.getElementById('page-gmail');
    const active = () => doc.querySelector('.modal-overlay.open');
    function sync() {
      const isOpen = Boolean(active() || gmail()?.classList.contains('active'));
      doc.body.classList.toggle('modal-is-open', isOpen);
      if (isOpen) options.scrollToTop?.();
    }
    function open(element) {
      doc.querySelectorAll('.modal-overlay.open').forEach((modal) => modal.classList.remove('open'));
      element.classList.add('open');
      sync();
    }
    function close(element = active()) {
      if (element) element.classList.remove('open');
      sync();
    }
    function handleKey(event) {
      if (event.key !== 'Escape') return;
      if (gmail()?.classList.contains('active')) {
        event.preventDefault();
        options.closeGmail?.();
        sync();
      } else if (active()) {
        event.preventDefault();
        close();
      }
    }
    function handleClick(event) {
      if (event.target.matches?.('.modal-overlay.open')) close(event.target);
    }
    function start() {
      doc.addEventListener('keydown', handleKey, true);
      doc.addEventListener('click', handleClick);
      const observer = new MutationObserver(sync);
      observer.observe(doc.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
      sync();
      return () => { observer.disconnect(); doc.removeEventListener('keydown', handleKey, true); doc.removeEventListener('click', handleClick); };
    }
    return { active, open, close, sync, start };
  }
  const api = { createModalState };
  if (root) (root.OutreachCommand ||= {}).modalState = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : undefined);
