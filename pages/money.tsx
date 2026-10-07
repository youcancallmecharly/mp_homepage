import Layout from "@/components/Layout";
import Link from "next/link";
import {
  basketAnnualRate,
  basketIndex2025,
  basketItems,
  cbdcComparison,
  euroBasketAnnualPublished,
  euroBasketClaimAfterHorizon,
  factsSince1971,
  faq,
  moneyPageDescription,
  moneyPageTitle,
  pageJsonLd,
  formatEur,
  formatPct,
  formatUsd,
  hicpAnnual2022,
  hicpAnnualRate,
  hicpIndex2025,
  horizonYears,
  housePriceAnnualRate,
  housePriceIndex2025,
  moneyComparison,
  range2026,
  reviewedOn,
  savingsPrincipal,
  sources,
  usCpiAnnualPublished,
  usCpiClaimAfterHorizon,
  usCpiPeakToJune2022,
  usHouseAnnualPublished,
  usM2AnnualPublished,
  usM2ClaimAfterHorizon,
} from "@/content/soundMoney";

const pct = formatPct;
const usd = formatUsd;
const eur = formatEur;

export default function MoneyPage() {
  return (
    <Layout
      title="Money"
      documentTitle={moneyPageTitle}
      description={moneyPageDescription}
      ogType="article"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <h1 className="mp-heading" id="sound-money">
        Sound money
      </h1>
      <p className="mp-body">
        A source page on what money is, why some monies last, what changed in
        1971, why a published inflation rate of 2% fails a hard check, and how
        Bitcoin differs from a central bank digital currency. Figures were read
        on {reviewedOn}. Each one links to the series it came from. Dollar
        rates and euro rates are never mixed.
      </p>

      <section id="summary">
        <h2 className="mp-heading">The numbers, in one place</h2>
        <p className="mp-body">
          Three kinds of figure appear below. Official means a published index.
          This page&apos;s calculation means the fixed euro basket. Money stock
          means growth of the quantity of dollars, which is not a price index.
        </p>
        <div className="mp-table-wrap">
          <table className="mp-table">
            <caption className="mp-body">
              Compound rates. Retrieved {reviewedOn}.
            </caption>
            <thead>
              <tr>
                <th>Place</th>
                <th>Measure</th>
                <th>Kind</th>
                <th>Per year</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>United States</td>
                <td>M2 money stock, Aug 1971–Aug 2026</td>
                <td>Money stock, not CPI</td>
                <td>{pct(usM2AnnualPublished)}</td>
              </tr>
              <tr>
                <td>United States</td>
                <td>CPI-U, Aug 1971–Aug 2026</td>
                <td>Official consumer prices</td>
                <td>{pct(usCpiAnnualPublished)}</td>
              </tr>
              <tr>
                <td>United States</td>
                <td>Median house price, 1971 Q3–2026 Q2</td>
                <td>Official sale price, not the CPI</td>
                <td>{pct(usHouseAnnualPublished)}</td>
              </tr>
              <tr>
                <td>Euro area</td>
                <td>HICP, 2015–2025</td>
                <td>Official consumer prices</td>
                <td>{pct(hicpAnnualRate)}</td>
              </tr>
              <tr>
                <td>Euro area</td>
                <td>Fixed basket on this page, 2015–2025</td>
                <td>This page&apos;s calculation</td>
                <td>{pct(basketAnnualRate)}</td>
              </tr>
              <tr>
                <td>Euro area</td>
                <td>House purchase prices, 2015–2025</td>
                <td>Official, and outside the HICP</td>
                <td>{pct(housePriceAnnualRate)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mp-body">
          A long average hides a spike. Official US CPI rose{" "}
          {pct(usCpiPeakToJune2022)} in the twelve months to June 2022. The
          euro-area HICP annual average rose {pct(hicpAnnual2022)} in 2022.
        </p>
      </section>

      <section id="what-money-is">
        <h2 className="mp-heading">What money is</h2>
        <p className="mp-body">
          Money does three jobs. It is a medium of exchange, so two people can
          trade without bartering. It is a unit of account, so prices share one
          measure. It is a store of value, so saving today can still buy goods
          later. The short comparison of those jobs is on the{" "}
          <Link href="/education" className="mp-link">
            Education
          </Link>{" "}
          page. This page is about which goods can keep the third job.
        </p>
      </section>

      <section id="why-some-money-wins">
        <h2 className="mp-heading">Why some money wins</h2>
        <p className="mp-body">
          A good monetary good is durable, easy to check, easy to carry, and
          easy to split. The property that decides the store of value is
          hardness: the stock already in existence, divided by how much can be
          produced in a year. If new units are cheap to make, the stock-to-flow
          collapses and the old holders are diluted.
        </p>
        <h3 className="mp-subheading">Shells, gold, housing, notes, bitcoin</h3>
        <p className="mp-body">
          Shells have been money. They fail when someone finds a beach, or a
          way to manufacture them. Gold lasted as money because a year of mining
          is small next to the gold already above ground. Housing is scarce in
          a given city, but the stock grows when people build, including upward.
          A higher price calls forth more floor space. Fiat notes have no such
          physical limit. The central bank sets the new supply. Bitcoin&apos;s
          new supply does not rise when the price rises. The subsidy started at
          50 bitcoin a block and is cut in half every 210,000 blocks. The sum of
          that schedule is 21 million. Integer division of the subsidy leaves
          the issued total slightly under the round number. By {reviewedOn},{" "}
          <a
            className="mp-link"
            href="https://blockchain.info/q/totalbc"
            target="_blank"
            rel="noreferrer"
          >
            20,094,278 bitcoin
          </a>{" "}
          had been issued.
        </p>
        <div className="mp-table-wrap">
          <table className="mp-table">
            <caption className="mp-body">
              The same properties, across five monetary goods.
            </caption>
            <thead>
              <tr>
                <th>Property</th>
                <th>Shells</th>
                <th>Gold</th>
                <th>Fiat notes</th>
                <th>Housing</th>
                <th>Bitcoin</th>
              </tr>
            </thead>
            <tbody>
              {moneyComparison.map((row) => (
                <tr key={row.property}>
                  <td>{row.property}</td>
                  <td>{row.shells}</td>
                  <td>{row.gold}</td>
                  <td>{row.fiat}</td>
                  <td>{row.housing}</td>
                  <td>{row.bitcoin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mp-subheading" id="how-long-money-lasts">
          How long a money lasts
        </h3>
        <p className="mp-body">
          Gold as a monetary metal is measured in millennia. The metal is still
          here. Fiat units are not. The Papiermark was destroyed in the
          hyperinflation of 1923. The Reichsmark was replaced in the western
          zones by the Deutsche Mark in 1948. The Deutsche Mark itself ended as
          cash when euro notes arrived on 1 January 2002, after book-entry euros
          began on 1 January 1999. The state continued. The unit did not.
        </p>
        <p className="mp-body">
          The US dollar is a different case. The unit still exists. On 15 August
          1971 the United States suspended the promise that foreign central
          banks could convert dollars into gold at 35 dollars an ounce. That
          promise did not return. This was a broken redemption contract, not a
          court bankruptcy of the United States. The note continued without the
          asset it had pointed to.
        </p>
        <p className="mp-body">
          Bitcoin is young. The genesis block is dated 3 January 2009. Issuance
          since then is public: about 20.09 million of the scheduled 21 million
          by {reviewedOn}. Adoption into regulated savings products is also
          dated. On 10 January 2024 the US Securities and Exchange Commission
          allowed spot bitcoin exchange-traded products. In Switzerland, pillar
          3a providers such as finpension have offered an optional allocation to
          a bitcoin exchange-traded product inside the pension foundation. The
          foundation holds the product. The saver does not hold the keys. Published
          accounts put the foundation&apos;s own cap near 5% of the 3a assets.
          That cap is the foundation&apos;s rule, not a feature of Bitcoin. If
          the network is still here in several decades, savings that today sit
          in other scarce goods have an alternative with no issuer. That
          consequence is set out below. It is not a claim that the switch has
          already happened.
        </p>
      </section>

      <section id="short-history">
        <h2 className="mp-heading">A short history</h2>
        <p className="mp-body">
          People have settled debts in shells, cattle, salt, and metal. Coins
          concentrated that job. Gold and silver carried value across distance
          because they were hard to multiply. Later, paper notes circulated as
          claims on metal sitting in a vault. The claim was only as good as the
          vault&apos;s promise.
        </p>
        <p className="mp-body">
          Bretton Woods, agreed in 1944, tied other currencies to the dollar and
          tied the dollar, for foreign central banks, to gold at 35 dollars an
          ounce. On 15 August 1971 President Nixon suspended that conversion and
          called the step temporary. The conversion did not resume. The world
          moved to fiat: notes and deposits backed by law and by the issuer&apos;s
          restraint, not by a redeemable stock of metal.
        </p>
        <p className="mp-body">
          Bitcoin&apos;s genesis block followed on 3 January 2009, with a
          schedule no issuer can quietly raise. A central bank digital currency
          is the next proposal from the other direction: the same issuer, in
          digital form, with the account rules the issuer can write. The ECB
          says no decision to issue a digital euro has been taken. It is
          preparing for the possibility.
        </p>
      </section>

      <section id="since-1971">
        <h2 className="mp-heading">What changed in 1971</h2>
        <p className="mp-body">
          The break is documented by{" "}
          <a
            className="mp-link"
            href="https://www.federalreservehistory.org/essays/gold-convertibility-ends"
            target="_blank"
            rel="noreferrer"
          >
            Federal Reserve History
          </a>
          . A German-language walk through the years after the break is at
          Blocktrainer,{" "}
          <a
            className="mp-link"
            href="https://www.blocktrainer.de/blog/wtf-happened-in-1971-die-katastrophalen-auswirkungen-von-ungedecktem-papiergeld"
            target="_blank"
            rel="noreferrer"
          >
            WTF happened in 1971
          </a>
          . The multiples below are computed from the primary series, not copied
          from that article. They are developments since the gold restraint
          ended. They are not a cause for every social chart that starts near
          1971.
        </p>
        <div className="mp-table-wrap">
          <table className="mp-table">
            <caption className="mp-body">
              US series from the end of dollar-gold convertibility to {reviewedOn}.
            </caption>
            <thead>
              <tr>
                <th>What changed</th>
                <th>Multiple</th>
                <th>Period</th>
                <th>Series</th>
              </tr>
            </thead>
            <tbody>
              {factsSince1971.map((fact) => (
                <tr key={fact.id}>
                  <td>{fact.claim}</td>
                  <td>{fact.figure}</td>
                  <td>{fact.period}</td>
                  <td>
                    <a
                      className="mp-link"
                      href={fact.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {fact.sourceName}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mp-body">
          Read together, in dollars only: the money stock compounded at{" "}
          {pct(usM2AnnualPublished)} a year, official consumer prices at{" "}
          {pct(usCpiAnnualPublished)} a year, and median house prices at{" "}
          {pct(usHouseAnnualPublished)} a year. The quantity of dollars grew
          faster than consumer prices, and house prices grew faster than
          consumer prices again.
          Output per hour pulled away from real pay. Gold, measured against the
          old 35-dollar parity, repriced by about 120 times. The futures print
          of 4,199.80 dollars is a market price on {reviewedOn}. The 35-dollar
          figure was an official parity, not a futures settlement from the same
          contract.
        </p>
      </section>

      <section id="price-index">
        <h2 className="mp-heading">
          Why the official price index fails a hard check
        </h2>
        <p className="mp-body">
          The statistic is not a forgery. It is a different question from the
          one a household asks. The{" "}
          <a
            className="mp-link"
            href="https://www.ecb.europa.eu/stats/macroeconomic_and_sectoral/hicp/html/index.en.html"
            target="_blank"
            rel="noreferrer"
          >
            ECB says
          </a>{" "}
          it aims for 2% inflation over the medium term, and that its reference
          is the Harmonised Index of Consumer Prices compiled by Eurostat. That
          2% is a target for that index. It is not a measurement of an unchanged
          household bill.
        </p>
        <p className="mp-body">
          The dataset is incongruent with that bill. When a good rises fast, the
          basket substitutes a cheaper one and the expensive good loses weight.
          Weights are updated every year, so the pain of last year&apos;s bill
          drops out of next year&apos;s average. A quality adjustment can count
          a higher till price as a price cut if the statistician decides the
          new good is better. Eurostat also publishes indexes that exclude
          energy, food, alcohol, and tobacco. Officials often cite that narrower
          rate. Electricity and the grocery bill are outside it by construction.
        </p>
        <p className="mp-body">
          Housing and insurance are the clearest gaps. The HICP has measured
          tenants&apos; rents, not the price of buying the home you live in. On
          8 July 2021 the ECB{" "}
          <a
            className="mp-link"
            href="https://www.ecb.europa.eu/press/pr/date/2021/html/ecb.pr210708~dc78cc4b0d.en.html"
            target="_blank"
            rel="noreferrer"
          >
            kept the HICP as its reference and recommended adding owner-occupied
            housing over time
          </a>
          . Health premiums are often rewritten inside the health component
          instead of entered as the transfer the household actually sends.
        </p>

        <h3 className="mp-subheading" id="fixed-basket">
          A fixed basket, nothing swapped
        </h3>
        <p className="mp-body">
          This is a counter-account, not a second statistical office and not
          &quot;the true inflation.&quot; It uses euro-area sub-indexes so it
          answers the ECB rather than mixing in another currency. The goods stay
          the same from 2015 to 2025. The weights below are chosen once, for
          costs a household cannot drop, and they are not updated when a price
          rises. Nothing is swapped for a cheaper category.
        </p>
        <div className="mp-table-wrap">
          <table className="mp-table">
            <caption className="mp-body">
              Euro area, annual average index, 2015 = 100. Eurostat prc_hicp_aind.
              Weights sum to 1 and are this page&apos;s weights, not Eurostat&apos;s.
            </caption>
            <thead>
              <tr>
                <th>Item</th>
                <th>Code</th>
                <th>Weight</th>
                <th>2015</th>
                <th>2025</th>
                <th>Per year</th>
              </tr>
            </thead>
            <tbody>
              {basketItems.map((item) => (
                <tr key={item.code}>
                  <td>{item.label}</td>
                  <td>{item.code}</td>
                  <td>{item.weight.toFixed(2)}</td>
                  <td>{item.index2015.toFixed(2)}</td>
                  <td>{item.index2025.toFixed(2)}</td>
                  <td>
                    {pct(
                      (item.index2025 / item.index2015) ** (1 / 10) - 1
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>This basket</td>
                <td>fixed weights</td>
                <td>1.00</td>
                <td>100.00</td>
                <td>{basketIndex2025.toFixed(2)}</td>
                <td>{pct(basketAnnualRate)}</td>
              </tr>
              <tr>
                <td>HICP, all items</td>
                <td>CP00</td>
                <td>official</td>
                <td>100.00</td>
                <td>{hicpIndex2025.toFixed(2)}</td>
                <td>{pct(hicpAnnualRate)}</td>
              </tr>
              <tr>
                <td>House purchase prices (not in the HICP)</td>
                <td>prc_hpi_a</td>
                <td>left out</td>
                <td>100.00</td>
                <td>{housePriceIndex2025.toFixed(2)}</td>
                <td>{pct(housePriceAnnualRate)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mp-body">
          The basket index is the weighted sum of the 2025 indexes: 0.40 ×
          118.85 + 0.30 × 141.41 + 0.10 × 154.17 + 0.05 × 160.84 + 0.15 × 115.44
          = {basketIndex2025.toFixed(2)}. The annual rate is that index over
          100, to the power of 1/10, minus 1, which is {pct(basketAnnualRate)}.
          Headline HICP over the same window is {pct(hicpAnnualRate)}.
        </p>
        <p className="mp-body">
          The gap is 0.16 percentage points. That is not the hard check, and it
          does not clear the 2% target. It shows the limit of reweighting
          indexes that are already adjusted inside each series. Electricity and
          gas inside the basket rose faster than the headline. They are diluted
          by the rent and health sub-indexes. The hard check is elsewhere: US M2
          at {pct(usM2AnnualPublished)} a year against US CPI at{" "}
          {pct(usCpiAnnualPublished)} a year, and house purchase prices, which
          this index leaves out.
        </p>
        <p className="mp-body">
          The row the index still leaves out is the purchase of a home. Euro
          area house prices rose from 100 to {housePriceIndex2025.toFixed(2)}{" "}
          between 2015 and 2025, about {pct(housePriceAnnualRate)} a year. That
          series is not called inflation on this page. It is the scarce good
          households actually buy when they try to store savings, and it is
          absent from the rate the ECB steers by.
        </p>
        <p className="mp-body">
          The ten-year euro average also hides 2022. The HICP annual average
          rose {pct(hicpAnnual2022)} that year. In the United States, CPI-U rose{" "}
          {pct(usCpiPeakToJune2022)} in the twelve months to June 2022. A rate
          near 2% is what the long window looks like after that spike has been
          averaged in.
        </p>
      </section>

      <section id="why-prices-rise">
        <h2 className="mp-heading">Why prices rise</h2>
        <p className="mp-body">
          A price is a ratio: how many units of the money for how much of the
          good. More units, with the same goods, raise the ratio. Technical
          progress works the other way. It should make many goods cheaper. From
          1971 onward the US price level rose anyway, while the money stock rose
          faster still. The new units did not fund a matching pile of new goods.
        </p>
        <p className="mp-body">
          Richard Cantillon described the path in the 18th century. New money
          does not reach every person on the same day. It arrives first at the
          point of issue: the state, the banks, and the markets where the new
          balances are spent. Those buyers pay yesterday&apos;s prices. As the
          units move outward, rents, food, and energy are already higher. Wages
          and the savings account adjust last. The same official rate therefore
          feels different to a renter than to the balance sheet that received
          the units first. Since 1971, house prices and financial assets have
          outrun the consumer basket. That is what the order of arrival looks
          like in the data.
        </p>
      </section>

      <section id="purchasing-power">
        <h2 className="mp-heading">What inflation does to savings</h2>
        <aside className="mp-note" id="two-percent-disclaimer">
          <p className="mp-body">
            Do not read 2% as the loss on savings. That figure is the ECB&apos;s
            target for the euro-area HICP. The{" "}
            <a className="mp-link" href="#price-index">
              price-index section
            </a>{" "}
            shows why the dataset fails a hard check. The failure is not the
            0.16 percentage point gap between this page&apos;s basket and the
            HICP. It is the money stock and the house prices the index leaves
            out. Each line below names its currency and its kind: money stock,
            official consumer prices, or this page&apos;s euro basket. A euro
            rate is not applied to a dollar sum.
          </p>
        </aside>
        <h3 className="mp-subheading">United States, in dollars</h3>
        <p className="mp-body">
          US M2 compounded at {pct(usM2AnnualPublished)} a year from August 1971
          to August 2026. That is growth of the money stock. It is not consumer
          price inflation. A claim on that stock shrinks at the same rate:{" "}
          {usd(savingsPrincipal)} / (1.066)
          <sup>{horizonYears}</sup> = {usd(usM2ClaimAfterHorizon)}. The account
          can still show {usd(savingsPrincipal)}. No parliament voted a tax in
          that amount. New dollars did the dilution. Rule of thumb: 72 / 6.6 is
          about 11 years for that claim to halve.
        </p>
        <p className="mp-body">
          Official CPI-U compounded at {pct(usCpiAnnualPublished)} a year over
          the same months. {usd(savingsPrincipal)} / (1.039)
          <sup>{horizonYears}</sup> = {usd(usCpiClaimAfterHorizon)}. That line
          is the official consumer-price path. Median house prices compounded
          faster, at {pct(usHouseAnnualPublished)} a year, and they are not the
          CPI. The twelve months to June 2022 rose{" "}
          {pct(usCpiPeakToJune2022)}, which the 55-year average smooths away.
        </p>
        <h3 className="mp-subheading">Euro area, in euros</h3>
        <p className="mp-body">
          This paragraph does not use the dollar lines. Official HICP, 2015 to
          2025, compounded at {pct(hicpAnnualRate)} a year. This page&apos;s
          fixed basket compounded at {pct(basketAnnualRate)} a year. At the
          published basket rate of {pct(euroBasketAnnualPublished)},{" "}
          {eur(savingsPrincipal)} / (1.0272)
          <sup>{horizonYears}</sup> = {eur(euroBasketClaimAfterHorizon)}. House
          purchase prices, outside the HICP, compounded at{" "}
          {pct(housePriceAnnualRate)} a year. The 2022 HICP average of{" "}
          {pct(hicpAnnual2022)} is inside the ten-year figure, not instead of
          it.
        </p>
      </section>

      <section id="how-to-save">
        <h2 className="mp-heading">How to save, and the shift in scarce goods</h2>
        <p className="mp-body">
          Saving is consumption postponed. It only works in a good whose quantity
          does not grow with the price. Long-term savings left only in bank
          deposits lose the gap in the section above. Hard money keeps the
          purchasing power because nobody can vote a larger supply into being.
        </p>
        <p className="mp-body">
          Housing is the scarce savings good many households, and many pension
          funds, already use. Against bitcoin it is clumsy. It does not split
          into a small amount without selling the whole asset. It does not
          travel. It needs maintenance, tax, and permission from the place it
          stands. And, as above, new living space can be built, including
          upward, so the stock responds to the price. Bitcoin splits to a
          satoshi, settles worldwide, has no building to repair, and does not
          issue more units because the price rose.
        </p>
        <p className="mp-body">
          The price still moves, and that risk belongs on this page. From 1
          January 2026 through {reviewedOn}, the distance from the low to the
          high was about {pct(range2026.goldFutures)} for COMEX gold futures,
          about {pct(range2026.silverFutures)} for COMEX silver futures, and
          about {pct(range2026.bitcoin)} for bitcoin. Bitcoin is not in a class
          of its own on that year&apos;s range. Gold and silver swung hard too.
          What is different is age. Gold has been a monetary metal for millennia.
          Bitcoin has been issued only since the genesis block of 3 January
          2009, so the record is short and a young market can gap. A price drop
          does not change the 21 million schedule. The range is not a forecast
          of the next year.
        </p>
        <p className="mp-body">
          A shift follows if bitcoin keeps purchasing power better than housing.
          This is a consequence, not a forecast and not a claim about next
          year&apos;s price. Pension funds and property funds hold buildings
          partly because the buildings are scarce. Early, capped access already
          exists inside some Swiss pillar 3a foundations, as a small slice of a
          regulated portfolio rather than as self-custody. If that scarcity
          premium moves toward a monetary good with a harder supply, funds have
          a reason to sell buildings and hold the harder good. Less demand for
          the property fund, more buildings offered for sale, and a smaller
          monetary premium inside the house price. The roof and the rooms
          remain. The role of the house as a savings technology gets weaker.
        </p>
        <p className="mp-body">
          This page does not say &quot;buy now.&quot; A practical distinction is
          custody. Coins left on an exchange are someone else&apos;s promise.
          Coins under keys you control are not. The{" "}
          <Link href="/tools" className="mp-link">
            Tools
          </Link>{" "}
          page lists wallet software and a hardware wallet, along with
          exchanges.
        </p>
      </section>

      <section id="cbdc-and-bitcoin">
        <h2 className="mp-heading">CBDC and Bitcoin</h2>
        <p className="mp-body">
          A central bank digital currency is money issued by the central bank in
          digital form. The ECB describes a digital euro as a digital form of
          cash for the euro area, complementary to notes, with no decision yet
          to issue it. The comparison below uses the ECB&apos;s own FAQ where it
          states a design choice, and states the matching Bitcoin rule beside
          it.
        </p>
        <div className="mp-table-wrap">
          <table className="mp-table">
            <caption className="mp-body">
              Design properties. Digital-euro cells follow the ECB FAQ as of{" "}
              {reviewedOn}.
            </caption>
            <thead>
              <tr>
                <th>Topic</th>
                <th>CBDC (digital euro, as described)</th>
                <th>Bitcoin</th>
              </tr>
            </thead>
            <tbody>
              {cbdcComparison.map((row) => (
                <tr key={row.topic}>
                  <td>{row.topic}</td>
                  <td>{row.cbdc}</td>
                  <td>{row.bitcoin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mp-body">
          The sentence worth quoting in full is the ECB&apos;s, from its{" "}
          <a
            className="mp-link"
            href="https://www.ecb.europa.eu/euro/digital_euro/faqs/html/ecb.faq_digital_euro.en.html"
            target="_blank"
            rel="noreferrer"
          >
            digital euro FAQ
          </a>
          : programmable money is &quot;a digital form of money used for a
          predefined purpose, like a voucher, with limitations on where, when or
          with whom it can be used.&quot; The ECB says the digital euro would
          never be programmable money, and that it could facilitate conditional
          payments, for example pay-on-delivery. Read both halves. The refusal
          is a rule the issuer writes and can later revise. Conditional payment
          is already a condition on when the unit moves. Bitcoin has no office
          that can add a voucher rule, a holding cap, or a border.
        </p>
        <p className="mp-body">
          Reach is the same distinction. Bitcoin can be sent between two people
          anywhere the network is reachable, without a state approving the
          payment. A digital euro, on the ECB&apos;s description, is for the
          euro area and moves through payment service providers. A payment the
          issuer or the provider will not pass does not pass. Foreign use is
          not a default. It exists when the authorities open it.
        </p>
        <p className="mp-body">
          An automated agent that pays another party needs a unit it can receive
          without opening an account at a bank or a payment service provider.
          Bitcoin allows that on the rules already stated above: no issuer, and
          settlement between any two parties that can reach the network. The
          agent still needs keys, a fee, and a counterparty that accepts the
          payment. A digital euro, on the ECB FAQ as of {reviewedOn}, would
          still move through supervised intermediaries inside the euro area.
          This page only states which design properties fit settlement without
          a bank or payment-service account.
        </p>
      </section>

      <section id="faq">
        <h2 className="mp-heading">Questions this page answers</h2>
        <p className="mp-body">
          The same answers are in the page markup for search engines and AIs.
          The rates match the sections above, including {pct(usM2AnnualPublished)}{" "}
          for US M2.
        </p>
        {faq.map((item) => (
          <div key={item.question}>
            <h3 className="mp-subheading">{item.question}</h3>
            <p className="mp-body">{item.answer}</p>
          </div>
        ))}
      </section>

      <section id="sources">
        <h2 className="mp-heading">Sources</h2>
        <p className="mp-body">
          Last reviewed {reviewedOn}. The levels were read from the linked
          series on that date and will change. Dollar arithmetic uses the
          rounded US rates in the summary (6.6% and 3.9%). Euro arithmetic uses
          the rounded basket rate of 2.72%. Neither line is a forecast, and
          neither is the other currency.
        </p>
        <ul className="mp-body">
          {sources.map((source) => (
            <li key={source.url}>
              <a
                className="mp-link"
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {source.name}
              </a>
              . {source.note}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
