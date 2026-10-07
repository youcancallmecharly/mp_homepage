export const reviewedOn = "6 October 2026";

export const savingsPrincipal = 500_000;
export const horizonYears = 12;

/** August 1971 to August 2026. Published rate is the compound rate rounded to 0.1%. */
export const usM2Start = 685.5;
export const usM2End = 23342.8;
export const usM2Years = 55;
export const usM2Multiple = usM2End / usM2Start;
export const usM2AnnualPublished = 0.066;

/** August 1971 to August 2026. Official US CPI-U. */
export const usCpiStart = 40.7;
export const usCpiEnd = 334.131;
export const usCpiYears = 55;
export const usCpiMultiple = usCpiEnd / usCpiStart;
export const usCpiAnnualPublished = 0.039;
/** Twelve months to June 2022, CPIAUCSL. */
export const usCpiPeakToJune2022 = 0.09;

/** 1971 Q3 to 2026 Q2, 54.75 years. Official median US house price, not the CPI. */
export const usHouseStart = 25300;
export const usHouseEnd = 410700;
export const usHouseYears = 54.75;
export const usHouseMultiple = usHouseEnd / usHouseStart;
export const usHouseAnnualPublished = 0.052;

export const usM2ClaimAfterHorizon = Math.round(
  savingsPrincipal / (1 + usM2AnnualPublished) ** horizonYears
);
export const usCpiClaimAfterHorizon = Math.round(
  savingsPrincipal / (1 + usCpiAnnualPublished) ** horizonYears
);

export function formatPct(rate: number) {
  return `${(rate * 100).toFixed(2)}%`;
}

