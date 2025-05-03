import { useState, useContext } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import { Redirect, Link } from "react-router-dom"; // Added Link for navigation
import ChipInput from "material-ui-chip-input";
import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";
import "./Signup.css"; // Import the CSS file

const SignUp = () => {
  const setPopup = useContext(SetPopupContext);
  const [loggedin, setLoggedin] = useState(isAuth());

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    skills: [],
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: { untouched: true, required: true, error: false, message: "" },
    password: { untouched: true, required: true, error: false, message: "" },
    name: { untouched: true, required: true, error: false, message: "" },
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: { required: true, untouched: false, error: status, message },
    });
  };

  const handleLogin = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    const verified = !Object.keys(tmpErrorHandler).some(
      (obj) => tmpErrorHandler[obj].error
    );

    if (verified) {
      axios
        .post(apiList.signup, signupDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Signed up successfully",
          });
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <div className="signup-container">
      <Paper elevation={3} className="signup-form">
        <Grid container direction="column" spacing={4} alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h2">
              Sign Up
            </Typography>
            <Typography variant="subtitle1" className="subheading">
              Fill the form below to create your account
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              select
              label="Category"
              variant="outlined"
              className="input-box"
              value={signupDetails.type}
              onChange={(event) => handleInput("type", event.target.value)}
            >
              <MenuItem value="applicant">Applicant</MenuItem>
              <MenuItem value="recruiter">Recruiter</MenuItem>
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              label="Name"
              value={signupDetails.name}
              onChange={(event) => handleInput("name", event.target.value)}
              className="input-box"
              error={inputErrorHandler.name.error}
              helperText={inputErrorHandler.name.message}
              onBlur={(event) => {
                if (event.target.value === "") {
                  handleInputError("name", true, "Name is required");
                } else {
                  handleInputError("name", false, "");
                }
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <EmailInput
              label="Email"
              value={signupDetails.email}
              onChange={(event) => handleInput("email", event.target.value)}
              inputErrorHandler={inputErrorHandler}
              handleInputError={handleInputError}
              className="input-box"
              required={true}
            />
          </Grid>
          <Grid item>
            <PasswordInput
              label="Password"
              value={signupDetails.password}
              onChange={(event) => handleInput("password", event.target.value)}
              className="input-box"
              error={inputErrorHandler.password.error}
              helperText={inputErrorHandler.password.message}
              onBlur={(event) => {
                if (event.target.value === "") {
                  handleInputError("password", true, "Password is required");
                } else {
                  handleInputError("password", false, "");
                }
              }}
            />
          </Grid>
          {/* Conditionally render Skills field only for applicant */}
          {signupDetails.type === "applicant" && (
            <Grid item>
              <ChipInput
                className="input-box"
                label="Skills"
                variant="outlined"
                helperText="Press enter to add skills"
                onChange={(chips) => handleInput("skills", chips)}
              />
            </Grid>
          )}
          <Grid item>
            <Button
              variant="contained"
              onClick={handleLogin}
              className="submit-button"
            >
              Sign Up
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="body2" className="login-link">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default SignUp;