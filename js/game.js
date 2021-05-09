class Game {
  snake = new Snake();
  apple = new Apple();

  // colors for canvas
  colors = {
    background: "#e6e2d3",
    grid: "#b9936c",
    snake: "#82b74b",
    apple: "#d64161",
  };

  // initialization board size values
  initBoard(canvasIdName, boardSize, renderGrid = false) {
    this.canvas = document.getElementById(canvasIdName);
    this.boardSize = boardSize;
    this.squareSize = boardSize / this.gridSize;
    this.canvas.setAttribute("height", this.boardSize);
    this.canvas.setAttribute("width", this.boardSize);
    this.renderGrid = renderGrid;
  }

  // render game scene
  renderBoard() {
    let context = this.canvas.getContext("2d");

    // fill background
    context.fillStyle = this.colors.background;
    context.fillRect(0, 0, this.boardSize, this.boardSize);

    // draw board grid (optional)
    if (this.renderGrid) {
      for (let i = 0; i <= this.boardSize; i += this.squareSize) {
        context.moveTo(i, 1);
        context.lineTo(i, this.boardSize);
      }

      for (let i = 0; i <= this.boardSize; i += this.squareSize) {
        context.moveTo(1, i);
        context.lineTo(this.boardSize, i);
      }

      context.lineWidth = 1;
      context.strokeStyle = this.colors.grid;
      context.stroke();
    }

    if (this.run) {
      // draw apple
      context.fillStyle = this.colors.apple;
      context.fillRect(
        this.apple.position[0] * this.squareSize,
        this.apple.position[1] * this.squareSize,
        this.squareSize,
        this.squareSize
      );

      // draw snake
      context.fillStyle = this.colors.snake;
      for (let i = 0; i < this.snake.body.length; i++) {
        context.fillRect(
          this.snake.body[i][0] * this.squareSize,
          this.snake.body[i][1] * this.squareSize,
          this.squareSize,
          this.squareSize
        );
      }
    }
  }

  // generate new apple position
  spawnApple() {
    this.apple.position[0] = Math.floor(Math.random() * this.gridSize);
    this.apple.position[1] = Math.floor(Math.random() * this.gridSize);
    for (let i = 0; i < this.snake.body.length; i++) {
      if (
        this.snake.body[i][0] == this.apple.position[0] &&
        this.snake.body[i][1] == this.apple.position[1]
      ) {
        this.spawnApple();
        break;
      }
    }
  }

  // check snake collision with border
  snakeBorderCollision() {
    if (this.borderCollision) {
      if (this.nextStep[0] < 0) {
        this.nextStep[0] = this.gridSize - 1;
      }
      if (this.nextStep[0] > this.gridSize - 1) {
        this.nextStep[0] = 0;
      }
      if (this.nextStep[1] < 0) {
        this.nextStep[1] = this.gridSize - 1;
      }
      if (this.nextStep[1] > this.gridSize - 1) {
        this.nextStep[1] = 0;
      }
    } else if (
      this.nextStep[0] < 0 ||
      this.nextStep[0] > this.gridSize - 1 ||
      this.nextStep[1] < 0 ||
      this.nextStep[1] > this.gridSize - 1
    ) {
      return true;
    }
    return false;
  }

  // check snake collision with its own body
  snakeBodyCollision() {
    for (let i = 0; i < this.snake.body.length; i++) {
      if (
        this.snake.body[i][0] == this.nextStep[0] &&
        this.snake.body[i][1] == this.nextStep[1]
      ) {
        return true;
      }
    }
    return false;
  }

  // routine for next snake step
  makeStep() {
    let snakeHead = this.snake.body[this.snake.body.length - 1];
    this.nextStep = [
      snakeHead[0] + this.snake.directions[this.snake.direction][0],
      snakeHead[1] + this.snake.directions[this.snake.direction][1],
    ];

    if (this.snakeBorderCollision() || this.snakeBodyCollision()) {
      this.stop();
      return;
    }

    this.snake.body.push(this.nextStep);

    // eat apple ?
    if (
      snakeHead[0] == this.apple.position[0] &&
      snakeHead[1] == this.apple.position[1]
    ) {
      this.spawnApple();
      this.apples++;
    } else {
      this.snake.body.shift();
    }
  }

  // keypress is set immediately but actual snake direction each interval tick
  setKeyPress(key) {
    if (["Right", "Left", "Up", "Down"].includes(key)) {
      this.key = key;
    }
  }

  setSnakeDirection() {
    let newDirection = this.key;
    if (
      (this.snake.direction == "Up" && newDirection == "Down") ||
      (this.snake.direction == "Down" && newDirection == "Up") ||
      (this.snake.direction == "Right" && newDirection == "Left") ||
      (this.snake.direction == "Left" && newDirection == "Right")
    ) {
      return;
    }

    this.snake.direction = newDirection;
  }

  // interval tick routine
  update() {
    this.setSnakeDirection();
    this.makeStep();
    this.renderBoard();
  }

  // initialization of new game
  init(gridSize = 20, gameSpeed = 200, borderCollision = false) {
    this.gridSize = gridSize;
    this.gameSpeed = gameSpeed;
    this.borderCollision = borderCollision;

    this.run = false;
    this.spawnApple();
    this.apples = 0;
  }

  // game over :(
  stop() {
    clearInterval(this.interval);
    alert("Game Over\n" + "Collected apples: " + this.apples);
    location.reload();
  }

  // start game :)
  start() {
    if (this.run == true) {
      // this should not happen
      return;
    }
    this.run = true;

    this.interval = setInterval(() => {
      this.update();
    }, this.gameSpeed);
  }
}
