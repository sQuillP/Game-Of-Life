

// Prefixed storage key to separate anything else that would be saved to localstorage.
export const STORAGE_PREFIX_KEY="GOLSAVED-"

/**
 * @description Extract the live and dead cells from a GOL game.
 * The data will be saved to local storage. It will eventually reach a 
 * unique name if overwrite is set to false.
 * @param {{liveCells: Set<string> , deadCells: Set<string> }}
 */
export function saveLayout(name, {liveCells, deadCells}, overwrite=false) {
    const liveCellsList = [];
    const deadCellsList = [];


    for(const liveCell of liveCells) {
        liveCellsList.push(liveCell);
    }
    for(const deadCell of deadCells) {
        deadCellsList.push(deadCell);
    }

    //append storage prefix key with the name.
    name = STORAGE_PREFIX_KEY + name;
    let t_name = name;
    let counter = 0;
    if(overwrite === false) {
        while(localStorage.getItem(t_name) != null) {
            ++counter;
            t_name = `${name}-${counter}`;
        }
    }


    const savedPayload =  {
        liveCells:liveCellsList,
        deadCells:deadCellsList
    };

    localStorage.setItem(t_name, JSON.stringify(savedPayload));
}

/**
 * @description Read from localStorage and retrieve the saved game. 
 * Transform the data that is readable to the GOL Engine
 * @param {*} name 
 */
export function loadSavedGame(name) {
    const gameString = localStorage.getItem(name)
    const savedGame = {liveCells: new Set(), deadCells: new Set()};

    if (gameString === null) {
        return savedGame;
    }

    const parsedGameString = JSON.parse(gameString);

    savedGame.liveCells = new Set(parsedGameString.liveCells);
    savedGame.deadCells = new Set(parsedGameString.deadCells);

    return savedGame;
}


/**
 * @description Take a generic coordinate grouping of cells and shift them
 * xoffset and yoffset
 * @param {*} cells 
 * @param {*} xoffset 
 * @param {*} yoffset 
 * @returns 
 */
export const shiftCells = (cells,xoffset, yoffset)=> {
    return cells.map(x=> {
        const [x1,y1] = x.split(",").map(v => parseInt(v,10));//Help scale the points without modifying things.
        return `${x1+xoffset},${y1 + yoffset}`
    })
}



export function processCustomText(text) {
    //Match expression for (x,y) format
    const matchExpression = /\(\d+,\d+\)/gi;

    //parsed expression, strip the opening
    const parsedText = text.match(matchExpression)?.map(point => point.substring(1,point.length-1))
    console.log(parsedText);
    const liveCells = new Set();

    //add points to a set
    for(let i = 0; i< parsedText?.length; i++) {
        liveCells.add(parsedText[i]);
    }

    return liveCells
}