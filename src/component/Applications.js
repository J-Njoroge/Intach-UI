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
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import { SetPopupContext } from "../App";
import apiList, {server} from "../lib/apiList";
import "./Applications.css";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = () => {
    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRating(response.data.rating);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, jobId: application.job._id },
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
          message: "Rating updated successfully",
        });
        fetchRating();
        setOpen(false);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        fetchRating();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  return (
    <div className="job-tile">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} container spacing={1}>
          {/* Top Row: Logo, Company Name, Applied On, Status */}
          <Grid item container alignItems="center">
            <Grid item xs={6} container alignItems="center">
              <div className="logo-placeholder">
                <img src={`${server} ${application.recruiter.companyLogo}`} alt="Company Logo" className="company-logo" width={20} height={20} />
              </div>
              <Typography variant="subtitle2" className="company-name">
                {application.recruiter.name}
              </Typography>
            </Grid>
            <Grid item xs={6} container justifyContent="flex-end" alignItems="center">
              <Typography variant="body2" className="applied-on">
                Applied On: {appliedOn.toLocaleDateString()}
              </Typography>
              <div className="status-container">
                <Paper
                  className={classes.statusBlock}
                  style={{
                    background: colorSet[application.status],
                    color: "#ffffff",
                  }}
                >
                  {application.status}
                </Paper>
              </div>
            </Grid>
          </Grid>
          {/* Job Title */}
          <Grid item>
            <Typography variant="h5" className="job-title">
              {application.job.title}
            </Typography>
          </Grid>
          {/* Role, Salary, Duration */}
          <Grid item className="job-details-row">
            <Typography variant="body1" className="job-detail">
              ROLE: {application.job.jobType}
            </Typography>
            <Typography variant="body1" className="job-detail">
              SALARY: Ksh {application.job.salary} /month
            </Typography>
            <Typography variant="body1" className="job-detail">
              DURATION: {application.job.duration !== 0 ? `${application.job.duration} months` : `Flexible`}
            </Typography>
          </Grid>
          {/* Job Description */}
          <Grid item>
            <Typography variant="body2" className="job-description">
              {application.job.description}
            </Typography>
          </Grid>
          {/* Skills */}
          <Grid item>
            {application.job.skillsets.map((skill) => (
              <Chip key={skill} label={skill} className="skill-chip" />
            ))}
          </Grid>
          {/* Rating, Applicants, Positions, Location, Joined On, Rate Job Button */}
          <Grid item className="applicants-location-row">
            <Typography variant="body2" className="rating-text">
              Rating: <Rating value={application.job.rating !== -1 ? application.job.rating : null} readOnly size="small" />
            </Typography>
            <Typography variant="body2" className="applicants-info">
              NUMBER OF APPLICANTS: {application.job.maxApplicants}
            </Typography>
            <Typography variant="body2" className="applicants-info">
              REMAINING NUMBER OF POSITIONS: {application.job.maxPositions - application.job.acceptedCandidates}
            </Typography>
            <Typography variant="body2" className="location-info">
              LOCATION: {application.recruiter.location}
            </Typography>
            {application.status === "accepted" || application.status === "finished" ? (
              <Typography variant="body2" className="joined-on">
                Joined On: {joinedOn.toLocaleDateString()}
              </Typography>
            ) : null}
            {application.status === "accepted" || application.status === "finished" ? (
              <Button
                variant="contained"
                color="primary"
                className="rate-button"
                onClick={() => {
                  fetchRating();
                  setOpen(true);
                }}
              >
                Rate Job
              </Button>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Rating
            name="simple-controlled"
            style={{ marginBottom: "30px" }}
            value={rating === -1 ? null : rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={() => changeRating()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

const Applications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setApplications(response.data);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2" className="page-title">
          My Applications
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs
        direction="column"
        style={{ width: "100%" }}
        alignItems="center"
        justify="center"
      >
        {applications.length > 0 ? (
          applications.map((obj) => (
            <Grid item key={obj._id}>
              <ApplicationTile application={obj} />
            </Grid>
          ))
        ) : (
          <Typography variant="h5" style={{ textAlign: "center" }}>
            No Applications Found
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Applications;