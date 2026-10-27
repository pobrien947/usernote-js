import type { CSSProperties, ReactElement } from 'react';

export interface UserNoteProps {
  /** Board ID from the UserNote dashboard: ws_ followed by 12 characters. */
  board: string;
  /** Show the board in the page instead of a floating Feedback button. */
  inline?: boolean;
  /** Open on the ideas list (default) or the roadmap. */
  view?: 'ideas' | 'roadmap';
  /** false hides the floating Feedback button; call open() from your own button. */
  launcher?: boolean;
  /** Corner for the floating button and panel: bottom right (default) or bottom left. */
  position?: 'right' | 'left';
  /** Class for the inline board's container. */
  className?: string;
  /** Style for the inline board's container. */
  style?: CSSProperties;
}

/** A UserNote board: a floating Feedback button by default, or the full board in the page with `inline`. */
export function UserNote(props: UserNoteProps): ReactElement | null;
export default UserNote;
export { open, close } from './index.js';
