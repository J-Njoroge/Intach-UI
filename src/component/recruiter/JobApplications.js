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
  Avatar,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import InstagramIcon from '@material-ui/icons/Instagram';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

import { SetPopupContext } from "../../App";

import apiList, { server } from "../../lib/apiList";
import "./JobApplications.css";

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
  avatar: {
    width: theme.spacing(17),
    height: theme.spacing(17),
  },
}));

const FilterPopup = (props) => {
  const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
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
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Application Status
            </Grid>
            <Grid
              container
              item
              xs={9}
              justify="space-around"
              alignItems="center"
            >
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rejected"
                      checked={searchOptions.status.rejected}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          status: {
                            ...searchOptions.status,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Rejected"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="applied"
                      checked={searchOptions.status.applied}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          status: {
                            ...searchOptions.status,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Applied"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="shortlisted"
                      checked={searchOptions.status.shortlisted}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          status: {
                            ...searchOptions.status,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Shortlisted"
                />
              </Grid>
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
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="name"
                    checked={searchOptions.sort["jobApplicant.name"].status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          "jobApplicant.name": {
                            ...searchOptions.sort["jobApplicant.name"],
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="name"
                  />
                </Grid>
                <Grid item>
                  <label htmlFor="name">
                    <Typography>Name</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort["jobApplicant.name"].status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          "jobApplicant.name": {
                            ...searchOptions.sort["jobApplicant.name"],
                            desc: !searchOptions.sort["jobApplicant.name"].desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort["jobApplicant.name"].desc ? (
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
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="dateOfApplication"
                    checked={searchOptions.sort.dateOfApplication.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          dateOfApplication: {
                            ...searchOptions.sort.dateOfApplication,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="dateOfApplication"
                  />
                </Grid>
                <Grid item>
                  <label htmlFor="dateOfApplication">
                    <Typography>Date of Application</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.dateOfApplication.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          dateOfApplication: {
                            ...searchOptions.sort.dateOfApplication,
                            desc: !searchOptions.sort.dateOfApplication.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.dateOfApplication.desc ? (
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
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="rating"
                    checked={searchOptions.sort["jobApplicant.rating"].status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          "jobApplicant.rating": {
                            ...searchOptions.sort[["jobApplicant.rating"]],
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
                    disabled={!searchOptions.sort["jobApplicant.rating"].status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          "jobApplicant.rating": {
                            ...searchOptions.sort["jobApplicant.rating"],
                            desc: !searchOptions.sort["jobApplicant.rating"]
                              .desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort["jobApplicant.rating"].desc ? (
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

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application, getData } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);

  const appliedOn = new Date(application.dateOfApplication);

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

  const getResume = () => {
    if (
      application.jobApplicant.resume &&
      application.jobApplicant.resume !== ""
    ) {
      const address = `${server}${application.jobApplicant.resume}`;
      axios(address, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          setPopup({
            open: true,
            severity: "error",
            message: "Error",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No resume found",
      });
    }
  };

  const getSchoolRecommendation = () => {
    if (
      application.jobApplicant.schoolrecommendation &&
      application.jobApplicant.schoolrecommendation !== ""
    ) {
      const address = `${server}${application.jobApplicant.schoolrecommendation}`;
      axios(address, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          setPopup({
            open: true,
            severity: "error",
            message: "Error",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No school recommendation found",
      });
    }
  };

  const getLecturerRecommendation = () => {
    if (
      application.jobApplicant.lecturerrecommendation &&
      application.jobApplicant.lecturerrecommendation !== ""
    ) {
      const address = `${server}${application.jobApplicant.lecturerrecommendation}`;
      axios(address, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          setPopup({
            open: true,
            severity: "error",
            message: "Error",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No lecturer recommendation found",
      });
    }
  };

  const getInsurancePolicy = () => {
    if (
      application.jobApplicant.insurancecover &&
      application.jobApplicant.insurancecover !== ""
    ) {
      const address = `${server}${application.jobApplicant.insurancecover}`;
      axios(address, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          setPopup({
            open: true,
            severity: "error",
            message: "Error",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No insurance policy found",
      });
    }
  };

  const getProfileVideo = () => {
    if (
      application.jobApplicant.profilevideo &&
      application.jobApplicant.profilevideo !== ""
    ) {
      const address = `${server}${application.jobApplicant.profilevideo}`;
      axios(address, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const file = new Blob([response.data], { type: "video/mp4" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          setPopup({
            open: true,
            severity: "error",
            message: "Error",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No profile video found",
      });
    }
  };

  const updateStatus = (status) => {
    const address = `${apiList.applications}/${application._id}`;
    const statusData = {
      status: status,
      dateOfJoining: new Date().toISOString(),
    };
    axios
      .put(address, statusData, {
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
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  const buttonSet = {
    applied: (
      <>
        <Button
          className={classes.statusBlock}
          style={{
            background: colorSet["shortlisted"],
            color: "#ffffff",
          }}
          onClick={() => updateStatus("shortlisted")}
        >
          Shortlist
        </Button>
        <Button
          className={classes.statusBlock}
          style={{
            background: colorSet["rejected"],
            color: "#ffffff",
          }}
          onClick={() => updateStatus("rejected")}
        >
          Reject
        </Button>
      </>
    ),
    shortlisted: (
      <>
        <Button
          className={classes.statusBlock}
          style={{
            background: colorSet["accepted"],
            color: "#ffffff",
          }}
          onClick={() => updateStatus("accepted")}
        >
          Accept
        </Button>
        <Button
          className={classes.statusBlock}
          style={{
            background: colorSet["rejected"],
            color: "#ffffff",
          }}
          onClick={() => updateStatus("rejected")}
        >
          Reject
        </Button>
      </>
    ),
    rejected: (
      <Paper
        className={classes.statusBlock}
        style={{
          background: colorSet["rejected"],
          color: "#ffffff",
        }}
      >
        Rejected
      </Paper>
    ),
    accepted: (
      <Paper
        className={classes.statusBlock}
        style={{
          background: colorSet["accepted"],
          color: "#ffffff",
        }}
      >
        Accepted
      </Paper>
    ),
    cancelled: (
      <Paper
        className={classes.statusBlock}
        style={{
          background: colorSet["cancelled"],
          color: "#ffffff",
        }}
      >
        Cancelled
      </Paper>
    ),
    finished: (
      <Paper
        className={classes.statusBlock}
        style={{
          background: colorSet["finished"],
          color: "#ffffff",
        }}
      >
        Finished
      </Paper>
    ),
  };

  return (
    <>
      <Paper className={`${classes.jobTileOuter} application-tile`} elevation={3}>
        <Grid container spacing={2} className="application-tile-content">
          <Grid container item xs={12} justify="center">
            <Grid item xs={12}>
              <div className="columns-container">
                {/* Left Div */}
                <div className="left-div">
                  <div className="avatar-container">
                    <Avatar
                      src={`${server}${application.jobApplicant.profile}`}
                      className={`${classes.avatar} applicant-avatar`}
                    />
                  </div>
                  <Typography variant="h5" className="applicant-name">
                    {application.jobApplicant.name}
                  </Typography>
                  <Rating
                    value={
                      application.jobApplicant.rating !== -1
                        ? application.jobApplicant.rating
                        : null
                    }
                    readOnly
                    className="rating-stars"
                  />
                  <div className="status-button">
                    {buttonSet[application.status]}
                  </div>
                  <Typography className="applied-date">
                    Applied on: {appliedOn.toLocaleDateString()}
                  </Typography>
                  <div className="bio-section">
                    <Typography className="section-title">Bio</Typography>
                    <Typography className="section-content">
                      {application.sop !== "" ? application.sop : "Not Submitted"}
                    </Typography>
                  </div>
                  <div className="education-section">
                    <Typography className="section-title">Education</Typography>
                    <Typography className="section-content">
                      {application.jobApplicant.education
                        .map((edu) => {
                          return `${edu.institutionName} (${edu.startYear}-${
                            edu.endYear ? edu.endYear : "Ongoing"
                          })`;
                        })
                        .join(", ")}
                    </Typography>
                  </div>
                  <div className="skills-section">
                    <Typography className="section-title">Skills</Typography>
                    <div className="skills-container">
                      {application.jobApplicant.skills.map((skill) => (
                        <Chip key={skill} label={skill} className="skill-chip" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Div */}
                <div className="right-div">
                  <video controls className="profile-video">
                    <source src={`${server}${application.jobApplicant.profilevideo}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="download-section">
                    <Typography className="download-title">Download or View Files</Typography>
                    <div className="download-buttons">
                      <Button
                        variant="contained"
                        className="gradient-button"
                        onClick={() => getResume()}
                      >
                        Resume
                      </Button>
                      <Button
                        variant="contained"
                        className="gradient-button"
                        onClick={() => getSchoolRecommendation()}
                      >
                        School Recommendation
                      </Button>
                      <Button
                        variant="contained"
                        className="gradient-button"
                        onClick={() => getLecturerRecommendation()}
                      >
                        Lecturer Recommendation
                      </Button>
                      <Button
                        variant="contained"
                        className="gradient-button"
                        onClick={() => getInsurancePolicy()}
                      >
                        Insurance Cover
                      </Button>
                      <Button
                        variant="contained"
                        className="gradient-button"
                        onClick={() => getProfileVideo()}
                      >
                        Profile Video
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>

          {/* Footer: Social Icons */}
          <Grid item xs={12}>
            <div className="social-icons">
              {application.jobApplicant.instagram && (
                <a href={application.jobApplicant.instagram} target="_blank" rel="noopener noreferrer">
                  <IconButton>
                    <InstagramIcon />
                  </IconButton>
                </a>
              )}
              {application.jobApplicant.linkedin && (
                <a href={application.jobApplicant.linkedin} target="_blank" rel="noopener noreferrer">
                  <IconButton>
                    <LinkedInIcon />
                  </IconButton>
                </a>
              )}
              {application.jobApplicant.githublink && (
                <a href={application.jobApplicant.githublink} target="_blank" rel="noopener noreferrer">
                  <IconButton>
                    <GitHubIcon />
                  </IconButton>
                </a>
              )}
            </div>
          </Grid>
        </Grid>
      </Paper>

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
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </>
  );
};

const JobApplications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);
  const { jobId } = useParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    status: {
      all: false,
      applied: false,
      shortlisted: false,
    },
    sort: {
      "jobApplicant.name": {
        status: false,
        desc: false,
      },
      dateOfApplication: {
        status: true,
        desc: true,
      },
      "jobApplicant.rating": {
        status: false,
        desc: false,
      },
    },
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [];

    if (searchOptions.status.rejected) {
      searchParams = [...searchParams, `status=rejected`];
    }
    if (searchOptions.status.applied) {
      searchParams = [...searchParams, `status=applied`];
    }
    if (searchOptions.status.shortlisted) {
      searchParams = [...searchParams, `status=shortlisted`];
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
    let address = `${apiList.applicants}?jobId=${jobId}`;
    if (queryString !== "") {
      address = `${address}&${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setApplications(response.data);
        response.data.map((obj) => {
          axios
            .get(`${apiList.user}/${obj.jobApplicant.userId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((response) => {});
        });
      })
      .catch((err) => {
        setApplications([]);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
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
        style={{ padding: "0px", minHeight: "93vh" }}
      >
        <Grid item>
          <Typography variant="h2">Applicants</Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={() => setFilterOpen(true)}>
            <FilterListIcon />
          </IconButton>
        </Grid>
        <Grid
          container
          item
          xs
          direction="column"
          style={{ width: "100%" }}
          alignItems="stretch"
          justify="center"
        >
          {applications.length > 0 ? (
            applications.map((obj) => (
              <Grid item key={obj._id}>
                <ApplicationTile application={obj} getData={getData} />
              </Grid>
            ))
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              No Applications Found
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

export default JobApplications;