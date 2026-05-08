/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

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

  function startBall() {
    const boardWidth = $("#board").width();
    const boardHeight = $("#board").height();

    ball.x = (boardWidth - ball.width) / 2;
    ball.y = (boardHeight - ball.height) / 2;
    ball.speedX = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? -1 : 1);
    ball.speedY = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? -1 : 1);

    $(ball.id).css({
      left: ball.x,
      top: ball.y
    });
  }
  
  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
