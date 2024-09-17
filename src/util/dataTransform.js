

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

    console.log(liveCellsList);
    console.log(liveCells);

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