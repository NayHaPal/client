import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { UploaderWithChunkesComponent } from "../component/chunkesUploader/UploaderWithChunkesComponen";
import { makeStyles } from "@material-ui/styles";
import { startProcessing } from "../api/proccingApi";
import { MapperFormComponent } from "../component/MapperFormComponent";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export function ChunksUploadPages({ fileCompleted }) {
  const [filePatientName, setFilePatientName] = useState(null);
  const [fileTreatmentName, setFileTreatmentName] = useState(null);
  const [dataToApi, setDataToApi] = useState([]);
  const [error, setError] = useState(false);
  const [state, setState] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const classes = useStyles();

  const sendFiles = async () => {
    console.log("sendFile", filePatientName, fileTreatmentName);
    if (filePatientName && fileTreatmentName) {
      const response = await startProcessing({
        name:
          filePatientName.originalFileName +
          " - " +
          fileTreatmentName.originalFileName,
        patientFile: filePatientName.fileName,
        tretmentFile: fileTreatmentName.fileName,
        mapperObject: dataToApi,
      });
      let responseData = await response.json();
      setError(responseData.message);
      if (response.status !== 201) {
        return;
      }
      setFilePatientName(null);
      setFileTreatmentName(null);
    }
  };
  const handleClick = (newState) => () => {
    setState({ open: true, ...newState });
  };

  const handleClose = () => {
    setError(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={error}
        onClose={handleClose}
        message={error}
        key={vertical + horizontal}
      />
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography className={classes.pos} color="textSecondary">
                Patietn File
              </Typography>
              <UploaderWithChunkesComponent
                singleFile={true}
                setFileFinalName={(data) => {
                  setFilePatientName(data);
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography className={classes.pos} color="textSecondary">
                Tretment File
              </Typography>
              <UploaderWithChunkesComponent
                singleFile={true}
                setFileFinalName={(data) => {
                  setFileTreatmentName(data);
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <br />
      {filePatientName && fileTreatmentName ? (
        <MapperFormComponent setDataToApi={setDataToApi} />
      ) : (
        ""
      )}
      <br />
      <Button
        variant="contained"
        onClick={sendFiles.bind(this)}
        disabled={!filePatientName || !fileTreatmentName}
        color="primary"
      >
        add Process To Queue
      </Button>
    </div>
  );
}
