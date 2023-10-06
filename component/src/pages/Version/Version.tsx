import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import JoditEditor from "jodit-react";
import { useParams } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { formatDate } from "../../utils/utility";
import BackIcon from "../../components/BackIcon/BackIcon";
// import { DocumentService } from "../../services/documentService";
import { CustomSnackbarType, VersionType } from "../../utils/types";
import { useHideElement } from "../../hooks/useHideElement";
import CustomizedSnackbar from "../../components/Snackbar/Snackbar";
import { MSGSEVERITY } from "../../utils/constant";

const drawerWidth = 240;

export default function Version() {
  const { documentId } = useParams();
  const [currentVersionId, setCurrentVersionId] = useState<string>("");
  const [versionList, setVersionList] = useState<VersionType[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<VersionType>();
  const [selectedVersionData, setSelectedVersionData] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<CustomSnackbarType>({
    visibility: false,
  });

  useHideElement(["jodit-toolbar__box", "jodit-status-bar"]);

  const getVersionList = useCallback(async () => {
    // try {
    //   if (documentId) {
    //     // const response = await DocumentService.getVersionList(documentId);
    //     if (response.data.success && response.data.total > 0) {
    //       const versionArr: VersionType[] = response.data.data.map(
    //         (item: VersionType) => ({
    //           ...item,
    //           time: formatDate(item.time),
    //         })
    //       );
    //       setVersionList(versionArr);
    //       setCurrentVersionId(versionArr[0]._id);
    //     }
    //   }
    // } catch (err) {
    //   console.log(err);
    //   setCurrentVersionId("");
    // }
  }, [documentId]);

  useEffect(() => {
    if (documentId) getVersionList();
  }, [documentId, getVersionList]);

  useEffect(() => {
    setSelectedVersion(versionList[0]);
  }, [versionList]);

  useEffect(() => {
    const getSelectedVersionData = async () => {
      // try {
      //   if (selectedVersion) {
      //     const response = await DocumentService.getSelectedVersionData(
      //       selectedVersion._id
      //     );
      //     if (response.data.success) {
      //       setSelectedVersionData(response.data.data.data);
      //     }
      //   }
      // } catch (err) {
      //   console.log(err);
      //   setSelectedVersionData("");
      // }
    };
    getSelectedVersionData();
  }, [selectedVersion]);

  const handleClick = (version: VersionType) => {
    setSelectedVersion(version);
  };

  const handleRestore = async () => {
    // if (documentId && selectedVersion?._id) {
    //   const response = await DocumentService.restoreVersion({
    //     documentId,
    //     versionId: selectedVersion?._id,
    //   });
    //   if (response.data.success) {
    //     setOpenSnackbar({
    //       visibility: true,
    //       message: "Version Restored Successfully",
    //       severity: MSGSEVERITY.SUCCESS,
    //     });
    //     //fetch the updated version
    //     await getVersionList();
    //   } else {
    //     setOpenSnackbar({
    //       visibility: true,
    //       message: "Failed to restore version",
    //       severity: MSGSEVERITY.ERROR,
    //     });
    //   }
    // }
  };
  return (
    <>
      <Box sx={{ display: "flex", backgroundColor: "#f9fbfd" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            mr: `${drawerWidth}px`,
            backgroundColor: "#f9fbfd",
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <BackIcon color="#202124" />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: "#202124" }}
            >
              {selectedVersion?.time}
            </Typography>
            {currentVersionId && selectedVersion?._id !== currentVersionId && (
              <Button
                variant="contained"
                disableElevation
                sx={{ marginLeft: "1rem", textTransform: "none" }}
                onClick={handleRestore}
              >
                Restore this version
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            p: 3,
            height: "100%",
            margin: "0 auto",
          }}
        >
          <Toolbar />
          <JoditEditor
            value={selectedVersionData}
            config={{ readonly: true, buttons: [], height: 1056, width: 816 }}
          />
        </Box>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="right"
        >
          <Toolbar>
            <Typography variant="body1">Version History</Typography>
          </Toolbar>
          <Divider />
          <List>
            {versionList.length === 0 ? (
              <ListItem sx={{ display: "flex", justifyContent: "center" }}>
                <ListItemText secondary={<span>No versions found</span>} />
              </ListItem>
            ) : (
              versionList.map((version) => (
                <ListItem key={version._id} disablePadding>
                  <ListItemButton
                    onClick={() => handleClick(version)}
                    selected={version._id === selectedVersion?._id}
                  >
                    <ListItemText
                      primary={version.time}
                      primaryTypographyProps={{ fontSize: "0.85rem" }}
                      secondary={
                        version._id === currentVersionId ? "latest version" : ""
                      }
                      secondaryTypographyProps={{
                        fontSize: "0.75rem",
                        fontStyle: "italic",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
          <Divider />
        </Drawer>
      </Box>
      <CustomizedSnackbar
        openSnackbar={openSnackbar}
        setOpenSnackbar={setOpenSnackbar}
      />
    </>
  );
}
