// -- All JS code has to be within the curly parenthsis of the below event listener-->
// -- the event listener arguement - 'DOMContentLoaded' --means the event will fires after the entire HTML has been loaded and subsequently after the DOM has been created
// The above event listener has been added so that the script is read after the entire HTML has been loaded and DOM has been created

//  The DOMContentLoaded just waits for the DOM to be created and then fires...doesnt wait for the images, stylesheets or subframes to upload

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");

  /*declaring width of the grid and cells, The variable width will be used while defining shapes of the Tetrominoes  */
  const width = 10;
  let nextRandom = 0; //( used later during mini grid display and freeze function)
  let timerId;
  let score = 0;
  const colors = ["orange", "red", "purple", "green", "blue"];
  //  In aboce, put colors in the same order as the shapes you'd want to be in those colors
  //  Add this logic to every instance of searching for classList.add("tetromino")

  /*we'd like JS to speak to all the squares in the div grid */
  /* Also, Converting all the 200 divs into an array so that we can apply array specific methods and properties on them */
  let squares = Array.from(document.querySelectorAll(".grid div"));
  /*************************************************** */

  /*Drawing tetrominoes using classList.add() 
  Each of the 4 child arrays represent the particular shape's possible rotation */
  const lTetrominoes = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetrominoes = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetrominoes = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width + 1, width * 2 + 1, width],
  ];

  const oTetrominoes = [
    [0, 1, width + 1, width],
    [0, 1, width + 1, width],
    [0, 1, width + 1, width],
    [0, 1, width + 1, width],
  ];

  const iTetrominoes = [
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
  ];
  /* Creating one master terimino for all child tetrominoes */
  const theTetrominoes = [
    lTetrominoes,
    zTetrominoes,
    tTetrominoes,
    oTetrominoes,
    iTetrominoes,
  ];

  /*Choose the position at where the tetrominoes should start to appear on the grid ...lets position it from box indexed at 4 onwards...NOTE this is box indexed at 4 and actually the 5th box from start*/
  let currentPosition = 4;
  let currentRotation = 0; /* Targeting 1st rotation shape for each tetromino */

  let random = Math.floor(Math.random() * theTetrominoes.length);

  /* Choosing a random shape from the theTetrominoes */
  let currentPiece = theTetrominoes[random][currentRotation];

  /*Draw the tetromino using forEach() in the grid*/
  /*The below function:
    1.  runs forEach() for each item of the array 'current'
    2.  gains control of each div element  - ref squares above
    3.  draws [currentPosition +item] and adds a class 'tetromino' which gives it a blue color - as defined in css sheet */

  function draw() {
    currentPiece.forEach((item) => {
      squares[currentPosition + item].classList.add("tetromino");
      squares[currentPosition + item].style.backgroundColor = colors[random];
    });
  }

  /*Undraw the Teromino in the grid*/
  /* Does everything same as above function but removes the class, hence the blue color goes away diluting the shape as well */
  function undraw() {
    currentPiece.forEach((item) => {
      squares[currentPosition + item].classList.remove("tetromino");
      squares[currentPosition + item].style.backgroundColor = " "; // empty string left in order to remove the color association
    });
  }

  /*make the tetrimino move down every second:*/
  /* the function 'moveDown' invokes every 1000 mili second. i.e. 1 second */

  /****************************************** */
  // timerId = setInterval(moveDown, 250);
  // /********************************* */

  //  Assign functions to keyCodes
  //  Anytime you press a key on the keyboard, the event listener is gonna identify which key was pressed through the preassigned keyCodes and will invoke the associated function:

  // e is for event
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keycode === 40) {
      moveDown();
    }
  }

  // WHenever the event "keyup" happens, it invokes the function 'control'
  document.addEventListener("keyup", control);

  //  Move down function:
  function moveDown() {
    undraw(); /*removes the piece */
    currentPosition += width; /* resets the current Position to a new value incresed by width  = 10 - which'll be exactly 1 row down, same column */
    draw(); /*Draws the piece again with new current position*/
    freeze();
  }
  //The below function stops the tetrominoes to stop the drop fall when they reach the last row
  //  It converts each of the shape's divs to contain class 'taken' if the condition is met
  function freeze() {
    if (
      currentPiece.some((item) =>
        squares[currentPosition + item + width].classList.contains("taken")
      ) /* '+width is to check the next base down from the shape's square' */
    ) {
      currentPiece.forEach((item) =>
        squares[currentPosition + item].classList.add("taken")
      );
      //  start a new tetromino falling:
      random = nextRandom; // Mini Grid ref
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      currentPiece = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape(); // Mini grid display
      addScore();
      gameOver();
    }
  }

  function moveLeft() {
    undraw();
    const isAtLeftEdge = currentPiece.some(
      (item) => (currentPosition + item) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;

    // BUT/ or
    if (
      currentPiece.some((item) =>
        squares[currentPosition + item].classList.contains("taken")
      )
    )
      currentPosition += 1;
    draw();
  }
  /*The 1st if statement: the below will only move to left by 1 box only if function isAtLeftEdge is NOT true. If it is true, then there cannot be any further left repositioning
     
  The second If Statement: checks that if the next positioned box at left has a class of 'taken', then it moves back to its original space in the array
  */

  function moveRight() {
    undraw();
    const isAtRightEdge = currentPiece.some(
      (item) => (currentPosition + item) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    // But/ or
    if (
      currentPiece.some((item) =>
        squares[currentPosition + item].classList.contains("taken")
      )
    )
      currentPosition -= 1;
    draw();
  }

  function rotate() {
    // function rotate would only work after the preliminary check for isAtLeftEdge and isAtRightEdge not being true.
    // Layman Terms: rotate would only work if the tetriminoes are not on either edges
    const isAtLeftEdge = currentPiece.some(
      (item) => (currentPosition + item) % width === 0
    );
    const isAtRightEdge = currentPiece.some(
      (item) => (currentPosition + item) % width === width - 1
    );

    if (!(isAtLeftEdge || isAtRightEdge)) {
      undraw();
      currentRotation++;

      if (currentRotation === currentPiece.length) {
        // if the current rotation gets to 4, make it go back to 0
        currentRotation = 0;
      }
    }
    currentPiece = theTetrominoes[random][currentRotation];
    draw();
  }
  //***************************       MINI GRID      ************************************* */
  //  Show up-next tetromino in miniGrid
  const displaySquares = document.querySelectorAll(".miniGrid div"); // No Array.from() is being used coz its a different approach

  const displayWidth = 4; // this is a variable defined to be used for defining shapes below
  let displayIndex = 0;

  //  the tetrominos without rotations: taking only the 1st shapre of each tetromino
  const upNextTetrominos = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth + 1, displayWidth], // oTetromino
    [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth + 3], // iTetromino
  ];

  //  display the shape in the mini-grid display:

  function displayShape() {
    // remove any trace of a tetromino from the entire miniGrid
    // displaySquares.forEach((item) => {
    //   item.classList.remove("tetromino");
    // });
    displaySquares.forEach(function (item) {
      item.classList.remove("tetromino");
      squares.style.background = " ";
    }); // Why was the class tetromino removed?
    upNextTetrominos[nextRandom].forEach((item) => {
      displaySquares[displayIndex + item].classList.add("tetromino");
      displaySquares[displayIndex + item].style.backgroundColor =
        colors[nextRandom]; // Tetromino color

      // if the nextRandom has been assiged a global value 0 initially, then upNextTetrominos[0] doesnt look right..refer below logic
      // let value = 5

      // function Num() {
      //     let value = 7
      //     console.log(value)
      // }
      // console.log(value)
      // Num()

      // function newNum() {
      //     let newValue = value + 1
      //     console.log(newValue)
      // }
      // // console.log(newValue)
      // newNum(
    });
  }
  // add functionality to the button

  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 250);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  // add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      // now define what your row is...this would the i plus every square that makes up the row
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      // A 'every' method works similarly to some()
      if (row.every((item) => squares[item].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((item) => {
          squares[item].classList.remove("taken");
          squares[item].classList.remove("tetromino");
          squares[item].style.backgroundColor = " ";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares); // make the row complete
        squares.forEach((cell) => grid.appendChild(cell)); // Add a line so the grid doesnt appear to shrink
      }
    }
  }

  // game Over:

  function gameOver() {
    if (
      currentPiece.some((item) =>
        squares[currentPosition + item].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "GAME OVER";
      clearInterval(timerId);
    }
  }

  /*Assiggning colors to the tetromino */
});

