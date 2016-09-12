/**
 * A very basic component class.
 *
 * @class
 * @abstract
 */
class Component {
  constructor() {
    /**
     * The component's DOM.
     *
     * @type {Element|null}
     */
    this.dom = null;

    /**
     * The component's state. (State is a behavior here, not a set of
     * properties.)
     *
     * @type {ComponentState}
     */
    this.state = null;

    /**
     * The component's default state. Use on first mount.
     *
     * @abstract
     * @type {ComponentState}
     */
    this.defaultState = null;
  }

  /**
   * Returns the component's DOM root.
   *
   * @abstract
   * @returns {Element}
   */
  createDOMRoot() {
    throw new Error("Abstract method!");
  }

  /**
   * Mounts the component on a DOM node.
   *
   * @param {Element} dom
   */
  mount(dom) {
    this.dom = dom;
    if(!this.state) this.setState(this.defaultState);
    else if(this.state.enter) this.state.enter.call(this);
  }

  /**
   * Detaches the component from its DOM node.
   */
  unmount() {
    if(this.state.exit) this.state.exit.call(this);
    this.dom = null;
  }

  /**
   * Clears the DOM root's contents.
   */
  clearDOM() {
    while(this.dom.firstChild) {
      this.dom.removeChild(this.dom.firstChild);
    }
  }

  /**
   * Sets the component's state.
   *
   * @param {ComponentState} newState - The new state to use
   */
  setState(newState) {
    if(this.state && this.state.exit) this.state.exit.call(this);
    this.state = newState;
    if(newState.enter) newState.enter.call(this);
  }
}

module.exports = Component;
