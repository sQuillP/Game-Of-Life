const shiftCells = (cells,xoffset, yoffset)=> {
    return cells.map(x=> {
        const [x1,y1] = x.split(",").map(v => parseInt(v,10));//Help scale the points without modifying things.
        return `${x1+xoffset},${y1 + yoffset}`
    })
}


export const PLAY = Object.freeze({
    height: 55,
    width: 200,
    magnification: 30,
    TICK_SPEED: 100,
    enableZoom: false,
    editable: false,
    grid: false,
    data:shiftCells([
        "0,0",
        "0,1",
        "0,2",
        "0,3",
        "0,4",
        "1,0",
        "2,0",
        "3,1",
        "2,2",
        "1,2",
        "6,0",
        "6,1",
        "6,2",
        "6,3",
        "6,4",
        "7,4",
        "8,4",
        "11,4",
        "11,3",
        "11,2",
        "11,1",
        "12,0",
        "13,0",
        "14,1",
        "14,2",
        "14,3",
        "14,4",
        "12,2",
        "13,2",
        "17,0",
        "18,1",
        "19,2",
        "19,3",
        "19,4",
        "20,1",
        "21,0"
    ],20,6)
});




export const WIKI = Object.freeze({
    height: 55,
    width: 200,
    magnification: 30,
    TICK_SPEED: 100,
    editable: false,
    grid: false,
    enableZoom: false,
    data:shiftCells([
        "0,0",
        "0,1",
        "0,2",
        "0,3",
        "1,4",
        "2,3",
        "2,2",
        "2,1",
        "3,4",
        "4,3",
        "4,2",
        "4,1",
        "4,0",
        "7,4",
        "7,3",
        "7,2",
        "7,1",
        "7,0",
        "10,4",
        "10,3",
        "10,2",
        "10,1",
        "10,0",
        "13,4",
        "12,3",
        "11,2",
        "12,1",
        "13,0",
        "16,4",
        "16,3",
        "16,2",
        "16,1",
        "16,0"
    ],22,6)
});