/* Creating one master theTetrominoes and including all the 4 shape arrays within */

/*  Other Observations:

1.  var -   function or global scoped 
    let -   block scoped
    const-  block scoped constant
*/
/*
document.querySelector(".grid"): to get control of main div with class - grid

document.querySelectorAll(".grid div") : to get control of all the 200 child divs of the div with class name - "grid"

Arrayfrom() : converting all the entire result into an Array ...so that all the array specific methods and properties can be applied 

*/
// ************************************************
/*RANDOMLY CHOOSING A SHAPE AND ASSIGNING BLUE COLOR THROUGH CLASSLIST ADD METHOD */
/*ERASING THE DRAWING BY REMOVING CLASS THROUGH CLASSLIST REMOVE()*/

/*Drawing Tetrominoes using classList.add()- Adding a class 'tetrimino for color blue defined in css '
WE'LL BE MAKING USE OF forEach() to draw shapes: forEach gains control for each RELEVANT child div in the parent 'grid' to give it a class 'tetrimino' which is defined blue in color

We also made a draft for each shape all possible rotations in the excel sheet
*/

/*Choose a random shape
random = Math.floor(Math.random() * theTetrominoes.length); */

// ************************************************
/*MOVING THE TETRIMINOS AROUND OUR GRID */
/* TIME INTERVALS AND SETiNTERVAL */
// setInterval(function, 1000): allows us to invoke a function that we pass through it, after x amount of time
// In the above eg.time is 1000 miliseconds or 1 second;
/* itemArray.some (false, true, false):   'some()' The some() method executes the function once for each element present in the array: If it finds an array element where the function returns a true value, some() returns true (and does not check the remaining values) Otherwise it returns false.
This method works like forEach method and checks if the methods we are writing is true for some of the items in an 'itemArray' array. Even if one comes out to be true of all, that means we are good to go */

