import { useContext, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
} from "@material-ui/core";
import axios from "axios";
import { Redirect } from "react-router-dom";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";
import "./Login.css";

const Login = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [loggedin, setLoggedin] = useState(isAuth());

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setLoginDetails({
      ...loginDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const verified = !Object.keys(inputErrorHandler).some((obj) => {
      return inputErrorHandler[obj].error;
    });
    if (verified) {
      axios
        .post(apiList.login, loginDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
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
    <div className="login-container">
      <div className="login-box">
        <div>
          {/* Left Side: Form */}
          <Grid item xs={12} md={6} className="form-section">
            <Typography variant="h4" className="welcome-text">
              Welcome back!
            </Typography>

            <div className="input-group">
              <EmailInput
                label="Email"
                value={loginDetails.email}
                onChange={(event) => handleInput("email", event.target.value)}
                inputErrorHandler={inputErrorHandler}
                handleInputError={handleInputError}
                className="input-box"
                required={true}
              />
            </div>

            <div className="input-group">
              <PasswordInput
                label="Password"
                value={loginDetails.password}
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
            </div>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              className="remember-forgot-container"
            >
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Remember me"
                className="remember-me"
              />
              <Typography variant="body2" className="forgot-password">
                <a href="/forgot-password">Forgot your password?</a>
              </Typography>
            </Box>

            <Button
              variant="contained"
              className="login-button"
              onClick={() => handleLogin()}
            >
              Log in
            </Button>

            <Box display="flex" justifyContent="center" className="signup-link-container">
              <Typography variant="body2" className="signup-link">
                Don't have an account? <a href="/signup">Register here</a>
              </Typography>
            </Box>
          </Grid>
        </div>

        <div>
          {/* Right Side: Image */}
          <div className="image-section">
            <img
              src="https://ik.imagekit.io/patricode/sample-folder/HomePage%20img_bqkAZWxb6.png"
              alt="Working Woman"
              className="login-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;