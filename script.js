const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('reset-btn');
const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');
const playButton = document.getElementById('play-btn');
const stopButton = document.getElementById('stop-btn');
const numGenerations =  document.getElementById('num-gens');

canvas.width = 600;
canvas.height = 600;

const PADDING = 0;
const CELL_SIZE = 10;
const ROWS = canvas.height / CELL_SIZE;
const COLS = canvas.width / CELL_SIZE;
const DELAY = 100;


let generations = 0;
let history = [];
let grid = [];
let hue = 150;
let colour = `hsl(${hue} 100% 50%)`;
let playGen;

// Count neighbouring cells and return count for game of life rules
function countCells(xPos, yPos){
    let count = 0;

    for (let y = -1; y <= 1; y++){
        for (let x = -1; x <= 1; x++){
            if (x === 0 && y === 0) continue;
                
            const newX = (xPos + x + COLS) % COLS;
            const newY = (yPos + y + ROWS) % ROWS;


            if (grid[newY][newX] !== 0) {
                count += 1;
            }
        }
    }

    return count;
}

// Clear cells
function createGrid(){
    return Array.from(Array(ROWS), () => new Array(COLS).fill(0));
}

function resetGrid(){
    grid = createGrid();
    draw();
    history = [];
    generations = 0;
    numGenerations.innerText = `Number of Generations: ${generations}`;
}

// Draw
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGrid();

    for(let y = PADDING; y < ROWS - PADDING; y++){
        for(let x = PADDING; x < COLS - PADDING; x++){
            if(grid[y][x] !== 0){
                drawCell(x, y, grid[y][x])
            }
        }
    }
}

function drawCell(x, y, hue){
    ctx.beginPath();
    ctx.fillStyle = `hsl(${hue} 100% 50%)`;
    ctx.rect(x * CELL_SIZE,y * CELL_SIZE,CELL_SIZE,CELL_SIZE);
    ctx.fill();
}


// Draw the grid on canvas
function drawGrid(){
    ctx.fillStyle = "black";
    ctx.rect(PADDING * CELL_SIZE,PADDING * CELL_SIZE,canvas.width - (PADDING * 2 * CELL_SIZE),canvas.height - (PADDING * 2 * CELL_SIZE));
    ctx.fill()
    
    ctx.strokeStyle = `hsl(0 0% 10%)`;
    ctx.beginPath();

    for(let y = PADDING; y < ROWS - PADDING; y++){
        ctx.moveTo(PADDING * CELL_SIZE, y * CELL_SIZE);
        ctx.lineTo((COLS - PADDING) * CELL_SIZE, y * CELL_SIZE);
    }

    // vertical lines
    for(let x = PADDING; x < COLS - PADDING; x++){
        ctx.moveTo(x * CELL_SIZE, PADDING * CELL_SIZE);
        ctx.lineTo(x * CELL_SIZE, (ROWS - PADDING) * CELL_SIZE);
    }

    ctx.stroke();



}

// Move game to next generation based on game of life rules. Store current generation in array before updating
function nextGeneration(){
    history.push(structuredClone(grid));
    const next = createGrid()

    for(let y = 0; y < ROWS; y++){
        for(let x = 0; x < COLS; x++){
            const isAlive = grid[y][x] !== 0;
            const neighbours = countCells(x, y);

            if (isAlive && (neighbours === 2 || neighbours === 3)){
                next[y][x] = grid[y][x];
            } else if (!isAlive && neighbours === 3){
                next[y][x] = hue;
            }
        }
    }

    grid = next;
    hue += 10;
    generations += 1;
    numGenerations.innerText = `Number of Generations: ${generations}`;
    draw();
}

// Move back a generation
function prevGeneration(){
    if (generations > 0){
        generations -= 1;
        grid = history[generations];
        numGenerations.innerText = `Number of Generations: ${generations}`;
        draw();
    }
}

// Start button event
function start(){
    if(!playGen){
        playGen = setInterval(nextGeneration, DELAY);
        playButton.classList.toggle("hidden");
        stopButton.classList.toggle("hidden");
    }
}

// Stop button event
function stop(){
    clearInterval(playGen);
    playGen = null;
    playButton.classList.toggle("hidden");
    stopButton.classList.toggle("hidden");
}

// Click to add cell on canvas element
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();

    const mousePosition = {
        x : e.clientX - rect.left,
        y : e.clientY - rect.top,
    }

    let x = Math.floor(mousePosition.x / CELL_SIZE);
    let y = Math.floor(mousePosition.y / CELL_SIZE);

    if(x >= PADDING && y >= PADDING && y < ROWS - PADDING && x < COLS - PADDING){
        if(grid[y][x] === 0){
            grid[y][x] = hue;
        } else {
            grid[y][x] = 0;
        }
        
    }
    draw();
});


// Show cell mouse is currently in when moving
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();

    const mousePosition = {
        x : e.clientX - rect.left,
        y : e.clientY - rect.top,
    }

    let x = Math.floor(mousePosition.x / CELL_SIZE);
    let y = Math.floor(mousePosition.y / CELL_SIZE);
   
    draw();

    if(x >= PADDING && y >= PADDING && y < ROWS - PADDING && x < COLS - PADDING){
        ctx.beginPath();
        ctx.fillStyle = "grey";
        ctx.rect(x * CELL_SIZE,y * CELL_SIZE,CELL_SIZE,CELL_SIZE);
        ctx.fill();
        ctx.closePath();
    }

})

resetButton.addEventListener("click", resetGrid);
nextButton.addEventListener("click" , nextGeneration)
prevButton.addEventListener("click" , prevGeneration)
playButton.addEventListener("click", start);
stopButton.addEventListener("click", stop);
resetGrid();
