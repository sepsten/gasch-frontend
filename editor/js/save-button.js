var ToolbarComponent = require("piotr/toolbar/toolbar-component");

/**
 * A "save" button for Piotr's default toolbar.
 *
 * @class
 * @param {SaveAgent} sa - A save agent instance
 */
class SaveButton extends ToolbarComponent {
  constructor(sa) {
    super();

    /**
     * Contains the actual <button> element.
     *
     * @type {HTMLButtonElement}
     */
    this.dom = document.createElement("button");
    this.dom.textContent = "Save";
    //this.dom.disabled = true;
    
    /**
     * Reference to the parent toolbar.
     *
     * @type {Piotr.Toolbar}
     */
    this.toolbar = null;
  }

  // From ToolbarComponent
  setParent(toolbar) {
    super.setParent(toolbar);

    this.dom.addEventListener("click", function() {
      sa.save(toolbar.editor.document.toJSON());
    });
  }
}

module.exports = SaveButton;
