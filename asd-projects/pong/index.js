/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  const BOARD_WIDTH = $("#board").width();
  const BOARD_HEIGHT = $("#board").height();

  const KEYCODE = {
    W: 87,
    S: 83,
    UP: 38,
    DOWN: 40
  };

  // Game Item Objects
  let ball;
  let leftPaddle;
  let rightPaddle;

  // Score Variables
  let score1 = 0; // Left player
  let score2 = 0; // Right player

  // one-time setup
  ball = createGameItem("#ball", 0, 0);
  leftPaddle = createGameItem("#leftPaddle", 0, 0);
  rightPaddle = createGameItem("#rightPaddle", 0, 0);

  startBall();

  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);
  $(document).on('keyup', handleKeyUp);

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    moveObject(ball);
    moveObject(leftPaddle);
    moveObject(rightPaddle);
    
    wallCollision(ball);
    wallCollision(leftPaddle);
    wallCollision(rightPaddle);

    // Check for paddle collisions
    if (doCollide(ball, leftPaddle)) {
      ball.speedX = -ball.speedX;
    }
    if (doCollide(ball, rightPaddle)) {
      ball.speedX = -ball.speedX;
    }
  }
  
  /* 
  Called in response to keydown events.
  */
  function handleKeyDown(event) {
    const keycode = event.which;

    if (keycode === KEYCODE.W) {
      leftPaddle.speedY = -5;
    }
    else if (keycode === KEYCODE.S) {
      leftPaddle.speedY = 5;
    }
    else if (keycode === KEYCODE.UP) {
      rightPaddle.speedY = -5;
    }
    else if (keycode === KEYCODE.DOWN) {
      rightPaddle.speedY = 5;
    }
  }

  /* 
  Called in response to keyup events.
  */
  function handleKeyUp(event) {
    const keycode = event.which;

    if (keycode === KEYCODE.W || keycode === KEYCODE.S) {
      leftPaddle.speedY = 0;
    }
    else if (keycode === KEYCODE.UP || keycode === KEYCODE.DOWN) {
      rightPaddle.speedY = 0;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function createGameItem(id, speedX, speedY) {
    const gameItem = {};
    gameItem.id = id;

    const xFromCss = parseFloat($(id).css("left"));
    const yFromCss = parseFloat($(id).css("top"));

    gameItem.x = Number.isNaN(xFromCss) ? $(id).position().left : xFromCss;
    gameItem.y = Number.isNaN(yFromCss) ? $(id).position().top : yFromCss;
    gameItem.width = $(id).width();
    gameItem.height = $(id).height();
    gameItem.speedX = speedX;
    gameItem.speedY = speedY;

    return gameItem;
  }

  function moveObject(gameItem) {
    gameItem.x += gameItem.speedX;
    gameItem.y += gameItem.speedY;

    $(gameItem.id).css({
      left: gameItem.x,
      top: gameItem.y
    });
  }

  function wallCollision(gameItem) {
    // Check collision with left wall
    if (gameItem.x < 0) {
      // Ball scored on the right
      if (gameItem.id === "#ball") {
        score2++;
        $("#score2").text(score2);
        if (score2 >= 4) {
          endGame();
        }
        startBall();
      } else {
        gameItem.x = 0;
      }
    }

    // Check collision with top wall
    if (gameItem.y < 0) {
      gameItem.y = 0;
      // Ball bounces off top
      if (gameItem.id === "#ball") {
        gameItem.speedY = -gameItem.speedY;
      }
    }

    // Check collision with right wall
    if (gameItem.x + gameItem.width > BOARD_WIDTH) {
      // Ball scored on the left
      if (gameItem.id === "#ball") {
        score1++;
        $("#score1").text(score1);
        if (score1 >= 4) {
          endGame();
        }
        startBall();
      } else {
        gameItem.x = BOARD_WIDTH - gameItem.width;
      }
    }

    // Check collision with bottom wall
    if (gameItem.y + gameItem.height > BOARD_HEIGHT) {
      gameItem.y = BOARD_HEIGHT - gameItem.height;
      // Ball bounces off bottom
      if (gameItem.id === "#ball") {
        gameItem.speedY = -gameItem.speedY;
      }
    }
  }

  function startBall() {
    ball.x = (BOARD_WIDTH - ball.width) / 2;
    ball.y = (BOARD_HEIGHT - ball.height) / 2;
    ball.speedX = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? -1 : 1);
    ball.speedY = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? -1 : 1);

    $(ball.id).css({
      left: ball.x,
      top: ball.y
    });
  }
  
  function doCollide(obj1, obj2) {
    // Check if obj1's left side is to the left of obj2's right side
    // AND obj1's right side is to the right of obj2's left side
    // AND obj1's top side is above obj2's bottom side
    // AND obj1's bottom side is below obj2's top side
    if (obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y) {
      return true;
    }
    return false;
  }
  
  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
