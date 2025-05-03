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
import ChipInput from "material-ui-chip-input";

import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";


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
}));

const FilterPopupTraining = (props) => {
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
              
              
            </Grid>
            <Grid container item alignItems="center">
              
            </Grid>
            <Grid container item alignItems="center">
              <Grid item xs={3}>
                Duration (in Months)
              </Grid>
              <Grid item xs={9}>
                <TextField
                  select
                  label="Duration"
                  variant="outlined"
                  fullWidth
                  value={searchOptions.duration}
                  onChange={(event) =>
                    setSearchOptions({
                      ...searchOptions,
                      duration: event.target.value,
                    })
                  }
                >
                    
                  <MenuItem value="0" >All</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="6">6</MenuItem>
                  <MenuItem value="7">7</MenuItem>
                  
                </TextField>
              </Grid>
                    </Grid>
                    <Grid item>
                <ChipInput
                  className={classes.inputBox}
                  label="Skills"
                  variant="outlined"
                  helperText="Press enter to add skills"
                  value={searchOptions.skills}
                  onAdd={(chip) =>
                    setSearchOptions({
                      ...searchOptions,
                      skills: [...searchOptions.skills, chip],
                    })
                  }
                  onDelete={(chip, index) => {
                    let skills = searchOptions.skills;
                    skills.splice(index, 1);
                    setSearchOptions({
                      ...searchOptions,
                      skills: skills,
                    });
                  }}
                  fullWidth
                />
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
                      name="duration"
                      checked={searchOptions.sort.duration.status}
                      onChange={(event) =>
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            duration: {
                              ...searchOptions.sort.duration,
                              status: event.target.checked,
                            },
                          },
                        })
                      }
                      id="duration"
                    />
                  </Grid>
                  <Grid item>
                    <label for="duration">
                      <Typography>Duration</Typography>
                    </label>
                  </Grid>
                  <Grid item>
                    <IconButton
                      disabled={!searchOptions.sort.duration.status}
                      onClick={() => {
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            duration: {
                              ...searchOptions.sort.duration,
                              desc: !searchOptions.sort.duration.desc,
                            },
                          },
                        });
                      }}
                    >
                      {searchOptions.sort.duration.desc ? (
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
  
export default FilterPopupTraining;