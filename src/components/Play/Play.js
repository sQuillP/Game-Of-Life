import "./css/Play.css";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import GOLPlayer from "../GOLPlayer/GOLPlayer";
import { Button, Select, MenuItem, Stack, IconButton, Tooltip, Modal } from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { Link } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import PlayButton from "./components/PlayButton";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import Draggable from "react-draggable";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { FileDownload } from "@mui/icons-material";
import PaletteIcon from '@mui/icons-material/Palette';

/*


TODO: Mobile support for pinch gesture.

node.addEventListener('gestureend', function(e) {
    if (e.scale < 1.0) {
        // User moved fingers closer together
    } else if (e.scale > 1.0) {
        // User moved fingers further apart
    }
}, false);

*/


const buttonSX = {
    background: 'lightgray',
    color:'black',
    "&:hover": {
        background:'lightgray'
    },
    textTransform:'unset'
}

export default function Play() {

    const [playState, setPlayState] = useState(false);
    const [zoom, setZoom] = useState(10);
    const [initialData, setInitialData] = useState([]);
    const [cellColor, setCellColor] = useState("#000000");
    const [generation, setGeneration] = useState(0);

    const [loadGameDialog, setLoadGameDialog] = useState(false);


    // If changed, game data will be erased
    const [resetGame, setResetGame]= useState(false);

    //Trigger modal to open in the child component (GOLPlayer)
    const [openModal, setOpenModal] = useState(false);

    const smallscreen = useMediaQuery('(max-width: 1045px)');



    function updateGeneration() {
        setGeneration((generation)=> generation + 1);
    }

    

    function onResetGame() {
        setResetGame(!resetGame);
        setGeneration(0);
    }


    //Cancel the current play state and toggle the modal
    function onToggleSaveModal() {
        setOpenModal(openModal => !openModal);

        setPlayState(false);
    }

    function onToggleLoadGameModal() {
        setLoadGameDialog(loadGameDialog => !loadGameDialog);
    }


    function onCloseLoadGameDialog() {
        setLoadGameDialog(false);
    }


    return (
        <>

            {(()=> {
                if(smallscreen === false) {
                    return (
                        <div className="play-header">
                            <Link style={{textDecoration:'none'}} to={'/home'}>
                                <h2 className="play-title silkscreen-regular">
                                    Game of Life
                                </h2>
                            </Link>
                            <Stack direction={'row'} gap={2} justifyContent={'end'} alignItems={'center'}>
                                <PlayButton
                                    playState={playState}
                                    setPlayState={setPlayState}
                                />
                                <Button
                                    size="medium"
                                    variant='contained'
                                    sx={buttonSX}
                                    endIcon={<BookmarksIcon/>}
                                    onClick={onToggleSaveModal}
                                >
                                    Save
                                </Button>
                                <Tooltip title="Reset game">
                                    <IconButton
                                        size="small"
                                        onClick={onResetGame}
                                        style={{background: 'lightgray', color:'black'}}

                                    >
                                        <RestartAltIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Button
                                    endIcon={<FileDownload/>}
                                    size="medium"
                                    variant="contained"
                                    sx={buttonSX}
                                    onClick={onToggleLoadGameModal}
                                >
                                    Load
                                </Button>
                                <Tooltip title="Choose color">
                                    <MuiColorInput
                                        format="hex"
                                        value={cellColor}
                                        onChange={setCellColor}
                                        sx={{background:'lightgray'}}
                                        size="small"
                                    />
                                </Tooltip>
                            </Stack>
                            <div style={{width: '150px'}}>
                                <p style={{fontSize:'1.5rem', color:'lightgray'}} className="text silkscreen-regular">GEN: {generation}</p>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <>
                            <div className="smallscreen-header">
                                <Stack
                                    direction={'row'}
                                    justifyContent={'space-around'}
                                    alignItems={'center'}
                                    width={'100%'}
                                >
                                    
                                    <Link style={{textDecoration:'none'}} to={'/home'}>
                                        <h2 className="play-title silkscreen-regular">
                                            Game of Life
                                        </h2>
                                    </Link>
                                    <div>
                                        <p  className="text generation-txt silkscreen-regular">GEN: {generation}</p>
                                    </div>
                                </Stack>
                            </div>
                            <div className="smallscreen-footer">
                                <Stack 
                                    direction={'row'} 
                                    justifyContent={'center'} 
                                    alignItems={'center'}
                                    height={'100%'}
                                    gap={2}
                                >
                                    <Tooltip title="Reset game">
                                        <IconButton
                                            size="small"
                                            onClick={onResetGame}
                                            style={{background: 'lightgray', color:'black'}}

                                        >
                                            <RestartAltIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                        title="Save Game"
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={onToggleSaveModal}
                                            style={{background:'lightgray', color:'black'}}
                                        >
                                            <BookmarksIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <PlayButton
                                        playState={playState}
                                        setPlayState={setPlayState}
                                    />
                                    <Tooltip
                                        title="Palette"
                                    >
                                        <div className="play-color-picker">
                                            <label className="color-picker-label" htmlFor="colorPicker">
                                                <IconButton
                                                    disabled
                                                    size="small"
                                                    style={{background:'lightgray', color:'black'}}
                                                >
                                                    <PaletteIcon/>
                                                </IconButton>
                                            </label>
                                            <input 
                                                onChange={(e)=>setCellColor(e.target.value)} 
                                                type="color" 
                                                value={cellColor}
                                                id="colorPicker"
                                                
                                            />
                                        </div>
                                    </Tooltip>
                                    <Tooltip
                                        title={'Load Game'}
                                    >
                                        <IconButton
                                            size="small"
                                            style={{background:'lightgray', color:'black'}}
                                            onClick={onToggleLoadGameModal}
                                        >
                                            <FileDownload/>
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </div>
                        </>
                    )
                }
            })()}
            <GOLPlayer
                playState={playState}
                updateGeneration={updateGeneration}
                cellColor={cellColor}
                resetGame={resetGame}

                openSaveModal={openModal}
                loadGameDialog={loadGameDialog}

                onCloseSaveModal={onToggleSaveModal}
                onCloseLoadGameDialog={onCloseLoadGameDialog}
            />
       </>

    );
}