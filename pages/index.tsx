import Layout from "@/components/Layout";
import Head from "next/head";

export default function HomePage() {
  return (
    <Layout title="Touch Base">
      <Head>
        <meta
          name="description"
          content="Bitcoin overview with interactive price chart plus curated education links."
        />
      </Head>
      <section>
        <iframe
          title="Bitcoin price chart"
          className="mp-chart-frame"
          src="https://www.tradingview.com/embed-widget/mini-symbol-overview/?locale=en#%7B%22symbol%22%3A%22BINANCE%3ABTCUSDT%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22400%22%2C%22dateRange%22%3A%221D%22%7D"
          loading="lazy"
        />
        <h2 className="mp-heading">BITCOIN OVERVIEW</h2>
        <p className="mp-body">
          links to education and infos about blockchain &amp; crypto
        </p>
        <p className="mp-body">
          extract from the glossary by Andreas M. Antonopoulos{" "}
          <a
            className="mp-link"
            href="https://aantonop.com/"
            target="_blank"
            rel="noreferrer"
          >
            LINK
          </a>
        </p>

        <h3 className="mp-subheading">BLOCKCHAIN (BITCOIN)</h3>
        <p className="mp-body">
          A list of validated blocks, each linking to its predecessor all the
          way to the genesis block.
        </p>

        <h3 className="mp-subheading">BITCOIN</h3>
        <p className="mp-body">
          The name of the currency unit (the coin), the network, and the
          software.
        </p>
      </section>
    </Layout>
  );
}


