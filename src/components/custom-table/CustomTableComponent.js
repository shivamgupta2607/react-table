import React, { useState } from "react";
import "./CustomTableComponent.scss"
import { generateSampleData } from "../../util/genUtil";
import { Table, TableHead, TableRow, TableBody, TableCell} from '@material-ui/core'

export default function CustomTableComponent() {
  const [dataState, setDataState] = useState(generateSampleData(10));
  return (
    <Table>
      <TableHead>
        <TableRow>
          {dataState.columns.map((item) => (<TableCell>{item.title}</TableCell>))};
        </TableRow>
      </TableHead>


      <TableBody>
        {
          dataState.rows.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.phNum}</TableCell>
              <TableCell>{item.email}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}
