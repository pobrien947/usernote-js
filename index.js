// Loads the UserNote widget (https://getusernote.com/widget.js) from code, for
// single-page apps where pasting a <script> tag into the HTML isn't natural.
// The widget reads its options from data-* attributes on its own <script>
// element, so mount() builds that element; destroy() removes it again,
// together with the button the widget added to the page.

const WIDGET_URL = 'https://getusernote.com/widget.js';
const BOARD_ID = /^ws_[a-z0-9]{12}$/;

// One entry per distinct widget (same options = same entry), counted, so a
// component that mounts, unmounts and mounts again straight away (React's
// StrictMode does this in development) keeps a single widget.
const live = new Map();
// Floating-button hosts already owned by an entry.
const claimed = new Set();
let nextId = 0;

function targetSelector(target) {
  if (typeof target === 'string') return target;
  if (!target.id) target.id = `usernote-${++nextId}`;
  return `#${typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(target.id) : target.id}`;
}

function remove(key, entry) {
  live.delete(key);
  entry.script.remove();
  if (entry.inline) {
    // Leave it if another live widget now uses the same element (options changed).
    const reused = [...live.values()].some((other) => other.attrs.target === entry.attrs.target);
    const host = document.querySelector(entry.attrs.target);
    if (!reused && host && host.shadowRoot) host.shadowRoot.replaceChildren();
  } else if (entry.host) {
    claimed.delete(entry.host);
    entry.host.remove();
  } else {
    entry.cancelled = true; // still loading: remove its button once it runs
  }
  if (live.size === 0 && typeof window !== 'undefined') delete window.UserNote;
}

/**
 * Show a UserNote board on the page.
 *
 * @param {object} options
 * @param {string} options.board Board ID from the UserNote dashboard (ws_ followed by 12 characters).
 * @param {string | Element} [options.target] Show the board inside this element (or selector) instead of a floating Feedback button.
 * @param {'ideas' | 'roadmap'} [options.view] Open on the ideas list (default) or the roadmap.
 * @param {boolean} [options.launcher] false hides the Feedback button; open the board with open() from your own button.
 * @param {string} [options.src] Widget URL, for testing.
 * @returns {() => void} Removes the widget again.
 */
export function mount({ board, target, view, launcher, src = WIDGET_URL } = {}) {
  if (typeof document === 'undefined') return () => {}; // server rendering
  if (!BOARD_ID.test(String(board))) {
    console.warn(`[UserNote] "${board}" is not a board ID. Copy it from your board's Install tab: it starts with ws_.`);
    return () => {};
  }

  const attrs = { workspace: board };
  if (target) {
    attrs.mode = 'inline';
    attrs.target = targetSelector(target);
  }
  if (view === 'roadmap') attrs.view = 'roadmap';
  if (launcher === false) attrs.launcher = 'false';
  const key = JSON.stringify([src, attrs]);

  let entry = live.get(key);
  if (entry) {
    entry.count += 1;
    clearTimeout(entry.timer);
  } else {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    for (const [name, value] of Object.entries(attrs)) script.setAttribute(`data-${name}`, value);
    entry = { count: 1, script, attrs, inline: Boolean(target), host: null, timer: null, cancelled: false };
    if (!entry.inline) {
      const e = entry;
      script.addEventListener('load', () => {
        const hosts = [...document.querySelectorAll('div[data-usernote]')].filter((h) => !claimed.has(h));
        e.host = hosts[hosts.length - 1] || null;
        if (!e.host) return;
        if (e.cancelled) e.host.remove();
        else claimed.add(e.host);
      });
    }
    live.set(key, entry);
    document.body.append(script);
  }

  let done = false;
  return function destroy() {
    if (done) return;
    done = true;
    const e = live.get(key);
    if (!e || --e.count > 0) return;
    // Wait a tick: if the same widget is mounted again straight away, keep it.
    e.timer = setTimeout(() => {
      if (live.get(key) === e && e.count === 0) remove(key, e);
    }, 0);
  };
}

/** Open the board, for example from your own "Feedback" button. */
export function open() {
  if (typeof window !== 'undefined' && window.UserNote) window.UserNote.open();
}

/** Close the board. */
export function close() {
  if (typeof window !== 'undefined' && window.UserNote) window.UserNote.close();
}
