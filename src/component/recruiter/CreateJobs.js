import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Modal,
  Paper,
  makeStyles,
  TextField,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    maxWidth: "700px", // Reduced width of the floating form
    width: "100%",
    margin: "0 auto", // Center the form
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)", // Softer shadow for elegance
    backgroundColor: "#fff", // Clean white background
  },
  inputField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px", // Rounded corners
      backgroundColor: "#f9f9f9", // Light background for elegance
      transition: "all 0.3s ease", // Smooth transition on focus
      "&:hover": {
        backgroundColor: "#f0f0f0", // Slightly darker on hover
      },
      "&.Mui-focused": {
        backgroundColor: "#fff", // White background when focused
        boxShadow: "0 0 5px rgba(0, 123, 255, 0.3)", // Subtle shadow on focus
      },
      "& fieldset": {
        borderColor: "#ddd", // Lighter border
      },
    },
    "& .MuiInputLabel-outlined": {
      color: "#666", // Softer label color
      fontWeight: 500,
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "#3f51b5", // Match primary color on focus
    },
  },
  chipInput: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#f0f0f0",
      },
      "&.Mui-focused": {
        backgroundColor: "#fff",
        boxShadow: "0 0 5px rgba(0, 123, 255, 0.3)",
      },
      "& fieldset": {
        borderColor: "#ddd",
      },
    },
    "& .MuiInputLabel-outlined": {
      color: "#666",
      fontWeight: 500,
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "#3f51b5",
    },
  },
  createButton: {
    background: "linear-gradient(135deg, #3f51b5 0%, #6fcfd6 100%)", // Gradient background
    color: "white",
    padding: "10px 50px",
    borderRadius: "8px",
    textTransform: "none",
    fontSize: "16px",
    fontWeight: 500,
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #2c3e9b 0%, #5ab8c1 100%)", // Darker gradient on hover
      transform: "translateY(-2px)", // Slight lift effect
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Shadow on hover
    },
  },
  heading: {
    color: "#4B0082", // Darker shade of purple for "Add Job"
    fontWeight: "bold",
  },
}));

