import type { PropsWithChildren } from 'react';
import { Metadata, Viewport } from 'next';

import { siteConfig } from '@/config/site';

import { Root } from '@/components/Root';

import '@vkontakte/vkui/dist/vkui.css';
import 'normalize.css/normalize.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ]
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html>
      <body className='antialiased'>
        <Root>
          {children}
        </Root>
      </body>
    </html>
  );
}
