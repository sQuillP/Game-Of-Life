import { useEffect, useRef, useState } from "react"
import GOLEngine from "../../scripts/GOLEngine";


export default function GOLButton({preset}) {

    const canvas = useRef(null);

    const GOLHandler = useRef();


    useEffect(()=> {
        console.log(canvas.current);
        GOLHandler.current = new GOLEngine(canvas.current);
        GOLHandler.current.run();
    },[]);


    return(
        <>
            <button onClick={()=>{ GOLHandler.current.unmount()}}>remove listeners</button>
            <canvas
                ref={canvas} 
                width={100}
                height={100}
            >
            </canvas>
        </>
    )
}