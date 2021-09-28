import axios from "axios";
import API from "../constant";

// export const startProcessing = async (data) => {
//   let response = await axios.post(API.PROCESS, data);
//   return response;
// };


  export const startProcessing = async (data) => {
  try {
    let response = await fetch(API.PROCESS,{method: 'POST', body: JSON.stringify(data) });
    return response;
  } catch (e) {
    Error("error while add column", e);
    return [];
  }
};