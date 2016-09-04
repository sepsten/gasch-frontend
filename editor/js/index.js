var Document = require("piotr/document"),
    HeadingNode = require("piotr/nodes/heading-node"),
    ParagraphNode = require("piotr/nodes/paragraph-node"),
    ImageNode = require("./image-node"),
    Editor = require("piotr/editor"),
    Toolbar = require("piotr/toolbar");

var el = document.getElementById("editor");
var doc = new Document();

// Heading
var h = new HeadingNode(1);
h.state.text = "I'm a heading 1";
doc.nodes.push(h);

// Paragraphs
var p1 = new ParagraphNode;
p1.state.text = "Hello world!";
doc.nodes.push(p1);

var i = new ImageNode;
doc.nodes.push(i);

var p2 = new ParagraphNode;
p2.state.text = "I am the second paragraph.";
doc.nodes.push(p2);

var editor = new Editor(el, doc);
var toolbar = new Toolbar.Toolbar(editor, document.getElementById("toolbar"));
toolbar.add(new Toolbar.UndoButton);
toolbar.add(new Toolbar.RedoButton);
toolbar.add(new Toolbar.HeadingButton);

window.editor = editor;
window.toolbar = toolbar;
window.require = require;

window.onbeforeunload = function(e) {
  return "Do you really want to quit this page? There are unsaved changes.";
}
