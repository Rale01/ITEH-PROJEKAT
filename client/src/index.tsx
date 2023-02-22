import React from "react";
import { createRoot } from "react-dom/client";

import reportWebVitals from "./reportWebVitals";
import App from "./App";

import 'index.css';

//kada u klijentu npm run dev iyvrsava se index.tsx koji renderuje/prikazuje app komponentu koja sadrzi sve ostale komponente
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

//prikazuje errore
reportWebVitals();
