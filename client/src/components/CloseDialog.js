import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useState } from 'react';

function CloseDialog() {
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
      };
    
    const handleClose = (e) => {
        if(e.currentTarget.id === 'close') {
            window.close();
        }
        setOpen(false);
      };
    

    return (
        <div className="close-dialog-container">
            <button className="close-dialog-button" onClick={handleClickOpen}>분석 종료</button>
            <Dialog
                className="close-dialog"
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        종료 하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button id="continue" onClick={handleClose}>
                        계속
                    </button>
                    <button id="close" onClick={handleClose}>
                        종료
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default CloseDialog;