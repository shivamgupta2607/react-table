import React, { useState } from "react";
import "./CustomTableComponent.scss"
import { generateSampleData } from "../../util/genUtil";
import { Table, TableHead, TableRow, TableBody, TableCell, Box, Popover, Button, TextField, Select, MenuItem, Chip, Icon } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';

import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import AddColumnDialogue from '../add-column-dialogue/AddColumnDialogue'

export default function CustomTableComponent() {
  const [dataState, setDataState] = useState(generateSampleData(10));
  const [editCellValue, setEditCellValue] = useState('');
  const [columnCounter, setColumnCounter] = useState(1);
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null,
    colKey: null
  });

  const onEdit = (rowId, colId, cellValue) => {
    if (inEditMode.status === false) {
      setInEditMode({
        status: true,
        rowKey: rowId,
        colKey: colId
      })
      setEditCellValue(cellValue)
    }
  }

  const handleOnSelect = (event, row_index, column_name) => {
    updateEditModeAndSaveData(event, row_index, column_name)
  }

  const handleOnAddNewLookup = (event, row_index, column_name) => {
    disableEditMode()
    let savedValue = event.target.value
    setDataState((data) => {
      let newStateCols = data.columns
      let changedColumn = newStateCols.find((col) => col.name === column_name)
      let newId;
      if (changedColumn.lookup.find((l) => l.title === savedValue) == null) {
        newId = randomInteger();
        changedColumn.lookup = changedColumn.lookup.concat({ id: newId, title: savedValue })
      } else {
        newId = changedColumn.lookup.find((l) => l.title === savedValue).id
      }
      let newStateRows = data.rows
      newStateRows[row_index][column_name] = newId

      return {
        ...data,
        rows: newStateRows,
        columns: newStateCols
      };
    });

  }

  function randomInteger() {
    return Math.floor(Math.random() * 1000000) + 10;
  }

  const saveEdit = (event, row_index, column_name) => {
    if ((event.key != null && event.key === 'Enter')
      || (event.type === 'blur')
    ) {
      updateEditModeAndSaveData(event, row_index, column_name)
    }
  }

  function updateEditModeAndSaveData(event, row_index, column_name) {
    disableEditMode()
    let savedValue = event.target.value
    setDataState((data) => {
      let changedRows = data.rows
      changedRows[row_index][column_name] = savedValue
      return {
        ...data,
        rows: changedRows
      };
    });
  }


  function addColumns(colTitle, colType) {
    setDataState(() => {
      const prevStateColsCopy = [...dataState.columns];
      const c = {};
      var counterVal = columnCounter;
      setColumnCounter(counterVal + 1)
      const colName = 'col-' + counterVal;
      c.name = colName
      c.title = colTitle;
      if (colType === 'lookup') {
        c.lookup = []
      }
      c.type = colType
      const newStateCols = prevStateColsCopy.concat([c])
      return {
        ...dataState,
        columns: newStateCols
      };
    });
  }
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("colIdx", index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  }

  const handleDragEnter = (e, index) => {
  };

  const handleOnDrop = (e, index) => {

    const droppedColIdx = index;
    const draggedColIdx = e.dataTransfer.getData("colIdx");
    const tempCols = [...dataState.columns];
    tempCols[draggedColIdx] = dataState.columns[droppedColIdx];
    tempCols[droppedColIdx] = dataState.columns[draggedColIdx];
    setDataState((data) => {
      return {
        ...data,
        columns: tempCols
      }
    })
  };

  function disableEditMode(){
    setInEditMode({
      status: false,
      rowKey: undefined,
      colKey: undefined
    })
  }
  return (

    <div className="table-wrapper">
      <div >
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              <Button variant="contained" {...bindTrigger(popupState)} >
                <b>+</b>
              </Button>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Box>
                  <AddColumnDialogue val={"Column-" + columnCounter} addColumnFunction={addColumns} popState={popupState} />
                </Box>
              </Popover>
            </div>
          )}
        </PopupState>
      </div>


      <div className="table" >
        <Table>
          <TableHead>

            <TableRow>
              {
                dataState.columns.map((col, index) => {
                  return (
                    <TableCell
                      draggable
                      onDragStart={(event) => handleDragStart(event, index)}
                      onDragOver={(event) => handleDragOver(event, index)}
                      onDrop={(event) => handleOnDrop(event, index)}
                      onDragEnter={(event) => handleDragEnter(event, index)}
                    >
                      {col.title}</TableCell>
                  )
                })
              }
            </TableRow>
          </TableHead>

          <TableBody>
            {
              dataState.rows.map((row, index) => (
                <TableRow key={index}>
                  {
                    dataState.columns.map((col) => (
                      <TableCell onClick={() => onEdit(index, col.name, row[col.name])}>
                        {
                          inEditMode.status && inEditMode.rowKey === index && inEditMode.colKey === col.name ?
                            col.type === 'lookup' ? (
                              <LookupComponent
                                onSelect={handleOnSelect}
                                onAddNewLookup={handleOnAddNewLookup}
                                value={row[col.name]}
                                column={col}
                                rowIndex={index}
                              />
                            )

                              :
                              (<TextField value={editCellValue}
                                onChange={(event) => setEditCellValue(event.target.value)}
                                onKeyPress={(event) => saveEdit(event, index, col.name)}
                                onBlur={(event) => saveEdit(event, index, col.name)}
                              />
                              )

                            : col.type === 'lookup'
                              && row[col.name] != null ?
                              (
                                 <Chip
                                  label={
                                    col.lookup.find((l) => l.id.toString() === row[col.name].toString()).title
                                  }
                                 />
                              )

                              : (
                                row[col.name]
                              )
                        }
                      </TableCell>
                    ))
                  }
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function LookupComponent(props) {

  const [state, setState] = useState(props.value == null ? Object.keys(props.column.lookup)[0] : props.value)
  const handleOnChange = (e, value) => {
    e.target.value = value != null && value.id
    props.onSelect(e, props.rowIndex, props.column.name)
    props = {
      ...props, value: e.target.value
    }
    setState(props.value)
  }

  const handleOnKeyPress = (e) => {
    if (e.key != null && e.key === 'Enter') {
      props.onAddNewLookup(e, props.rowIndex, props.column.name)
    }
  }

  function getSelectedItem(){
    const item = props.column.lookup.find((opt)=>{
      if (opt.id === state)
        return opt;
    })
    return item || {};
  }

  return (
    <Autocomplete
      value={getSelectedItem()}
      id="disable-clearable"
      disableClearable
      options={props.column.lookup}
      getOptionLabel={(option) => option.title}
      style={{ width: 300 }}
      onChange={handleOnChange}
      onKeyPress={handleOnKeyPress}
      renderInput={(params) => <TextField {...params} label={props.column.title}/>}
    />
  )
}