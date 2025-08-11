import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css";
import "./scss/style.scss";
import App from "./App.jsx";

import "bootstrap/dist/js/bootstrap.bundle.min";
import store from "./app/store.js";

createRoot(document.getElementById("root")).render(
      <Provider store={store}>
            <App />
      </Provider>
);
