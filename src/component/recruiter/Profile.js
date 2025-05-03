import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Modal,
  Paper,
  makeStyles,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";
import "./Profile.css";
import FileUploadInput from "../../lib/FileUploadInput";
import FaceIcon from "@material-ui/icons/Face";

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
}));

const Profile = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [profileDetails, setProfileDetails] = useState({
    companyName: "",
    companyDescription: "",
    contactNumber: "",
    location: "",
    industrySector: "",
    companyUrl: "",
    companyLogo: "",
  });

  const [phone, setPhone] = useState("");

  const industrySectors = [
    "Technology",
    "Medicine",
    "Agriculture",
    "Retail",
    "Mechatronics",
    "Aviation",
    "Hospitality",
    "Tourism",
    "Wildlife",
  ];

  const handleInput = (key, value) => {
    console.log("key:", key)
    console.log("value:", value)
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  const handleFileInput = (key, file) => {
    setProfileDetails({
      ...profileDetails,
      [key]: file,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
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
        setPhone(data.contactNumber || "");
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const handleUpdate = () => {
    if (profileDetails.companyLogo){
      console.log("profile details")
    }
    let updatedDetails = {
      name: profileDetails.companyName,
      bio: profileDetails.companyDescription,
      contactNumber: phone ? `+${phone}` : "",
      location: profileDetails.location,
      industrySector: profileDetails.industrySector,
      companyUrl: profileDetails.companyUrl,
      companyLogo: profileDetails.companyLogo

    };

    console.log(updatedDetails)

    axios
      .put(apiList.user, updatedDetails, {
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

  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid item>
          <Typography variant="h2" className="page-title">
            Profile
          </Typography>
        </Grid>
        <Grid item xs style={{ width: "100%", maxWidth: "800px" }}>
          <Paper className="profile-form">
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} sm={6} container direction="column" spacing={3}>
                <Grid item>
                  <TextField
                    label="Company Name"
                    value={profileDetails.companyName}
                    onChange={(event) => handleInput("companyName", event.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Location"
                    value={profileDetails.location}
                    onChange={(event) => handleInput("location", event.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Company Description (upto 250 words)"
                    multiline
                    rows={8}
                    variant="outlined"
                    value={profileDetails.companyDescription}
                    onChange={(event) => {
                      if (
                        event.target.value.split(" ").filter((n) => n !== "").length <= 250
                      ) {
                        handleInput("companyDescription", event.target.value);
                      }
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
              {/* Right Column */}
              <Grid item xs={12} sm={6} container direction="column" spacing={3}>
                <Grid item>
                <FileUploadInput
                  className={classes.inputBox}
                  label="Company logo(.jpg/.png)"
                  icon={<FaceIcon />}
                  uploadTo={apiList.uploadProfileImage}
                  handleInput={handleInput}
                  identifier={"companyLogo"}
                />
              </Grid>
                <Grid item>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Industry Sector</InputLabel>
                    <Select
                      value={profileDetails.industrySector}
                      onChange={(event) => handleInput("industrySector", event.target.value)}
                      label="Industry Sector"
                    >
                      {industrySectors.map((sector) => (
                        <MenuItem key={sector} value={sector}>
                          {sector}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <TextField
                    label="Company Website (URL)"
                    value={profileDetails.companyUrl}
                    onChange={(event) => handleInput("companyUrl", event.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <PhoneInput
                    country={"ke"}
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    style={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ textAlign: "center", marginTop: "30px" }}>
              <Button
                variant="contained"
                color="primary"
                className="save-button"
                onClick={() => handleUpdate()}
              >
                Save
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;