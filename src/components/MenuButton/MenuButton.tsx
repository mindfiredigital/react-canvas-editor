import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AlertDialog from "../AlertDialog/AlertDialog";
import FormDialog from "../FormDialog/FormDialog";
import { DocumentService } from "../../services/documentService";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DocumentState, reloadRecentDoc } from "../../redux/documentReducer";

const ITEM_HEIGHT = 48;

export default function MenuButton({ documentId }: { documentId: string }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [togglePopup, setTogglePopup] = React.useState<boolean>(false);
  const [toggleFormDialog, setToggleFormDialog] =
    React.useState<boolean>(false);
  let renameTitle = "";
  const doc = useSelector(
    (state: RootState) => state.document
  ) as DocumentState;
  const dispatch = useDispatch();

  const removeDoc = async () => {
    try {
      if (documentId) {
        const response = await DocumentService.removeDoc(documentId);
        if (response.data.success) {
          console.log(doc.reloadRecentDoc);
          dispatch(reloadRecentDoc({ reloadRecentDoc: !doc.reloadRecentDoc }));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateTitle = async () => {
    try {
      if (documentId && renameTitle) {
        await DocumentService.updateTitle({
          documentId,
          title: renameTitle,
        });
        renameTitle = "";
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div onClick={(e) => e.stopPropagation()}>
        <IconButton
          aria-label="more"
          id="menu-button"
          aria-controls={open ? "menu-button" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="menu-button"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          }}
        >
          <MenuItem
            key="Rename"
            onClick={() => {
              handleClose(), setToggleFormDialog(true);
            }}
          >
            Rename
          </MenuItem>
          <MenuItem
            key="Delete"
            onClick={() => {
              handleClose(), setTogglePopup(true);
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </div>

      <AlertDialog
        toggle={togglePopup}
        message="Are you sure, you want to remove."
        onClose={() => setTogglePopup(false)}
        onClick={() => {
          removeDoc();
          setTogglePopup(false);
        }}
      />

      <FormDialog
        toggle={toggleFormDialog}
        title="Rename"
        content="Please enter a new name for the item:"
        onClose={() => {
          setToggleFormDialog(false), (renameTitle = "");
        }}
        onClick={(value: string) => {
          renameTitle = value;
          updateTitle();
          setToggleFormDialog(false);
        }}
      />
    </>
  );
}
