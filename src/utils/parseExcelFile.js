import XLSX from "xlsx";

const onLoadReaderFirstRow = (reader) => {
  const fileData = reader.result;
  const wb = XLSX.read(fileData, { type: "binary" });
  const sheetName = wb.SheetNames[0];
  const rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
  return rowObj[0];
};

const onLoadReader = (reader) => {
  const fileData = reader.result;
  const wb = XLSX.read(fileData, { type: "binary" });
  const sheetName = wb.SheetNames[0];
  const rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
  return rowObj;
};

export const excelToJson = (file) => {
  try {
    const reader = new FileReader();
    reader.onload = this.onLoadReader(reader);
    reader.readAsBinaryString(file);
  } catch (e) {
    throw new Error("cant export excel", e);
  }
};

export const excelToJsonFirstRow = (file) => {
  try {
    const reader = new FileReader();
    reader.onload = this.onLoadReaderFirstRow(reader);
    reader.readAsBinaryString(file);
  } catch (e) {
    throw new Error("could read excel fiel", e);
  }
};
