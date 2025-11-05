'use client'

import type { RootState } from '@/lib/store';
import { useEffect, type PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';

import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider
} from '@vkontakte/vkui';

import { ModalProvider } from '@/contexts/ModalContext';

import MediaViewer from '@/components/media/Viewer';
import StoreProvider from '@/components/services/StoreProvider';

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { i18nStrings } from "@/i18n";

import { ErrorBoundary } from '@/components/services/ErrorBoundary';
import { ErrorPage } from '@/components/error/ErrorPage';

import { useDidMount } from '@/hooks/utils/useDidMount';

import { GoogleAnalytics } from '@next/third-parties/google';

// global application styles
import '@/styles/global.css';
import '@/styles/tailwind.css';
import '@/styles/tfeed.css';
import '@/styles/vkui.css';

const i18nHook = i18n.use(initReactI18next);

i18nHook.init({
  resources: i18nStrings,
  fallbackLng: "en",

  interpolation: {
    escapeValue: false
  }
});

const App = (props: PropsWithChildren) => {
  const isBlocked = useSelector((state: RootState) => state.scroll.isBlocked);

  useEffect(() => {
    if (isBlocked) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
    }

    return () => {
      document.body.style.overflowY = 'scroll';
    };
  }, [isBlocked]);
  
  useEffect(() => {
    i18nHook.changeLanguage(navigator.language.split("-")[0]);
  }, []);

  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <ModalProvider>
            {props.children}
          </ModalProvider>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
};

const RootInner = ({ children }: PropsWithChildren) => (
  <StoreProvider>
    <App>
      {children}
      <MediaViewer />
      {process.env.NEXT_PUBLIC_ANALYTICS_ID ? 
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_ANALYTICS_ID} />
      : null}
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
