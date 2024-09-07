import "./css/Play.css";

import GOLPlayer from "../GOLPlayer/GOLPlayer";
import { useState } from "react";
import { 
    Button, 
    IconButton, 
    MenuItem, 
    Select, 
    Stack, 
    Tooltip,
    FormControl,
    InputLabel,
    Input,
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FolderIcon from '@mui/icons-material/Folder';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { MuiColorInput } from "mui-color-input";
import { Link } from "react-router-dom";

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


    function updateGeneration() {
        setGeneration(generation + 1);
    }

    
    function handleSelectChange() {

    }

    return (
        <div className="play-main">
            {/* add header */}
            <div className="play-header">
                <Link style={{textDecoration:'none'}} to={'/home'}>
                    <h2 className="play-title silkscreen-regular">
                        Game of Life
                    </h2>
                </Link>
                <Stack direction={'row'} gap={3} justifyContent={'center'} alignItems={'center'}>
                    <Tooltip title={playState === true ? "Play (space)":"Pause (space)"}>
                        <IconButton
                            size="large"
                            style={{background:'#1ed760'}}
                            onClick={()=> setPlayState(!playState)}
                        >
                            {
                                playState === true ? (
                                    <PlayArrowIcon sx={{color:'black', fontSize: '1.5rem'}}/>
                                ): (
                                    <PauseIcon sx={{color:'black', fontSize: '1.5rem'}}/>
                                )
                            }
                        </IconButton>
                    </Tooltip>
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
            <GOLPlayer 
                playState={playState}
                updateGeneration={updateGeneration}
            />
        </div>
    );
}