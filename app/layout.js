import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Mini POS System',
  description: 'ระบบขายของร้านเล็กๆ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <nav>
          <strong style={{ color: '#fff', fontSize: '1.2rem', marginRight: '1rem' }}>Mini POS</strong>
          <Link href="/">สินค้า</Link>
          <Link href="/sell">ขายสินค้า</Link>
          <Link href="/history">ประวัติการขาย</Link>
        </nav>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
