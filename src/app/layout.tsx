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
  applicationName: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    siteName: siteConfig.name
  },
  twitter: {
    site: "@Telegram"
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  generator: "Next.js",
  robots: "index, follow",
  alternates: { canonical: "https://tfeed.koval.page" },
  appLinks: {
    ios: {
      app_store_id: 686449807,
      app_name: "Telegram Messenger",
      url: "tg://resolve?domain=telegram"
    },
    android: {
      package: "org.telegram.messenger",
      app_name: "Telegram",
      url: "tg://resolve?domain=telegram"
    }
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ]
}

const RootLayout = ({ children }: PropsWithChildren) => {
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

export default RootLayout;
