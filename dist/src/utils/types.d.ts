import { IElement } from "@mindfiredigital/canvas-editor";
import { MSGSEVERITY } from "./constant";
export type RecentDocPropType = {
    id: string;
    title: string;
    updatedAt: string;
    _id: string;
    image?: string;
};
export type SelectionRect = {
    left: number;
    top: number;
    visiblity: boolean;
};
export type CreateDocumentDto = {
    templateId: string;
    userId: string;
    title?: string;
    margins: number[];
};
export type TemplateDto = {
    userId: string;
    data: IElement[];
    title: string;
    margins: number[];
};
export interface VersionType {
    _id: string;
    time: string;
    documentId: string;
}
export type RestoreVersionDto = {
    documentId: string;
    versionId: string;
};
export type CustomSnackbarType = {
    visibility: boolean;
    message?: string;
    severity?: MSGSEVERITY;
};
export type AlertDialogType = {
    message: string;
    toggle: boolean;
    onClose: Function;
    onClick: Function;
};
export type FormDialogType = {
    toggle: boolean;
    title: string;
    content: string;
    onClose: Function;
    onClick: Function;
};
export type TPayload = {
    text: string;
    tone?: string;
};
export type TAskAI = {
    endpoint: string;
    payload: TPayload;
};
