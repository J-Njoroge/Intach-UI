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


import FilterPopupTraining from "./FilterPopupTraining";
import TrainingTile from "./TrainingTile";


import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";


const Training = (props) => {
  const [training, setTraining] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    duration: "0",
    sort: {
      duration: {
        status: false,
        desc: false,
      },
      },
    skills: [],
  });
  

  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    
    if (searchOptions.duration != "0") {
      searchParams = [...searchParams, `duration=${searchOptions.duration}`];
      }
      if (searchOptions.skills.length > 0) {
        searchParams = [...searchParams, `skill=${searchOptions.skills.join(",")}`];
      }

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = apiList.training;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setTraining(
          response.data.filter((obj) => {
           
            return true;
          })
          
        );
        console.log(training);
      })
      .catch((err) => {
        console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
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
        <Grid
          item
          container
          direction="column"
          // justify="center"
          alignItems="center"
        >
          <Grid item xs>
            <Typography variant="h2" font-family="Open Sans">
              Trainings
            </Typography>
          </Grid>
          <Grid item xs>
            <TextField
              label="Search Trainings"
              value={searchOptions.query}
              // style={{ maxLength: "10px" }}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  query: event.target.value,
                })
              }
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getData();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => getData()}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ width: "500px" }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <IconButton onClick={() => setFilterOpen(true)}>
              <FilterListIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs
          direction="column"
          alignItems="stretch"
          justify="center"
        >
          {training.length > 0 ? (
            training.map((job) => {
              return <TrainingTile training={job} />;
            })
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              No Training found
            </Typography>
          )}
        </Grid>
        {/* <Grid item>
          <Pagination count={10} color="primary" />
        </Grid> */}
      </Grid>
      <FilterPopupTraining
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
      
    </>
  );
};

export default Training;
