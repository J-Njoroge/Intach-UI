import { useContext, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
} from "@material-ui/core";
import axios from "axios";
import { Redirect, useParams } from "react-router-dom";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";
import "./Login.css";

const ResetPassword = (props) => {
  const { token } = useParams(); // token from URL
  const setPopup = useContext(SetPopupContext);
  const [loggedin, setLoggedin] = useState(isAuth());

  const [resetDetails, setResetDetails] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    newPassword: {
      error: false,
      message: "",
    },
    confirmPassword: {
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setResetDetails({
      ...resetDetails,
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

  const handleResetPassword = () => {
    const { newPassword, confirmPassword } = resetDetails;

    if (newPassword !== confirmPassword) {
      setPopup({
        open: true,
        severity: "error",
        message: "Passwords do not match",
      });
      return;
    }

    if (newPassword.length < 6) {
      setPopup({
        open: true,
        severity: "error",
        message: "Password must be at least 6 characters",
      });
      return;
    }

    axios
      .post(`${apiList.resetPassword}/${token}`, { newPassword })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: "Password reset successfully. Please login with your new password.",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000); // redirect after 2 seconds
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Something went wrong",
        });
      });
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
              Reset Password
            </Typography>

            <Typography variant="body1" className="instruction-text">
              Enter your new password below.
            </Typography>

            <div className="input-group">
              <TextField
                label="New Password"
                variant="outlined"
                fullWidth
                type="password"
                value={resetDetails.newPassword}
                onChange={(e) => handleInput("newPassword", e.target.value)}
                error={inputErrorHandler.newPassword.error}
                helperText={inputErrorHandler.newPassword.message}
                className="input-box"
                required
              />
            </div>

            <div className="input-group">
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                type="password"
                value={resetDetails.confirmPassword}
                onChange={(e) => handleInput("confirmPassword", e.target.value)}
                error={inputErrorHandler.confirmPassword.error}
                helperText={inputErrorHandler.confirmPassword.message}
                className="input-box"
                required
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              className="login-button"
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>

            <Box display="flex" justifyContent="center" className="back-to-login">
              <Typography variant="body2" className="signup-link">
                Remembered your password? <a href="/login">Login here</a>
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

export default ResetPassword;
