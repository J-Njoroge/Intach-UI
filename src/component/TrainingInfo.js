import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
    Typography,
  Modal,
} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  body: {
    height: "100%",
  },
  button: {
    width: "100%",
    height: "40%",
    margin: "10%",
    padding: "20%",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    
  
    },
    popupText: {
        color: "#231F20",
        backgroundColor: "#F5F5F3",
      
      
  }
}));



const PopUpDescriptionTraining = (props) => {
    const classes = useStyles();
    const { open, handleClose, trainingDetails } = props;
    return (
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "50px",
            outline: "none",
            minWidth: "50%",
          }}
  
        >
  
          <Grid container direction="column" alignItems="center" spacing={3}>
            <Grid item className={classes.popupText}>
                
                <Typography variant="h3" >
                {trainingDetails.Title}
                </Typography>
  
            </Grid>
            <Grid item>
                <Typography variant="h5">
                    Job Description
                </Typography>
                <Typography variant="h6">
                  {trainingDetails.Description}
                </Typography>
  
            </Grid>
            <Grid item>
              <Typography variant="h5">
                Duration : {trainingDetails.Duration}
              </Typography>
              
            </Grid>
            <Grid item>
              <Typography variant="h5">
                Location : {trainingDetails.Location}
              </Typography>
              <Typography variant="h6">
                            
                Link : {trainingDetails.Link}
                </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    );
};
  
export default PopUpDescriptionTraining;