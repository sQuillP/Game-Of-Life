import { Tooltip, IconButton } from "@mui/material"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

export default function PlayButton({
    setPlayState,
    playState
}) {




    return (
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
    )
}