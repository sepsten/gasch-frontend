var IsolatedNode = require("piotr/nodes/isolated-node"),
    ParagraphNode = require("piotr/nodes/paragraph-node"),
    Surface = require("piotr/surface"),
    ImageSurfaceComponent = require("./image-surface-component"),
    nodeReg = require("piotr/node-registry"),
    Document = require("piotr/document");

/**
 * An isolated node that hosts an image and its description.
 * The image file can be dragged and dropped.
 *
 * @class
 * @extends {Piotr.IsolatedNode}
 * @param {GaschAPI} api - An API client instance
 */
class ImageNode extends IsolatedNode {
  constructor(api) {
    super();

    this.api = api;

    // Image surface
    this.imageSurface = new ImageSurfaceComponent(this);

    // Description surface initialization.
    var node = new ParagraphNode;
    node.state.text = "Picture description…";
    this.innerSurface = new Surface([node]);
  }

  // From Node
  getInitialState() {
    return {
      // Image URL????
      dataURL: null
      // Do I need to store the state of the inner surface here?      
    };
  }

  // From Node
  createDOMRoot() {
    var dom = document.createElement("div");

    // Child image surface
    var is = this.imageSurface.createDOMRoot();
    dom.appendChild(is);
    this.imageSurface.mount(is);

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
    this.imageSurface.unmount();
    this.innerSurface.detachNodes();
  }

  // From Node
  render() {}

  // From Node
  toJSON() {
    var obj = super.toJSON();
    var doc = new Document;
    doc.nodes = this.innerSurface.nodes;
    obj.descNodes = doc.nodesToJSON();
    return obj;
  }

  static fromJSON(json) {
    var node = new ImageNode;
    node.state = Object.assign({}, json.state);

    // Image surface initialization
    if(json.state.dataURL !== null)
      node.imageSurface.state = ImageSurfaceComponent.ImageState;

    // Description surface initialization
    if(json.descNodes) {
      var doc = Document.fromJSON({nodes: json.descNodes});
      node.innerSurface = new Surface(doc.nodes);
    }

    return node;
  }
};

ImageNode.id = "image";
nodeReg.add(ImageNode);

module.exports = ImageNode;
