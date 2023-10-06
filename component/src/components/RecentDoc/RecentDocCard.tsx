import * as React from "react";
import { Box, CardActionArea } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { RecentDocPropType } from "../../utils/types";
import { formatDate } from "../../utils/utility";
import MenuButton from "../MenuButton/MenuButton";
import ArticleIcon from "@mui/icons-material/Article";

export default function RecentDocCard({
  recentDoc,
}: {
  recentDoc: RecentDocPropType;
}) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/documents/${recentDoc._id}`);
  };

  const skeleton = (
    <>
      {Array.from({ length: 20 }, (_x, i) => i).map((i) => {
        return (
          <div
            key={i}
            style={{
              width: `${Math.floor(Math.random() * 100)}%`,
              backgroundColor: "rgb(229 231 235)",
              height: "0.2rem",
              marginTop: "0.2rem",
            }}
          ></div>
        );
      })}
    </>
  );
  return (
    <>
      <Card sx={{ width: "12rem", margin: "0.5rem" }}>
        <CardActionArea onClick={handleClick}>
          <Box
            style={{
              width: "100%",
              padding: "0.25rem",
              display: "flex",
              flexDirection: "column",
              marginTop: "0.5rem",
            }}
          >
            {skeleton}
          </Box>

          <CardContent>
            <Typography
              gutterBottom
              variant="body1"
              component="div"
              sx={{ marginLeft: ".2rem", marginTop: "0.6rem", lineHeight: "0" }}
            >
              {recentDoc.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArticleIcon sx={{ color: "#1976d2" }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginLeft: ".2rem" }}
                >
                  {formatDate(recentDoc.updatedAt)}
                </Typography>
              </Box>
              <MenuButton documentId={recentDoc._id} />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
