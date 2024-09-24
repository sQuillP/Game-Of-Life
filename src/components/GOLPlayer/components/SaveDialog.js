import { 
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    TextField,
    Button
 } from "@mui/material"

import "../css/SaveDialog.css";


export default function SaveDialog({
    onChange,
    error,
    onClose,
    onSave,
    open,
    value
}) {

    const buttonSX = {
        textTransform:'unset'
    }

    return (
        <Dialog
                open={open}
                onClose={onClose}
                sx={{"*":{color:'white'}}}
                fullWidth
            >
                <DialogTitle sx={{background:'var(--dark-4)'}}>Save Game</DialogTitle>
                <DialogContent sx={{background:'var(--dark-1)'}}>
                    <DialogContentText paddingTop={'20px'} color={'white'}>
                        Please provide a name.
                    </DialogContentText>
                    <input
                        autoFocus
                        required
                        autoComplete="off"
                        margin="dense"
                        id="name"
                        name="name"
                        className="save-input"
                        label={error ? "Invalid Name":"Name"}
                        variant="standard"
                        onChange={onChange}
                        value={value}
                        style={{background:'var(--dark-6)'}}
                    />
                </DialogContent>
                <DialogActions sx={{background:'var(--dark-4)'}}>
                    <Button color="error" sx={buttonSX} onClick={onClose}>Cancel</Button>
                    <Button variant="contained" style={{background:"var(--dark-6)"}} sx={buttonSX} onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
    )

}