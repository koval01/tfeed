'use client'

import { useEffect } from 'react';

import { Error } from '@/components/error/Error';
import { t } from 'i18next';

export const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Error header={t("UnhandledError")} description={error.message} actions={
      !reset ? undefined :
        {
          click: reset, name: t("Try again")
        }} />
  )
}