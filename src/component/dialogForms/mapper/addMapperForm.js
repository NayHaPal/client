/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { DialogTitle, Snackbar, SnackbarContent } from '@material-ui/core';
import { saveCloum } from '../../../api/columnsMpper';

const filter = createFilterOptions(); 

export default function MapperForm({column,data,setValueToParent,label,DialogName}) {
  const [value, setValue] = React.useState(null);
  const [open, toggleOpen] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleClose = () => {
    setDialogValue({
      name: '',
      id: '',
    });

    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    name: '',
    id: '',
  });

  const handleSubmit = async (event) => {

    event.preventDefault();

    const response = await saveCloum(dialogValue);
    let responseData = await response.json();
    setError(responseData.message); 
    if (response.status !== 201) {
      return;
    }
    setValueToParent(column,responseData.data);
   setValue({
      name: dialogValue.name,
      id: parseInt(dialogValue.id, 10),
    });

    handleClose();
  };
const handleCloseMsg = () => {
      setError(false);
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
          if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                name: newValue,
                id: '',
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              name: newValue.inputValue,
              id: '',
            });
          } else {
            setValue(newValue);
            setValueToParent(column,newValue)
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== '') {
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
          if (typeof option === 'string') {
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
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-name">
        <form onSubmit={handleSubmit}>
          <DialogTitle  id="form-dialog-name">{DialogName}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              pelase add mapper to pointer  <strong> `{column}` </strong> column in provided a sheet.
            </DialogContentText>
        
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.name}
              onChange={(event) => setDialogValue({ ...dialogValue, name: event.target.value })}
              label="name"
              type="text"
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

