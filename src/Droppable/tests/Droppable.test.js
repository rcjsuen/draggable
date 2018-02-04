import {createSandbox, clickMouse, moveMouse, releaseMouse, waitForDragDelay, DRAG_DELAY} from 'helper';

import Droppable, {DroppableStartEvent, DroppableDroppedEvent, DroppableReleasedEvent, DroppableStopEvent} from '..';

const sampleMarkup = `
  <div class="container">
    <div class="Droppable isOccupied">
      <div class="Draggable"></div>
    </div>
    <div class="Droppable"></div>
    <div class="Droppable isOccupied">
      <div class="Draggable"></div>
    </div>
  </div>
`;

describe('Droppable', () => {
  let sandbox;
  let containers;
  let draggableElement;
  let droppableElements;
  let occupiedDroppableElement;
  let droppable;
  let firstDroppable;
  let secondDroppable;

  beforeEach(() => {
    sandbox = createSandbox(sampleMarkup);
    containers = sandbox.querySelectorAll('.container');
    draggableElement = sandbox.querySelector('.Draggable');
    droppableElements = sandbox.querySelectorAll('.Droppable');
    firstDroppable = droppableElements[0];
    secondDroppable = droppableElements[1];
    occupiedDroppableElement = droppableElements[2];
    droppable = new Droppable(containers, {
      draggable: '.Draggable',
      droppable: '.Droppable',
      delay: DRAG_DELAY,
      classes: {
        'droppable:occupied': 'isOccupied',
      },
    });
  });

  afterEach(() => {
    droppable.destroy();
    sandbox.parentNode.removeChild(sandbox);
  });

  describe('triggers', () => {
    let eventHandler;
    let originalDragEvents;

    beforeEach(() => {
      eventHandler = jest.fn();
      originalDragEvents = [];
    });

    it('droppable:start event', () => {
      droppable.on('drag:start', (dragEvent) => originalDragEvents.push(dragEvent));
      droppable.on('droppable:start', eventHandler);

      move();

      expect(eventHandler).toHaveBeenCalledWithEvent(DroppableStartEvent);

      expect(eventHandler).toHaveBeenCalledWithEventProperties({
        dragEvent: originalDragEvents[0],
        droppable: firstDroppable,
      });
    });

    it('droppable:dropped event', () => {
      droppable.on('drag:move', (dragEvent) => originalDragEvents.push(dragEvent));
      droppable.on('droppable:dropped', eventHandler);

      move();

      expect(eventHandler).toHaveBeenCalledWithEvent(DroppableDroppedEvent);

      expect(eventHandler).toHaveBeenCalledWithEventProperties({
        dragEvent: originalDragEvents[0],
        droppable: secondDroppable,
      });
    });

    it('droppable:released event', () => {
      droppable.on('drag:move', (dragEvent) => originalDragEvents.push(dragEvent));
      droppable.on('droppable:released', eventHandler);

      move(() => {
        moveMouse(firstDroppable);
        moveMouse(secondDroppable);
      });

      expect(eventHandler).toHaveBeenCalledWithEvent(DroppableReleasedEvent);

      expect(eventHandler).toHaveBeenCalledWithEventProperties({
        dragEvent: originalDragEvents[1],
        droppable: secondDroppable,
      });
    });

    it('droppable:stop event', () => {
      droppable.on('drag:stop', (dragEvent) => originalDragEvents.push(dragEvent));
      droppable.on('droppable:stop', eventHandler);

      move();

      expect(eventHandler).toHaveBeenCalledWithEvent(DroppableStopEvent);

      expect(eventHandler).toHaveBeenCalledWithEventProperties({
        dragEvent: originalDragEvents[0],
        droppable: secondDroppable,
      });
    });
  });

  it('prevents drag when canceling sortable start event', () => {
    droppable.on('droppable:start', (droppableEvent) => {
      droppableEvent.cancel();
    });

    clickMouse(draggableElement);
    waitForDragDelay();
    moveMouse(secondDroppable);

    expect(droppable.isDragging()).toBe(false);

    releaseMouse(droppable.source);
  });

  it('drops draggable element in an empty droppable element', () => {
    expect(draggableElement.parentNode).toBe(firstDroppable);

    clickMouse(draggableElement);
    waitForDragDelay();
    moveMouse(secondDroppable);

    expect(droppable.source.parentNode).toBe(secondDroppable);

    releaseMouse(droppable.source);
  });

  it('prevents drop on occupied droppable element', () => {
    const handler = jest.fn();

    droppable.on('droppable:dropped', handler);

    expect(draggableElement.parentNode).toBe(firstDroppable);

    clickMouse(draggableElement);
    waitForDragDelay();
    moveMouse(occupiedDroppableElement);

    expect(droppable.source.parentNode).toBe(firstDroppable);

    expect(handler).not.toHaveBeenCalled();

    releaseMouse(droppable.source);
  });

  it('prevents drop when droppable:dropped event gets canceled', () => {
    droppable.on('droppable:dropped', (droppableEvent) => {
      droppableEvent.cancel();
    });

    clickMouse(draggableElement);
    waitForDragDelay();
    moveMouse(secondDroppable);

    expect(droppable.source.parentNode).toBe(firstDroppable);

    releaseMouse(droppable.source);
  });

  it('prevents release when droppable:released event gets canceled', () => {
    droppable.on('droppable:released', (droppableEvent) => {
      droppableEvent.cancel();
    });

    clickMouse(draggableElement);
    waitForDragDelay();
    moveMouse(secondDroppable);
    moveMouse(firstDroppable);

    expect(droppable.source.parentNode).toBe(secondDroppable);

    releaseMouse(droppable.source);
  });

  function move(
    optionalMoves = () => {
      /* noop */
    },
  ) {
    clickMouse(draggableElement);
    waitForDragDelay();
    moveMouse(secondDroppable);
    optionalMoves();
    releaseMouse(droppable.source);
  }
});
