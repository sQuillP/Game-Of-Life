import "./css/GOLPlayer.css";
import { useCallback, useRef, useEffect, useState } from "react";
import GOLEngine from "../../scripts/GOLEngine";
import { MAIN_PLAY_CONFIG } from "../configs/Play.config";


const RIGHT_CLICK = 3;
const LEFT_CLICK = 1;

export default function GOLPlayer({playState=false, tickSpeed=100, updateGeneration}) {

    const canvas = useRef(null);
    const GOLRef = useRef(null);
    const playInterval = useRef(null);
    const canvasContainer = useRef(null);
    

    //Make sure that we are makeing
    const mousedownHandler = useCallback( (event) => {
        GOLRef.current.setClick(true, event.which);
        GOLRef.current.placePoint(event);
    },[]);


    //set the clicked flag to false and the mousebutton
    //This will disable drawing mode
    const mouseupHandler = useCallback((event)=> {
        GOLRef.current.setClick(false, event.which);
    },[]);

    const mousemoveHandler = useCallback((event)=> {
        GOLRef.current.placePoint(event);
    },[]);

    const wheelListener = useCallback((event)=> {
        GOLRef.current.drawGrid(GOLRef.current.handleScroll(event));
    },[]);


    //Auto-adjust the screen so that grid takes up the desired space.
    const resizeListener = useCallback(resizeScreen,[]);


    //Get the dimensions of the parent element, set the new dimensions in grid
    //Repaint the canvas right afterwards.
    function resizeScreen() {
        const height = Math.round(canvasContainer.current.getBoundingClientRect().height)
        const width = Math.round(canvasContainer.current.getBoundingClientRect().width);
        GOLRef.current.setDimensions(height, width);
        GOLRef.current.drawGrid();
    }


    /* Listen for changes in the parent with configuration options. */
    // useEffect(()=> {
    //     if(playState === false) {
    //         clearInterval(playInterval.current);
    //     } else {
    //         clearInterval(playInterval.current);
    //         playInterval.current = setInterval(()=>{
    //             GOLRef.current.tick();
    //             updateGeneration();
    //         }, tickSpeed);
    //     }
    // },[playState,tickSpeed, updateGeneration]);


    useEffect(()=> {

        // Initialize the game engine instance.
        GOLRef.current = new GOLEngine(canvas.current, MAIN_PLAY_CONFIG);


        //Mount listeners for grid events

        canvas.current.addEventListener('wheel',wheelListener);
        window.addEventListener('resize', resizeListener);
        canvas.current.addEventListener('mousedown', mousedownHandler);
        canvas.current.addEventListener('mouseup', mouseupHandler);
        canvas.current.addEventListener('mousemove', mousemoveHandler);

        //Create the cells and amke sure tha tthe screen is resized appropriately.
        GOLRef.current.initializeCells();
        resizeScreen();

        //Cleanup event listeners for grid events.
        return ()=> {

            window.removeEventListener('resize', resizeListener);
            if(canvas.current) {
                canvas.current.removeEventListener('wheel',wheelListener);
                canvas.current.removeEventListener('mousedown', mousedownHandler);
                canvas.current.removeEventListener('mouseup', mouseupHandler);
                canvas.current.removeEventListener('mousemove', mousemoveHandler);
            }
        }

    },[
        resizeListener, 
        mousedownHandler, 
        mouseupHandler, 
        mousemoveHandler, 
        wheelListener
    ]);


    /* Any more useEffects for reacting to data changes from the parent. */


    return (
        <div  ref={canvasContainer} className="canvas-container">
            <canvas
                onContextMenu={e=> e.preventDefault()}
                ref={canvas}
                style={{cursor:'pointer',}}
            >
            </canvas>
        </div>
    )
}