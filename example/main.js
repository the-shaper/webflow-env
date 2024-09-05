// Create and append style element
var __vite_style__ = document.createElement("style");
__vite_style__.innerHTML = `
  .js-badge {
    position: fixed;
    bottom: 32px;
    right: 32px;
    border-radius: 16px;
    background-color: #add8e6;
    color: #000;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
document.head.appendChild(__vite_style__);

// Main function
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    factory();
  }
})(function () {
  "use strict";

  var e = "";

  // Create and append badge element
  const badge = document.createElement("div");
  badge.classList.add("js-badge");
  badge.innerText = "does it!?!";
  document.body.appendChild(badge);

  console.log("it works!");
});
