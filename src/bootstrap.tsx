import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import "./main.scss";

const ele = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(ele);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </Provider>
  // {/* </React.StrictMode> */}
);
