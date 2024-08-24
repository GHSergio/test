//APP.tsx
import React from "react";
import { ThemeProviderComponent } from "./contexts/ThemeContext";
import { Provider } from "react-redux";
import store from "./store/index";

import Main from "./Main";

function App() {
  return (
    <ThemeProviderComponent>
      <Provider store={store}>
        <Main />
      </Provider>
    </ThemeProviderComponent>
  );
}

export default App;
