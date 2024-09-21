import "../css/GameList.css";
import { Box,Stack, Tooltip, IconButton, Avatar } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';

import { STORAGE_PREFIX_KEY } from "../../../util/dataTransform";


export default function GameList({
    setSelectedLevel,
    gameData,
    enableDelete=false,
    selectedLevel,
    onDeleteSavedGame,
    listType,
}) {



    return (
        <Box paddingTop={'10px'} minHeight={250}>
            {
                gameData.map((game, i)=> {
                    let levelName = game;
                    if(listType === 'saved') {
                        levelName = game.substring(STORAGE_PREFIX_KEY.length);
                    }
                    return (
                        <div
                            className="gl-list-item"
                            style={{
                                padding:"5px 15px",
                                background:selectedLevel === levelName ? '#f5f2f2':'white',
                                cursor:'pointer',
                                fontFamily:"sans-serif",
                                display:'flex',
                                justifyContent:'space-between',
                                alignItems:'center',
                                borderTop:'1px solid lightgray',
                                borderBottom: i === gameData.length -1 ? '1px solid lightgray':'unset'
                            }}
                            onClick={()=> setSelectedLevel(levelName)}
                            key={game}

                        >
                            <p className={selectedLevel === levelName ? "silkscreen-bold":"silkscreen-regular"} style={{padding:'10px', margin: 0}}>{levelName}</p>
                            {
                                levelName === selectedLevel && (
                                    <Stack 
                                        alignItems={'center'}
                                        gap={1}    
                                        direction={'row'}
                                    >
                                        {
                                                enableDelete && (
                                                    <Tooltip
                                                        title="Delete Saved Game"
                                                    >
                                                        
                                                        <IconButton
                                                            onClick={()=> onDeleteSavedGame(game)}
                                                            size="small"
                                                        >
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                    </Tooltip>
                                                )
                                        }
                                        
                                        <Avatar  sx={{bgcolor:'green', height:24, width: 24}}>
                                            <CheckIcon sx={{fontSize:'.9rem'}}/>
                                        </Avatar>
                                    </Stack>
                                )
                            }
                        </div>
                    )
                })
            }
        </Box>
    )
}