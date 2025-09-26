import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function Root() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  );
}
