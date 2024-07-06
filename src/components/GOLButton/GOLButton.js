import { useEffect, useRef, useState } from "react"
import GOLEngine from "../../scripts/GOLEngine";


export default function GOLButton({preset}) {

    const canvas = useRef(null);

    const GOLHandler = useRef();


    useEffect(()=> {
        console.log(canvas.current);
        GOLHandler.current = new GOLEngine(canvas.current);
        GOLHandler.current.run();
    },[canvas.current]);


    return(
        <canvas
            onMouseEnter={()=> GOLHandler.current.run()}
            ref={canvas} 
            width={100}
            height={100}
        >
        </canvas>
    )
}