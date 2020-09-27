import React, { useState } from "react";
import "./CustomTableComponent.scss"
import { generateSampleData } from "../../util/genUtil";
import { Table, TableHead, TableRow, TableBody, TableCell, Box, Popover, Button, TextField, Select, MenuItem, Chip, Icon } from '@material-ui/core'
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
  const [dragOverState, setDragOverState] = useState(0);

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


  const saveEdit = (event, row_index, column_name) => {
    if ((event.key != null && event.key === 'Enter')
      || (event.type === 'blur')
    ) {
      updateEditModeAndSaveData(event, row_index, column_name)
    }
  }

  function updateEditModeAndSaveData(event, row_index, column_name) {
    setInEditMode({
      status: false,
      rowKey: undefined,
      colKey: undefined
    })
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


  function addColumns(colTitle) {
    setDataState(() => {
      const prevStateColsCopy = [...dataState.columns];
      const c = {};
      var counterVal = columnCounter;
      setColumnCounter(counterVal + 1)
      const colName = 'col-' + counterVal;
      c.name = colName
      c.title = colTitle;
      c.type = 'text'
      const newStateCols = prevStateColsCopy.concat([c])

      const newStateRows = dataState.rows
      newStateRows.map((row) => row[colName] = '')

      return {
        ...dataState,
        rows: newStateRows,
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
    setDragOverState(index);
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
    setDragOverState(0);
  };


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

                            : col.type === 'lookup' && row[col.name] != null ?

                              (
                                <Chip
                                  label={col.lookup[row[col.name]]}
                                />)

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
  const handleOnChange = (e) => {
    props = {
      ...props, value: e.target.value
    }
    setState(props.value)
    props.onSelect(e, props.rowIndex, props.column.name)
  }

  return (
    <Select
      value={state}
      onChange={(e) => handleOnChange(e, props.rowIndex, props.column.name)}
    >
      {
        Object.keys(props.column.lookup).map((key, index) =>
          <MenuItem key={key} value={key} > {props.column.lookup[key]} </MenuItem>
        )
      }
    </Select>)
}