var ImageNode = require("./image-node"),
    ParagraphNode = require("piotr/nodes/paragraph-node"),
    CF = require("piotr/commands/command-factory"),
    Range = require("piotr/range"),
    Surface = require("piotr/surface"),
    ToolbarComponent = require("piotr/toolbar/toolbar-component");

/**
 * Button that creates images nodes.
 *
 * @class
 */
class ImageButton extends ToolbarComponent {
  constructor() {
    super();

    /**
     * Contains the actual <button> element.
     *
     * @type {HTMLButtonElement}
     */
    this.dom = document.createElement("button");
    this.dom.textContent = "Cliché";
    this.dom.disabled = true;
  }

  // From ToolbarComponent
  setParent(toolbar) {
    super.setParent(toolbar);

    var self = this;
    toolbar.editor.selection.on("update", function() {
      self.update();
    })

    this.dom.addEventListener("click", function() {
      toolbar.editor.execute(ImageButton.clickHandler);
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
  var snode = Range.startNode(r), cmd, addP = false,
      nnode = new ImageNode;

  // If the last node in the surface is selected...
  if(r.surface.nodes.length === r.startNodeIndex+1)
    addP = true;

  // If node is a paragraph node, take its contents and put them in the new node.
  if(snode instanceof ParagraphNode) {
    nnode.innerSurface = new Surface;
    cmd = CF.compose(
      // Remove the paragraph node
      CF.removeNode(r.surface, r.startNodeIndex),
      // Replace it by the image node
      CF.insertNode(r.surface, nnode, r.startNodeIndex),
      // Put the paragraph node in the image node
      CF.insertNode(nnode.innerSurface, snode, 0)
    );

    // Set selection inside the image nodew
    this.selection.set({
      caret: r.caret,
      surface: nnode.innerSurface,
      startNodeIndex: 0,
      endNodeIndex: 0,
      startOffset: r.startOffset,
      endOffset: r.endOffset
    });

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
    cmd = CF.insertNode(r.surface, nnode, r.startNodeIndex+1);

    // Update selection
    this.selection.set({
      caret: true,
      surface: nnode.innerSurface,
      startNodeIndex: 0,
      startOffset: 0
    });

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
