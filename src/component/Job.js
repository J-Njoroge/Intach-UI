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
} from "@material-ui/core";

import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";

import PopUpDescription from "./jobInfo";
import FilterPopup from "./FilterPopup";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";
import {useParams} from "react-router-dom";

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

const Job = () => {
  const classes = useStyles();
  const {jobId} = useParams();
  const [job, setJob] = useState({
    name: "",
    description: "",
    jobType: "",
    salary: "",
    duration: "",
    skillsets: [],
    recruiter: {
      name: "",
    },
    location: "",
    deadline: "",
    rating: -1,
    _id: "",
    applications: [],
    companyName: "",
    companyDescription: "",
    contactNumber: "",
  });
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

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  const getData=()=>{
    const address = `${apiList.jobs}/${jobId}`;
    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setJob(response.data);
      })
      .catch((err) => {
        console.log(err.response);
        // console.log(err.response.data);
        setJob({});
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  }

  useEffect(()=>{
    getData()
  }, [])

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

          <Grid item>Application Deadline : {deadline}</Grid>

          <Grid item>
            {job.skillsets.map((skill) => (
              <Chip label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
          <Grid item>Job Description</Grid>
          <Grid item>{job.description}</Grid>
        </Grid>
        <Grid item xs={1} style={{ height: "50px"}}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              setOpen(true);
            }}
            disabled={userType() === "recruiter"}
          >
            Apply
          </Button>
           {/*<Button
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
          </Button>*/}
        </Grid>
      </Grid>
      <PopUpDescription
        jobDetails={popDescription}
        open={popOpen}
        handleClose={() => setPopOpen(false)}
      />
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

export default Job;
