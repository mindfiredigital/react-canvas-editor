export declare const store: import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<{
    document: import("./documentReducer").DocumentState;
}, import("redux").AnyAction, [import("@reduxjs/toolkit").ThunkMiddleware<{
    document: import("./documentReducer").DocumentState;
}, import("redux").AnyAction, undefined>]>;
export type RootState = ReturnType<typeof store.getState>;
