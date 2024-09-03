document.addEventListener('DOMContentLoaded', () => {


        const height = 20;
        const width = 10;
        const startBtn = document.querySelector('button');

        const grid = createGrid();
        let squares = Array.from(grid.querySelectorAll('div'));
        const scoreDisplay = document.querySelector('.score-display');
        const displaySquares = document.querySelectorAll('.previous-display-grid div');
        const linesDisplay = document.querySelector('.lines-display');

        let currentPosition = 4;
        let currentIndex = 0;
        let timerId;
        let score = 0;
        let lines = 0;
        let tickDuration = 800;
        let level = 0;
        //[iTetromino, tTetromino, lTetromino, oTetromino, sTetromino, zTetromino, jTetromino, background]
        const colors = ['#00ffff', '#800080', '#ff7f00', '#ffff00', '#00ff00', '#ff0000', '#0000ff', '#f2f2f2']
        startBtn.addEventListener('click', () => {
            if (timerId) {
                clearInterval(timerId)
                timerId = null;
            } else {
                draw()
                timerId = setInterval(moveDown, tickDuration)
                nextRandom = Math.floor(Math.random() * theTetrominoes.length);
                displayShape()
            }
        })

        // game over
        function gamerOver() {
            if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
                scoreDisplay.innerHTML = 'end'
                clearInterval(timerId)
            }
        }

        //level increases every 10 lines
        function updateLevel() {
            level = Math.floor(lines / 10)
            tickDuration = 800 - level * 83;
            timerId = setInterval(moveDown, tickDuration)
        }

        //create Grid divs
        function createGrid() {
            //main grid
            let grid = document.querySelector(".grid")
            for (let i = 0 ; i < height * width ; i++) {
                let gridElement = document.createElement("div")
                grid.appendChild(gridElement)
            }

            //set base of grid
            for (let i = 0 ; i < width ; i++) {
                let gridElement = document.createElement("div")
                gridElement.setAttribute("class", "floor")
                grid.appendChild(gridElement)
            }

            let previousGrid = document.querySelector(".previous-display-grid")
            // Since 16 is the max grid size in which all the Tetrominoes
            // can fit in we create one here
            for (let i = 0 ; i < 16 ; i++) {
                let gridElement = document.createElement("div")
                previousGrid.appendChild(gridElement);
            }
            return grid;
        }

        //add score
        function addScore() {
            for (currentIndex = 0 ; currentIndex < height * width ; currentIndex += width) {
                const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9]
                if (row.every(index => squares[index].classList.contains('block2'))) {
                    score += 10
                    lines += 1
                    updateLevel()
                    scoreDisplay.innerHTML = score;
                    linesDisplay.innerHTML = lines;
                    row.forEach(index => {
                        squares[index].style.backgroundColor = colors[colors.length - 1];
                        squares[index].classList.remove('block2') || squares[index].classList.remove('block')
                    })
                    //splice Array
                    const squaresRemoved = squares.splice(currentIndex, width)
                    squares = squaresRemoved.concat(squares)
                    squares.forEach(cell => grid.appendChild(cell))
                }
            }
        }

        //assign functions to keycodes
        function control(e) {
            console.log(e.keyCode)
            if (e.keyCode === 39) {
                moveRight()
            } else if (e.keyCode === 38) {
                rotateCounterClockwise()
            } else if (e.keyCode === 37) {
                moveLeft()
            } else if (e.keyCode === 40) {
                rotateClockwise()
            } else if (e.keyCode === 32) {
                moveDown()
            }
        }

        document.addEventListener('keydown', control)

        //"Blocks" = Tetrominoes
        const iTetromino = [
            [width, width + 1, width + 2, width + 3],
            [2, width + 2, width * 2 + 2, width * 3 + 2],
            [2 * width, 2 * width + 1, 2 * width + 2, 2 * width + 3],
            [1, width + 1, width * 2 + 1, width * 3 + 1]
        ]

        const jTetromino = [
            [0, width, width + 1, width + 2],
            [1, 2, width + 1, width * 2 + 1],
            [width, width + 1, width + 2, width * 2 + 2],
            [1, width + 1, width * 2, width * 2 + 1],
        ]

        const lTetromino = [
            [2, width, width + 1, width + 2],
            [1, width + 1, width * 2 + 1, width * 2 + 2],
            [width, width + 1, width + 2, width * 2],
            [0, 1, width + 1, width * 2 + 1]
        ]

        const oTetromino = [
            [0, 1, width, width + 1],
            [0, 1, width, width + 1],
            [0, 1, width, width + 1],
            [0, 1, width, width + 1]
        ]

        const sTetromino = [
            [1, 2, width, width + 1],
            [1, width + 1, width + 2, width * 2 + 2],
            [width + 1, width + 2, width * 2, width * 2 + 1],
            [0, width, width + 1, width * 2 + 1]
        ]

        const tTetromino = [
            [1, width, width + 1, width + 2],
            [1, width + 1, width + 2, width * 2 + 1],
            [width, width + 1, width + 2, width * 2 + 1],
            [1, width, width + 1, width * 2 + 1],
        ]

        const zTetromino = [
            [0, 1, width + 1, width + 2],
            [2, width + 1, width + 2, width * 2 + 1],
            [width, width + 1, width * 2 + 1, width * 2 + 2],
            [1, width, width + 1, width * 2],
        ]

        const theTetrominoes = [iTetromino, tTetromino, lTetromino, oTetromino, sTetromino, zTetromino, jTetromino]


        //randomly select one of the Tetrominoes
        let rand = Math.floor(Math.random() * theTetrominoes.length);
        let currentRotation = 0;
        let current = theTetrominoes[rand][currentRotation];

        //draw Tetromino
        function draw() {
            current.forEach(index => {
                    squares[currentPosition + index].classList.add('block')
                    squares[currentPosition + index].style.backgroundColor = colors[rand]
                }
            )

        }

        //undraw Tetromino
        function undraw() {
            current.forEach(index => {
                    squares[currentPosition + index].classList.remove('block')
                    squares[currentPosition + index].style.backgroundColor = colors[colors.length - 1]
                }
            )
        }

        //move Tetromino down
        function moveDown() {
            freeze()
            undraw()
            currentPosition = currentPosition += width;
            draw()
        }

        //move Tetromino right
        function moveRight() {
            undraw()
            const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
            if (!isAtRightEdge) {
                currentPosition += 1;
            }
            if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
                currentPosition -= 1;
            }
            draw()
        }

        //move Tetromino left
        function moveLeft() {
            undraw()
            const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
            if (!isAtLeftEdge) {
                currentPosition -= 1;
            }
            if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
                currentPosition += 1;
            }
            draw()
        }

        //rotate Tetromino clockwise
        function rotateClockwise() {
            undraw()
            let previousRot = currentRotation;
            currentRotation = (currentRotation + 1) % current.length;
            current = theTetrominoes[rand][currentRotation];
            // Determine the x-coordinates of the blocks in the Tetromino
            const xPositions = current.map(index => (currentPosition + index) % width);
            // Check if any block is on the far left and any block is on the far right, indicating an overflow
            const isCrossingBoundary = xPositions.some(x => x === 0) && xPositions.some(x => x === width - 1);

            if (current.some(index => squares[currentPosition + index].classList.contains('block2')) || isCrossingBoundary) {
                current = theTetrominoes[rand][previousRot];
                currentRotation = previousRot;
            }
            draw();
        }

        //rotate Tetromino counter-clockwise
        function rotateCounterClockwise() {
            undraw()
            let previousRot = currentRotation;
            if (currentRotation === 0) {
                currentRotation = 3;
            } else {
                currentRotation--;
            }
            current = theTetrominoes[rand][currentRotation];
            // Determine the x-coordinates of the blocks in the Tetromino
            const xPositions = current.map(index => (currentPosition + index) % width);
            // Check if any block is on the far left and any block is on the far right, indicating an overflow
            const isCrossingBoundary = xPositions.some(x => x === 0) && xPositions.some(x => x === width - 1);

            if (current.some(index => squares[currentPosition + index].classList.contains('block2')) || isCrossingBoundary) {
                current = theTetrominoes[rand][previousRot];
                currentRotation = previousRot;
            }
            draw();
        }

        //show previous Tetromino
        const displayWidth = 4
        const displayIndex = 0
        let nextRandom = 0
        const smallTetrominoes = [
            [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //i
            [1, displayWidth, displayWidth + 1, displayWidth + 2], //t
            [2, displayWidth, displayWidth + 1, displayWidth + 2], //l
            [0, 1, displayWidth, displayWidth + 1], //o
            [1, 2, displayWidth, displayWidth + 1], //s
            [0, 1, displayWidth + 1, displayWidth + 2], //z
            [0, displayWidth, displayWidth + 1, displayWidth + 2] //j
        ]


        function displayShape() {
            displaySquares.forEach(square => {
                square.classList.remove('block')
                square.style.backgroundColor = colors[colors.length - 1]
            })
            smallTetrominoes[nextRandom].forEach(index => {
                displaySquares[displayIndex + index].classList.add('block')
                displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
            })
        }

        //freeze Tetromino
        function freeze() {
            if (current.some(index => squares[currentPosition + index + width].classList.contains('block2'))
                || current.some(index => squares[currentPosition + index + width].classList.contains('floor'))) {
                current.forEach(index => squares[index + currentPosition].classList.add('block2'))
                rand = nextRandom;
                nextRandom = Math.floor(Math.random() * theTetrominoes.length);
                current = theTetrominoes[rand][currentRotation];
                currentPosition = 4;
                gamerOver()
                addScore()
                displayShape()
                draw()
            }
        }
    }
)
