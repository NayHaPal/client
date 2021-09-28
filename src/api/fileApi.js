import axios from "axios";
import API from "../constant";

export const UploadFile = (file) => {
  var data = new FormData();
  data.append("file", file);
  data.append("data", "data");
  return fetch(API.UPLOAD_FILE, {
    method: "POST",
    body: data,
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      Error("error while upload file", e);
      return null;
    });
};

export const uploadChunks = async (url, data, headers) => {
  return await axios.post(url, data, { headers }).then((response) => {
    return response;
  });
};
