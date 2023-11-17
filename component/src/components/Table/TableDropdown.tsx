import React, { useState, useEffect, MouseEvent } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import CloseIcon from "@mui/icons-material/Close";
import { DOMEventHandlers } from "@mindfiredigital/canvas-editor";
import ButtonWrapper from "../ButtonWrapper/ButtonWrapper";
import "./TableDropdown.scss";

const TableComponent = (_props: any) => {
  const [colIndex, setColIndex] = useState(-1);
  const [rowIndex, setRowIndex] = useState(-1);
  const [tablePanelVisible, setTablePanelVisible] = useState(false);
  const [tableTitle, setTableTitle] = useState("Insert table");

  const handleTableClick = () => {
    setTablePanelVisible(true);
  };

  const handleTableCellHover = (evt: MouseEvent<HTMLDivElement>) => {
    const celSize = 16;
    const rowMarginTop = 4;
    const celMarginRight = 6;
    const { offsetX, offsetY } = evt.nativeEvent;

    setColIndex(Math.ceil(offsetX / (celSize + celMarginRight)) || 1);
    setRowIndex(Math.ceil(offsetY / (celSize + rowMarginTop)) || 1);
  };

  useEffect(() => {
    if (rowIndex > -1 && colIndex > -1)
      setTableTitle(`${rowIndex}×${colIndex}`);
  }, [rowIndex, colIndex]);

  const handleCloseTable = () => {
    setTablePanelVisible(false);
    setColIndex(-1);
    setRowIndex(-1);
    setTableTitle("Insert table");
  };

  const handleApplyTable = () => {
    DOMEventHandlers.createTable({ rowIndex, colIndex });
    handleCloseTable();
  };

  return (
    <Box className='tableContainer'>
      <ButtonWrapper
        title='Insert table'
        handleClick={handleTableClick}
        sx={Object.assign({ height: "100%" }, _props.style)}>
        <BackupTableIcon style={{ fontSize: "large" }} />
      </ButtonWrapper>
      {tablePanelVisible && (
        <Box className='tableCollapse'>
          <Box className='ableTitle'>
            <Typography sx={{ fontSize: "0.8rem" }}>{tableTitle}</Typography>
            <ButtonWrapper
              title='Close table'
              sx={{
                cursor: "pointer",
              }}
              handleClick={handleCloseTable}>
              <CloseIcon sx={{ width: "0.8rem", height: "0.8rem" }} />
            </ButtonWrapper>
          </Box>
          <Table
            onMouseMove={handleTableCellHover}
            onClick={handleApplyTable}
            sx={{
              borderCollapse: "separate",
              borderSpacing: "0.25rem",
            }}>
            <TableBody>
              {[...Array(10)].map((_, trIndex) => (
                <TableRow key={trIndex}>
                  {[...Array(10)].map((_, tdIndex) => {
                    return (
                      <TableCell
                        className={
                          trIndex < rowIndex && tdIndex < colIndex
                            ? "activeCell"
                            : ""
                        }
                        key={tdIndex}
                        sx={{
                          padding: "6px",
                          width: "16px",
                          height: "16px",
                          boxSizing: "border-box",
                          border: "1px solid #e2e6ed",
                          background: "#fff",
                          marginRight: "6px",
                          pointerEvents: "none",
                        }}
                      />
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default TableComponent;
