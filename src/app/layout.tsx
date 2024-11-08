import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import { Root } from '@/components/Root/Root';

import '@vkontakte/vkui/dist/vkui.css';
import 'normalize.css/normalize.css';

export const metadata: Metadata = {
  title: 'Telegram Mini App',
  description: 'This is an example of Telegram Mini App built with next.js',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html>
      <body>
        <Root>
          {children}
        </Root>
      </body>
    </html>
  );
}
