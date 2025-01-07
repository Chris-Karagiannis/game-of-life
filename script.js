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

const padding = 5;

let generations = 0;
let genGrid = [];
let grid = [];
let hue = 150;
let colour = `hsl(${hue} 100% 50%)`;
let playGen;

// Cell class
class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.hue = hue;
    }

    neighbourCount(){
        const count = countCells(this.x, this.y);
        
        if (count <= 1){
            return 0
        }

        if (count >= 4){
            return 0
        }

        if (count === 2 || count === 3){
            return this
        }
        
    }
}

// Count neighbouring cells and return count for game of life rules
function countCells(xPos, yPos){
    let count = 0;

    for(let y = -1; y <= 1; y++){
        for(let x = -1; x <= 1; x++){
            if(x !== 0 || y !== 0){
                if(xPos + x >= 0 && yPos + y >= 0 && xPos + x < canvas.width / 10 && yPos + y < canvas.height / 10){
                    if(grid[xPos + x][yPos + y] !== 0){
                        count += 1;
                    }
                }
            }
        }
    }

    return count;
}

// Clear cells
function resetGrid(){
    for(let i = 0; i < canvas.height / 10; i++){
        grid[i] = new Array(canvas.height / 10);
        grid[i].fill(0);
    }
    updateGrid();
    generations = 0;
    numGenerations.innerText = `Number of Generations: ${generations}`;
}

// Update grid to draw cells to canvas
function updateGrid(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(padding * 10,padding * 10,canvas.width - (padding * 2 * 10),canvas.height - (padding * 2 * 10));
    ctx.fill()

    for(let y = padding; y < (canvas.height / 10) - padding; y++){
        for(let x = padding; x < (canvas.width / 10) - padding; x++){
            if(grid[x][y] !== 0){
                ctx.beginPath();
                ctx.fillStyle = `hsl(${grid[x][y].hue} 100% 50%)`;
                ctx.rect(x * 10,y * 10,10,10);
                ctx.fill();
    
            }
        }
    }

    drawGridLines();
    
}

// Draw the grid lines on the canvas
function drawGridLines(){
    for(let y = padding; y < (canvas.height / 10) - padding; y++){
        ctx.beginPath();
        ctx.strokeStyle = `hsl(0 0% 20%)`;
        ctx.moveTo(padding * 10, y * 10);
        ctx.lineTo(((canvas.width / 10) - padding) * 10, y * 10);
        ctx.stroke();
    }

    for(let x = padding; x < (canvas.width / 10) - padding; x++){
        ctx.beginPath();
        ctx.strokeStyle = `hsl(0 0% 20%)`;
        ctx.moveTo(x * 10, padding * 10);
        ctx.lineTo(x * 10, ((canvas.height / 10) - padding) * 10);
        ctx.stroke();
    }

}

// Move game to next generation based on game of life rules. Store current generation in array before updating
function nextGeneration(){
    genGrid[generations] = grid;
    let checkGrid = [];

    for(let i = 0; i < canvas.height / 10; i++){
        checkGrid[i] = new Array(canvas.height / 10);
        checkGrid[i].fill(0);
    }

    for(let y = 0; y < canvas.height / 10; y++){
        for(let x = 0; x < canvas.width / 10; x++){
            if(grid[x][y] !== 0){
                checkGrid[x][y] = grid[x][y].neighbourCount();
            }else{
                const count = countCells(x, y);
                if(count === 3){
                    checkGrid[x][y] = new Cell(x,y);
                }else{
                    checkGrid[x][y] = 0;
                }
            }
        }
    }

    grid = checkGrid;
    hue += 10;
    generations += 1;
    numGenerations.innerText = `Number of Generations: ${generations}`;
    updateGrid();
}

// Move back a generation
function prevGeneration(){
    if (generations > 0){
        generations -= 1;
        grid = genGrid[generations];
        numGenerations.innerText = `Number of Generations: ${generations}`;
        updateGrid();
    }
}

// Add glider gun for testing
function gosperGliderGun(){
    grid[11][15] = new Cell(11,15);
    grid[12][15] = new Cell(12,15);
    grid[11][16] = new Cell(11,16);
    grid[12][16] = new Cell(12,16);

    grid[24][13] = new Cell(24,13);
    grid[23][13] = new Cell(23,13);
    grid[22][14] = new Cell(22,14);
    grid[21][15] = new Cell(21,15);
    grid[21][16] = new Cell(21,16);
    grid[21][17] = new Cell(21,17);
    grid[22][18] = new Cell(22,18);
    grid[23][19] = new Cell(23,19);
    grid[24][19] = new Cell(24,19);

    grid[25][16] = new Cell(25,16);

    grid[26][14] = new Cell(26,14);

    grid[27][15] = new Cell(27,15);
    grid[27][16] = new Cell(27,16);
    grid[27][17] = new Cell(27,17);  

    grid[28][16] = new Cell(28,16);

    grid[26][18] = new Cell(26,18);
    
    grid[31][15] = new Cell(31,15);
    grid[31][14] = new Cell(31,14);
    grid[31][13] = new Cell(31,13);

    grid[32][15] = new Cell(32,15);
    grid[32][14] = new Cell(32,14);
    grid[32][13] = new Cell(32,13);

    grid[33][12] = new Cell(33,12);
    grid[33][16] = new Cell(33,16);

    grid[35][11] = new Cell(35,11);
    grid[35][12] = new Cell(35,12);

    grid[35][16] = new Cell(35,16);
    grid[35][17] = new Cell(35,17);

    grid[45][13] = new Cell(45,13);
    grid[45][14] = new Cell(45,14);
    grid[46][13] = new Cell(46,13);
    grid[46][14] = new Cell(46,14);

    updateGrid();
}

// Start button event
function start(){
    if(!playGen){
        playGen = setInterval(nextGeneration, 100);
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

    let x = Math.floor(mousePosition.x / 10);
    let y = Math.floor(mousePosition.y / 10);

    if(x >= padding && y >= padding && y < (canvas.height / 10) - padding && x < (canvas.height / 10) - padding){
        if(grid[x][y] === 0){
            grid[x][y] = new Cell(x,y);
        }else{
            grid[x][y] = 0;
        }
        console.log(x, y);
    }
    updateGrid();
});


// Show cell mouse is currently in when moving
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();

    const mousePosition = {
        x : e.clientX - rect.left,
        y : e.clientY - rect.top,
    }

    let x = Math.floor(mousePosition.x / 10);
    let y = Math.floor(mousePosition.y / 10);
   
    updateGrid();

    if(x >= padding && y >= padding && y < (canvas.height / 10) - padding && x < (canvas.height / 10) - padding){
        ctx.beginPath();
        ctx.fillStyle = "grey";
        ctx.rect(x * 10,y * 10,10,10);
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
