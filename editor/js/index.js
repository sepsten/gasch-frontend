var ImageButton = require("./image-button"),
    Editor = require("piotr/editor"),
    Document = require("piotr/document"),
    Toolbar = require("piotr/toolbar"),
    api = require("./../../common/js/client"),
    SaveAgent = require("./save-agent"),
    SaveButton = require("./save-button");

//// Document retrieval/creation
var sa;

// Check query string
if(window.location.search.length > 0) {
  var id = window.location.search.slice(1); // Remove first "?"
  api.get("/documents/"+id).then(function(res) {
    window.doc = Document.fromJSON(res.body);
    window.sa = new SaveAgent(api, res.body.id);
    createEditor();
  }, function(err) {
    if(err.name === "DocumentNotFound") {
      alert("The document wasn't found!");
      window.location.href = "/browser";
    }
  });
} else {
  console.warn("Creating a new document.");
  window.doc = new Document(true);
  window.sa = new SaveAgent(api);
  createEditor();
}


//// Editor creation
function createEditor() {
  var doc = window.doc,
      sa = window.sa;

  var el = document.getElementById("editor");
  var editor = new Editor(el, doc);
  var toolbar = new Toolbar.Toolbar(editor, document.getElementById("toolbar"));
  toolbar.add(new Toolbar.UndoButton);
  toolbar.add(new Toolbar.RedoButton);
  toolbar.add(new Toolbar.HeadingButton);
  toolbar.add(new ImageButton);
  toolbar.add(new SaveButton(sa));

  editor.selection.set({
    caret: true,
    surface: editor.mother,
    startNodeIndex: 0,
    startOffset: 0
  });
  editor.selection.update();

  window.editor = editor;
  window.toolbar = toolbar;
  window.require = require;

  window.onbeforeunload = function(e) {
    return "Do you really want to quit this page? There are unsaved changes.";
  };
}
