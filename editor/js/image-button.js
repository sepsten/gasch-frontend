var ImageNode = require("./image-node"),
    ParagraphNode = require("piotr/nodes/paragraph-node"),
    CF = require("piotr/commands/command-factory"),
    Range = require("piotr/range"),
    Surface = require("piotr/surface");

/**
 * Button that creates images nodes.
 *
 * @class
 * @param {GaschAPI} api - An API client instance
 */
class ImageButton {
  constructor(api) {
    /**
     * Contains the actual <button> element.
     *
     * @type {HTMLButtonElement}
     */
    this.dom = document.createElement("button");
    this.dom.textContent = "Cliché";
    this.dom.disabled = true;

    /**
     * Reference to the parent toolbar.
     *
     * @type {Piotr.Toolbar}
     */
    this.toolbar = null;

    /**
     * An API client instance.
     *
     * @type {GaschAPI}
     */
    this.api = api;

    var self = this;
    this.dom.addEventListener("click", function() {
      self.toolbar.editor.execute(ImageButton.clickHandler, self.api);
    });
  }

  update() {
    var sel = this.toolbar.editor.selection.state;

    // Disable the button if selection is outside the editor
    if(!sel.inside)
      return this.dom.disabled = true;

    var surface = sel.surface;

    // Disable the button if the selection is over multiple nodes
    if(!Range.isInSameNode(sel))
      return this.dom.disabled = true;

    var node = Range.startNode(sel);

    this.dom.disabled = false;
  }
}

ImageButton.clickHandler = function(r, api) {
  var snode = Range.startNode(r), cmd, addP = false;

  // If the last node in the surface is selected...
  if(r.surface.nodes.length === r.startNodeIndex+1)
    addP = true;

  // If node is a paragraph node, take its contents and put them in the new node.
  if(snode instanceof ParagraphNode) {
    var nnode = new ImageNode(api); // Create a new image node
    nnode.innerSurface = new Surface;
    cmd = CF.compose(
      // Remove the paragraph node
      CF.removeNode(r.surface, r.startNodeIndex),
      // Replace it by the image node
      CF.insertNode(r.surface, nnode, r.startNodeIndex),
      // Put the paragraph node in the image node
      CF.insertNode(nnode.innerSurface, snode, 0)
    );

    // Add a trailing paragraph node if necessary
    if(addP)
      return CF.compose(
        cmd,
        CF.insertNode(r.surface, new ParagraphNode, r.startNodeIndex+1)
      );
    else
      return cmd;

  } else {
    // Insert an image node after the selection's start node 
    cmd = CF.insertNode(r.surface, new ImageNode(api), r.startNodeIndex+1);

    // Add a trailing paragraph node if necessary
    if(addP)
      return CF.compose(
        cmd,
        CF.insertNode(r.surface, new ParagraphNode, r.startNodeIndex+2)
      );
    else
      return cmd;
  }
};

module.exports = ImageButton;
