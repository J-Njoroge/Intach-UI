import { useContext, useEffect, useState } from "react";
import {
  Button,
  Typography,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";
import FileUploadInput from "../lib/FileUploadInput";
import DescriptionIcon from "@material-ui/icons/Description";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import VideocamIcon from "@material-ui/icons/Videocam";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import "./Profile.css";

const MultifieldInput = (props) => {
  const { education, setEducation } = props;

  return (
    <div className="multifield-container">
      {education.map((obj, key) => (
        <div key={key} className="education-row">
          <div className="institution-field">
            <TextField
              label={`Institution ${key + 1}`}
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
              fullWidth
              InputProps={{ className: "input-border" }}
            />
          </div>
          <div className="course-field">
            <TextField
              label="Course"
              value={education[key].course || ""}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].course = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
              fullWidth
              InputProps={{ className: "input-border" }}
            />
          </div>
          <div className="year-field">
            <TextField
              label="Start Year"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].startYear = event.target.value;
                setEducation(newEdu);
              }}
              fullWidth
              InputProps={{ className: "input-border" }}
            />
          </div>
          <div className="year-field">
            <TextField
              label="End Year"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].endYear = event.target.value;
                setEducation(newEdu);
              }}
              fullWidth
              InputProps={{ className: "input-border" }}
            />
          </div>
        </div>
      ))}
      <div className="add-button-container">
        <Button
          variant="contained"
          className="add-institution-button"
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                course: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
        >
          Add another institution details
        </Button>
      </div>
    </div>
  );
};

