var IsolatedNode = require("piotr/nodes/isolated-node"),
    ParagraphNode = require("piotr/nodes/paragraph-node"),
    Surface = require("piotr/surface"),
    ImageSurfaceComponent = require("./image-surface-component"),
    nodeReg = require("piotr/node-registry"),
    Document = require("piotr/document"),
    CF = require("piotr/commands/command-factory"),
    api = require("./../../common/js/client");

/**
 * An isolated node that hosts an image and its description.
 * The image file can be dragged and dropped.
 *
 * @class
 * @extends {Piotr.IsolatedNode}
 * @param {Boolean} [init=true] - If true, will initialize the node with an
 * empty image surface component.
 */
class ImageNode extends IsolatedNode {
  constructor(init=true) {
    super();

    this.api = api;
    this.imgSurfaces = [];

    if(init) this.imgSurfaces[0] = new ImageSurfaceComponent(this);

    // Description surface initialization.
    var node = new ParagraphNode;
    node.state.text = "Picture description…";
    this.innerSurface = new Surface([node]);

    var self = this;

    /**
     * Listener for the `click` event on the "add" button.
     *
     * @type {Function}
     */
    this.addHandler = function(e) {
      self.addImageSurface();
    };

    this.behavior["Enter"] = function(r, e) {
      if(e) e.preventDefault();
      var cmd = CF.insertNode(r.surface, new ParagraphNode, r.startNodeIndex+1);
      if(e) r.surface.selection.set(r.startNodeIndex+1, 0);
      return cmd;
    };
  }

  // From Node
  getInitialState() {
    return {
      // We don't really have any state that is specific to the node and not
      // to its children.
    };
  }

  // From Node
  createDOMRoot() {
    var dom = document.createElement("div");

    // Child image surfaces
    var imgs = document.createElement("div");
    imgs.className = "piotr-image__images";
    for(var i = 0; i < this.imgSurfaces.length; i++) {
      let is = this.imgSurfaces[i].createDOMRoot();
      imgs.appendChild(is);
      this.imgSurfaces[i].mount(is);
    }
    dom.appendChild(imgs);

    // Toolbar
    var bar = document.createElement("div");
    bar.className = "piotr-image__toolbar";
    dom.appendChild(bar);

    var button = document.createElement("button");
    button.textContent = "Add a picture";
    bar.appendChild(button);

    button.addEventListener("click", this.addHandler);

    // Child description surface
    var div = document.createElement("div");
    dom.appendChild(div);
    this.innerSurface.setDOMRoot(div);

    return dom;
  }

  // From Node
  attach(surface) {
    super.attach(surface);
    this.innerSurface.setParentSurface(surface);
    this.innerSurface.attachNodes();
  }

  // From Node
  detach() {
    super.detach();
    // Child image surfaces
    for(var i = 0; i < this.imgSurfaces.length; i++) {
      this.imgSurfaces[i].unmount();
    }
    this.innerSurface.detachNodes();
  }

  // From Node
  render() {}

  // From Node
  toJSON() {
    var obj = super.toJSON();
    obj.images = [];
    for(var i = 0; i < this.imgSurfaces.length; i++) {
      obj.images[i] = this.imgSurfaces[i].dataURL;
    }
    obj.descNodes = Document.nodesToJSON(this.innerSurface.nodes);
    return obj;
  }

  // From Node
  static fromJSON(json) {
    var node = new ImageNode(false);

    if(json.images) {
      // Initialize image surfaces
      for(var i = 0; i < json.images.length; i++) {
        node.imgSurfaces[i] = new ImageSurfaceComponent(node);
        node.imgSurfaces[i].dataURL = json.images[i];
        if(json.images[i] !== null)
          node.imgSurfaces[i].state = ImageSurfaceComponent.ImageState;
      }
    } else if(json.state) {
      // Backward-compatible initialization for nodes supporting only one image
      node.imgSurfaces[0] = new ImageSurfaceComponent(node);
      node.imgSurfaces[0].dataURL = json.state.dataURL;
      if(json.state.dataURL !== null)
        node.imgSurfaces[0].state = ImageSurfaceComponent.ImageState;
    }

    // Description surface initialization
    if(json.descNodes)
      node.innerSurface = new Surface(Document.nodesFromJSON(json.descNodes));

    return node;
  }

  /**
   * Adds an image surface to the node. The node must be mounted. Used as a
   * handler for the "Add picture" button.
   * It simply instantiates the component and mounts it.
   */
  addImageSurface() {
    var i = this.imgSurfaces.length;
    this.imgSurfaces[i] = new ImageSurfaceComponent(this);
    var is = this.imgSurfaces[i].createDOMRoot();
    this.dom.children[0].appendChild(is);
    this.imgSurfaces[i].mount(is); // Insert in the DOM
  }

  /**
   * Deletes an image surface. The node must be mounted. Used as a handler for
   * the "Remove" buttons.
   * It removes the component from the DOM and unmounts it.
   */
  removeImageSurface(is) {
    // Look for the ID.
    for(var i = 0; this.imgSurfaces[i] !== is; i++) {
      // Exit the function if nothing is found.
      if(i > this.imgSurfaces.length) return;
    }

    this.dom.children[0].removeChild(is.dom);
    is.unmount();
    this.imgSurfaces.splice(i, 1); // Remove the image surface from the array.
  }
};

ImageNode.id = "image";
nodeReg.add(ImageNode);

module.exports = ImageNode;
