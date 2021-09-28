/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import {
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import { Alert } from "@material-ui/lab";
import Button from "@material-ui/core/Button";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { DialogTitle } from "@material-ui/core";
import { saveOperation } from "../../../api/columnsMpper";

const filter = createFilterOptions();

export default function OperationsForm({
  column,
  data,
  setValueToParent,
  label,
  DialogName,
}) {
  const [value, setValue] = React.useState(null);
  const [error, setError] = React.useState(false);
  const [open, toggleOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.between("md"));

  const handleClose = () => {
    setDialogValue({
      name: "",
      id: "",
    });

    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    name: "",
    id: "",
  });

  
  const handleCloseMsg = () => {
      setError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await saveOperation(dialogValue);
    let responseData = await response.json();
    setError(responseData.message); 
    if (response.status !== 201) {
      return;
    }
    setValueToParent(column,responseData.data);
    setValue({
      name: dialogValue.name,
      id: parseInt(dialogValue.id, 10) || 0,
    });

    handleClose();
  };

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={error}
        message={error}
        onClose={handleCloseMsg}
        key={"vertical" + "horizontal"}
      />
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                name: newValue,
                id: "",
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              name: newValue.inputValue,
              id: "",
            });
          } else {
            setValue(newValue);
            setValueToParent(column, newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        id="free-solo-dialog-demo"
        options={data}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(option) => option.name}
        style={{ width: 300 }}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" />
        )}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="scroll-dialog-title">{DialogName}</DialogTitle>

          <DialogContent dividers={"paper"}>
            <DialogContentText>
              pelase handel the operation by writing code over here !!
              <br />
              varabiles in use
              <ul>
                <li>
                  <strong>`value`</strong> to get the current value of column
                </li>
                <li>
                  <strong>`columnName`</strong> to get column name
                </li>
                <li>
                  <strong>`row`</strong> to get the object of row{" "}
                </li>
              </ul>
            </DialogContentText>

            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.name}
              onChange={(event) =>
                setDialogValue({ ...dialogValue, name: event.target.value })
              }
              label="Operation Name"
              type="text"
            />
            <br />

            <br />
            <Typography color="textSecondary">operation Code</Typography>
            <AceEditor
              placeholder={"place your code here !"}
              mode="javascript"
              theme="github"
              name="blah2"
              //   onLoad={this.onLoad}
              onChange={(newValue) => {
                setDialogValue({ ...dialogValue, code: newValue });
              }}
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={dialogValue.code}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
