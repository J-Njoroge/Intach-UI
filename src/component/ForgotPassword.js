import { useContext, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
} from "@material-ui/core";
import axios from "axios";
import { Redirect } from "react-router-dom";

import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";
import "./Login.css";

const ForgotPassword = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [loggedin, setLoggedin] = useState(isAuth());
  const [emailSent, setEmailSent] = useState(false);

  const [forgotDetails, setForgotDetails] = useState({
    email: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setForgotDetails({
      ...forgotDetails,
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

  const handleForgotPassword = () => {
    const verified = !Object.keys(inputErrorHandler).some((obj) => {
      return inputErrorHandler[obj].error;
    });

    if (verified) {
      axios
        .post(apiList.forgotPassword, forgotDetails)
        .then((response) => {
          setEmailSent(true);
          setPopup({
            open: true,
            severity: "success",
            message: "Password reset link sent to your email",
          });
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response?.data?.message || "Something went wrong",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "Please enter a valid email address",
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
              Forgot Password
            </Typography>

            {emailSent ? (
              <>
                <Typography variant="body1" className="instruction-text">
                  We've sent a password reset link to your email address.
                </Typography>
                <Typography variant="body2" className="instruction-text">
                  Please check your inbox and follow the instructions to reset your password.
                </Typography>
                <Box display="flex" justifyContent="center" className="back-to-login">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.location.href = "/login"}
                    className="back-button"
                  >
                    Back to Login
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="body1" className="instruction-text">
                  Enter your email address and we'll send you a link to reset your password.
                </Typography>

                <div className="input-group">
                  <EmailInput
                    label="Email"
                    value={forgotDetails.email}
                    onChange={(event) => handleInput("email", event.target.value)}
                    inputErrorHandler={inputErrorHandler}
                    handleInputError={handleInputError}
                    className="input-box"
                    required={true}
                  />
                </div>

                <Button
                  variant="contained"
                  className="login-button"
                  onClick={() => handleForgotPassword()}
                >
                  Send Reset Link
                </Button>

                <Box display="flex" justifyContent="center" className="back-to-login">
                  <Typography variant="body2" className="signup-link">
                    Remember your password? <a href="/login">Login here</a>
                  </Typography>
                </Box>
              </>
            )}
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

export default ForgotPassword;