//  decaring function freeze

// ***************************************************
/* Using Modulus to define our place on grid */

//  Move the tetromino left, unless its at the edge OR there is a blockage
// ***************************************************

// KeyCodes and Events

//  Assigning keyCode to the events and then adding event listener so that when the event happens, the particular function gets invoked. In this cosa, the function "control"

// ******************************************************

// Choosing items from Arrays:
// Learn how the array works and also the increment operator - '++' means +1 to previous value and  '--' means -1 from the previous value
//  Create function rotate

// *********************************************************
// Displaying the 'Next Up' tetromino

//********************************************************
// Adding a start and a pause button:
// settingIntervals and clearIntervals

//********************************************************

// splice(): it changes the original array. it mutates the array by
// 1.   removes items from the array
// 2.   removes and replace items from the array with new ones

// splice(startIndex, deleteCount)
//*****************************************************************

// splice(), concat(), and appendChild()

/* The following actions are addressed:
  // When the user manages to fill the entire row with a tetrominos sqaures
  1.  We need to remove the particular row
  2.  Add the score to the score tally
  3.  Addanother row to ensure the grid remains the same size after removal of the matched row. We wouldnt like it to shrink down in size

  */
//  Add Score
// forLoop would loop over the entire grid and all its sqaures every 10 sqaures - width by width

//*****************************************************************
/*

Game over using some() and innerHTML


Defining game over: Tetris finishes when you stack up all your tetrominos in a grid so that they cant fit anymore. 

Logic: If there is a 'taken' shape present in the original default position or index for, we call it a game over

*/

/*
All methods and properties used in the project:

.addEventListener()
.querySelector()
.querySelectorAll()
Array.from()
classList.add()
classList.remove()
.keyCode

function control(e) {
if (e.keyCode === 37) {
moveLeft();

.Math.floor()
.Math.random()
.length
.forEach()
.splice()
.clearInterval()
.setInterval()
.some()
.every()
.innerHTML()
.add()
.remove()
.contains()
.concat()
.appendChild()


*/

/* Steps for Improvisations:

 1.  add a level
 2. adding a line count
 3. add some music to the game
 4. Styling it to the max
 */
