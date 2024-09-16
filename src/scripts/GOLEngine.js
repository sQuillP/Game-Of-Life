const RIGHT_CLICK = 3;
const LEFT_CLICK = 1;


/**
 * @description Logic controller for handling Game oF Life simulation.
 * For UI purposes, you can customize the output of the engine. Attach the engine instance
 * to a canvas and you're all set.
 */
export default class GOLEngine {
    constructor(canvas,{height, TICK_SPEED, editable, width, magnification, data, grid, enableZoom, enableDeadCells=false}) {
        // Instance variables.
        this.liveCells = new Set();
        this.deadCells = new Set();
        this.canvas = canvas;
        this.pen = canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
        this.magnification = magnification;
        this.TICK_SPEED = TICK_SPEED;
        this.showGrid = grid;
        this.enableZoom = enableZoom;
        this.initialCells = data;
        this.editable = editable;
        this.enableDeadCells = enableDeadCells
        this.clicked = false;
        this.mouseButton = LEFT_CLICK;

        //Declare constants
        this.MAX_ZOOM = 15.0;
        this.MIN_ZOOM = 1.0;

        this.initializeCells();
    }


    updateConfiguration(configuration) {
        
    }


    mapCoordinate(n) {
        const cellSize = 100 / this.magnification;
        const location = Math.floor(n / cellSize);
        return location;
    }


    initializeCells() {
        //clear all live cells
        this.liveCells = new Set();
        this.deadCells = new Set();

        for(const liveCell of this.initialCells) {
            this.insertLiveCell(liveCell);
        }
        this.drawGrid();
    }

    placePoint(e) {
        if(this.editable === false || this.clicked === false) return;
        const scale = this.canvas.getBoundingClientRect();
        const [x, y] = [this.mapCoordinate(e.clientX - scale.x), this.mapCoordinate(e.clientY - scale.y)];
        const liveCellPoint = `${x},${y}`;
        if(this.mouseButton === RIGHT_CLICK && this.liveCells.has(liveCellPoint) === true) {
            console.log('should delete live cell')
            this.deleteLiveCell(liveCellPoint)
        }
        else if(this.liveCells.has(liveCellPoint) === false && this.mouseButton === LEFT_CLICK){
            this.insertLiveCell(liveCellPoint);
        }
        this.drawGrid(this.magnification);
    }

    handleScroll(e) {
        if(this.enableZoom === false) return;

        const delta = Math.sign(e.deltaY);

        //updated magnification.
        const newMagnification = (delta*0.1)+this.magnification;

        //Disable scrolling when user reaches their maximum or minimum zoom level.
        if(newMagnification > this.MAX_ZOOM || newMagnification < this.MIN_ZOOM) {
            return;
        }

        //Otherwise set the scroll magnification to the newly adjusted value.
        this.magnification = newMagnification

        //re-render the grid.
        this.drawGrid(this.magnification);
    }


    // Sets the edit mode to true and the mouse button to eitehr
    setClick(clicked, mouseButton) {
        this.clicked = clicked;
        this.mouseButton = mouseButton;
    }


    // Removes all live and dead cells in the object.
    clearCells() {
        this.liveCells = new Set();
        this.deadCells = new Set();
    }


    //Set a new height and width of the canvas.
    // use -1 to keep current dimension.
    setDimensions(height = -1, width = -1) {
        if(height != -1) {
            this.canvas.height = height;
        }
        if(width != -1) {
            this.canvas.width = width;
        }
    }



    /**
     * @description iterate over each point and draw it to the grid.
     * These points are stored in the liveCells set data structure.
     */
    drawGrid() {
        this.pen.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const cellSize = 100 / this.magnification;
        this.pen.beginPath();
        if(this.showGrid === true) {
            for (let x = 0; x < this.canvas.width; x += cellSize) {
                this.pen.moveTo(x, 0);
                this.pen.lineTo(x, this.canvas.height);
            }
            for (let y = 0; y < this.canvas.height; y += cellSize) {
                this.pen.moveTo(0, y);
                this.pen.lineTo(this.canvas.width, y);
            }
            this.pen.stroke();
        }

        // Render each live cell to the screen
        for (const pointString of this.liveCells) {
            let [x, y] = this.pointToInt(pointString);
            this.pen.beginPath();
            this.pen.fillStyle = 'black';
            this.pen.rect(
                x * cellSize,
                y * cellSize,
                cellSize,
                cellSize
            );
            this.pen.fill();
            this.pen.stroke();
        }
    }

