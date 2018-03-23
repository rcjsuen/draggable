## ResizeMirror

The resize mirror plugin changes the mirror element dimensions as you drag it over other draggable elements.
It also appends the mirror element into draggable containers you drag into.
Add transitions to the mirror element to animate the dimensions change.

This plugin is not included by default, so make sure to import.

### Import

```js
import {Plugins} from '@shopify/draggable';
```

```js
import ResizeMirror from '@shopify/draggable/lib/plugins/resize-mirror';
```

```html
<script src="https://cdn.jsdelivr.net/npm/@shopify/draggable@1.0.0-beta.5/lib/plugins.js"></script>
```

```html
<script src="https://cdn.jsdelivr.net/npm/@shopify/draggable@1.0.0-beta.5/lib/plugins/resize-mirror.js"></script>
```

### API

**`new ResizeMirror(draggable: Draggable): ResizeMirror`**  
Creates a resize mirror plugin instance.

### Options

_No options_

### Examples

```js
import {Sortable, Plugins} from '@shopify/draggable';

const sortable = new Sortable(document.querySelectorAll('ul'), {
  draggable: 'li',
  plugins: [Plugins.ResizeMirror],
});
```
