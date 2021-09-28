import React, { useEffect, useState } from "react";
import {
  getColumns,
  getColumnsMapper,
  getOperationList,
} from "../api/columnsMpper";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import MapperForm from "./dialogForms/mapper/addMapperForm";
import OperationsForm from "./dialogForms/operation/addOperationsForm";

export function MapperFormComponent({setDataToApi}) {


  const [listOfColumnsMapper, setListOfColumnsMapper] = useState([]);
  const [listOfColumns, setListOfColumns] = useState([]);
  const [listOfOperation, setListOfOperation] = useState([]);
  const [value, setValue] = React.useState(null);

  const defaultPropsMapper = {
    options: listOfColumns,
    getOptionLabel: (option) => option.name,
  };

  const defaultPropsFunction = {
    options: listOfColumns,
    getOptionLabel: (option) => option.name,
  };
  const setMapperValueToColumn = async (columnName, value) => {
    let mappedListOfCoulmns = listOfColumns.map((column) => {
      if (column.name === columnName) {
        column.Mapper = value;
      }
      return column;
    });
    setListOfColumns(mappedListOfCoulmns);
    setListOfColumnsMapper(await getColumnsMapper());
  
  };
    useEffect(async () => {
    setDataToApi(listOfColumns);
  }, [listOfColumns]);

  const setOperationValueToColumn =async  (columnName, value) => {
    let mappedListOfCoulmns = listOfColumns.map((column) => {
      if (column.name === columnName) {
        column.Operation = value;
      }
      return column;
    });
    setListOfColumns(mappedListOfCoulmns);
    setListOfOperation(await getOperationList());

  };
  //   const flatProps = {
  //     options: listOfColumns.map((option) => option.title),
  //   };

  useEffect(async () => {
    setListOfColumns(await getColumns());
    setListOfColumnsMapper(await getColumnsMapper());
    setListOfOperation(await getOperationList());
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Column Name</TableCell>
            <TableCell>entity</TableCell>
            <TableCell>Column Mapper</TableCell>
            <TableCell>Function</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(listOfColumns || []).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.entity}
              </TableCell>
              <TableCell align="right">
                <MapperForm
                  column={row.name}
                  data={listOfColumnsMapper}
                  setValueToParent={setMapperValueToColumn.bind(this)}
                  label={"Mapper colum"}
                  DialogName ={"add new Mapper"}
                />
              </TableCell> 
              <TableCell align="right">
                <OperationsForm
                  column={row.name}
                  data={listOfOperation}
                  setValueToParent={setOperationValueToColumn.bind(this)}
                  label={"Function name"}
                  DialogName ={"add new operation"}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
