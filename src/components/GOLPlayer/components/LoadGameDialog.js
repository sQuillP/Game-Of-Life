import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    RadioGroup,
    Radio,
    FormControlLabel,
    Box,
    Tabs,
    Tab
 } from "@mui/material"


 import { STORAGE_PREFIX_KEY } from "../../../util/dataTransform";
import { useState } from "react";



//Tab names:




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

    const [tab, setCurretTab] = useState(0);


    const gameData = Object.keys(localStorage).filter(k=>k.startsWith(STORAGE_PREFIX_KEY));
    

    const [selectedLevel, setSelectedLevel] = useState('');

    const buttonSX = {
        textTransform:'unset'
    }


    function handleOk() {

    }
    

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Load Game</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tab } onChange={(e, value)=>setCurretTab(value)} aria-label="basic tabs example">
                            <Tab label="Saved" />
                            <Tab label="Presets"  />
                            <Tab label="Load Custom"/>
                        </Tabs>
                    </Box>
                    {
                        (()=> {
                            if(tab === 0) {
                                return (
                                    <RadioGroup
                                        aria-label="ringtone"
                                        name="ringtone"
                                        value={selectedLevel}
                                        onChange={(e)=>setSelectedLevel(e.target.value)}
                                    >
                                        {
                                            gameData.map(storageKey=> {
                                                return (
                                                    <FormControlLabel
                                                        value={storageKey}
                                                        key={storageKey}
                                                        control={<Radio />}
                                                        label={storageKey.substring(STORAGE_PREFIX_KEY.length)}
                                                    />
                                                )
                                            })
                                        }
                                    </RadioGroup>
                                )
                            }
                            if(tab === 1) {
                                return (
                                    <div>
                                        Presets
                                    </div>
                                )
                            } else {
                                return (
                                    <div>
                                        custom
                                    </div>
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
                <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
      </Dialog>
    )

}