export function formatUsd(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatEur(amount: number) {
  return `€${amount.toLocaleString("en-US")}`;
}

export type BasketItem = {
  code: string;
  label: string;
  weight: number;
  index2015: number;
  index2025: number;
};

/**
 * Euro area HICP annual average indexes, 2015 = 100.
 * Eurostat prc_hicp_aind, unit INX_A_AVG, geo EA. Retrieved 6 October 2026.
 * House prices are a separate dataset (prc_hpi_a) and are not inside the basket.
 */
export const basketItems: BasketItem[] = [
  {
    code: "CP041",
    label: "Actual rentals for housing",
    weight: 0.4,
    index2015: 100,
    index2025: 118.85,
  },
  {
    code: "CP011",
    label: "Food",
    weight: 0.3,
    index2015: 100,
    index2025: 141.41,
  },
  {
    code: "CP0451",
    label: "Electricity",
    weight: 0.1,
    index2015: 100,
    index2025: 154.17,
  },
  {
    code: "CP0452",
    label: "Gas",
    weight: 0.05,
    index2015: 100,
    index2025: 160.84,
  },
  {
    code: "CP06",
    label: "Health",
    weight: 0.15,
    index2015: 100,
    index2025: 115.44,
  },
];

export const hicpIndex2025 = 128.75;
export const housePriceIndex2025 = 153.45;

export const basketIndex2025 = basketItems.reduce(
  (sum, item) => sum + item.weight * item.index2025,
  0
);

const spanYears = 10;

export function annualRateFromIndex(endIndex: number, years = spanYears) {
  return (endIndex / 100) ** (1 / years) - 1;
}

export const basketAnnualRate = annualRateFromIndex(basketIndex2025);
export const hicpAnnualRate = annualRateFromIndex(hicpIndex2025);
export const housePriceAnnualRate = annualRateFromIndex(housePriceIndex2025);

export function purchasingPower(
  principal: number,
  annualRate: number,
  years: number
) {
  return principal / (1 + annualRate) ** years;
}

/** Euro-area annual average HICP, 2021 and 2022, same dataset as hicpIndex2025. */
export const hicpIndex2021 = 107.78;
export const hicpIndex2022 = 116.82;
export const hicpAnnual2022 = hicpIndex2022 / hicpIndex2021 - 1;

/**
 * Euro sum at this page's fixed-basket rate. Not a dollar figure and not the HICP.
 * Uses the rounded 2.72% so a reader can reproduce the line.
 */
export const euroBasketAnnualPublished = 0.0272;
export const euroBasketClaimAfterHorizon = Math.round(
  purchasingPower(savingsPrincipal, euroBasketAnnualPublished, horizonYears)
);

/**
 * Distance from the low to the high, 1 January 2026 through 6 October 2026.
 * Not a loss from the peak. Yahoo Finance daily range.
 */
export const range2026 = {
  goldFutures: 0.41,
  silverFutures: 1.2,
  bitcoin: 0.7,
};

export type Fact = {
  id: string;
  claim: string;
  figure: string;
  period: string;
  sourceName: string;
  sourceUrl: string;
};

export const factsSince1971: Fact[] = [
  {
    id: "m2",
    claim:
      "US M2 money stock, seasonally adjusted, was 685.5 billion dollars in August 1971 and 23,342.8 billion dollars in August 2026.",
    figure: `${usM2Multiple.toFixed(1)} times, ${formatPct(usM2AnnualPublished)} a year`,
    period: "August 1971 to August 2026",
    sourceName: "FRED series M2SL",
    sourceUrl: "https://fred.stlouisfed.org/series/M2SL",
  },
  {
    id: "cpi",
    claim:
      "The US consumer price index (CPI-U, 1982–84 = 100) was 40.700 in August 1971 and 334.131 in August 2026.",
    figure: `${usCpiMultiple.toFixed(1)} times, ${formatPct(usCpiAnnualPublished)} a year`,
    period: "August 1971 to August 2026",
    sourceName: "FRED series CPIAUCSL",
    sourceUrl: "https://fred.stlouisfed.org/series/CPIAUCSL",
  },
  {
    id: "gold",
    claim:
      "Under Bretton Woods, foreign central banks could convert dollars at 35 dollars an ounce of gold. A COMEX gold futures price on 6 October 2026 was 4,199.80 dollars an ounce.",
    figure: "about 120 times the old parity",
    period: "Official parity versus 6 October 2026",
    sourceName: "Federal Reserve History",
    sourceUrl:
      "https://www.federalreservehistory.org/essays/gold-convertibility-ends",
  },
  {
    id: "houses",
    claim:
      "The median sales price of houses sold in the United States was 25,300 dollars in the third quarter of 1971 and 410,700 dollars in the second quarter of 2026.",
    figure: `${usHouseMultiple.toFixed(1)} times, ${formatPct(usHouseAnnualPublished)} a year`,
    period: "1971 Q3 to 2026 Q2",
    sourceName: "FRED series MSPUS (US Census)",
    sourceUrl: "https://fred.stlouisfed.org/series/MSPUS",
  },
  {
    id: "wages",
    claim:
      "In the US nonfarm business sector, output per hour rose to 2.76 times its level, while real compensation per hour rose to 1.70 times its level.",
    figure: "2.76× output, 1.70× real pay",
    period: "1971 Q3 to 2026 Q2",
    sourceName: "FRED series OPHNFB and COMPRNFB",
    sourceUrl: "https://fred.stlouisfed.org/series/OPHNFB",
  },
];

export type CompareRow = {
  property: string;
  shells: string;
  gold: string;
  fiat: string;
  housing: string;
  bitcoin: string;
};

export const moneyComparison: CompareRow[] = [
  {
    property: "New supply",
    shells: "Easy to gather or make",
    gold: "Mining is slow next to the stock",
    fiat: "Set by policy",
    housing: "Taller buildings add units",
    bitcoin: "Fixed schedule, cap of 21 million",
  },
  {
    property: "Divisible",
    shells: "Poor",
    gold: "Coins and bars, not fine",
    fiat: "Easy",
    housing: "The whole property, or not at all",
    bitcoin: "Down to one satoshi",
  },
  {
    property: "Portable",
    shells: "Local",
    gold: "Heavy and costly to move",
    fiat: "Easy inside the issuer's system",
    housing: "It stays where it was built",
    bitcoin: "A payment worldwide, no permission",
  },
  {
    property: "Upkeep",
    shells: "Low",
    gold: "Storage and assay",
    fiat: "The account can be frozen",
    housing: "Repairs, tax, local rules",
    bitcoin: "No building to maintain",
  },
  {
    property: "How long the unit lasts",
    shells: "Local, then abandoned",
    gold: "Millennia as money metal",
    fiat: "Many units are already gone",
    housing: "The building ages",
    bitcoin: "Issued since 3 January 2009",
  },
];

export type CbdcRow = {
  topic: string;
  cbdc: string;
  bitcoin: string;
};

export const cbdcComparison: CbdcRow[] = [
  {
    topic: "Issuer",
    cbdc: "The central bank. A digital euro would be a liability of the Eurosystem.",
    bitcoin: "No issuer. Holders keep units the protocol already issued.",
  },
  {
    topic: "Supply",
    cbdc: "The central bank decides how much exists.",
    bitcoin:
      "The subsidy started at 50 bitcoin a block and is cut in half every 210,000 blocks. That schedule sums to 21 million. Price does not raise the cap.",
  },
  {
    topic: "Ledger",
    cbdc: "Accounts at supervised payment service providers, on a system the central bank runs.",
    bitcoin: "Nodes keep the chain. No administrator key.",
  },
  {
    topic: "Reach",
    cbdc: "A digital euro would be for the euro area. Cross-border use exists only if the issuing authorities allow it.",
    bitcoin:
      "Any two people who can reach the network can pay each other, across borders, without a state's permission.",
  },
  {
    topic: "Holding rules",
    cbdc: "The ECB says users would only be able to hold a limited amount. Its technical work tested hypothetical limits of up to 3,000 euros a person.",
    bitcoin: "No protocol limit on how much one person may hold.",
  },
  {
    topic: "Programmability",
    cbdc: "The ECB says a digital euro would never be programmable money, and that it could still facilitate conditional payments, such as pay-on-delivery. That refusal is a rule the issuer writes and can later revise.",
    bitcoin:
      "No office can bind a unit to a shop, a date, or a person. A later political promise is not required, because there is no switch to flip.",
  },
  {
    topic: "Privacy",
    cbdc: "Payments go through intermediaries. The ECB describes a privacy design; the payer is still inside a supervised system.",
    bitcoin:
      "No account application. Addresses are public on the chain if the holder reuses them. Identity is not required to receive.",
  },
  {
    topic: "Failure",
    cbdc: "The unit depends on the central bank, the intermediaries, and the law that defines it.",
    bitcoin: "The network has no headquarters to close.",
  },
];

export const sources: { name: string; url: string; note: string }[] = [
  {
    name: "FRED M2SL",
    url: "https://fred.stlouisfed.org/series/M2SL",
    note: "US M2, billions of dollars, seasonally adjusted.",
  },
  {
    name: "FRED CPIAUCSL",
    url: "https://fred.stlouisfed.org/series/CPIAUCSL",
    note: "US CPI-U, 1982–84 = 100.",
  },
  {
    name: "FRED MSPUS",
    url: "https://fred.stlouisfed.org/series/MSPUS",
    note: "Median sales price of houses sold in the United States.",
  },
  {
    name: "FRED OPHNFB",
    url: "https://fred.stlouisfed.org/series/OPHNFB",
    note: "Nonfarm business, output per hour.",
  },
  {
    name: "FRED COMPRNFB",
    url: "https://fred.stlouisfed.org/series/COMPRNFB",
    note: "Nonfarm business, real compensation per hour.",
  },
  {
    name: "COMEX gold futures (GC=F)",
    url: "https://finance.yahoo.com/quote/GC=F",
    note: "Futures price 4,199.80 dollars an ounce on 6 October 2026, and the 2026 low-to-high range of about 41%. Not the 1971 official parity.",
  },
  {
    name: "COMEX silver futures (SI=F)",
    url: "https://finance.yahoo.com/quote/SI=F",
    note: "2026 low-to-high range of about 120%, through 6 October 2026.",
  },
  {
    name: "Bitcoin price (BTC-USD)",
    url: "https://finance.yahoo.com/quote/BTC-USD",
    note: "2026 low-to-high range of about 70%, through 6 October 2026. A price range, not a change in the 21 million schedule.",
  },
  {
    name: "Gold convertibility ends",
    url: "https://www.federalreservehistory.org/essays/gold-convertibility-ends",
    note: "Federal Reserve History on the 15 August 1971 suspension. Bretton Woods parity was 35 dollars an ounce.",
  },
  {
    name: "Eurostat HICP annual index",
    url: "https://ec.europa.eu/eurostat/databrowser/view/prc_hicp_aind/default/table?lang=en",
    note: "Dataset prc_hicp_aind. This page uses annual averages, 2015 = 100, euro area, 2015–2025.",
  },
  {
    name: "Eurostat house price index",
    url: "https://ec.europa.eu/eurostat/databrowser/view/prc_hpi_a/default/table?lang=en",
    note: "Dataset prc_hpi_a, annual average, 2015 = 100, euro area. Not part of the HICP.",
  },
  {
    name: "ECB on the HICP and the 2% aim",
    url: "https://www.ecb.europa.eu/stats/macroeconomic_and_sectoral/hicp/html/index.en.html",
    note: "The ECB says it aims for 2% inflation over the medium term and that the HICP is the reference.",
  },
  {
    name: "ECB monetary policy strategy, 8 July 2021",
    url: "https://www.ecb.europa.eu/press/pr/date/2021/html/ecb.pr210708~dc78cc4b0d.en.html",
    note: "Symmetric 2% target. The HICP stays the reference. Owner-occupied housing was recommended for inclusion over time.",
  },
  {
    name: "ECB digital euro FAQ",
    url: "https://www.ecb.europa.eu/euro/digital_euro/faqs/html/ecb.faq_digital_euro.en.html",
    note: "Programmability, holding limits, and the euro-area scope, in the ECB's words.",
  },
  {
    name: "Blocktrainer, WTF happened in 1971",
    url: "https://www.blocktrainer.de/blog/wtf-happened-in-1971-die-katastrophalen-auswirkungen-von-ungedecktem-papiergeld",
    note: "Context for the break in 1971. Figures on this page are taken from the primary series above, not copied from the article.",
  },
  {
    name: "Bitcoin whitepaper",
    url: "https://bitcoin.org/bitcoin.pdf",
    note: "Satoshi Nakamoto, 2008. A declining issuance subsidy.",
  },
  {
    name: "Bitcoin issued supply",
    url: "https://blockchain.info/q/totalbc",
    note: "Satoshis issued. Read on 6 October 2026: 20,094,278 bitcoin.",
  },
  {
    name: "SEC spot bitcoin exchange-traded products",
    url: "https://www.sec.gov/news/statement/gensler-statement-spot-bitcoin-011023",
    note: "US Securities and Exchange Commission statement, 10 January 2024.",
  },
  {
    name: "finpension and pillar 3a bitcoin",
    url: "https://www.smolio.ch/en/wissen/finpension-bitcoin-the-crypto-pioneer-of-pillar-3a/",
    note: "A published account of a Swiss pillar 3a provider offering a capped bitcoin allocation inside the foundation, not in self-custody.",
  },
];

export const faq = [
  {
    question: "Why is everything getting more expensive?",
    answer:
      `A price is an exchange ratio. When the number of currency units grows faster than the goods people buy, more units are offered for the same goods and the prices rise. New units reach governments, banks, and asset markets first. Wages and bank savings meet the higher prices later. In the United States, from August 1971 to August 2026, the M2 money stock compounded at ${formatPct(usM2AnnualPublished)} a year (${usM2Multiple.toFixed(1)} times). That is growth of the money stock, not the consumer price index. Official US CPI-U compounded at ${formatPct(usCpiAnnualPublished)} a year (${usCpiMultiple.toFixed(1)} times) over the same months. Median US house prices compounded at ${formatPct(usHouseAnnualPublished)} a year from the third quarter of 1971 to the second quarter of 2026. These are dollar series. Euro-area rates are a different currency and are not interchangeable with them.`,
  },
  {
    question: "Why does the official 2% inflation figure fail a hard check?",
    answer:
      `The ECB aims for 2% inflation over the medium term and uses the euro-area Harmonised Index of Consumer Prices. That dataset swaps goods, changes weights every year, and has left out the purchase price of owner-occupied housing. Reweighting official euro-area sub-indexes for rent, food, electricity, gas, and health, with weights held still from 2015 to 2025, produces ${formatPct(basketAnnualRate)} a year against ${formatPct(hicpAnnualRate)} for the HICP. That gap is small, because each sub-index is already adjusted. It is not the hard check. The hard check is what the index leaves out, and how fast the money stock grew. Euro-area house purchase prices rose ${formatPct(housePriceAnnualRate)} a year over those ten years. US M2 grew ${formatPct(usM2AnnualPublished)} a year since August 1971, against ${formatPct(usCpiAnnualPublished)} a year for US CPI. A long average also hides spikes: US CPI rose ${formatPct(usCpiPeakToJune2022)} in the twelve months to June 2022, and the euro-area HICP annual average rose ${formatPct(hicpAnnual2022)} in 2022.`,
  },
  {
    question: "What does inflation do to 500,000 of savings in 12 years?",
    answer:
      `Keep the currency attached to the rate. United States, money stock, not consumer prices: ${formatUsd(savingsPrincipal)} divided by 1.066 to the power ${horizonYears} is ${formatUsd(usM2ClaimAfterHorizon)}. That uses the ${formatPct(usM2AnnualPublished)} a year compound growth of US M2 from August 1971 to August 2026. It measures how a claim on the money stock shrinks, not the CPI. United States, official CPI: the same sum at ${formatPct(usCpiAnnualPublished)} a year is ${formatUsd(usCpiClaimAfterHorizon)}. Euro area, this page's fixed basket, not the HICP and not a dollar sum: ${formatEur(savingsPrincipal)} at ${formatPct(euroBasketAnnualPublished)} a year is ${formatEur(euroBasketClaimAfterHorizon)}. The ECB's 2% target is a policy aim for the HICP, not any of these three lines.`,
  },
  {
    question: "How do I save, and what about bitcoin's price swings?",
    answer:
      `Saving means delaying consumption in a unit whose supply does not grow with the price. Bank deposits lose the dollar or euro gap worked out above, depending on the currency. Housing is scarce, but new floors can be built, and a home is hard to divide or move. Bitcoin's issuance does not rise when the price rises, and the schedule sums to 21 million. The price still moves. From 1 January 2026 through ${reviewedOn} the distance from the low to the high was ${formatPct(range2026.goldFutures)} for COMEX gold futures, ${formatPct(range2026.silverFutures)} for COMEX silver futures, and ${formatPct(range2026.bitcoin)} for bitcoin. Bitcoin is not in a class of its own on that year's range. It is young: issued since 3 January 2009, while gold has been a monetary metal for millennia. A price drop does not change the 21 million cap. This page is not a recommendation to buy.`,
  },
  {
    question: "How is Bitcoin different from a CBDC?",
    answer:
      "A central bank digital currency is issued by the central bank, can be limited and stopped by that issuer, and in the euro area would be for use inside that currency zone. The ECB says a digital euro would never be programmable money, and also says it could facilitate conditional payments. That limit is a political promise on a system the issuer controls. Bitcoin has no issuer, a 21 million schedule, and can be sent between two people worldwide without permission from a state. In 2026 its low-to-high range sat with gold and silver, not apart from them. The market is young: bitcoin has been issued only since 3 January 2009.",
  },
];

const moneyPageUrl = "https://moneypenny.li/money";

export const moneyPageTitle =
  "Sound money: inflation, 1971, Bitcoin vs CBDC | Money Penny";

export const moneyPageDescription = `US M2 grew ${formatPct(usM2AnnualPublished)} a year from Aug 1971 to Aug 2026 (money stock, not CPI). This page's euro-area basket rose ${formatPct(basketAnnualRate)} a year, 2015–2025. Figures read ${reviewedOn}.`;

export const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": moneyPageUrl,
      url: moneyPageUrl,
      name: "Sound money: inflation, 1971, Bitcoin vs CBDC",
      description: moneyPageDescription,
      inLanguage: "en",
      dateModified: "2026-10-06",
      isPartOf: {
        "@type": "WebSite",
        name: "Money Penny",
        url: "https://moneypenny.li/",
      },
      publisher: {
        "@type": "Organization",
        name: "Money Penny",
        url: "https://moneypenny.li/",
      },
      about: ["Money", "Inflation", "Bitcoin", "Central bank digital currency"],
    },
    {
      "@type": "FAQPage",
      "@id": `${moneyPageUrl}#faq`,
      url: `${moneyPageUrl}#faq`,
      inLanguage: "en",
      dateModified: "2026-10-06",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};
