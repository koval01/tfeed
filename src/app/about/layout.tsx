import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About'
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => children;

export default Layout;
