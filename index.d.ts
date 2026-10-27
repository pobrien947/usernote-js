export interface MountOptions {
  /** Board ID from the UserNote dashboard: ws_ followed by 12 characters. */
  board: string;
  /** Show the board inside this element (or CSS selector) instead of a floating Feedback button. */
  target?: string | Element;
  /** Open on the ideas list (default) or the roadmap. */
  view?: 'ideas' | 'roadmap';
  /** false hides the floating Feedback button; open the board with open() from your own button. */
  launcher?: boolean;
  /** Corner for the floating button and panel: bottom right (default) or bottom left. */
  position?: 'right' | 'left';
  /** Widget URL, for testing. Defaults to https://getusernote.com/widget.js. */
  src?: string;
}

/** Show a UserNote board on the page. Returns a function that removes it. */
export function mount(options: MountOptions): () => void;
/** Open the board, for example from your own "Feedback" button. */
export function open(): void;
/** Close the board. */
export function close(): void;
