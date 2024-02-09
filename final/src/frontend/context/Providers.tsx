"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import Web3Provider from "./Web3Provider";

interface IProvidersProps {
  children: ReactNode;
}

const Providers = (props: IProvidersProps) => {
  return (
    <Provider store={store}>
      <Web3Provider>{props.children}</Web3Provider>
    </Provider>
  );
};

export default Providers;
