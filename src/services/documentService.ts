import { HSLColor, RGBColor } from "react-color";
import {
  CreateDocumentDto,
  RestoreVersionDto,
  TemplateDto,
} from "../utils/types";
import API from "./api";

export const DocumentService = {
  getDoc: (documentId: string) => {
    return API.get(`/getDocument/${documentId}`);
  },

  getRecentDocs: (userId: string) => {
    return API.get(`/getDocuments/${userId}`);
  },

  listTemplates: () => {
    return API.get(`/get-template`);
  },

  createDoc: (payload: CreateDocumentDto) => {
    return API.post("/document", payload);
  },

  getVersionList: (documentId: string) => {
    return API.get(`/getVersions/${documentId}`);
  },

  saveAsTemplate: (data: TemplateDto) => {
    return API.post("/create-template", data);
  },

  getSelectedVersionData: (versionId: string) => {
    return API.get(`/getVersionData/${versionId}`);
  },

  restoreVersion: (payload: RestoreVersionDto) => {
    return API.post("/restoreVersion", payload);
  },

  updateTitle: (payload: { documentId: string; title: string }) => {
    return API.post(`/updateTitle/${payload.documentId}`, payload);
  },

  removeDoc: (documentId: string) => {
    return API.get(`/removeDoc/${documentId}`);
  },

  createVersion: (documentId: string) => {
    return API.post("/create-version", { documentId });
  },

  uploadImage: (templateId: string, payload: FormData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return API.post(`/uploadImage/${templateId}`, payload, config);
  },

  updateMargins: (payload: { documentId: string; margins: number[] }) => {
    return API.post(`/updateMargins/${payload.documentId}`, payload);
  },

  getColor: (documentId: string) => {
    return API.get(`/colors/${documentId}`);
  },

  saveColorPalette: (payload: {
    documentId: string;
    color: string | HSLColor | RGBColor;
    feature: string;
  }) => {
    return API.post(`/create-color`, payload);
  },
};
