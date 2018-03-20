import {
  createSandbox,
  clickMouse,
  moveMouse,
  releaseMouse,
  waitForDragDelay,
  DRAG_DELAY,
} from 'helper';

import Draggable from '../../..';
import ClassManager from '..';

const sampleMarkup = `
  <ul class="Container">
    <li>First item</li>
  </ul>
  <ul class="Container">
    <li>Second item</li>
  </ul>
`;

describe('ClassManager', () => {
  let sandbox;
  let containers;
  let draggable;
  let draggables;

  beforeEach(() => {
    sandbox = createSandbox(sampleMarkup);
    containers = sandbox.querySelectorAll('.Container');
    draggables = sandbox.querySelectorAll('li');
    draggable = new Draggable(containers, {
      draggable: 'li',
      delay: DRAG_DELAY,
    });
  });

  afterEach(() => {
    draggable.destroy();
    sandbox.parentNode.removeChild(sandbox);
  });

  test('is included by default', () => {
    const focusablePlugin = draggable.plugins
      .find((plugin) => plugin.constructor === ClassManager);

    expect(focusablePlugin).toBeInstanceOf(ClassManager);
  });

  test('sets dragging classes on `drag:start`', () => {
    clickMouse(draggables[0]);

    waitForDragDelay();

    expect(draggable.source.classList)
      .toContain(draggable.getClassNameFor('source:dragging'));

    expect(draggable.originalSource.classList)
      .toContain(draggable.getClassNameFor('source:original'));

    expect(draggable.sourceContainer.classList)
      .toContain(draggable.getClassNameFor('container:dragging'));

    releaseMouse(draggable.source);
  });

  test('does not set dragging classes on `drag:start` when canceled', () => {
    draggable.on('drag:start', (dragEvent) => {
      dragEvent.cancel();
    });

    clickMouse(draggables[0]);

    waitForDragDelay();

    expect(draggable.source.classList)
      .not
      .toContain(draggable.getClassNameFor('source:dragging'));

    expect(draggable.originalSource.classList)
      .not
      .toContain(draggable.getClassNameFor('source:original'));

    expect(draggable.sourceContainer.classList)
      .not
      .toContain(draggable.getClassNameFor('container:dragging'));

    releaseMouse(draggable.source);
  });
});
