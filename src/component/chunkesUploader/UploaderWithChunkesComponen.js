import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./chunkesUploader.css";
import API from "../../constant";
import {
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { uploadChunks } from "../../api/fileApi";

const chunkSize = 10 * 1024;

export function UploaderWithChunkesComponent({ setFileFinalName, singleFile }) {
  const [dropzoneActive, setDropzoneActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(null);

  function handleDrop(e) {
    e.preventDefault();
    if (singleFile) {
      if (files.length >= 1) {
        return;
      }
    }
    setFiles([...files, ...e.dataTransfer.files]);
  }

  const clearFiles = () => {
    setFiles([]);
    setFileFinalName(null);
    setDropzoneActive(false);
    setCurrentFileIndex(null);
    setCurrentChunkIndex(null);
    setLastUploadedFileIndex(null);
  };

  const readAndUploadCurrentChunk = useCallback(() => {
    const reader = new FileReader();
    const file = files[currentFileIndex];
    if (!file) {
      return;
    }
    const from = currentChunkIndex * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = (e) => uploadChunk(e);
    reader.readAsDataURL(blob);
  }, [currentChunkIndex, files, currentFileIndex]);

  async function uploadChunk(readerEvent) {
    const file = files[currentFileIndex];
    const data = readerEvent.target.result;
    const params = new URLSearchParams();
    params.set("name", file.name);
    params.set("size", file.size);
    params.set("currentChunkIndex", currentChunkIndex);
    params.set("totalChunks", Math.ceil(file.size / chunkSize));
    const headers = { "Content-Type": "application/octet-stream" };
    const url = API.UPLOAD_FILE + "?" + params.toString();
    let response = await uploadChunks(url, data, headers);
    const filesize = files[currentFileIndex].size;
    const chunks = Math.ceil(filesize / chunkSize) - 1;
    const isLastChunk = currentChunkIndex === chunks;
    if (isLastChunk) {
      file.finalFilename = response.data.finalFilename;
      setFileFinalName({originalFileName:file.name,fileName:response.data.finalFilename});
      setLastUploadedFileIndex(currentFileIndex);
      setCurrentChunkIndex(null);
    } else {
      setCurrentChunkIndex(currentChunkIndex + 1);
    }
  }

  useEffect(() => {
    if (lastUploadedFileIndex === null) {
      return;
    }
    const isLastFile = lastUploadedFileIndex === files.length - 1;
    const nextFileIndex = isLastFile ? null : currentFileIndex + 1;
    setCurrentFileIndex(nextFileIndex);
  }, [lastUploadedFileIndex]);

  useEffect(() => {
    if (files.length > 0) {
      if (currentFileIndex === null) {
        setCurrentFileIndex(
          lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
        );
      }
    }
  }, [files.length]);

  useEffect(() => {
    if (currentFileIndex !== null) {
      setCurrentChunkIndex(0);
    }
  }, [currentFileIndex]);

  useEffect(() => {
    if (currentChunkIndex !== null) {
      readAndUploadCurrentChunk();
    }
  }, [currentChunkIndex, readAndUploadCurrentChunk]);

  return (
    <div className={"uploader-area"}>
      <div style={{ clear: "both" }}></div>
      <div
        onDragOver={(e) => {
          setDropzoneActive(true);
          e.preventDefault();
        }}
        onDragLeave={(e) => {
          setDropzoneActive(false);
          e.preventDefault();
        }}
        className={"dropzone-z" + (dropzoneActive ? " active" : "")}
        onDrop={(e) => handleDrop(e)}
      >
        Drop your files here
      </div>
      <div className="files">
        {files.map((file, fileIndex) => {
          let progress = 0;
          if (file.finalFilename) {
            progress = 100;
          } else {
            const uploading = fileIndex === currentFileIndex;
            const chunks = Math.ceil(file.size / chunkSize);
            if (uploading) {
              progress = Math.round((currentChunkIndex / chunks) * 100);
            } else {
              progress = 0;
            }
          }
          return (
            <>
              <Typography color="textSecondary">
                {file.name}
                <IconButton onClick={clearFiles.bind(this)} aria-label="delete">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
            </>
          );
        })}
      </div>
    </div>
  );
}