    // Return a pont string "x,y" into an int[] = [x,y]
    pointToInt(pointString) {
        return pointString.split(',').map(x => parseInt(x, 10));
    }


    //This comes at a large performance cost. Don't use this lol.
    //Draw all the dead cells (the frontier) that surrounds each live cell.
    showDeadCells(cellSize) {
        for (const pointString of this.deadCells) {
            let [x, y] = this.pointToInt(pointString);
            this.pen.beginPath();
            this.pen.fillStyle = 'red';
            this.pen.rect(
                x * cellSize,
                y * cellSize,
                cellSize,
                cellSize
            );
            this.pen.fill();
            this.pen.stroke();
        }
    }


    // Return a list of points that are adjacent by exactly
    // 1 unit in all 8 directions
    getAdjacentPoints(x, y) {
        return [
            `${x + 1},${y + 1}`,
            `${x + 1},${y}`,
            `${x + 1},${y - 1}`,
            `${x},${y + 1}`,
            `${x},${y - 1}`,
            `${x - 1},${y}`,
            `${x - 1},${y + 1}`,
            `${x - 1},${y - 1}`
        ];
    }

    // Adds a new live cell to the game. adds the respective
    //neighboring "dead" cells.
    insertLiveCell(liveCellPoint) {
        this.liveCells.add(liveCellPoint);
        this.deadCells.delete(liveCellPoint);
        const [x, y] = this.pointToInt(liveCellPoint);
        const adjacentPoints = this.getAdjacentPoints(x, y);
        for (let i = 0; i < adjacentPoints.length; i++) {
            // If neighboring cell is not alive, add it to the dead frontier.
            if (!this.liveCells.has(adjacentPoints[i])) {
                this.deadCells.add(adjacentPoints[i]);
            }
        }
    }


    //NOTE: This method should definitely be optimized. Redrawing the dead cell frontier is a costly 
    //way to manage dead cells. O(C+N)*O(set operation)
    // I tried already and wasted too much time.
    deleteLiveCell(liveCellPoint) {
        let newDeadCells = new Set();
        this.liveCells.delete(liveCellPoint);

        for (const liveCell of this.liveCells) {
            const [x, y] = this.pointToInt(liveCell);
            const adjacentPoints = this.getAdjacentPoints(x, y);

            // after getting adjacent points, we check if any adjacent point is a live cell
            for (let i = 0; i < adjacentPoints.length; i++) {
                if (!this.liveCells.has(adjacentPoints[i])) {
                    newDeadCells.add(adjacentPoints[i]);
                }
            }
        }
        this.deadCells = newDeadCells;
    }


    // Upon calling, run a single frame of simulation for the
    // Game of life
    tick() {
        const newlyLiveCells = new Set();
        const newlyDeadCells = new Set();

        for (const deadCellString of this.deadCells) {
            const [x, y] = this.pointToInt(deadCellString);
            const neighbors = this.getAdjacentPoints(x, y);
            let liveNeighborCount = 0;
            for (let i = 0; i < neighbors.length; i++) {
                if (this.liveCells.has(neighbors[i])) {
                    liveNeighborCount += 1;
                }
            }
            if (liveNeighborCount === 3) {
                newlyLiveCells.add(deadCellString);
            }
        }
        for (const liveCellString of this.liveCells) {
            const [x, y] = this.pointToInt(liveCellString);
            const adjacentPoints = this.getAdjacentPoints(x, y);
            let adjacentCounter = 0;
            for (let i = 0; i < adjacentPoints.length; i++) {
                if (this.liveCells.has(adjacentPoints[i])) {
                    adjacentCounter += 1;
                }
            }
            if (adjacentCounter !== 2 && adjacentCounter !== 3) {
                newlyDeadCells.add(liveCellString);
            }
        }
        for (const discardedCell of newlyDeadCells) {
            this.deleteLiveCell(discardedCell);
        }
        for (const newCell of newlyLiveCells) {
            this.insertLiveCell(newCell);
        }
        this.drawGrid();
    }
}

