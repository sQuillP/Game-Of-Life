import { 
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    RadioGroup,
    Radio,
    FormControlLabel,

 } from "@mui/material"


 import { STORAGE_PREFIX_KEY } from "../../../util/dataTransform";
import { useState } from "react";


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



    const gameData = Object.keys(localStorage).filter(k=>k.startsWith(STORAGE_PREFIX_KEY));
    

    const [selectedLevel, setSelectedLevel] = useState("");

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
            <DialogTitle>Saved Games</DialogTitle>
            <DialogContent dividers>
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