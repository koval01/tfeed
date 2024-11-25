'use client'

import { useEffect, type PropsWithChildren } from 'react';

import {
  AdaptivityProvider,
  ConfigProvider,
  AppRoot
} from '@vkontakte/vkui';

import StoreProvider from '@/components/StoreProvider';

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { i18nStrings } from "@/i18n";

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/ErrorPage';

import { useDidMount } from '@/hooks/useDidMount';

// global application styles
import '@/styles/app.css';
import '@/styles/vkui.css';
import '@/styles/tfeed.css';
import '@/styles/tailwind.css';

const i18nHook = i18n.use(initReactI18next);

i18nHook.init({
  resources: i18nStrings,
  fallbackLng: "en",

  interpolation: {
    escapeValue: false
  }
});

const App = (props: PropsWithChildren) => {
  useEffect(() => {
    i18nHook.changeLanguage(navigator.language.split("-")[0]);
  }, []);

  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          {props.children}
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
};

const RootInner = ({ children }: PropsWithChildren) => (
  <StoreProvider>
    <App>
      {children}
    </App>
  </StoreProvider>
);

export const Root = (props: PropsWithChildren) => {
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : null;
}
