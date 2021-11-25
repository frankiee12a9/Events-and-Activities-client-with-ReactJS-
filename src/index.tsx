import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./app/layout/styles.css";
import App from "./app/layout/App";
import "react-calendar/dist/Calendar.css"; // need to import dependencies to use
import "semantic-ui-css/semantic.min.css";
import { store, StoreContext } from "./app/stores/store";
import { Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css"; // react-toastify
import "react-datepicker/dist/react-datepicker.css"; // react-datepicker
import { createBrowserHistory } from "history";
import ScrollToTop from "./app/layout/ScrollToTop";

export const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      {/*  */}
      <Router history={history}>
        <ScrollToTop />
        <App />
      </Router>
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
