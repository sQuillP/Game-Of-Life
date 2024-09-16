import "./css/Play.css";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import GOLPlayer from "../GOLPlayer/GOLPlayer";
import { Button, Select, MenuItem, Stack } from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { Link } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import PlayButton from "./components/PlayButton";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import Draggable from "react-draggable";



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

    const smallscreen = useMediaQuery('(max-width: 1000px)');



    function updateGeneration() {
        setGeneration(generation + 1);
    }

    
    function handleSelectChange() {

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
                            <Stack direction={'row'} gap={3} justifyContent={'center'} alignItems={'center'}>
                            <PlayButton
                                playState={playState}
                                setPlayState={setPlayState}
                            />
                                <Button
                                    size="medium"
                                    variant='contained'
                                    sx={buttonSX}
                                    endIcon={<BookmarksIcon/>}
                                >
                                    Save
                                </Button>
                                <Button
                                    size="medium"
                                    variant='contained'
                                    sx={buttonSX}
                                    endIcon={<FolderIcon fontSize="small"/>}
                                >
                                    Load
                                </Button>
                                <Select
                                    size="small"
                                    value={"None"}
                                    onChange={handleSelectChange}
                                    variant="outlined"
                                    sx={{background:'lightgray'}}

                                >
                                    <MenuItem hidden value='None'>Presets</MenuItem>
                                </Select>
                                <MuiColorInput
                                    format="hex"
                                    value={cellColor}
                                    onChange={setCellColor}
                                    sx={{background:'lightgray'}}
                                    size="small"
                                />
                            </Stack>
                            <div></div>
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
                                        <p className="text generation-txt silkscreen-regular">GEN: 890</p>
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
            {/* <Draggable
            >
                <div className="drag-container">
                    <p>Generation:  2321</p>
                    <p>live cells: </p>
                </div>
            </Draggable> */}

            <GOLPlayer
                playState={playState}
                updateGeneration={updateGeneration}
            />
       </>

    );
}