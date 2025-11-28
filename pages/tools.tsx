import Layout from "@/components/Layout";

type ToolCategory = {
  title: string;
  items: { label: string; href: string }[];
};

const categories: ToolCategory[] = [
  {
    title: "Exchanges",
    items: [
      { label: "Kraken", href: "https://www.kraken.com" },
      { label: "Coinbase", href: "https://www.coinbase.com" },
      { label: "FixedFloat", href: "https://fixedfloat.com" }
    ]
  },
  {
    title: "Markets",
    items: [
      { label: "Mempool", href: "https://mempool.space" },
      { label: "Glassnode", href: "https://glassnode.com" },
      { label: "TradingView", href: "https://www.tradingview.com" },
      { label: "Coinmetrics", href: "https://coinmetrics.io" },
      { label: "CoinMarketCap", href: "https://coinmarketcap.com" },
      { label: "Coin360", href: "https://coin360.com" },
      { label: "Coingecko", href: "https://www.coingecko.com" }
    ]
  },
  {
    title: "News",
    items: [
      { label: "Investing", href: "https://www.investing.com" },
      { label: "MarketWatch", href: "https://www.marketwatch.com" },
      { label: "CNBC", href: "https://www.cnbc.com" },
      { label: "Reuters", href: "https://www.reuters.com" },
      { label: "Bloomberg", href: "https://www.bloomberg.com" }
    ]
  },
  {
    title: "Apps",
    items: [
      { label: "Trust Wallet", href: "https://trustwallet.com" },
      { label: "Blue Wallet", href: "https://bluewallet.io" },
      { label: "Cash App", href: "https://cash.app" }
    ]
  },
  {
    title: "Hardware Wallets",
    items: [
      { label: "Trezor", href: "https://trezor.io" },
      { label: "BitBox", href: "https://shiftcrypto.ch/bitbox02" },
      { label: "Ledger", href: "https://www.ledger.com" }
    ]
  }
];

export default function ToolsPage() {
  return (
    <Layout title="Tools">
      <section className="mp-columns">
        {categories.map((cat) => (
          <div key={cat.title}>
            <h2 className="mp-section-title">{cat.title}</h2>
            <div className="mp-pill-buttons">
              {cat.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mp-pill-button"
                >
                  {item.label.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </Layout>
  );
}


