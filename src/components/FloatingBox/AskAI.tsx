import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { AIPromptsOption } from "../../utils/constant";
import { AskAIService } from "../../services/askAIService";
import { DOMEventHandlers } from "@harshita/canvas-editor";
import { SelectionRect } from "../../utils/types";

export default function AskAI({
  selectedText,
  setDropdown,
}: {
  selectedText: string;
  setDropdown: Dispatch<SetStateAction<SelectionRect>>;
}) {
  const [open, setOpen] = useState(false);
  const [endPoint, setEndPoint] = useState<string>("");
  const [tone, setTone] = useState<string>("");

  const handleClick = () => {
    setOpen(!open);
  };

  const handleAskAI = (type: string, option?: string) => {
    setEndPoint(type);
    if (option) {
      setTone(option);
    }
  };

  useEffect(() => {
    const askAI = async () => {
      try {
        const payload = {
          text: selectedText,
          tone: tone ? tone : undefined,
        };
        const response = await AskAIService.askAI({
          endpoint: endPoint,
          payload,
        });
        if (response.data.success) {
          DOMEventHandlers.insertElement(response.data.data);
          setDropdown((prevState: SelectionRect) => ({ ...prevState, visiblity: false }));
        } else {
          console.log(`askAI api failed`, response.data);
        }
      } catch (err) {
        console.log(`Error in askAI`, err);
      }
    };
    if (endPoint && selectedText) {
      askAI();
    }
  }, [endPoint, selectedText, tone, setDropdown]);

  return (
    <List
      sx={{ width: "15rem", maxWidth: "100%", bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          sx={{ height: "3rem" }}
          component="div"
          id="nested-list-subheader"
        >
          <AutoFixHighIcon fontSize="small" />
          Ask AI
        </ListSubheader>
      }
    >
      {AIPromptsOption.map((item) => (
        <React.Fragment key={item.label}>
          <ListItemButton
            sx={{ height: "2rem" }}
            onClick={() => {
              if (item.options) {
                handleClick();
              } else {
                handleAskAI(item.value);
              }
            }}
          >
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ variant: "body2" }}
            />
            {item.options && (open ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          {item.options &&
            item.options.map((option) => (
              <Collapse key={option} in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 4, height: "2rem" }}
                    onClick={() => handleAskAI(item.value, option)}
                  >
                    <ListItemText
                      primary={option}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItemButton>
                </List>
              </Collapse>
            ))}
        </React.Fragment>
      ))}
    </List>
  );
}
