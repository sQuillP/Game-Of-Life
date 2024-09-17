import { 
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    TextField,
    Button
 } from "@mui/material"




export default function SaveDialog({
    onChange,
    error,
    onClose,
    onSave,
    open
}) {

    const buttonSX = {
        textTransform:'unset'
    }

    return (
        <Dialog
                open={open}
                onClose={onClose}
            >
                <DialogTitle>Save Game</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please provide a name for this simulation.
                    </DialogContentText>
                    <TextField
                        sx={{color:'black'}}
                        autoFocus
                        required
                        autoComplete="off"
                        margin="dense"
                        id="name"
                        name="name"
                        label={error ? "Invalid Name":"Name"}
                        fullWidth
                        variant="standard"
                        onChange={onChange}
                        error={error}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="error" sx={buttonSX} onClick={onClose}>Cancel</Button>
                    <Button variant="contained" color="success" sx={buttonSX} onClick={onSave}>Save game</Button>
                </DialogActions>
            </Dialog>
    )

}