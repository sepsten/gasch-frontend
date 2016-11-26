var Component = require("./../../common/js/component");

/**
 * A component that creates a surface (unrelated to Piotr surfaces) where an
 * image can be dragged and dropped. It was created specifically for Gasch's
 * image nodes.
 *
 * @class
 * @extends {Component}
 * @param {ImageNode} parent - The parent ImageNode instance
 */
class ImageSurfaceComponent extends Component {
  constructor(parent) {
    super();

    // From Component
    this.defaultState = ImageSurfaceComponent.DragState;

    /**
     * The parent ImageNode instance.
     *
     * @type {ImageNode}
     */
    this.parent = parent;

    /**
     * The URL of the image. If no image has been set yet, null.
     *
     * @type {String|null}
     */
    this.dataURL = null;

    var self = this;

    /**
     * Listener for the `dragenter` event.
     *
     * @type {Function}
     */
    this.dragEnterHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.dom.classList.add("drag-over");
    };

    /**
     * Listener for the `dragleave` event.
     *
     * @type {Function}
     */
    this.dragLeaveHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.dom.classList.remove("drag-over");
    };

    /**
     * Listener for the `dragover` event.
     *
     * @type {Function}
     */
    this.dragOverHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.dom.classList.add("drag-over");
    };

    /**
     * Listener for the `drop` event.
     *
     * @type {Function}
     */
    this.dropHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();

      // Handling
      if(e.dataTransfer.files.length === 1) {
        let file = e.dataTransfer.files.item(0);

        // Check if the file is an image
        if(!file.type.match("image.*"))
          return;

        // Upload the file
        let data = new FormData;
        data.append("asset", file);
        self.parent.api.post("/assets", data).then(function(res) {
          // Update the image node's state with the URL without going through
          // the history: no need to cancel that... ?
          self.setImageURL(self.parent.api.prefix + "/assets/" + res.body.id);
        },
        function(err) {
          // We have to find a better way to display notifications!
          alert("Couldn't upload image...");
          throw err;
        });
      }
    };
  }

  /**
   * Sets the image node's image URL and switches state.
   *
   * @param {String} url
   */
  setImageURL(url) {
    this.dataURL = url;
    this.setState(ImageSurfaceComponent.ImageState);
  }

  // From Component
  createDOMRoot() {
    var dom = document.createElement("div");
    dom.classList.add("image-surface");
    return dom;
  }
}

ImageSurfaceComponent.DragState = {
  enter() {
    // DOM setup
    this.dom.classList.add("image-surface--drag");
    var p = document.createElement("p");
    p.textContent = "Drop an image here!";
    this.dom.appendChild(p);

    this.dom.addEventListener("dragenter", this.dragEnterHandler);
    this.dom.addEventListener("dragleave", this.dragLeaveHandler);
    this.dom.addEventListener("dragover", this.dragOverHandler);
    this.dom.addEventListener("drop", this.dropHandler);
  },

  exit() {
    // DOM clearing
    this.dom.classList.remove("image-surface--drag");
    this.dom.classList.remove("drag-over");
    this.dom.removeEventListener("dragenter", this.dragEnterHandler);
    this.dom.removeEventListener("dragleave", this.dragLeaveHandler);
    this.dom.removeEventListener("dragover", this.dragOverHandler);
    this.dom.removeEventListener("drop", this.dropHandler);
    this.clearDOM();
  }
};

ImageSurfaceComponent.ImageState = {
  enter() {
    var img = new Image;
    img.src = this.dataURL;
    this.dom.appendChild(img);
  },

  exit() {
    // Nothing to do.
  }
};

module.exports = ImageSurfaceComponent;
