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
                        value={value}
                    />
                </DialogContent>
                <DialogActions sx={{background:'var(--dark-4)'}}>
                    <Button color="error" sx={buttonSX} onClick={onClose}>Cancel</Button>
                    <Button variant="contained" style={{background:"var(--dark-6)"}} sx={buttonSX} onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
    )

}