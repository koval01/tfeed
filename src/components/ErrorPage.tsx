'use client'

import { useEffect } from 'react';

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
    <div className="p-2">
      <b>An unhandled error occurred!</b>
      <blockquote>
        <pre>
          {error.message}
        </pre>
      </blockquote>
      {reset && <button onClick={() => reset()}>Try again</button>}
    </div>
  );
}