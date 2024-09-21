import { shiftCells } from "../../util/dataTransform";



const GLIDER = {
    title:'Glider',
    data: new Set(["1,3", "2,1", "2,3", "3,2", "3,3"])
};

const GOSPER_GLIDER_GUN = {
    title:"Gosper Glider Gun",
    data: new Set(shiftCells([
        "1,5", "1,6", "2,5", "2,6", "11,5", "11,6", "11,7", "12,4", "12,8", "13,3", "13,9", 
        "14,3", "14,9", "15,6", "16,4", "16,8", "17,5", "17,6", "17,7", "18,6", "21,3", 
        "21,4", "21,5", "22,3", "22,4", "22,5", "23,2", "23,6", "25,1", "25,2", "25,6", 
        "25,7", "35,3", "35,4", "36,3", "36,4"
    ], 40,40))
};

const COPPERHEAD = {
    title:"Copper Head",
    data: new Set(["37,22","37,23","38,23","38,22","40,21","40,22","40,23","40,24","41,20","41,21","42,19","44,19","45,19","41,24","41,25","42,26","44,26","45,26","45,24","45,21","46,22","46,23","47,23","47,22","48,21","48,20","48,24","48,25"])
};

const R_PENTOMINO = {
    title:"R-Pentomino",
    data: new Set(["62,35","62,34","61,34","62,33","63,33"])
};

const BLOCK = {
    title:"Block",
    data: new Set(["50,50","50,51","49,50","49,51"])
};

// const 

export default Object.freeze({
    GLIDER,
    COPPERHEAD,
    GOSPER_GLIDER_GUN,
    R_PENTOMINO,
    BLOCK
});