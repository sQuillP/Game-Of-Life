import "./css/GOLPlayer.css";
import { useCallback, useRef, useEffect, useState } from "react";
import GOLEngine from "../../scripts/GOLEngine";
import { MAIN_PLAY_CONFIG } from "../configs/Play.config";




export default function GOLPlayer({playState=false, tickSpeed=100, updateGeneration}) {

    const canvas = useRef(null);
    const GOLRef = useRef(null);
    const playInterval = useRef(null);
    const canvasContainer = useRef(null);
    
  

    const mousedownHandler = useCallback( (event) => {
        GOLRef.current.setClick(true);
        GOLRef.current.placePoint(event);
    },[]);

    const mouseupHandler = useCallback((_)=> {
        GOLRef.current.setClick(false);
    },[]);

    const mousemoveHandler = useCallback((event)=> {
        GOLRef.current.placePoint(event);
    },[]);

    const wheelListener = useCallback((event)=> {
        GOLRef.current.drawGrid(GOLRef.current.handleScroll(event));
    },[]);


    //Auto-adjust the screen so that grid takes up the desired space.
    const resizeListener = useCallback(resizeScreen,[]);


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
        GOLRef.current = new GOLEngine(canvas.current, MAIN_PLAY_CONFIG);
        // canvas.current.style.backgroundColor='green';
        //Mount listeners for grid events

        canvas.current.addEventListener('wheel',wheelListener);
        window.addEventListener('resize', resizeListener);
        canvas.current.addEventListener('mousedown', mousedownHandler);
        canvas.current.addEventListener('mouseup', mouseupHandler);
        canvas.current.addEventListener('mousemove', mousemoveHandler);


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
        <div ref={canvasContainer} className="canvas-container">
            <canvas
                ref={canvas}
                style={{cursor:'pointer',}}
            >
            </canvas>
        </div>
    )
}