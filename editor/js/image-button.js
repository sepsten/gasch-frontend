var ImageNode = require("./image-node"),
    ParagraphNode = require("piotr/nodes/paragraph-node"),
    CF = require("piotr/commands/command-factory"),
    Range = require("piotr/range"),
    Surface = require("piotr/surface");

/**
 * Button that creates images nodes.
 *
 * @class
 */
class ImageButton {
  constructor() {
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

    var self = this;
    this.dom.addEventListener("click", function() {
      self.toolbar.editor.execute(ImageButton.clickHandler);
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

ImageButton.clickHandler = function(r) {
  var snode = Range.startNode(r), cmd, addP = false;

  // If the last node in the surface is selected...
  if(r.surface.nodes.length === r.startNodeIndex+1)
    addP = true;

  // If node is a paragraph node, take its contents and put them in the new node.
  if(snode instanceof ParagraphNode) {
    var nnode = new ImageNode; // Create a new image node
    nnode.innerSurface = new Surface;
    cmd = CF.compose(
      CF.removeNode(r.surface, r.startNodeIndex), // Remove the paragraph node
      CF.insertNode(r.surface, nnode, r.startNodeIndex), // Replace it by the image node
      CF.insertNode(nnode.innerSurface, snode, 0) // Put the paragraph node in the image node
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
    cmd = CF.insertNode(r.surface, new ImageNode, r.startNodeIndex+1);

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
