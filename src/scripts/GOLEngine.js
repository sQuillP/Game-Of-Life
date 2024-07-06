

/**
 * @description Attach instance to a canvas object and plug in config
 * to render a specific type of Game of Life playthrough.
 */
export default class GOLEngine {


    constructor(canvas, height=100, width=100, magnification=10) {
        this.liveCells = new Set(['1,1']);
        this.deadCells = new Set();
        this.canvas = canvas;
        this.pen = canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
        this.magnification = magnification;
        this.TICK_SPEED = 1000;
        console.log("CANVAS FROM ENGINE", canvas)


        this.canvas.onwheel = e => {
            const delta = Math.sign(e.deltaY);
            this.magnification += delta * 0.1;
            this.drawGrid(this.magnification);
        }
    
    
        //Add live cell to coordinate map and all adjacent dead cells.
        this.canvas.addEventListener('click',(e)=> {
            console.log('clicked');
            //Generally the grid does not start at 0,0 in the view window.
            const scale = e.target.getBoundingClientRect();
            console.log("SCALE", scale)
            const [x,y] =[ this.mapCoordinate(e.clientX-scale.x), this.mapCoordinate(e.clientY - scale.y)]
            const liveCellPoint = `${x},${y}`;
            if(this.liveCells.has(liveCellPoint) === true) {
                this.deleteLiveCell(liveCellPoint);
            } else {
                this.insertLiveCell(liveCellPoint);
            }
            console.log(x,y);
            this.drawGrid(this.magnification);
        });

    }
    

    run() {
        console.log('running');
        this.drawGrid(10)
    }


    drawGrid(magnification){
        this.pen.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const cellSize = 100 / magnification;
        this.pen.beginPath();
        for(let x = 0; x < this.canvas.width; x += cellSize){
            this.pen.moveTo(x, 0);
            this.pen.lineTo(x, this.canvas.height);
        }
        for(let y = 0; y < this.canvas.height; y += cellSize){
            this.pen.moveTo(0, y);
            this.pen.lineTo(this.canvas.width, y);
        }
        this.pen.stroke();
        for(const pointString of this.liveCells) {
            let [x,y] = this.pointToInt(pointString);
            this.pen.beginPath();
            this.pen.fillStyle = 'black';
            this.pen.rect(
                x*cellSize,
                y*cellSize, 
                cellSize,
                cellSize
            )
            this.pen.fill();
            this.pen.stroke();
        }
        console.log(this.liveCells);
        //for debugging. These are the dead cells.
    }

    
    //Cast a point string<"x,y"> to an array([x,y]) 
    pointToInt = (pointString)=> pointString.split(',').map(x=> parseInt(x,10));

    //pass in x or y coordinate
    mapCoordinate(n) {
        const cellSize = 100/this.magnification;
        const location = Math.floor((n/cellSize));
        return location
    }


    //This will take a performance hit if used.
    //For every live cell, there is at least 8 neighboring cells
    //residing in memory. Essentially, this slows everything down by
    // 8x
    showDeadCells(cellSize) {
        for(const pointString of this.deadCells) {
            let [x,y] = this.pointToInt(pointString);
            this.pen.beginPath();
            this.pen.fillStyle = 'red';
            this.pen.rect(
                x*cellSize,
                y*cellSize,
                cellSize,
                cellSize
            );
            this.pen.fill();
            this.pen.stroke();
        }
    }

    /*Return all adjacent points for a specific coordinate*/
    getAdjacentPoints(x,y) {
        return [
            `${x+1},${y+1}`,
            `${x+1},${y}`,
            `${x+1},${y-1}`,
            `${x},${y+1}`,
            `${x},${y-1}`,
            `${x-1},${y}`,
            `${x-1},${y+1}`,
            `${x-1},${y-1}`
        ];
    }


    //Use this function to add a new cell to the grid.
    insertLiveCell(liveCellPoint) {
        this.liveCells.add(liveCellPoint);
        this.deadCells.delete(liveCellPoint);
        const [x,y] = this.pointToInt(liveCellPoint);
        const adjacentPoints = this.getAdjacentPoints(x,y);
        for(let i = 0; i<adjacentPoints.length; i++) {
            if(this.liveCells.has(adjacentPoints[i]) === false) {
                this.deadCells.add(adjacentPoints[i]);
            }
        }
    }

    //use this function to delete a currently alive cell.
    deleteLiveCell(liveCellPoint) {
        let newDeadCells = new Set();
        this.liveCells.delete(liveCellPoint)
        for(const liveCell of this.liveCells) {
            const [x,y] = this.pointToInt(liveCell);
            const adjacentPoints = this.getAdjacentPoints(x,y);
            for(let i = 0; i<adjacentPoints.length; i++) {
                if(this.liveCells.has(adjacentPoints[i]) === false) {
                    newDeadCells.add(adjacentPoints[i]);
                }
            }
        }
        this.deadCells = newDeadCells;
    }


    tick() {
        const newlyLiveCells = new Set();
        const newlyDeadCells = new Set();
        for(const deadCellString of this.deadCells) {
            const [x,y] = this.pointToInt(this.deadCellString);
            const neighbors = this.getAdjacentPoints(x,y);
            let liveNeighborCount = 0
            for(let i = 0; i< neighbors.length; i++) {
                if(this.liveCells.has(neighbors[i])) {
                    liveNeighborCount += 1
                }
            }
            if(liveNeighborCount === 3) {
                newlyLiveCells.add(this.deadCellString);
            }
        }
        for(const liveCellString of this.liveCells) {
            const [x,y] = this.pointToInt(liveCellString);
            const adjacentPoints = this.getAdjacentPoints(x,y);
            let adjacentCounter = 0;
            for(let i = 0; i<adjacentPoints.length; i++) {
                if(this.liveCells.has(adjacentPoints[i])) {
                    adjacentCounter += 1;
                }
            }
            if(adjacentCounter !== 2 && adjacentCounter !== 3) {
                newlyDeadCells.add(liveCellString);
            }
        }
        for(const discardedCell of newlyDeadCells) {
            this.deleteLiveCell(discardedCell);
        }
        for(const newCell of newlyLiveCells) {
            this.insertLiveCell(newCell);
        }
        this.drawGrid(this.magnification);
    }
}