import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import isAuth, { userType } from "../lib/isAuth";
import axios from "axios";
import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    height: "40px", // Adjust the height as needed
  },
}));

const Navbar = (props) => {
  const classes = useStyles();
  let history = useHistory();

  const isPremium = () => {
    axios
      .post(
        apiList.isPremium,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((response) => {
            localStorage.setItem("paid", response.data.isPremium);
        })
  }

  const handleClick = (location) => {
    console.log(location);
    history.push(location);
  };
  
    const upgrade = () => {
    
    }

  return (
    <AppBar position="fixed">
      <Toolbar
        style={{
          backgroundColor: "#23074D",
        }}
      >
        <img src="https://ik.imagekit.io/patricode/sample-folder/intech_UvnSojJZM.jpg" alt="Logo" className={classes.logo} />
        <div className={classes.title}></div> {/* Keeps the buttons aligned to the right */}
        {isAuth() ? (
          userType() === "recruiter" ? (
            <>
              <Button color="inherit" onClick={() => handleClick("/addjob")}>
                Add Jobs
              </Button>
              <Button color="inherit" onClick={() => handleClick("/myjobs")}>
                My Jobs
              </Button>
              <Button color="inherit" onClick={() => handleClick("/employees")}>
                Accepted Applications
              </Button>

              <Button color="inherit" onClick={() => handleClick("/profile")}>
                Profile
              </Button>
              <Button style={{backgroundColor: "blue"}} color="inherit" onClick={() => handleClick("/payment")}>
                Upgrade
              </Button>
              <Button color="inherit" onClick={() => handleClick("/logout")}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => handleClick("/home")}>
                Home
              </Button>
              <Button color="inherit" onClick={() => handleClick("/recommendedjobs")}>
                Recommended Jobs
              </Button>
              <Button
                color="inherit"
                onClick={() => handleClick("/applications")}
              >
                Applications
              </Button>
              <Button
                color="inherit"
                onClick={() => handleClick("/saved-jobs")}
              >
                SavedJobs
              </Button>
              <Button color="inherit" onClick={() => handleClick("/profile")}>
                Profile
              </Button>
              {console.log("paid: ", localStorage.getItem("paid"))}
              {
                !localStorage.getItem("paid") ? (
              <Button style={{backgroundColor: "blue"}} color="inherit" onClick={() => handleClick("/payment")}>
                Upgrade
              </Button>):
                <Button style={{backgroundColor: "blue"}} color="inherit">
                    PREMIUM
                </Button>
              }
              <Button color="inherit" onClick={() => handleClick("/logout")}>
                Logout
              </Button>
            </>
          )
        ) : (
          <>
            <Button color="inherit" onClick={() => handleClick("/login")}>
              Login
            </Button>
            <Button color="inherit" onClick={() => handleClick("/signup")}>
              Signup
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
