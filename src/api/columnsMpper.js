import axios from "axios";
import API from "../constant";

export const getColumnsMapper = async () => {
  try {
    let data = await fetch(API.GET_MAPED_COLUMS);
    data = await data.json();
    return data;
  } catch (e) {
    Error("error while upload file", e);
    return [];
  }
};

export const getColumns = async () => {
  try {
    let data = await fetch(API.GET_COLUMS);
    data = await data.json();
    return data;
  } catch (e) {
    Error("error while upload file", e);
    return [];
  }
};

export const getOperationList = async () => {
  try {
    let data = await fetch(API.GET_OPRATIONS);
    data = await data.json();
    return data;
  } catch (e) {
    Error("error while getting opration", e);
    return [];
  }
};

export const saveOperation = async (data) => {
  try {
    let response = await fetch(API.PSOT_OPERATION,{method: 'POST', body: JSON.stringify(data) });
    // response = await response.json();
    return response;
  } catch (e) {
    Error("error while add operation", e);
    return [];
  }
}
  export const saveCloum = async (data) => {
  try {
    let response = await fetch(API.PSOT_COLUMN,{method: 'POST', body: JSON.stringify(data) });
    // response = await response.json();
    return response;
  } catch (e) {
    Error("error while add column", e);
    return [];
  }
};
