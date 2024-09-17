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


/*

    - Color picker
    - zoom buttons
    - save
    - load
    - presets
    - generation


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

    const smallscreen = useMediaQuery('(max-width: 1000px)');



    function updateGeneration() {
        setGeneration((generation)=> generation + 1);
    }

    
    function handleSelectChange() {

    }

    function onSaveLayout() {
        
    }

    function onResetGame() {
        setResetGame(!resetGame);
        setGeneration(0);
    }


    //Cancel the current play state and toggle the modal
    function onToggleModal() {
        setOpenModal(openModal => !openModal);

        setPlayState(false);
    }

    function onToggleLoadGameModal() {
        setLoadGameDialog(loadGameDialog => !loadGameDialog);
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
                                    onClick={onToggleModal}
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
                                {/* <Button
                                    size="medium"
                                    variant='contained'
                                    sx={buttonSX}
                                    endIcon={<FolderIcon fontSize="small"/>}
                                >
                                    Load
                                </Button> */}
                                {/* <Select
                                    size="small"
                                    value={"None"}
                                    onChange={handleSelectChange}
                                    variant="outlined"
                                    sx={{background:'lightgray'}}

                                >
                                    <MenuItem hidden value='None'>Presets</MenuItem>
                                </Select> */}
                                <Button
                                    endIcon={<FileDownload/>}
                                    size="medium"
                                    variant="contained"
                                    sx={buttonSX}
                                    onClick={onToggleLoadGameModal}
                                >
                                    Load
                                </Button>

                                <MuiColorInput
                                    format="hex"
                                    value={cellColor}
                                    onChange={setCellColor}
                                    sx={{background:'lightgray'}}
                                    size="small"
                                />
                            </Stack>
                            <div style={{width: '150px'}}>
                                <p style={{fontSize:'1.5rem', color:'lightgray'}} className="text silkscreen-regular">GEN: {generation}</p>
                            </div>
                        </div>
                    )
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
                                    direction={'column'} 
                                    justifyContent={'center'} 
                                    alignItems={'center'}
                                    height={'100%'}
                                >
                                    
                                    <PlayButton
                                        playState={playState}
                                        setPlayState={setPlayState}
                                    />


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
                openModal={openModal}
                onCloseModal={onToggleModal}
                loadGameDialog={loadGameDialog}
            />
       </>

    );
}