const Profile = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    contact: "",
    bio: "",
    education: [],
    skills: [],
    resume: "",
    schoolrecommendation: "",
    lecturerrecommendation: "",
    insurancecover: "",
    profile: "",
    profilevideo: "",
    experienceYear: "",
    githublink: "",
    linkedin: "",
    instagram: "",
    facebook: "",
  });

  const [education, setEducation] = useState([
    {
      institutionName: "",
      course: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProfileDetails(response.data);
        if (response.data.education.length > 0) {
          setEducation(
            response.data.education.map((edu) => ({
              institutionName: edu.institutionName ? edu.institutionName : "",
              course: edu.course ? edu.course : "",
              startYear: edu.startYear ? edu.startYear : "",
              endYear: edu.endYear ? edu.endYear : "",
            }))
          );
        }
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleUpdate = () => {
    let updatedDetails = {
      ...profileDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
    };

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
    <div className="profile-container">
      <div className="profile-card">
        <Typography variant="h4" className="profile-title">
          Profile
        </Typography>

        {/* Navigation Steps */}
        <div className="navigation-steps">
          <div className="step active">
            <div className="step-circle">1</div>
            <span className="step-label">About You</span>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <div className="step-circle">2</div>
            <span className="step-label">Education</span>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <div className="step-circle">3</div>
            <span className="step-label">Experience & Skills</span>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <div className="step-circle">4</div>
            <span className="step-label">File Upload</span>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <div className="step-circle">5</div>
            <span className="step-label">Socials</span>
          </div>
        </div>

        {/* About You Section */}
        <div className="section">
          <Typography variant="h6" className="section-title">
            About You
          </Typography>
          <TextField
            label="Full Name"
            value={profileDetails.name}
            onChange={(event) => handleInput("name", event.target.value)}
            variant="outlined"
            fullWidth
            className="input-field"
            InputProps={{ className: "input-border" }}
          />
          <TextField
            label="Contact"
            value={profileDetails.contact}
            onChange={(event) => handleInput("contact", event.target.value)}
            variant="outlined"
            fullWidth
            className="input-field"
            InputProps={{ className: "input-border" }}
          />
          <div className="upload-row">
            <FileUploadInput
              label="Profile Photo (.jpg/.png)"
              icon={<PhotoCameraIcon />}
              uploadTo={apiList.uploadProfileImage}
              handleInput={handleInput}
              identifier={"profile"}
              className="upload-field"
            />
            <FileUploadInput
              label="Profile Video (.mp4)"
              icon={<VideocamIcon />}
              uploadTo={apiList.uploadProfileVideo}
              handleInput={handleInput}
              identifier={"profilevideo"}
              className="upload-field"
            />
          </div>
          <TextField
            label="Bio"
            value={profileDetails.bio}
            onChange={(event) => handleInput("bio", event.target.value)}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            className="input-field"
            InputProps={{ className: "input-border" }}
          />
        </div>

        {/* Education Section */}
        <div className="section">
          <Typography variant="h6" className="section-title">
            Education
          </Typography>
          <MultifieldInput education={education} setEducation={setEducation} />
        </div>

        {/* Experience & Skills Section */}
        <div className="section">
          <Typography variant="h6" className="section-title">
            Experience & Skills
          </Typography>
          <TextField
            label="Experience Years"
            value={profileDetails.experienceYear}
            variant="outlined"
            type="number"
            onChange={(event) => handleInput("experienceYear", event.target.value)}
            fullWidth
            className="input-field"
            InputProps={{ className: "input-border" }}
          />
          <ChipInput
            label="Skills"
            variant="outlined"
            helperText="Press enter to add skills"
            value={profileDetails.skills}
            onAdd={(chip) =>
              setProfileDetails({
                ...profileDetails,
                skills: [...profileDetails.skills, chip],
              })
            }
            onDelete={(chip, index) => {
              let skills = profileDetails.skills;
              skills.splice(index, 1);
              setProfileDetails({
                ...profileDetails,
                skills: skills,
              });
            }}
            fullWidth
            className="chip-input"
          />
        </div>

        {/* Upload Files Section */}
        <div className="section">
          <Typography variant="h6" className="section-title">
            Upload Files
          </Typography>
          <FileUploadInput
            label="Resume (pdf form)"
            icon={<DescriptionIcon />}
            uploadTo={apiList.uploadResume}
            handleInput={handleInput}
            identifier={"resume"}
            className="upload-field-narrow"
          />
          <FileUploadInput
            label="School Recommendation (pdf form)"
            icon={<DescriptionIcon />}
            uploadTo={apiList.uploadSchoolRecommendation}
            handleInput={handleInput}
            identifier={"schoolrecommendation"}
            className="upload-field-narrow"
          />
          <FileUploadInput
            label="Insurance Cover (pdf form)"
            icon={<DescriptionIcon />}
            uploadTo={apiList.uploadInsuranceCover}
            handleInput={handleInput}
            identifier={"insurancecover"}
            className="upload-field-narrow"
          />
          <FileUploadInput
            label="Lecturer Recommendation (pdf form)"
            icon={<DescriptionIcon />}
            uploadTo={apiList.uploadLecturerRecommendation}
            handleInput={handleInput}
            identifier={"lecturerrecommendation"}
            className="upload-field-narrow"
          />
        </div>

        {/* Socials Section */}
        <div className="section">
          <Typography variant="h6" className="section-title">
            Socials
          </Typography>
          <TextField
            label="Github Link"
            value={profileDetails.githublink}
            onChange={(event) => handleInput("githublink", event.target.value)}
            variant="outlined"
            fullWidth
            className="input-field"
            InputProps={{ className: "input-border" }}
          />
          <TextField
            label="LinkedIn"
            value={profileDetails.linkedin}
            onChange={(event) => handleInput("linkedin", event.target.value)}
            variant="outlined"
            fullWidth
            className="input-field"
            InputProps={{ className: "input-border" }}
          />
          <TextField
            label="Instagram"
            value={profileDetails.instagram}
            onChange={(event) => handleInput("instagram", event.target.value)}
            variant="outlined"
            fullWidth
            className="input-field"
            InputProps={{ className: "input-border" }}
          />
          <TextField
            label="Facebook"
            value={profileDetails.facebook}
            onChange={(event) => handleInput("facebook", event.target.value)}
            variant="outlined"
            fullWidth
            className="input-field"
            InputProps={{ className: "input-border" }}
          />
        </div>

        {/* Save Button */}
        <div className="save-button-container">
          <Button
            variant="contained"
            className="save-button"
            onClick={() => handleUpdate()}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;