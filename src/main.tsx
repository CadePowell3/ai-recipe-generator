import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../amplify_outputs.json";
import App from "./App";
import "./index.css";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <header className="site-header">
      <h1>Cade Powell's Recipe AI</h1>
      <p>AI-powered recipes from ingredients you already have</p>
    </header>
    <Authenticator>
      <App />
    </Authenticator>
  </React.StrictMode>
);
