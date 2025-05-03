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
    height: "inherit",
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
}));



const PopUpDescription = (props) => {
    const classes = useStyles();
    const { open, handleClose, jobDetails } = props;
    return (
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "50px",
            outline: "none",
            minWidth: "50%",
          }}
  
        >
  
  {/* Title: job.title,
                  Description: job.description,
                  Id: job._id,
                  Company: job.recruiter.name,
                  Location: job.location, */}
          <Grid container direction="column" alignItems="center" spacing={3}>
            <Grid item>
                <Typography variant="h4">
                    Job Title
                </Typography>
                <Typography variant="h6">
                {jobDetails.Title}
                </Typography>
  
            </Grid>
            <Grid item>
                <Typography variant="h5">
                    Job Description
                </Typography>
                <Typography variant="h6">
                  {jobDetails.Description}
                </Typography>
  
            </Grid>
            <Grid item>
              <Typography variant="h5">
                Company
              </Typography>
              <Typography variant="h6">
                {jobDetails.Company}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5">
                Location
              </Typography>
              <Typography variant="h6">
                {jobDetails.Location}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    );
};
  
export default PopUpDescription;
