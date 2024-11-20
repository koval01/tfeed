'use client'

import { useEffect, type PropsWithChildren } from 'react';

import {
  AdaptivityProvider,
  ConfigProvider,
  AppRoot
} from '@vkontakte/vkui';

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { i18nStrings } from "@/i18n";

import '@/styles/app.css';
import '@/styles/vkui.css';
import '@/styles/tailwind.css';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/ErrorPage';

import { useDidMount } from '@/hooks/useDidMount';

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
  <App>
    {children}
  </App>
);

export const Root = (props: PropsWithChildren) => {
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : null;
}
