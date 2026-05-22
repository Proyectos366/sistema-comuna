"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store from "@/store/store";

export default function ReduxProvider({ children }) {
  const [persistor, setPersistor] = useState(null);

  useEffect(() => {
    let isMounted = true;

    import("redux-persist").then(({ persistStore }) => {
      if (isMounted) {
        setPersistor(persistStore(store));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!persistor) {
    return <Provider store={store}>{children}</Provider>;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
