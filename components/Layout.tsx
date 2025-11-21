import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

type LayoutProps = {
  title?: string;
  children: React.ReactNode;
};

const navItems = [
  { href: "/", label: "Base" },
  { href: "/education", label: "Education" },
  { href: "/youtube", label: "Youtube" },
  { href: "/tools", label: "Tools" },
  { href: "/links", label: "Links" },
  { href: "/nodes", label: "Nodes" }
];

export default function Layout({ title, children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const pageTitle = title ? `${title} | Money Penny` : "Money Penny";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Money Penny – Bitcoin education, tools, links and node visualization."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mp-page">
        <header className="mp-header">
          <div className="mp-header-left">
            <Link href="/" className="mp-logo-link" aria-label="Money Penny home">
              <Image
                src="/moneypenny-icon.jpg"
                alt="Money Penny logo"
                width={48}
                height={48}
                priority
                className="mp-logo"
              />
            </Link>
            <div className="mp-brand">
              <span className="mp-brand-line" />
              <span className="mp-brand-text">MONEY PENNY</span>
              <span className="mp-brand-line" />
            </div>
          </div>
          <nav className="mp-nav mp-nav-desktop">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  router.pathname === item.href
                    ? "mp-nav-link mp-nav-link-active"
                    : "mp-nav-link"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            className="mp-nav-toggle"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </header>

        {menuOpen && (
          <nav className="mp-nav mp-nav-mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  router.pathname === item.href
                    ? "mp-nav-link mp-nav-link-active"
                    : "mp-nav-link"
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {title && <div className="mp-ribbon">{title.toUpperCase()}</div>}

        <main className="mp-main">{children}</main>

        <footer className="mp-footer">
          <span>© {new Date().getFullYear()} Money Penny</span>
        </footer>
      </div>
    </>
  );
}


