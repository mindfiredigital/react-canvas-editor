import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { RecentDocPropType } from "../../utils/types";
import { DocumentService } from "../../services/documentService";
import BackIcon from "../../components/BackIcon/BackIcon";
import TemplateCard from "../../components/TemplateCard/TemplateCard";
import Fallback from "../../components/Fallback/Fallback";

function TemplateGallery() {
  const [templateList, setTemplateList] = useState<RecentDocPropType[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const getAllTemplates = async () => {
      try {
        const response = await DocumentService.listTemplates();
        if (response.data.success) {
          setTemplateList(response.data.data);
        } else {
          setIsError(true);
          setTemplateList([]);
        }
      } catch (err) {
        setIsError(true);
        setTemplateList([]);
      }
    };
    getAllTemplates();
  }, []);

  return (
    <>
      <Box>
        <AppBar position="fixed" sx={{ top: 0 }}>
          <Toolbar>
            <BackIcon />
            <Typography variant="h6" noWrap component="div">
              Templates
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Toolbar />
      <Box
        sx={{
          display: "flex",
          flexFlow: "row wrap",
          width: "80%",
          margin: "0 auto",
        }}
      >
        {isError ? (
          <Fallback />
        ) : (
          templateList.map((template) => (
            <TemplateCard key={template._id} template={template} />
          ))
        )}
      </Box>
    </>
  );
}

export default TemplateGallery;
