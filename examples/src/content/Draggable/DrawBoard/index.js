// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import Draggable from 'lib/draggable';
import DrawBlock from './DrawBlock';

const CANVAS_CLASS_NAME = 'DrawBoardCanvas';

function isCanvas(node) {
  return node.classList.contains(CANVAS_CLASS_NAME);
}

function canCreateShapes({current, max}) {
  return current < max;
}

export default function DrawBoard() {
  const container = document.querySelector('#DrawBoard .BlockLayout');
  const template = document.getElementById('DrawBlockTemplate');
  const canvas = container.querySelector(`.${CANVAS_CLASS_NAME}`);

  if (!container || !template || !canvas) {
    return false;
  }

  const draggable = new Draggable(container);
  const drawBlock = new DrawBlock(template, canvas);

  let canvasRect;
  let currentBlock;
  let initialDrawPosition;

  const blocks = {
    nodes: {},
    count: {
      current: 0,
      max: 10,
    },
  };

  // --- Draggable events --- //
  draggable.on('drag:start', (evt) => {
    if (isCanvas(evt.source)) {
      if (!canCreateShapes(blocks.count)) {
        console.warn(`You already have the maximum number (${blocks.count.max}) of blocks on the board!`);
        evt.cancel();
        return;
      }

      canvasRect = evt.source.getBoundingClientRect();
      initialDrawPosition = drawBlock.getPositionFromCanvas(
        {
          top: evt.sensorEvent.clientY,
          left: evt.sensorEvent.clientX,
        },
        canvasRect,
      );

      const blockId = `DrawBlock${blocks.count.current + 1}`;
      const fragment = drawBlock.edit(drawBlock.clone, {
        id: blockId,
        classes: ['draggable-source'],
        style: {
          top: `${initialDrawPosition.top}px`,
          left: `${initialDrawPosition.left}px`,
        },
      });

      container.appendChild(fragment);
      blocks.nodes[blockId] = document.getElementById(blockId);
      currentBlock = blocks.nodes[blockId];
      blocks.count.current++;
    } else {
      console.log('You have STARTED dragging one of the DrawBlocks!');
    }
  });

  draggable.on('drag:move', (evt) => {
    if (isCanvas(evt.source)) {
      const movingPosition = drawBlock.getPositionFromCanvas(
        {
          top: evt.sensorEvent.clientY,
          left: evt.sensorEvent.clientX,
        },
        canvasRect,
        initialDrawPosition,
      );

      currentBlock.style.width = `${movingPosition.left}px`;
      currentBlock.style.height = `${movingPosition.top}px`;
    } else {
      console.log('You are MOVING dragging one of the DrawBlocks!');
    }
  });

  draggable.on('drag:stop', () => {
    canvasRect = null;
    currentBlock = null;
    initialDrawPosition = null;
  });

  // suppress mirror creation
  draggable.on('mirror:create', (evt) => evt.cancel());

  return draggable;
}
