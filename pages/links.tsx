import Layout from "@/components/Layout";

export default function LinksPage() {
  return (
    <Layout title="Links">
      <section>
        <h2 className="mp-section-title">Infos</h2>
        <div className="mp-pill-buttons">
          <a
            className="mp-pill-button"
            href="https://mempool.space/"
            target="_blank"
            rel="noreferrer"
          >
            Mempool
          </a>
          <a
            className="mp-pill-button"
            href="https://andersbrownworth.com/blockchain/"
            target="_blank"
            rel="noreferrer"
          >
            Blockchain Demo
          </a>
          <a
            className="mp-pill-button"
            href="https://btc.network/estimate"
            target="_blank"
            rel="noreferrer"
          >
            Network Fee Calc.
          </a>
          <a
            className="mp-pill-button"
            href="https://bitcoincompounding.com/"
            target="_blank"
            rel="noreferrer"
          >
            BTC Retirement Plan
          </a>
        </div>
      </section>
    </Layout>
  );
}


