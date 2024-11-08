'use client'

import { type PropsWithChildren } from 'react';

import {
  AdaptivityProvider,
  ConfigProvider,
  AppRoot
} from '@vkontakte/vkui';

import '@/styles/app.css';
import '@/styles/vkui.css';
import '@/styles/tailwind.css';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/ErrorPage';

import { useDidMount } from '@/hooks/useDidMount';

function App(props: PropsWithChildren) {
  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          {props.children}
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

function RootInner({ children }: PropsWithChildren) {
  return (
    <App>
      {children}
    </App>
  );
}

export function Root(props: PropsWithChildren) {
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : null;
}
