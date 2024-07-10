import "./css/GOLButton.css";
import { useEffect, useRef, useState } from "react"
import GOLEngine from "../../scripts/GOLEngine";



export default function GOLButton({config}) {

    const [t, st] = useState(0);
    const canvas = useRef(null);

    const GOLHandler = useRef();

    useEffect(()=> {
        //Initialize Game of Life Engine and attach it to the canvas.
        GOLHandler.current = new GOLEngine(canvas.current, config);
        let interval = null;


        function clickListener(e) {
            console.log('clicked');
            GOLHandler.current.handleClick(e);
        }


        function wheelListener(e) {
            GOLHandler.current.handleScroll(e);
        }

        function mouseLeave() {
            clearInterval(interval);
            GOLHandler.current.initializeCells();

        }

        function mouseEnter() {
            interval = setInterval(()=> {
                GOLHandler.current.tick();
            },GOLHandler.current.TICK_SPEED);
        }

        canvas.current.addEventListener('click',clickListener);
        canvas.current.addEventListener('wheel', wheelListener);
        canvas.current.addEventListener('mouseenter',mouseEnter);
        canvas.current.addEventListener('mouseleave',mouseLeave);

        return ()=> {
            canvas.current.removeEventListener('click', clickListener);
            canvas.current.removeEventListener('wheel', wheelListener);
            canvas.current.removeEventListener('mouseenter', mouseEnter);
            canvas.current.removeEventListener('mouseleave',mouseLeave);
            clearInterval(interval);//stop the simulation
        }
    },[]);


    return(
        <canvas
            className="GOLButton"
            ref={canvas} 
        >
        </canvas>
    )
}