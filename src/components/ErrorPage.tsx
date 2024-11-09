'use client'

import { useEffect } from 'react';

import { Error } from './Error';

export function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Error header="An unhandled error occurred!" description={error.message} actions={
      !reset ? undefined :
        {
          click: reset, name: "Try again"
        }} />
  )
}