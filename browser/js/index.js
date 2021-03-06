var api = require("./../../common/js/client");
window.api = api;

// Form handling
var loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", function(e) {
  e.preventDefault();
  let user = loginForm.elements["user"].value,
      pass = loginForm.elements["pass"].value;
  api.requestToken(user, pass).then(function() {
    alert("Logged in!");
    renderDocumentList();
  });
});

var docList = document.getElementById("docList");

function renderDocumentList() {
  api.get("/documents").then(function(res) {
    res.body.forEach(function(doc) {
      var a = document.createElement("a");
      a.href = "/editor/?" + doc.id;
      a.textContent = doc.title || doc.id;
      var li = document.createElement("li");
      li.appendChild(a);
      docList.appendChild(li);
    });
  });
}

// If already logged in
if(api.authenticated)
  renderDocumentList();
