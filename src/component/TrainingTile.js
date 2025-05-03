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

import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";

import PopUpDescriptionTraining from "./TrainingInfo";
import FilterPopup from "./FilterPopup";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  button: {
    width: "100%",
    height: "40%",
    margin: "10%",
    padding: "20%",
  },
  trainingTileOuter: {
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
}));

const TrainingTile = (props) => {
  const classes = useStyles();
  const { training } = props;
  const setPopup = useContext(SetPopupContext);
  const [popDescription, setPopDescription] = useState({
    Title: "",
    Description: "",
    Location: "",
    Duration: "",
    Link: "",
  });
  const [popOpen, setPopOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  // const deadline = new Date(training.deadline).toLocaleDateString();

  return (
    <Paper className={classes.trainingTileOuter} elevation={3}>
      <Grid container>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{training.title}</Typography>
          </Grid>
          {/* <Grid item>
              <Rating value={training.rating !== -1 ? training.rating : null} readOnly />
            </Grid> */}
          <Grid item>Title : {training.title}</Grid>

          <Grid item>
            Duration :{" "}
            {training.duration !== 0
              ? `${training.duration} month`
              : `Flexible`}
          </Grid>

          <Grid item>Link : {training.link}</Grid>
          <Grid item>Location : {training.location}</Grid>

          <Grid item>
            {training.skills.map((skill) => (
              <Chip label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
        </Grid>
        {/* <Grid item xs={3}>

          <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                
              }}
              
              
            >
              Completed
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                setPopDescription({
                  Title: training.title,
                  Description: training.description,
                  Location: training.location,
                  Link: training.link,
                  Duration: training.duration,
                });
                setPopOpen(true);
              }}
              
              
            >
              View Details
            </Button>
            
          </Grid> */}
      </Grid>
      <PopUpDescriptionTraining
        trainingDetails={popDescription}
        open={popOpen}
        handleClose={() => setPopOpen(false)}
      />
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "50%",
            alignItems: "center",
          }}
        >
          <TextField
            label="Write SOP (upto 250 words)"
            multiline
            rows={8}
            style={{ width: "100%", marginBottom: "30px" }}
            variant="outlined"
            value={sop}
            onChange={(event) => {
              if (
                event.target.value.split(" ").filter(function (n) {
                  return n != "";
                }).length <= 250
              ) {
                setSop(event.target.value);
              }
            }}
          />
          {/* <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => handleApply()}
            >
              Submit
            </Button> */}
        </Paper>
      </Modal>
    </Paper>
  );
};

export default TrainingTile;
