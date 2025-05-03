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
import { useHistory } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import { SetPopupContext } from "../../App";

import apiList, {server} from "../../lib/apiList";
import "./MyJobs.css";

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
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
}));

const JobTile = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const { job, getData, profileDetails } = props;
  const setPopup = useContext(SetPopupContext);


  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [jobDetails, setJobDetails] = useState(job);

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleClick = (location) => {
    history.push(location);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleDelete = () => {
    axios
      .delete(`${apiList.jobs}/${job._id}`, {
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
        getData();
        handleClose();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

  const handleJobUpdate = () => {
    axios
      .put(`${apiList.jobs}/${job._id}`, jobDetails, {
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
        getData();
        handleCloseUpdate();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleCloseUpdate();
      });
  };

  const postedOn = new Date(job.dateOfPosting);

  return (
    <Paper className="job-tile" elevation={3}>
      <Grid container spacing={2} alignItems="center">
        {/* Job Details */}
        <Grid item xs={12} container spacing={1}>
          <Grid item container alignItems="center">
            <Grid item xs={6} container alignItems="center">
              {console.log("profileDetails", profileDetails)}
              <div className="logo-placeholder">
                <img src={`${server}${profileDetails.companyLogo}`} width={20} height={20}/>
              </div>
              <Typography variant="subtitle2" className="company-name">

                {profileDetails?profileDetails.companyName:"Tech Corp"}
              </Typography>
            </Grid>
            <Grid item xs={6} container justifyContent="flex-end" alignItems="center">
              <Typography variant="body2" className="date-posting">
                Date Posted: {postedOn.toLocaleDateString()}
              </Typography>
              <Button
                variant="contained"
                className="edit-button"
                onClick={() => setOpenUpdate(true)}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                className="delete-button"
                onClick={() => setOpen(true)}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h5" className="job-title">
              {job.title}
            </Typography>
          </Grid>
          <Grid item className="job-details-row">
            <Typography variant="body1" className="job-detail">
              ROLE: {job.jobType}
            </Typography>
            <Typography variant="body1" className="job-detail">
              SALARY: Ksh {job.salary} /month
            </Typography>
            <Typography variant="body1" className="job-detail">
              DURATION: {job.duration !== 0 ? `${job.duration} months` : `Flexible`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" className="job-description">
              {job.description}
            </Typography>
          </Grid>
          <Grid item>
            {job.skillsets.map((skill) => (
              <Chip key={skill} label={skill} className="skill-chip" />
            ))}
          </Grid>
          <Grid item className="applicants-location-row">
            <Typography variant="body2" className="rating-text">
              Rating: <Rating value={job.rating !== -1 ? job.rating : null} readOnly size="small" />
            </Typography>
            <Typography variant="body2" className="applicants-info">
              NUMBER OF APPLICANTS: {job.maxApplicants}
            </Typography>
            <Typography variant="body2" className="applicants-info">
              REMAINING NUMBER OF POSITIONS: {job.maxPositions - job.acceptedCandidates}
            </Typography>
            <Typography variant="body2" className="location-info">
              LOCATION: {profileDetails.location}
            </Typography>
            <Button
              variant="contained"
              className="view-applications-button"
              onClick={() => handleClick(`/job/applications/${job._id}`)}
            >
              View Applicants
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* Delete Confirmation Modal */}
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper className="modal-paper">
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Are you sure?
          </Typography>
          <Grid container justifyContent="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleDelete()}
              >
                Delete
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>

      {/* Update Job Modal */}
      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
        className={classes.popupDialog}
      >
        <Paper className="modal-paper">
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Update Details
          </Typography>
          <Grid container direction="column" spacing={3} style={{ margin: "10px" }}>
            <Grid item>
              <TextField
                label="Application Deadline"
                type="datetime-local"
                value={jobDetails.deadline.substr(0, 16)}
                onChange={(event) => handleInput("deadline", event.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Maximum Number Of Applicants"
                type="number"
                variant="outlined"
                value={jobDetails.maxApplicants}
                onChange={(event) => handleInput("maxApplicants", event.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Positions Available"
                type="number"
                variant="outlined"
                value={jobDetails.maxPositions}
                onChange={(event) => handleInput("maxPositions", event.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleJobUpdate()}
              >
                Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleCloseUpdate()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </Paper>
  );
};

const FilterPopup = (props) => {
  const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Paper className="filter-modal">
        <Grid container direction="column" alignItems="center" spacing={3}>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Job Type
            </Grid>
            <Grid container item xs={9} justifyContent="space-around">
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="fullTime"
                      checked={searchOptions.jobType.fullTime}
                      onChange={(event) =>
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Full Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="partTime"
                      checked={searchOptions.jobType.partTime}
                      onChange={(event) =>
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Part Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="wfh"
                      checked={searchOptions.jobType.wfh}
                      onChange={(event) =>
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Work From Home"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Salary
            </Grid>
            <Grid item xs={9}>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => value * (100000 / 100)}
                marks={[{ value: 0, label: "0" }, { value: 100, label: "100000" }]}
                value={searchOptions.salary}
                onChange={(event, value) =>
                  setSearchOptions({ ...searchOptions, salary: value })
                }
              />
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Duration
            </Grid>
            <Grid item xs={9}>
              <TextField
                select
                label="Duration"
                variant="outlined"
                fullWidth
                value={searchOptions.duration}
                onChange={(event) =>
                  setSearchOptions({ ...searchOptions, duration: event.target.value })
                }
              >
                <MenuItem value="0">All</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Sort
            </Grid>
            <Grid item container direction="row" xs={9}>
              <Grid
                item
                container
                xs={4}
                justifyContent="space-around"
                alignItems="center"
                className="sort-option"
              >
                <Grid item>
                  <Checkbox
                    name="salary"
                    checked={searchOptions.sort.salary.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="salary"
                  />
                </Grid>
                <Grid item>
                  <label htmlFor="salary">
                    <Typography>Salary</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.salary.status}
                    onClick={() =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            desc: !searchOptions.sort.salary.desc,
                          },
                        },
                      })
                    }
                  >
                    {searchOptions.sort.salary.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justifyContent="space-around"
                alignItems="center"
                className="sort-option"
              >
                <Grid item>
                  <Checkbox
                    name="duration"
                    checked={searchOptions.sort.duration.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="duration"
                  />
                </Grid>
                <Grid item>
                  <label htmlFor="duration">
                    <Typography>Duration</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.duration.status}
                    onClick={() =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            desc: !searchOptions.sort.duration.desc,
                          },
                        },
                      })
                    }
                  >
                    {searchOptions.sort.duration.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justifyContent="space-around"
                alignItems="center"
                className="sort-option"
              >
                <Grid item>
                  <Checkbox
                    name="rating"
                    checked={searchOptions.sort.rating.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="rating"
                  />
                </Grid>
                <Grid item>
                  <label htmlFor="rating">
                    <Typography>Rating</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.rating.status}
                    onClick={() =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            desc: !searchOptions.sort.rating.desc,
                          },
                        },
                      })
                    }
                  >
                    {searchOptions.sort.rating.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => getData()}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

const MyJobs = (props) => {
  const [jobs, setJobs] = useState([]);
  const [profileDetails, setProfileDetails] = useState({})
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: { status: false, desc: false },
      duration: { status: false, desc: false },
      rating: { status: false, desc: false },
    },
  });

  const setPopup = useContext(SetPopupContext);

  useEffect(() => {
    getData();
    getRecruiterProfile();
  }, []);

  const getData = () => {
    let searchParams = [`myjobs=1`];
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
    if (searchOptions.salary[0] !== 0) {
      searchParams = [...searchParams, `salaryMin=${searchOptions.salary[0] * 1000}`];
    }
    if (searchOptions.salary[1] !== 100) {
      searchParams = [...searchParams, `salaryMax=${searchOptions.salary[1] * 1000}`];
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
        setJobs(response.data);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };
  const getRecruiterProfile = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const data = response.data;
        setProfileDetails({
          companyName: data.name || "",
          companyDescription: data.bio || "",
          contactNumber: data.contactNumber || "",
          location: data.location || "",
          industrySector: data.industrySector || "",
          companyUrl: data.companyUrl || "",
          companyLogo: data.companyLogo || null,
        });
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
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs>
            <Typography variant="h2" className="page-title">
              My Jobs
            </Typography>
          </Grid>
          <Grid item xs>
            <TextField
              label="Search Jobs"
              value={searchOptions.query}
              onChange={(event) =>
                setSearchOptions({ ...searchOptions, query: event.target.value })
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
              className="search-bar"
              variant="outlined"
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
            jobs.map((job) => <JobTile key={job._id} job={job} getData={getData} profileDetails={profileDetails} />)
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

export default MyJobs;