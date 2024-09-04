import "./css/GOLButton.css";
import { useEffect, useRef, useState, useCallback } from "react"
import GOLEngine from "../../scripts/GOLEngine";



export default function GOLButton({onClick, config, cleanup}) {

    const canvas = useRef(null);
    const interval = useRef(null);
    const GOLHandler = useRef(null);

    const wheelListener = useCallback((e)=> {
        GOLHandler.current.handleScroll(e);
    },[]);

    const mouseLeave = useCallback((e)=> {
        clearInterval(interval.current);
        GOLHandler.current.initializeCells();
    },[]);

    const mouseEnter = useCallback((e)=> {
        GOLHandler.current.initializeCells();
        interval.current = setInterval(()=> {
            GOLHandler.current.tick();
        },GOLHandler.current.TICK_SPEED);
    },[]);


    function handleClick() {
        if(cleanup === true) {
            // handleCleanup();
        }
        onClick();
    }


    // When we render another page, This needs to be called before going out of scope.
    function handleCleanup() {
        if(canvas.current) {
            canvas.current.removeEventListener('wheel', wheelListener);
            canvas.current.removeEventListener('mouseenter', mouseEnter);
            canvas.current.removeEventListener('mouseleave', mouseLeave);
        }
        clearInterval(interval.current);
    }

    useEffect(()=> {
        //Initialize Game of Life Engine and attach it to the canvas.
        GOLHandler.current = new GOLEngine(canvas.current, config);

        console.log(GOLHandler.current.TICK_SPEED);

        canvas.current.addEventListener('wheel', wheelListener);
        canvas.current.addEventListener('mouseenter',mouseEnter);
        canvas.current.addEventListener('mouseleave',mouseLeave);
        
        return ()=> {
            handleCleanup();
        }
    },[wheelListener, mouseEnter, mouseLeave]);


    return(
        <canvas
            onClick={handleClick}
            className="GOLButton"
            ref={canvas} 
        >
        </canvas>
    )
}