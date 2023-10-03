import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Version from "./pages/Version/Version";
import Home from "./pages/Home/Home";
import DocumentEditor from "./pages/DocumentEditor/DocumentEditor";
import TemplateGallery from "./pages/TemplateGallery/TemplateGallery";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    // element: <DocumentEditor />,
  },
  {
    path: "documents/:documentId",
    element: <DocumentEditor />,
  },
  {
    path: "documents/:documentId/version",
    element: <Version />,
  },
  {
    path: "/templates",
    element: <TemplateGallery />,
  },
]);

export default router;