const CreateJobs = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    responsibilities: "",
    experience: "",
    skillsets: [],
    jobType: "Full Time",
    duration: 0,
    salary: 0,
    deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 16),
    maxApplicants: 100,
    maxPositions: 30,
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    console.log(jobDetails);
    axios
      .post(apiList.jobs, jobDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        setJobDetails({
          title: "",
          description: "",
          responsibilities: "",
          experience: "",
          skillsets: [],
          jobType: "Full Time",
          duration: 0,
          salary: 0,
          deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .substr(0, 16),
          maxApplicants: 100,
          maxPositions: 30,
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
  };

  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh", width: "" }}
      >
        <Grid item>
          <Typography variant="h2" className={classes.heading}>
            Add Job
          </Typography>
        </Grid>
        <Grid item container xs direction="column" justify="center">
          <Grid item>
            <Paper className={classes.paper}>
              <Grid
                container
                direction="column"
                alignItems="stretch"
                spacing={3}
              >
                {/* Job Title */}
                <Grid item>
                  <TextField
                    label="Job Title"
                    value={jobDetails.title}
                    onChange={(event) =>
                      handleInput("title", event.target.value)
                    }
                    variant="outlined"
                    className={classes.inputField}
                    fullWidth
                  />
                </Grid>

                {/* Job Description */}
                <Grid item>
                  <TextField
                    label="Job Description"
                    multiline
                    rows={4}
                    type="text"
                    variant="outlined"
                    value={jobDetails.description}
                    onChange={(event) =>
                      handleInput("description", event.target.value)
                    }
                    className={classes.inputField}
                    fullWidth
                  />
                </Grid>

                {/* Responsibilities */}
                <Grid item>
                  <TextField
                    label="Responsibilities"
                    multiline
                    rows={4}
                    type="text"
                    variant="outlined"
                    value={jobDetails.responsibilities}
                    onChange={(event) =>
                      handleInput("responsibilities", event.target.value)
                    }
                    className={classes.inputField}
                    fullWidth
                  />
                </Grid>

                {/* Experience */}
                <Grid item>
                  <TextField
                    label="Experience"
                    type="number"
                    variant="outlined"
                    value={jobDetails.experience}
                    onChange={(event) =>
                      handleInput("experience", event.target.value)
                    }
                    className={classes.inputField}
                    fullWidth
                  />
                </Grid>

                {/* Skills */}
                <Grid item>
                  <ChipInput
                    label="Skills"
                    variant="outlined"
                    helperText="Press enter to add skills"
                    value={jobDetails.skillsets}
                    onAdd={(chip) =>
                      setJobDetails({
                        ...jobDetails,
                        skillsets: [...jobDetails.skillsets, chip.trim()],
                      })
                    }
                    onDelete={(chip, index) => {
                      let skillsets = jobDetails.skillsets;
                      skillsets.splice(index, 1);
                      setJobDetails({
                        ...jobDetails,
                        skillsets: skillsets,
                      });
                    }}
                    className={classes.chipInput}
                    fullWidth
                  />
                </Grid>

                {/* Job Type */}
                <Grid item>
                  <TextField
                    select
                    label="Job Type"
                    variant="outlined"
                    value={jobDetails.jobType}
                    onChange={(event) => {
                      handleInput("jobType", event.target.value);
                    }}
                    className={classes.inputField}
                    fullWidth
                  >
                    <MenuItem value="Full Time">Full Time</MenuItem>
                    <MenuItem value="Part Time">Part Time</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                  </TextField>
                </Grid>

                {/* Job Duration */}
                <Grid item>
                  <TextField
                    select
                    label="Job Duration"
                    variant="outlined"
                    value={jobDetails.duration}
                    onChange={(event) => {
                      handleInput("duration", event.target.value);
                    }}
                    className={classes.inputField}
                    fullWidth
                  >
                    <MenuItem value={0}>Flexible</MenuItem>
                    <MenuItem value={1}>1 Month</MenuItem>
                    <MenuItem value={2}>2 Months</MenuItem>
                    <MenuItem value={3}>3 Months</MenuItem>
                    <MenuItem value={4}>4 Months</MenuItem>
                    <MenuItem value={5}>5 Months</MenuItem>
                    <MenuItem value={6}>6 Months</MenuItem>
                    <MenuItem value={7}>6 Months & Above</MenuItem>
                  </TextField>
                </Grid>

                {/* Salary */}
                <Grid item>
                  <TextField
                    label="Salary"
                    type="number"
                    variant="outlined"
                    value={jobDetails.salary}
                    onChange={(event) => {
                      handleInput("salary", event.target.value);
                    }}
                    InputProps={{ inputProps: { min: 0 } }}
                    className={classes.inputField}
                    fullWidth
                  />
                </Grid>

                {/* Application Deadline */}
                <Grid item>
                  <TextField
                    label="Application Deadline"
                    type="datetime-local"
                    value={jobDetails.deadline}
                    onChange={(event) => {
                      handleInput("deadline", event.target.value);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    className={classes.inputField}
                    fullWidth
                  />
                </Grid>

                {/* Maximum Number of Applicants */}
                <Grid item>
                  <TextField
                    label="Maximum Number Of Applicants"
                    type="number"
                    variant="outlined"
                    value={jobDetails.maxApplicants}
                    onChange={(event) => {
                      handleInput("maxApplicants", event.target.value);
                    }}
                    InputProps={{ inputProps: { min: 1 } }}
                    className={classes.inputField}
                    fullWidth
                  />
                </Grid>

                {/* Positions Available */}
                <Grid item>
                  <TextField
                    label="Positions Available"
                    type="number"
                    variant="outlined"
                    value={jobDetails.maxPositions}
                    onChange={(event) => {
                      handleInput("maxPositions", event.target.value);
                    }}
                    InputProps={{ inputProps: { min: 1 } }}
                    className={classes.inputField}
                    fullWidth
                  />
                </Grid>

                {/* Create Job Button */}
                <Grid
                  item
                  container
                  justifyContent="center"
                  alignItems="center"
                  style={{ marginTop: "30px" }}
                >
                  <Button
                    variant="contained"
                    className={classes.createButton}
                    onClick={() => handleUpdate()}
                  >
                    Create Job
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateJobs;