/**
 * A "save" button for Piotr's default toolbar.
 *
 * @class
 * @param {SaveAgent} sa - A save agent instance
 */
class SaveButton {
  constructor(sa) {
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

    var self = this;
    this.dom.addEventListener("click", function() {
      sa.save(self.toolbar.editor.document.toJSON());
    });
  }

  update() {}
}

module.exports = SaveButton;
