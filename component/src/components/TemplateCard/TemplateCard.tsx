import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate } from "react-router-dom";
import { RecentDocPropType } from "../../utils/types";
// import { DocumentService } from "../../services/documentService";
// import MenuButton from "../MenuButton/MenuButton";
import { formatDate } from "../../utils/utility";

export default function TemplateCard({
  template,
}: {
  template: RecentDocPropType;
}) {
  const navigate = useNavigate();
  const [documentId, setDocumentId] = React.useState<string | null>(null);
  const handleClick = async (templateId: string) => {
    // const response = await DocumentService.createDoc({
    //   templateId,
    //   userId: "user1",
    //   margins: [100, 100, 120, 120]
    // });
    // if (response.data.success) {
    //   setDocumentId(response.data.data._id);
    // }
  };
  React.useEffect(() => {
    if (documentId) navigate(`/documents/${documentId}`);
  }, [documentId, navigate]);
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
    <Card sx={{ width: "12rem", margin: "0.5rem" }}>
      <CardActionArea onClick={() => handleClick(template._id)}>
        <Box
          style={{
            width: "100%",
            padding: "0.25rem",
            display: "flex",
            flexDirection: "column",
            marginTop: "0.5rem",
          }}
        >
          {template.image ? (
            <CardMedia
              component="img"
              alt="Base64 Image"
              image={template.image}
            />
          ) : (
            skeleton
          )}
        </Box>

        <CardContent>
          <Typography gutterBottom variant="body1" component="div">
            {template.title}
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
                {formatDate(template.updatedAt)}
              </Typography>
            </Box>
            {/* <MenuButton documentId={template._id} /> */}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
