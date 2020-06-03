document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score') // # shows id
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colours = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]
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
    const row= [0, 1, 2, 3, 4, 5, 6,7,8,9]
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){

      //do nothin
    }
    else{
      current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colours[random]
      })
    }

  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
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
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
      if(!isAtLeftEdge && !isAtRightEdge)rotate()

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
      addScore()
      draw()
      displayShape()
      gameOver()
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
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colours[nextRandom]
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
  // add score
  function addScore() {
    let scoreIndex=10
    for(let i = 0; i < 199; i +=width)
    {
      //define the row
      const row= [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      // to check if every square contains a class of taken
      if(row.every(index => squares[index].classList.contains('taken')))
      {
        score +=scoreIndex
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken') //remove from taken classs
          squares[index].classList.remove('tetromino')//remove from tetromino class
          squares[index].style.backgroundColor = '' //delte the colour of them

        })
        const squaresRemoved = squares.splice(i, width)//start index, how manyto delete
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
        scoreIndex+=5
      }
    }

  }
  //game moveRight
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
      document.removeEventListener("keyup", control)
    }
  }
})
