import { 
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    TextField,
    Button
 } from "@mui/material"


 import { STORAGE_PREFIX_KEY } from "../../../util/dataTransform";



export default function LoadGameDialog({
    open,
    onClose,

}) {

    const buttonSX = {
        textTransform:'unset'
    }

    const keys = Object.keys(localStorage);

    

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            TransitionProps={{ onEntering: handleEntering }}
            open={open}
            {...other}
        >
            <DialogTitle>Phone Ringtone</DialogTitle>
            <DialogContent dividers>
            <RadioGroup
                ref={radioGroupRef}
                aria-label="ringtone"
                name="ringtone"
                value={value}
                onChange={handleChange}
            >
                {
                    keys.filter(storageKey=> storageKey.startsWith(STORAGE_PREFIX_KEY)).map(storageItem=> {
                        return (
                            <FormControlLabel
                                value={storageItem}
                                key={storageItem}
                                control={<Radio />}
                                label={storageItem.substring(STORAGE_PREFIX_KEY.length)}
                            />
                        )
                    })
                }
            </RadioGroup>
            </DialogContent>
            <DialogActions>
            <Button autoFocus onClick={handleCancel}>
                Cancel
            </Button>
            <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
      </Dialog>
    )

}