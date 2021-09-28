import { Button, Grid, Paper } from "@material-ui/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getColumnsMapper } from "../api/columnsMpper";
import { UploadFile } from "../api/fileApi";
import { validateCoulmns } from "../BLogic/validateUploadedFile";
import { excelToJsonFirstRow } from "../utils/parseExcelFile";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function FileUpload() {
  const [paientsFile, setPaientsFile] = useState(null);
  const [tretmentsFile, setTretmentsFile] = useState(null);



  const sendFiles = () => {
    console.log("sendFile", paientsFile, tretmentsFile);
    if (paientsFile && tretmentsFile) {
      setPaientsFile(null);
      setTretmentsFile(null);
    }
  };
  const onDrop = useCallback( async acceptedFiles => {
    validateCoulmns(excelToJsonFirstRow(acceptedFiles[0]),getColumnsMapper())
    let data = await UploadFile(acceptedFiles[0])
    if(data){
      setPaientsFile(data.FileName);
    }
    console.log(acceptedFiles)
  }, [])
  const onDropTretment = useCallback( async acceptedFiles => {
    let data = await UploadFile(acceptedFiles[0])
    if(data){
      setTretmentsFile(data.FileName);
    }
    console.log(acceptedFiles,"tretment")
  }, [])

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: ".csv",
    preventDropOnDocument: false,
    onDrop,
  });

  const {
    acceptedFiles: acceptedFilesTradment,
    getRootProps: getRootPropsTradment,
    getInputProps: getInputPropsTradment,
  } = useDropzone({
    accept: ".csv",
    onDrop:onDropTretment,
    preventDropOnDocument: true,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );
  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const acceptedFileItemsTradment = acceptedFilesTradment.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div {...getRootProps({ style})}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
            <em>(Only Excel (.cvs) file will be accepted)</em>
            <aside>
              <h4>Patient file</h4>
              <ul>{acceptedFileItems}</ul>
            </aside>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div {...getRootPropsTradment({style})}>
            <input {...getInputPropsTradment()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
            <em>(Only Excel (.cvs) file will be accepted)</em>
            <aside>
              <h4>Tredment file</h4>
              <ul>{acceptedFileItemsTradment}</ul>
            </aside>
          </div>
        </Grid>
      </Grid>
      <br />
      <Button
        variant="contained"
        onClick={sendFiles.bind(this)}
        disabled={!paientsFile || !tretmentsFile}
        color="primary"
      >
        Upload File
      </Button>
    </>
  );
}

export default FileUpload;
