import "./css/GOLPlayer.css";
import { useCallback, useRef, useEffect, useState } from "react";
import GOLEngine from "../../scripts/GOLEngine";
import { MAIN_PLAY_CONFIG } from "../configs/Play.config";




export default function GOLPlayer({playState=false, tickSpeed=100, updateGeneration}) {

    const canvas = useRef(null);
    const GOLRef = useRef(null);
    const playInterval = useRef(null);
    const canvasContainer = useRef(null);
    


    const clickHandler = useCallback((event)=> {
        GOLRef.current.handleClick(event);
    },[]);

    const wheelListener = useCallback((event)=> {
        GOLRef.current.drawGrid(GOLRef.current.handleScroll(event));
    },[]);


    const resizeListener = useCallback(resizeScreen,[]);

    function cleanup() {
        canvas.current.removeEventListener('click',clickHandler);
        canvas.current.removeEventListener('wheel',wheelListener);
        canvas.current.removeEventListener('click', clickHandler);
        window.removeEventListener('resize', resizeListener);
    }


    function resizeScreen() {
        const height = Math.round(canvasContainer.current.getBoundingClientRect().height)
        const width = Math.round(canvasContainer.current.getBoundingClientRect().width);
        GOLRef.current.setDimensions(height, width);
        GOLRef.current.drawGrid();
    }


    /* Listen for changes in the parent with configuration options. */
    useEffect(()=> {
        if(playState === false) {
            clearInterval(playInterval.current);
        } else {
            clearInterval(playInterval.current);
            playInterval.current = setInterval(()=>{
                GOLRef.current.tick();
                updateGeneration();
            }, tickSpeed);
        }
    },[playState,tickSpeed, updateGeneration]);


    useEffect(()=> {
        GOLRef.current = new GOLEngine(canvas.current, MAIN_PLAY_CONFIG);
        canvas.current.addEventListener('click',clickHandler);
        canvas.current.addEventListener('wheel',wheelListener);
        window.addEventListener('resize', resizeListener);
        GOLRef.current.initializeCells();
        resizeScreen();
        return cleanup;
    },[clickHandler, wheelListener]);


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