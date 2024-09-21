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

import { STORAGE_PREFIX_KEY } from "../../../util/dataTransform";
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
    const [cellTextData, setCellTextData] = useState('');
    const [confirmDeleteMenu, setOpenConfirmDeleteMenu] = useState(false);
    const [customInputError, setCustomInputError] = useState({});



    const smallscreen = useMediaQuery('(max-width: 480px)')


    function populateSelectedLevel() {
        const storageData = Object.keys(localStorage).filter(k=>k.startsWith(STORAGE_PREFIX_KEY))
        if(storageData.length > 0) {
            return storageData[0].substring(STORAGE_PREFIX_KEY.length);
        }
        return "";
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
        textTransform:'unset'
    }

    function handleOk() {

    }
    

    function onOpenConfirmDeleteMenu() {
        setOpenConfirmDeleteMenu(true);
    }



    //Remove level from localstorage and update the saved game list with the game data.
    function onDeleteSavedGame(storageKey) {
        localStorage.removeItem(storageKey);
        
        refreshSavedList();
    }

    useEffect(()=> {
        if(open === false)  return;

        refreshSavedList();
    },[open]);


    async function showFile(e) { 
        e.preventDefault() 
        const reader = new FileReader() 
        
        reader.onload = async (e) => { 
  
           const text = (e.target.result) 
  
           console.log(text) 
  
           alert(text) 
  
        }; 
  
        reader.readAsText(e.target.files[0]) 
  
     } 


    return (
        <>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '80%', height: 500 } }}
                // maxWidth="xs"
                open={open}
                onClose={onClose}
                fullWidth
            >
                <DialogTitle sx={{textAlign:'center', fontFamily:'Silkscreen, sans-serif'}}>
                    Load Game
                    <Tabs variant={smallscreen ? 'scrollable':'standard'}  centered={!smallscreen} value={tab } onChange={(e, value)=>setCurretTab(value)}>
                        <Tab style={{fontFamily:'Silkscreen, sans-serif'}} label="Saved" />
                        <Tab style={{fontFamily:'Silkscreen, sans-serif'}} label="Presets"  />
                        <Tab style={{fontFamily:'Silkscreen, sans-serif'}} label="Custom"/>
                    </Tabs>
                </DialogTitle>
                <DialogContent sx={{paddingTop: '0'}} dividers>
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
                                            gameData={DUMMY_DATA}
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
                                                    <p className="text silkscreen-regular">Upload a Custom File</p>
                                                    <label htmlFor="upload-photo">
                                                        <input
                                                            style={{ display: 'none' }}
                                                            id="upload-photo"
                                                            name="upload-photo"
                                                            type="file"
                                                            onChange={showFile}
                                                        />

                                                        <Button 
                                                            sx={{
                                                                marginTop: '15px',
                                                                fontFamily:'Silkscreen, sans-serif'
                                                            }}  
                                                            variant="contained" 
                                                            component="span"

                                                        >
                                                            Choose File
                                                        </Button>
                                                    </label>
                                                </div>
                                                <Root>
                                                    <Divider textAlign="center">OR</Divider>
                                                </Root>
                                                <div className="lgd-custom-container">

                                                    <label className="silkscreen-regular" style={{ margin:'10px 0', display: 'inline-block'}} htmlFor="lgd-textfield">Enter custom values in the form <span className="silkscreen-bold">(x,y)</span>.</label>
                                                    <TextField
                                                        id="lgd-textfield"
                                                        onChange={(e)=> setCellTextData(e.target.value)}
                                                        multiline
                                                        rows={5}
                                                        placeholder="ex: (20,32) (33,2)"
                                                        fullWidth
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
                <DialogActions>
                    <Button autoFocus onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleOk}>Load</Button>
                </DialogActions>
        </Dialog>
      </>

    )

}


