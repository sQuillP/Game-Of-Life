/**
 * @description Logic controller for handling Game oF Life simulation.
 * For UI purposes, you can customize the output of the engine. This must get plugged
 * into a canvas HTML Element.
 */



export default class GOLEngine {
    constructor(canvas,{height, TICK_SPEED, editable, width, magnification, data, grid, enableZoom}) {
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

        this.clicked = false;

        
        this.initializeCells();
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
        if (this.liveCells.has(liveCellPoint)) {
            this.deleteLiveCell(liveCellPoint);
        } else {
            this.insertLiveCell(liveCellPoint);
        }
        this.drawGrid(this.magnification);
    }

    handleScroll(e) {
        if(this.enableZoom === false) return;
        console.log('listening to scroll');
        const delta = Math.sign(e.deltaY);
        this.magnification += delta * 0.1;
        this.drawGrid(this.magnification);
    }


    setClick(clicked) {
        this.clicked = clicked;
    }


    setDimensions(height = -1, width = -1) {
        if(height != -1) {
            this.canvas.height = height;
        }
        if(width != -1) {
            this.canvas.width = width;
        }
    }

    run() {
        this.drawGrid();
    }

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

    pointToInt(pointString) {
        return pointString.split(',').map(x => parseInt(x, 10));
    }


    //This comes at a large performance cost. Don't use this lol.
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

    insertLiveCell(liveCellPoint) {
        this.liveCells.add(liveCellPoint);
        this.deadCells.delete(liveCellPoint);
        const [x, y] = this.pointToInt(liveCellPoint);
        const adjacentPoints = this.getAdjacentPoints(x, y);
        for (let i = 0; i < adjacentPoints.length; i++) {
            if (!this.liveCells.has(adjacentPoints[i])) {
                this.deadCells.add(adjacentPoints[i]);
            }
        }
    }

    deleteLiveCell(liveCellPoint) {
        let newDeadCells = new Set();
        this.liveCells.delete(liveCellPoint);
        for (const liveCell of this.liveCells) {
            const [x, y] = this.pointToInt(liveCell);
            const adjacentPoints = this.getAdjacentPoints(x, y);
            for (let i = 0; i < adjacentPoints.length; i++) {
                if (!this.liveCells.has(adjacentPoints[i])) {
                    newDeadCells.add(adjacentPoints[i]);
                }
            }
        }
        this.deadCells = newDeadCells;
    }

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

