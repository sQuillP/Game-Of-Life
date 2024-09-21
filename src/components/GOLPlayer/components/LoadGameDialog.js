import "../css/LoadGameDialog.css";

import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Tabs,
    Tab,
    TextField,
    Avatar,
    useMediaQuery,
    Stack,
    IconButton,
    Tooltip,
    Divider,
 } from "@mui/material"

import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';

import { STORAGE_PREFIX_KEY, loadSavedGame, processCustomText } from "../../../util/dataTransform";
import { useEffect, useState } from "react";


import GamePresets from '../../configs/GamePresets';
import GameList from "./GameList";
import { styled } from '@mui/material/styles';



const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
      marginTop: theme.spacing(2),
    },
    "&:before, &:after":{backgroundColor: 'var(--dark-6)'},
    margin:'0px 0 50px 0'
}));
  


 /**
  * @description read from localstorage to fetch all the valid games
  * @param {*} param0 
  * @returns 
  */
export default function LoadGameDialog({
    open,
    onClose,
    setLoadedGame,
}) {


    const [savedGameData, setSavedGameData] = useState(
        Object.keys(localStorage).filter(k=>k.startsWith(STORAGE_PREFIX_KEY))
    );


    const DUMMY_DATA = [
        "Glider",
        "Spinner",
        "Default3",
        "Default4",
        "Default5"
    ]

    const [tab, setCurretTab] = useState(0);
    const [selectedLevel, setSelectedLevel] = useState(populateSelectedLevel());
    const [cellTextData, setCellTextData] = useState(null);
    const [confirmDeleteMenu, setOpenConfirmDeleteMenu] = useState(false);
    const [customInputError, setCustomInputError] = useState({});
    const [uploadedFileName, setUploadedFileName] = useState("");


    function handleCellTextDataChange(e) {
        const liveCells = processCustomText(e.target.value);
        setCellTextData(liveCells);
    }

    const smallscreen = useMediaQuery('(max-width: 480px)')


    function populateSelectedLevel() {
        const storageData = Object.keys(localStorage).filter(k=>k.startsWith(STORAGE_PREFIX_KEY))
        if(storageData.length > 0) {
            return storageData[0].substring(STORAGE_PREFIX_KEY.length);
        }
        return "";
    } 

    function removeFile() {
        setCellTextData(null);
        setUploadedFileName("");
    }


    function refreshSavedList() {
        setSavedGameData(
            Object.keys(localStorage).filter(k=>k.startsWith(STORAGE_PREFIX_KEY))
        );
        setSelectedLevel(
            populateSelectedLevel()
        );
    }


    const buttonSX = {
        textTransform:'unset',
        color:"white"
    }

    function handleOk() {
        // If we know that we have celltextdata populated, then we will be loading that
        //and taking priority over other selections.
        if(cellTextData !== null) {
            console.log('uploading a file', cellTextData);
            setLoadedGame(cellTextData, false)
        } else {

            // If we don't find any selected key from localstorage, that means
            //that game data is coming from the presets tab
            if(localStorage.getItem(STORAGE_PREFIX_KEY + selectedLevel) === null){
                for(const key of Object.keys(GamePresets)) {
                    if(GamePresets[key].title === selectedLevel) {
                        setLoadedGame(GamePresets[key].data, false);
                        break;
                    }
                }
            } else {
                // just load saved game.
                const savedGame = loadSavedGame(STORAGE_PREFIX_KEY + selectedLevel);
                setLoadedGame(savedGame, true);
            }
            
        }
        onClose();
    }
    




    //Remove level from localstorage and update the saved game list with the game data.
    function onDeleteSavedGame(storageKey) {
        localStorage.removeItem(storageKey);
        
        refreshSavedList();
    }

    useEffect(()=> {
        if(open === false)  return;
        refreshSavedList();
        removeFile();
    },[open]);


    async function showFile(e) { 
        e.preventDefault() 
        const reader = new FileReader() 
        reader.onload = async (e) => { 
            const liveCells = processCustomText(e.target.result) ;
            setCellTextData(liveCells);
        }; 
        console.log(e.target.files);
        setUploadedFileName(e.target.files[0].name)
        reader.readAsText(e.target.files[0]);
     } 

    
     function loadPresetData() {
        return Object.keys(GamePresets).map(key => GamePresets[key].title);
     }


    return (
        <>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '80%', height: 500 }, "*":{color:'white'} }}
                // maxWidth="xs"
                open={open}
                onClose={onClose}
                fullWidth
            >
                <DialogTitle style={{background:'var(--dark-4)'}} sx={{textAlign:'center', fontFamily:'Silkscreen, sans-serif'}}>
                    Load Game
                    <Tabs 
                        variant={smallscreen ? 'scrollable':'standard'}  
                        centered={!smallscreen} 
                        value={tab } 
                        onChange={(e, value)=>setCurretTab(value)}
                        TabIndicatorProps={{ sx: { backgroundColor: 'var(--dark-6)'}}}
                    >
                        <Tab style={{fontFamily:'Silkscreen, sans-serif', color:'white'}} label="Saved" />
                        <Tab style={{fontFamily:'Silkscreen, sans-serif', color:'white'}} label="Presets"  />
                        <Tab style={{fontFamily:'Silkscreen, sans-serif', color:'white'}} label="Custom"/>
                    </Tabs>
                </DialogTitle>
                <DialogContent style={{background:'var(--dark-1)'}} sx={{paddingTop: '0'}} dividers>
                    <Box sx={{width: '100%' }}>
                        {
                            (()=> {
                                if (tab === 0 && savedGameData.length === 0) {
                                    return (
                                        <Box 
                                            minHeight={240}
                                            paddingTop={'10px'}
                                            justifyContent={'center'}
                                            display={'flex'}
                                            alignItems={'center'}
                                        >
                                            <p className="lgd-empty-games silkscreen-bold">No Saved Games</p>
                                        </Box>
                                    )
                                }
                                else if(tab === 0) {
                                    return (
                                        <GameList
                                            setSelectedLevel={setSelectedLevel}
                                            gameData={savedGameData}
                                            enableDelete={true}
                                            selectedLevel={selectedLevel}
                                            onDeleteSavedGame={onDeleteSavedGame}
                                            listType={'saved'}
                                        />
                                    )
                                }
                                else if(tab === 1) {
                                    return (
                                        <GameList
                                            gameData={loadPresetData()}
                                            enableDelete={false}
                                            selectedLevel={selectedLevel}
                                            listType={'preset'}
                                            setSelectedLevel={setSelectedLevel}

                                        />
                                    )
                                } else {
                                    return (
                                        <Box sx={{marginTop: '10px'}} minHeight={250}>
                                            <Stack 
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                            >
                                                <div className="lgd-custom-container lgd-file-upload">
                                                    <p style={{textAlign:'center'}} className="text silkscreen-regular">Upload a Custom File</p>
                                                    <label htmlFor="upload-textfile">
                                                        <input
                                                            style={{ display: 'none' }}
                                                            id="upload-textfile"
                                                            name="upload-textfile"
                                                            type="file"
                                                            onChange={showFile}
                                                            accept=".txt"
                                                        />

                                                        <Button 
                                                            sx={{
                                                                marginTop: '15px',
                                                                fontFamily:'Silkscreen, sans-serif',
                                                                background:'var(--dark-6)',
                                                                "&:hover": {
                                                                    background: 'var(--dark-7)'
                                                                }
                                                            }}  
                                                            variant="contained" 
                                                            component="span"

                                                        >
                                                            Choose File
                                                        </Button>
                                                    </label>
                                                    {
                                                        uploadedFileName && (
                                                            <Stack 
                                                                style={{marginTop: '20px'}} 
                                                                direction={'row'}
                                                                alignItems={'center'}
                                                            >
                                                                <p style={{color:'white'}} className="text silkscreen-regular">{uploadedFileName}</p>
                                                                <Tooltip>
                                                                    <IconButton 
                                                                        onClick={removeFile}
                                                                        size="small"
                                                                    >
                                                                        <DeleteIcon/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Stack>
                                                        )
                                                    }
                                                </div>
                                                <Root>
                                                    <Divider textAlign="center">OR</Divider>
                                                </Root>
                                                <div className="lgd-custom-container">

                                                    <label className="silkscreen-regular" style={{ margin:'10px 0', display: 'inline-block'}} htmlFor="lgd-textfield">Enter custom values in the form <span className="silkscreen-bold">(x,y)</span>.</label>
                                                    <TextField
                                                        id="lgd-textfield"
                                                        onChange={handleCellTextDataChange}
                                                        multiline
                                                        rows={5}
                                                        placeholder="ex: (20,32) (33,2)"
                                                        fullWidth
                                                        style={{background:"var(--dark-6)"}}
                                                    />
                                                </div>
                                                
                                                
                                            </Stack>
                                        </Box>
                                    )
                                }
                            })()
                        }
                    </Box>    
                </DialogContent>
                <DialogActions style={{background:'var(--dark-4)'}}>
                    <Button sx={buttonSX} autoFocus onClick={onClose}>
                        Cancel
                    </Button>
                    <Button sx={buttonSX} onClick={handleOk}>Load</Button>
                </DialogActions>
        </Dialog>
      </>

    )

}


