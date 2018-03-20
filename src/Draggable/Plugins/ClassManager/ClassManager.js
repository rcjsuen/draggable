import AbstractPlugin from 'shared/AbstractPlugin';

export const onDragStart = Symbol('onDragStart');
export const onDragOut = Symbol('onDragOut');
export const onDragOutContainer = Symbol('onDragOutContainer');
export const onDragOver = Symbol('onDragOver');
export const onDragOverContainer = Symbol('onDragOverContainer');
export const onDragStop = Symbol('onDragStop');

const defaultOptions = {
  'container:dragging': 'draggable-container--is-dragging',
  'source:dragging': 'draggable-source--is-dragging',
  'source:placed': 'draggable-source--placed',
  'container:placed': 'draggable-container--placed',
  'body:dragging': 'draggable--is-dragging',
  'draggable:over': 'draggable--over',
  'container:over': 'draggable-container--over',
  'source:original': 'draggable--original',
  mirror: 'draggable-mirror',
};

/**
 * ClassManager plugin
 * @class ClassManager
 * @module ClassManager
 * @extends AbstractPlugin
 */
export default class ClassManager extends AbstractPlugin {

  /**
   * ClassManager constructor.
   * @constructs ClassManager
   * @param {Draggable} draggable - Draggable instance
   */
  constructor(draggable) {
    super(draggable);

    /**
     * Scrollable options
     * @property {Object} options
     * @property {Number} options.speed
     * @property {Number} options.sensitivity
     * @property {HTMLElement[]} options.scrollableElements
     * @type {Object}
     */
    this.options = {
      ...defaultOptions,
      ...this.getOptions(),
    };
  }

  /**
   * Attaches listeners to draggable
   */
  attach() {
    this.draggable
      .on('drag:start', this[onDragStart]);
  }

  /**
   * Detaches listeners from draggable
   */
  detach() {
    this.draggable
      .off('drag:start', this[onDragStart]);
  }

  /**
   * Returns class name for class identifier
   * @param {String} name - Name of class identifier
   * @return {String|null}
   */
  getClassNameFor(name) {
    return this.options[name];
  }

  /**
   * Returns options passed through draggable
   * @return {Object}
   */
  getOptions() {
    return this.draggable.options.classes || {};
  }

  /**
   * Drag start handler
   * @param {DragStartEvent} dragEvent
   * @private
   */
  [onDragStart](dragEvent) {
    if (dragEvent.canceled()) {
      return;
    }

    dragEvent.originalSource.classList.add(this.getClassNameFor('source:original'));
    dragEvent.source.classList.add(this.getClassNameFor('source:dragging'));
    dragEvent.sourceContainer.classList.add(this.getClassNameFor('container:dragging'));
    document.body.classList.add(this.getClassNameFor('body:dragging'));
  }

  [onDragOut](dragEvent) {
    dragEvent.over.classList.remove(this.getClassNameFor('draggable:over'));
  }

  [onDragOutContainer](dragEvent) {
    dragEvent.overContainer.classList.remove(this.getClassNameFor('draggable:over:container'));
  }

  [onDragOver](dragEvent) {
    dragEvent.over.classList.add(this.getClassNameFor('draggable:over'));
  }

  [onDragOverContainer](dragEvent) {
    dragEvent.overContainer.classList.add(this.getClassNameFor('container:over'));
  }

  [onDragStop](dragEvent) {
    dragEvent.source.classList.remove(this.getClassNameFor('source:dragging'));
    dragEvent.originalSource.classList.remove(this.getClassNameFor('source:original'));
    dragEvent.originalSource.classList.add(this.getClassNameFor('source:placed'));
    dragEvent.sourceContainer.classList.add(this.getClassNameFor('container:placed'));
    dragEvent.sourceContainer.classList.remove(this.getClassNameFor('container:dragging'));
    document.body.classList.remove(this.getClassNameFor('body:dragging'));
  }
}
