import React, { createRef, useRef, useEffect, RefObject } from "react";
import { Paper } from "@material-ui/core";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styled from 'styled-components';


const rows = [
    { id: 1, lastName: "Nguyen", firstName: "Truong", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 }
  ];
  
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "firstName",
      headerName: "First name",
      width: 130,
      minWidth: 100,
      maxWidth: 300
    },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column haasdasdasds a value getter and is not sortable.",
      sortable: false,
      width: "50%",
      formatValue: (params: any) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`
    }    
  ];

  const DEFAULT_MIN_WIDTH_CELL = 70;
  const DEFAULT_MAX_WIDTH_CELL = 800;

  const DragableTable = () => {
    const columnRefs : RefObject<HTMLDivElement>[] = columns.map(() => createRef());
    const isResizing = useRef(-1);

    useEffect(() => {
        document.onmousemove = handleOnMouseMove;
        document.onmouseup = handleOnMouseUp;
        return () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    }, );

    const adjustWidthColumn = (index:any, width:number) => {
        const minWidth = columns[index]?.minWidth ?? DEFAULT_MIN_WIDTH_CELL;
        const maxWidth = columns[index]?.maxWidth ?? DEFAULT_MAX_WIDTH_CELL;
        const newWidth = width > maxWidth ? maxWidth : width < minWidth ? minWidth : width;
       columnRefs[index].current!.parentElement!.style.width = newWidth +"px";
    }

    const setCursorDocument = (isResizing : boolean) => {
        document.body.style.cursor = isResizing ? "col-resize": "auto";
    }

    const handleOnMouseMove = (e : any) => {
        if (isResizing.current >= 0) {
            const newWidth = e.clientX - columnRefs[isResizing.current].current!.parentElement!.getBoundingClientRect().left;
            adjustWidthColumn(isResizing.current, newWidth);
        }
    }

    const handleOnMouseUp = () => {
        console.log("end resize");
        isResizing.current = -1;
        setCursorDocument(false);
      };
    
      const onClickResizeColumn = (index : any) => {
        console.log("start resize");
        isResizing.current = index;
        setCursorDocument(true);
      };

      return (
        <TableContainer component={Paper}>
            <StyledTable className={"table"} sx={{ minWidth: 650 }}>
                <StyledTableHead className={"tableHead"}>
                    <TableRow>
                        {columns.map((col, colIndex) => (
                            <StyledTableCell
                                className={"tableCell resizable"}
                                key={col.field}
                                align="center"
                                style={{ width: col?.width ?? "auto" }}
                            >
                                {col.headerName}
                                <StyledLine
                                    onMouseDown={() => onClickResizeColumn(colIndex)}
                                    ref={columnRefs[colIndex]}
                                    className={"resizeLine"}
                                />
                            </StyledTableCell>
                        ))}
                        <TableCell className="tableCell emptyCell" />
                    </TableRow>
                </StyledTableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                           {columns.map((col) => (
                            <StyledTableCell
                                key={`${row.id}-${col.field}`}
                                align="center"
                                className={"tableCell"}
                            >
                                {col.formatValue ? col.formatValue({ row }) : "null"}
                            </StyledTableCell>
                           ))}
                           <TableCell className="tableCell emptyCell" />
                        </TableRow>
                    ))}
                </TableBody>
            </StyledTable>
        </TableContainer>
      )
  }

export default DragableTable;

const StyledTable = styled(Table)`
  table-layout : fixed
`;

const StyledTableHead = styled(TableHead)`
  user-select: none;
`;

const StyledTableCell = styled(TableCell)`
  border: 1px solid black !important;
  padding: 10px 0;
  &.resizable {
    position: relative;
  }
  &.emptyCell {
    width: "auto"
  }
`;

const StyledLine = styled.div`
position: absolute; 
height: 100%;
width: 4px;
top: 0;
right: -2px;
cursor: col-resize;
&:hover{
  background-color: #0AA1DD;
}
&:active {
  background-color: #0AA1DD;

}
`;
