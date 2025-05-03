import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import VisibilityIcon from "@material-ui/icons/Visibility";
import BookmarkIcon from "@material-ui/icons/Bookmark";

import { SetPopupContext } from "../App";
import apiList, { server } from "../lib/apiList";
import FilterPopup from "./FilterPopup";
import "./Home.css";

const JobTile = (props) => {
  let history = useHistory();
  const { job } = props;
  const setPopup = useContext(SetPopupContext);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const handleProfileDialogClose = () => {
    setProfileDialogOpen(false);
  };

  const handleContinueApplication = () => {
    setProfileDialogOpen(false);
    applyForJob();
  };

  const handleUpdateProfile = () => {
    setProfileDialogOpen(false);
    setPopup({
      open: true,
      severity: "info",
      message: "Please update your profile before applying",
    });
    // You can add navigation to profile page here if needed
    history.push('/profile');
  };

  const handleApply = () => {
    setProfileDialogOpen(true);
  };

  const applyForJob = () => {
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        {},
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
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  const handleSave = () => {
    axios
      .post(
        apiList.saveJob,
        {
          jobId: job._id,
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
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  const handleViewDetails = () => {
    history.push(`/job/${job._id}`);
  };

  const deadline = new Date(job.deadline);

  return (
    <div className="job-tile">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} container spacing={1}>
          {/* Top Row: Logo, Company Name, Application Deadline, View Details, Save */}
          <Grid item container alignItems="center">
            <Grid item xs={6} container alignItems="center">
              <div className="logo-placeholder">
                <img
                  src={`${server}${job.recruiter.companyLogo}`}
                  alt="Company Logo"
                  className="company-logo"
                  width={20}
                  height={20}
                />
              </div>
              <Typography variant="subtitle2" className="company-name">
                {job.recruiter.name}
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              container
              justifyContent="flex-end"
              alignItems="center"
            >
              <Typography variant="body2" className="deadline">
                Application Deadline: {deadline.toLocaleDateString()}
              </Typography>
              <div className="button-group">
                <Button
                  variant="contained"
                  className="view-details-button"
                  onClick={handleViewDetails}
                  startIcon={<VisibilityIcon />}
                >
                  View Details
                </Button>
                <Button
                  variant="contained"
                  className="save-button"
                  onClick={handleSave}
                  startIcon={<BookmarkIcon />}
                >
                  Save
                </Button>
              </div>
            </Grid>
          </Grid>
          {/* Job Title */}
          <Grid item>
            <Typography variant="h5" className="job-title">
              {job.title}
            </Typography>
          </Grid>
          {/* Role, Salary, Duration */}
          <Grid item className="job-details-row">
            <Typography variant="body1" className="job-detail">
              ROLE: {job.jobType}
            </Typography>
            <Typography variant="body1" className="job-detail">
              SALARY: Ksh {job.salary} /month
            </Typography>
            <Typography variant="body1" className="job-detail">
              DURATION:{" "}
              {job.duration !== 0 ? `${job.duration} months` : `Flexible`}
            </Typography>
          </Grid>
          {/* Job Description */}
          <Grid item>
            <Typography variant="body2" className="job-description">
              {job.description}
            </Typography>
          </Grid>
          {/* Skills */}
          <Grid item>
            {job.skillsets.map((skill) => (
              <Chip key={skill} label={skill} className="skill-chip" />
            ))}
          </Grid>
          {/* Rating, Applicants, Positions, Location, Apply Button */}
          <Grid item className="applicants-location-row">
            <Typography variant="body2" className="rating-text">
              Rating:{" "}
              <Rating
                value={job.rating !== -1 ? job.rating : null}
                readOnly
                size="small"
              />
            </Typography>
            <Typography variant="body2" className="applicants-info">
              NUMBER OF APPLICANTS: {job.maxApplicants}
            </Typography>
            <Typography variant="body2" className="applicants-info">
              REMAINING NUMBER OF POSITIONS:{" "}
              {job.maxPositions - job.acceptedCandidates}
            </Typography>
            <Typography variant="body2" className="location-info">
              LOCATION: {job.recruiter.location}
            </Typography>
            <Button
              variant="contained"
              className="apply-button"
              onClick={handleApply}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* Profile Confirmation Dialog */}
      <Dialog open={profileDialogOpen} onClose={handleProfileDialogClose}>
        <DialogTitle>Profile Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to update your profile before applying or continue with
            your current profile information?
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
    </div>
  );
};

const Home = (props) => {
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
      mentor: false,
    },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: { status: false, desc: false },
      duration: { status: false, desc: false },
      rating: { status: false, desc: false },
    },
    skills: [],
  });

  const setPopup = useContext(SetPopupContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    if (searchOptions.jobType.fullTime) {
      searchParams = [...searchParams, `jobType=Full%20Time`];
    }
    if (searchOptions.jobType.partTime) {
      searchParams = [...searchParams, `jobType=Part%20Time`];
    }
    if (searchOptions.jobType.wfh) {
      searchParams = [...searchParams, `jobType=Work%20From%20Home`];
    }
    if (searchOptions.jobType.mentor) {
      searchParams = [...searchParams, `jobType=Mentor`];
    }
    if (searchOptions.skills.length > 0) {
      searchParams = [...searchParams, `skill=${searchOptions.skills.join(",")}`];
    }
    if (searchOptions.salary[0] !== 0) {
      searchParams = [
        ...searchParams,
        `salaryMin=${searchOptions.salary[0] * 1000}`,
      ];
    }
    if (searchOptions.salary[1] !== 100) {
      searchParams = [
        ...searchParams,
        `salaryMax=${searchOptions.salary[1] * 1000}`,
      ];
    }
    if (searchOptions.duration !== "0") {
      searchParams = [...searchParams, `duration=${searchOptions.duration}`];
    }

    let asc = [],
      desc = [];
    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    let address = apiList.jobs;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setJobs(
          response.data.filter((obj) => {
            const today = new Date();
            const deadline = new Date(obj.deadline);
            return deadline > today;
          })
        );
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
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid item container direction="column" alignItems="center">
          <Grid item xs>
            <Typography
              variant="h2"
              style={{ fontFamily: "Open Sans" }}
              className="page-title"
            >
              Jobs
            </Typography>
          </Grid>
          <Grid item xs>
            <TextField
              label="Search Jobs"
              value={searchOptions.query}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  query: event.target.value,
                })
              }
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getData();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => getData()}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ width: "500px" }}
              variant="outlined"
              className="search-bar"
            />
          </Grid>
          <Grid item>
            <IconButton onClick={() => setFilterOpen(true)}>
              <FilterListIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          {jobs.length > 0 ? (
            jobs.map((job) => <JobTile key={job._id} job={job} />)
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              No jobs found
            </Typography>
          )}
        </Grid>
      </Grid>
      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
    </>
  );
};

export default Home;