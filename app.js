document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score') // # shows id
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  // the tetrominoes
  const lTetrmonino = [
    // starts at position 1, then the next one is drawn at 11, 21 and 2
    // l shaped
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]
  // z shaped
  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]
  // tshaped
  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]
  // square shaped
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]
  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]
  const theTetrominoes = [lTetrmonino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0
  // randomly select a tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]
  // draw the tetromino
  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
    })
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
    })
  }
  //make the tetrominoes move down every second
  //timerId = setInterval(moveDown, 1000)

  //assign functions to keycode
//  console.log(10)
  function control(e) {
    if(e.keyCode === 37) {
      moveLeft()
    }
    else if(e.keyCode === 38)
    {
      rotate()
    }
    else if(e.keyCode === 39)
    {
      moveRight()
    }
    else if(e.keyCode === 40)
    {
      moveDown()
    }
  }

  document.addEventListener("keyup", control)

  function moveDown () {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  // freeze function
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetrominoe
      random = nextRandom
      nextRandom=Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
     }
  }
  // stop tetromino from going offscreen left
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    //if it isnt at the most left position, we can move left by one square
    if(!isAtLeftEdge) currentPosition -=1
    // if there is already something in the way do not move there
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }
  function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition -=1
    }
    draw()
  }
  //rotate the tetrominoe
  function rotate() {
    undraw()
    currentRotation++
    if(currentRotation === current.length) { //if current rotation is 4 go back to start
      currentRotation = 0
    }
    current= theTetrominoes[random][currentRotation]
    draw()
  }
  //show up-next tetromino in mini grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  let displayIndex = 0

  //the Tetrominos without currentRotation
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2 ], //lshaped
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zshaped
    [1, displayWidth, displayWidth+1, displayWidth+2], //tshaped
    [0, 1, displayWidth, displayWidth+1], //oshaped
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //ishaped
  ]
  // display the shape in the mini grid
  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
    })
  }


  //add functioanlity to start button
  startBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  } else {
    draw()
    timerId = setInterval(moveDown, 1000)
    nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    displayShape()
  }
})
})
