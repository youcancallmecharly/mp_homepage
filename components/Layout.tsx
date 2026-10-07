import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

const siteOrigin = "https://moneypenny.li";

type LayoutProps = {
  title?: string;
  documentTitle?: string;
  description?: string;
  ogType?: "website" | "article";
  children: React.ReactNode;
};

const navItems = [
  { href: "/", label: "Base" },
  { href: "/education", label: "Education" },
  { href: "/money", label: "Money" },
  { href: "/youtube", label: "Youtube" },
  { href: "/tools", label: "Tools" },
  { href: "/library", label: "Library" },
  { href: "/links", label: "Links" }
];

export default function Layout({
  title,
  documentTitle,
  description,
  ogType = "website",
  children,
}: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const pageTitle =
    documentTitle ?? (title ? `${title} | Money Penny` : "Money Penny");
  const pageDescription =
    description ?? "Money Penny – Bitcoin education, tools and links.";
  const path = router.asPath.split("?")[0].split("#")[0] || "/";
  const canonical = `${siteOrigin}${path === "/" ? "/" : path}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content={ogType} />
        <meta property="og:image" content={`${siteOrigin}/moneypenny-icon.jpg`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${siteOrigin}/moneypenny-icon.jpg`} />
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


