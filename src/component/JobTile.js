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
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";

import PopUpDescription from "./jobInfo";
import FilterPopup from "./FilterPopup";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";

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
  profileDialog: {
    padding: theme.spacing(4),
  },
}));

const JobTile = (props) => {
  const classes = useStyles();
  const { job } = props;
  const setPopup = useContext(SetPopupContext);
  const [popDescription, setPopDescription] = useState({
    Title: "",
    Description: "",
    Id: "",
    Company: "",
    Location: "",
  });
  const [popOpen, setPopOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

  // New state for profile confirmation dialog
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  const handleProfileDialogClose = () => {
    setProfileDialogOpen(false);
  };

  const handleContinueApplication = () => {
    setProfileDialogOpen(false);
    setOpen(true);
  };

  const handleUpdateProfile = () => {
    setProfileDialogOpen(false);
    // You can add navigation to profile page here if needed
    setPopup({
      open: true,
      severity: "info",
      message: "Please update your profile before applying",
    });
  };

  const handleApplyClick = () => {
    // First open the profile confirmation dialog
    setProfileDialogOpen(true);
  };

  const handleApply = () => {
    console.log(job._id);
    console.log(sop);
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        {
          sop: sop,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

  const deadline = new Date(job.deadline).toLocaleDateString();

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{job.title}</Typography>
          </Grid>
          {/* <Grid item>
              <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
            </Grid> */}
          <Grid item>Role : {job.jobType}</Grid>
          <Grid item>Salary : Ksh {job.salary} per month</Grid>
          <Grid item>
            Duration :{" "}
            {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
          </Grid>
          <Grid item>Posted By : {job.recruiter.name}</Grid>
          <Grid item>Application Deadline : {deadline}</Grid>

          <Grid item>
            {job.skillsets.map((skill) => (
              <Chip label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleApplyClick}
            disabled={userType() === "recruiter"}
          >
            Apply
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              setPopDescription({
                Title: job.title,
                Description: job.description,
                Id: job._id,
                Company: job.recruiter.name,
                Location: job.location,
              });
              setPopOpen(true);
            }}
          >
            View Details
          </Button>
        </Grid>
      </Grid>
      <PopUpDescription
        jobDetails={popDescription}
        open={popOpen}
        handleClose={() => setPopOpen(false)}
      />

      {/* Profile Confirmation Dialog */}
      <Dialog
        open={profileDialogOpen}
        onClose={handleProfileDialogClose}
        className={classes.profileDialog}
      >
        <DialogTitle>Profile Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to update your profile before applying or continue with your current profile information?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateProfile} color="primary">
            Update Profile
          </Button>
          <Button onClick={handleContinueApplication} color="primary" autoFocus>
            Continue Application
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "50%",
            alignItems: "center",
          }}
        >
          <TextField
            label="Write a cover Letter in no more than 250 words"
            multiline
            rows={8}
            style={{ width: "100%", marginBottom: "30px" }}
            variant="outlined"
            value={sop}
            onChange={(event) => {
              if (
                event.target.value.split(" ").filter(function (n) {
                  return n != "";
                }).length <= 250
              ) {
                setSop(event.target.value);
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={() => handleApply()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

export default JobTile;