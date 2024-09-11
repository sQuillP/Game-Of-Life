
const shiftCells = (cells,xoffset, yoffset)=> {
    return cells.map(x=> {
        const [x1,y1] = x.split(",").map(v => parseInt(v,10));//Help scale the points without modifying things.
        return `${x1+xoffset},${y1 + yoffset}`
    })
}


export const MAIN_PLAY_CONFIG = Object.freeze({
    height: 600,
    width: 600,
    magnification: 10,
    TICK_SPEED: 100,
    enableZoom: true,
    editable: true,
    grid: true,
    enableDeadCells: false,
    data:[]
});