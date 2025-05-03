import { Grid, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./Welcome.css";
import welcomeImage from '../component/images/welcome.png';

const Welcome = (props) => {
  return (
    <div className="welcome-container">
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        className="welcome-content"
      >
        <Grid item xs={12} md={6} className="image-section">
          <img
            src={welcomeImage}
            alt="Welcome Illustration"
            className="welcome-image"
          />
        </Grid>

        <Grid item xs={12} md={6} className="text-section">
          <Typography variant="h2" className="main-heading">
            WELCOME TO INTACH
          </Typography>
          <Typography variant="body1" className="sub-heading">
            Bridging talent with opportunity !
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/signup"
            className="get-started-button"
          >
            Get Started
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export const ErrorPage = (props) => {
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography
          variant="h2"
          style={{
            color: "black",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(99, 57, 97, 0.25)",
          }}
        >
          Error 404
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;