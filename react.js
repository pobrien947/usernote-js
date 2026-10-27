'use client';
// React component for the UserNote widget. Plain JavaScript (no JSX), so the
// package needs no build step.
import { createElement, useEffect, useRef } from 'react';
import { mount } from './index.js';

export { open, close } from './index.js';

/**
 * A UserNote board: a floating Feedback button by default, or the full board
 * inside the page with `inline`.
 *
 * @param {object} props
 * @param {string} props.board Board ID from the UserNote dashboard.
 * @param {boolean} [props.inline] Show the board in the page instead of a floating button.
 * @param {'ideas' | 'roadmap'} [props.view] Open on the ideas list (default) or the roadmap.
 * @param {boolean} [props.launcher] false hides the floating button; call open() from your own button.
 * @param {'right' | 'left'} [props.position] Corner for the floating button and panel (default bottom right).
 * @param {string} [props.className] Class for the inline board's container.
 * @param {object} [props.style] Style for the inline board's container.
 */
export function UserNote({ board, inline = false, view, launcher, position, className, style }) {
  const ref = useRef(null);
  useEffect(() => mount({ board, view, launcher, position, target: inline ? ref.current : undefined }), [board, inline, view, launcher, position]);
  return inline ? createElement('div', { ref, className, style }) : null;
}

export default UserNote;
