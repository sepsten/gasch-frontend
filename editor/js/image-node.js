var IsolatedNode = require("piotr/nodes/isolated-node"),
    ParagraphNode = require("piotr/nodes/paragraph-node"),
    Surface = require("piotr/surface"),
    ImageSurfaceComponent = require("./image-surface-component"),
    nodeReg = require("piotr/node-registry");

/**
 * An isolated node that hosts an image and its description.
 * The image file can be dragged and dropped.
 *
 * @class
 * @extends {Piotr.IsolatedNode}
 */
class ImageNode extends IsolatedNode {
  constructor() {
    super();

    // Image surface
    this.imageSurface = new ImageSurfaceComponent(this);

    // Description surface initialization.
    var node = new ParagraphNode;
    node.state.text = "Picture description…";
    this.innerSurface = new Surface([node]);
  }

  // From Node
  getInitialState() {
    return {};
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
}

ImageNode.id = "image";
nodeReg.add(ImageNode);

module.exports = ImageNode;
