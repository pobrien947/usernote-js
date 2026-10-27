# usernote

A feature voting board and public roadmap for your app. Your users suggest features and upvote ideas **without signing up**, and you mark ideas Planned, In progress or Completed to update a public roadmap.

This package loads the [UserNote](https://getusernote.com) widget from React, Next.js, Vue, Svelte or plain JavaScript. The widget is about 5 KB, runs in a Shadow DOM so it doesn't clash with your styles, and sets no cookies.

You need a UserNote board ID. [Create a board](https://getusernote.com/login?mode=signup&ref=npm) (the free plan has no time limit), then copy the ID from your board's Install tab. It starts with `ws_`.

[Live demo board](https://getusernote.com/b/ws_8n3ovms3y5yt)

## Install

```sh
npm install usernote
```

## React and Next.js

A floating Feedback button on every page: put it in your root layout.

```jsx
import { UserNote } from 'usernote/react';

export default function App() {
  return (
    <>
      {/* your app */}
      <UserNote board="ws_xxxxxxxxxxxx" />
    </>
  );
}
```

The full board inside a page, or the roadmap:

```jsx
<UserNote board="ws_xxxxxxxxxxxx" inline />
<UserNote board="ws_xxxxxxxxxxxx" inline view="roadmap" />
```

Your own button instead of the floating one:

```jsx
import { UserNote, open } from 'usernote/react';

<UserNote board="ws_xxxxxxxxxxxx" launcher={false} />
<button onClick={open}>Suggest a feature</button>
```

In the Next.js App Router you can use it directly in a Server Component layout: the component is marked `'use client'`.

| Prop | Type | Default | |
|---|---|---|---|
| `board` | string | (required) | Board ID, `ws_` + 12 characters |
| `inline` | boolean | `false` | Show the board in the page instead of a floating button |
| `view` | `'ideas'` \| `'roadmap'` | `'ideas'` | Which view to open on |
| `launcher` | boolean | `true` | `false` hides the floating button; call `open()` yourself |
| `position` | `'right'` \| `'left'` | `'right'` | Corner for the floating button and panel |
| `className`, `style` | | | For the inline board's container |

## Vue, Svelte or plain JavaScript

`mount()` adds the widget and returns a function that removes it.

```js
import { mount } from 'usernote';

const destroy = mount({ board: 'ws_xxxxxxxxxxxx' });
// later, if you need to: destroy();
```

Inline, in an element you choose:

```js
mount({ board: 'ws_xxxxxxxxxxxx', target: document.querySelector('#feedback'), view: 'roadmap' });
```

Vue example:

```vue
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { mount } from 'usernote';

const el = ref(null);
let destroy;
onMounted(() => (destroy = mount({ board: 'ws_xxxxxxxxxxxx', target: el.value })));
onUnmounted(() => destroy && destroy());
</script>

<template><div ref="el" /></template>
```

## No build tool?

You don't need this package. Paste the script tag from your board's Install tab before `</body>`:

```html
<script src="https://getusernote.com/widget.js" data-workspace="ws_xxxxxxxxxxxx" defer></script>
```

## Notes

- Ideas, approvals, statuses and colors are managed in your [UserNote dashboard](https://getusernote.com/dashboard).
- If you limited your board to certain domains, add the domain your app runs on (including `localhost` for development, if you want to test there).
- The widget is loaded from getusernote.com. See the [Terms](https://getusernote.com/terms) and [Privacy Policy](https://getusernote.com/privacy).

## Plans

Hobby is free with no time limit: one board, up to 50 ideas at a time, unlimited voters and the roadmap. Pro is $19/month, flat, for unlimited boards and ideas, no UserNote branding, custom CSS and Slack notifications.

## Licence

MIT for this package. The UserNote service has its own [Terms](https://getusernote.com/terms).
