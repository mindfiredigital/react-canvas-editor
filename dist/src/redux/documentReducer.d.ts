export interface DocumentState {
    documentId: string;
    title: string;
    reloadRecentDoc: boolean;
    margins: number[];
}
export declare const setDocumentTitle: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "document/setDocumentTitle">, reloadRecentDoc: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "document/reloadRecentDoc">, setDocumentId: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "document/setDocumentId">, setDocumentMargins: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "document/setDocumentMargins">;
declare const _default: import("redux").Reducer<DocumentState, import("redux").AnyAction>;
export default _default;
