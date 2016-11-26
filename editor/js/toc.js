var HeadingNode = require("piotr/nodes/heading-node"),
    Component = require("./../../common/js/component");

/**
 * A table of content for Piotr.
 *
 * @class
 * @param {Element} dom - The DOM element where the TOC will be rendered
 * @param {Piotr.Document} doc - The Piotr document
 */
class TOC extends Component {
  constructor(doc) {
    super();
    this.doc = doc;
    this.defaultState = DefaultState;
  }

  render() {
    // I. Initialization
    // - A. Variables
    var level = 1;

    // - B. DOM
    this.clearDOM();
    var li = this.dom;

    for(var i = 0; i < this.doc.nodes.length; i++) {
      let node = this.doc.nodes[i];

      if(node instanceof HeadingNode) {
        if(node.level === 1) {
          li = this.dom;
        } else if(node.level > level) {
          while(node.level > level) {
            li = li
              .appendChild(document.createElement("ul"))
              .appendChild(document.createElement("li"));

            level++;
          }
        } else if(node.level < level || node.level === level) {
          if(node.level < 0)
            throw new Error("Heading levels cannot go below 0!");

          while(node.level < level) {
            li = li.parentNode.parentNode;
            //   li ul         li
            level--;
          }

          li = li.parentNode.appendChild(document.createElement("li"));
        }

        let a = document.createElement("a");
        a.href = "#" + node.id;
        a.appendChild(document.createTextNode(node.state.text));
        li.appendChild(a);
      }
    }
  }
}

var DefaultState = {
  enter() {
    this.render();
  }
}

module.exports = TOC;
