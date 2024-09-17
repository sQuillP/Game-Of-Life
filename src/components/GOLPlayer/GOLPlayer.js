import "./css/GOLPlayer.css";
import { useCallback, useRef, useEffect, useState } from "react";
import GOLEngine from "../../scripts/GOLEngine";
import { MAIN_PLAY_CONFIG } from "../configs/Play.config";
import { saveLayout, loadSavedGame } from "../../util/dataTransform";
import CheckIcon from '@mui/icons-material/Check'
import { 
    Dialog, 
    DialogTitle, 
    DialogActions,
    DialogContentText,
    DialogContent,
    Button,
    TextField,
    Snackbar,
    Alert

} from "@mui/material";

const RIGHT_CLICK = 3;
const LEFT_CLICK = 1;



/**
 * @description - parent function feeds adjustments into GOL Player.
 * Control flow is handled via prop changes with useeffect doing the change listening.
 * @returns {React.JSX} Canvas element to show user the game of life.
 */
export default function GOLPlayer({
    playState=false, 
    tickSpeed=100, 
    updateGeneration,
    cellColor,
    resetGame,
    openModal,
    onCloseModal
}) {

    const canvas = useRef(null);
    const GOLRef = useRef(null);
    const playInterval = useRef(null);
    const canvasContainer = useRef(null);
    
    const [saveGameTitle, setSaveGameTitle] = useState("");
    const [saveGameError, setSaveGameError] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);


    const buttonSX = {
        textTransform:'unset'
    }


    //When user let's the game get saved.
    function onSaveGameData() {
        if(saveGameTitle.trim() === "") {
            setSaveGameError(true);
            return;
        }
        setSaveGameError(false);
        saveLayout(
            saveGameTitle,
            GOLRef.current.getCells(),
            true
        );
        setOpenSnackbar(true);
        onCloseModal();
    }
    


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


    //Play frame by frame if right arrow is pressed.
    const arrowKeyListener = useCallback((event)=> {
        if(playState === true || event.key !== 'ArrowRight') return;
        GOLRef.current.tick();
        updateGeneration();
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
        if(GOLRef.current){
            GOLRef.current.setCellColor(cellColor);
            GOLRef.current.drawGrid();
        }
    },[cellColor]);

    useEffect(()=> {
        if(!GOLRef.current) return;

        GOLRef.current.clearCells();
        GOLRef.current.drawGrid();
    },[resetGame]);



    useEffect(()=> {
        if(!GOLRef.current) return;
    },[openModal]);


    useEffect(()=> {

        // Initialize the game engine instance.
        GOLRef.current = new GOLEngine(canvas.current, MAIN_PLAY_CONFIG);
        

        //Mount listeners for grid events
        window.addEventListener('resize', resizeListener);
        window.addEventListener('keydown', arrowKeyListener);

        canvas.current.addEventListener('wheel',wheelListener);
        canvas.current.addEventListener('mousedown', mousedownHandler);
        canvas.current.addEventListener('mouseup', mouseupHandler);
        canvas.current.addEventListener('mousemove', mousemoveHandler);

        //Create the cells and amke sure tha tthe screen is resized appropriately.
        GOLRef.current.initializeCells();

        
        resizeScreen();

        //Cleanup event listeners for grid events.
        return ()=> {

            window.removeEventListener('resize', resizeListener);
            window.removeEventListener('keydown', arrowKeyListener);

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
        <>
            <Dialog
                open={openModal}
                onClose={onCloseModal}
            >
                <DialogTitle>Save Game</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please provide a name. Any saved game that has the same name will be overwritten.
                    </DialogContentText>
                    <TextField
                        sx={{color:'black'}}
                        autoFocus
                        required
                        autoComplete="off"
                        margin="dense"
                        id="name"
                        name="name"
                        label={saveGameError ? "Invalid Name":"Name"}
                        fullWidth
                        variant="standard"
                        onChange={e => setSaveGameTitle(e.target.value)}
                        error={saveGameError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="error" sx={buttonSX} onClick={onCloseModal}>Cancel</Button>
                    <Button variant="contained" color="success" sx={buttonSX} onClick={onSaveGameData}>Save game</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbar}
                onClose={()=> setOpenSnackbar(false)}
                autoHideDuration={1500}
                anchorOrigin={{horizontal:'center', vertical:'bottom'}}
            >
                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                    Successfully saved game.
                </Alert>
            </Snackbar>
            <div  ref={canvasContainer} className="canvas-container">
                <canvas
                    onContextMenu={e=> e.preventDefault()}
                    ref={canvas}
                    style={{cursor:'pointer',}}
                >
                </canvas>
            </div>
        </>
    )
}