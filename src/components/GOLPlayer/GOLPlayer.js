import "./css/GOLPlayer.css";
import { useCallback, useRef, useEffect, useState } from "react";
import GOLEngine from "../../scripts/GOLEngine";
import { MAIN_PLAY_CONFIG } from "../configs/Play.config";




export default function GOLPlayer({playState=false, tickSpeed=100}) {

    const canvas = useRef(null);
    const GOLEngineHandler = useRef(null);
    const playInterval = useRef(null);
    const canvasContainer = useRef(null);


    const clickHandler = useCallback((event)=> {
        GOLEngineHandler.current.handleClick(event);
    },[]);

    const wheelListener = useCallback((event)=> {
        GOLEngineHandler.current.drawGrid(GOLEngineHandler.current.handleScroll(event));
    },[]);

    function cleanup() {
        canvas.current.removeEventListener('click',clickHandler);
        canvas.current.removeEventListener('wheel',wheelListener);
        canvas.current.removeEventListener('click', clickHandler)
    }



    useEffect(()=> {
        GOLEngineHandler.current = new GOLEngine(canvas.current, MAIN_PLAY_CONFIG);
        canvas.current.addEventListener('click',clickHandler);
        canvas.current.addEventListener('wheel',wheelListener);
        GOLEngineHandler.current.initializeCells();
        console.log(canvasContainer.current.clientX);
        return cleanup;
    },[clickHandler, wheelListener]);



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