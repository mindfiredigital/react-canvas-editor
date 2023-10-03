import { Box, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { RecentDocPropType } from "../../utils/types";
import { DocumentService } from "../../services/documentService";
import RecentDocCard from "../RecentDoc/RecentDocCard";
import Fallback from "../Fallback/Fallback";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { DocumentState } from "../../redux/documentReducer";

function RecentDocsList() {
  const [recentDocList, setRecentDocList] = useState<RecentDocPropType[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const doc = useSelector(
    (state: RootState) => state.document
  ) as DocumentState;

  useEffect(() => {
    const getRecentDocs = async () => {
      try {
        console.log("Here");

        const response = await DocumentService.getRecentDocs("user1");
        if (response.data.success) {
          setRecentDocList(response.data.data);
        } else {
          setIsError(true);
          setRecentDocList([]);
        }
      } catch (err) {
        setIsError(true);
        setRecentDocList([]);
      }
    };
    getRecentDocs();
  }, [doc.reloadRecentDoc]);

  return (
    <Stack
      sx={{
        width: "100%",
        padding: "0.5rem",
      }}
    >
      <Typography
        sx={{
          width: "80%",
          fontSize: "1.1rem",
          margin: "0 auto",
          paddingLeft: "2rem",
        }}
      >
        Recent Documents
      </Typography>

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
        ) : recentDocList.length === 0 ? (
          <Typography
            sx={{
              width: "80%",
              fontSize: "0.8rem",
              paddingLeft: "2rem",
              textAlign: "center",
              paddingTop: "3rem",
            }}
          >
            No recent Docs.
          </Typography>
        ) : (
          recentDocList.map((recentDoc) => (
            <RecentDocCard key={recentDoc._id} recentDoc={recentDoc} />
          ))
        )}
      </Box>
    </Stack>
  );
}

export default RecentDocsList;
