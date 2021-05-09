// "use strict";
document.addEventListener("DOMContentLoaded", () => {
  let game = new Game();
  game.init(
    /* grid size */ 20,
    /* step interval (ms) */ 200,
    /* move through border */ true
  );

  game.setKeyPress("Right"); // default value to start with
  document.addEventListener("keydown", (event) => {
    // (just note) raw values are ArrowRight ArrowLeft ArrowUp ArrowDown
    game.setKeyPress(event.key.slice(5));
  });

  function render() {
    let sizeToFit =
      window.innerWidth > window.innerHeight
        ? window.innerHeight
        : window.innerWidth;

    game.initBoard("board", sizeToFit);
    game.renderBoard();
  }

  window.addEventListener("resize", render);

  alert(
    "jSnake Game\n" +
      "\n" +
      "Press F11 for full screen\n" +
      "Press F5 to restart game\n" +
      "\n" +
      "Click OK when ready"
  );
  render();

  game.start();
});
