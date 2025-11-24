import { useState, useEffect } from "react";

type CountryStats = {
  country: string;
  countryCode: string;
  knots: number;
  core: number;
  total: number;
};

type StatsPayload = {
  updatedAt?: string;
  knots: {
    total: number;
    byCountry: CountryStats[];
  };
  core: {
    total: number;
    byCountry: CountryStats[];
  };
};

type SortField = "country" | "count";
type SortDirection = "asc" | "desc";

export default function BitcoinNodeStats() {
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [knotsSort, setKnotsSort] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({ field: "count", direction: "desc" });
  const [coreSort, setCoreSort] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({ field: "count", direction: "desc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const res = await fetch("/data/node-stats.json");
        if (!res.ok) throw new Error(`Failed to load stats: ${res.status}`);
        const payload = (await res.json()) as StatsPayload;
        if (cancelled) return;
        setStats(payload);
        setError(null);
      } catch (err) {
        console.error("Unable to load node statistics", err);
        setError("Unable to load node statistics. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  function sortCountries(
    countries: CountryStats[],
    field: SortField,
    direction: SortDirection
  ): CountryStats[] {
    const sorted = [...countries].sort((a, b) => {
      let comparison = 0;
      if (field === "country") {
        comparison = a.country.localeCompare(b.country);
      } else {
        comparison = (a.knots || a.core) - (b.knots || b.core);
      }
      return direction === "asc" ? comparison : -comparison;
    });
    return sorted;
  }

  function toggleSort(
    currentSort: { field: SortField; direction: SortDirection },
    newField: SortField,
    setSort: (sort: { field: SortField; direction: SortDirection }) => void
  ) {
    if (currentSort.field === newField) {
      setSort({
        field: newField,
        direction: currentSort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSort({ field: newField, direction: "desc" });
    }
  }

  function getCountryFlag(countryCode: string): string {
    if (!countryCode) return "🌍";
    // Special case for Tor nodes
    if (countryCode === "TOR") return "🧅";
    if (countryCode.length !== 2) return "🌍";
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  if (loading) {
    return (
      <div className="mp-node-stats">
        <p className="mp-body">Loading node statistics…</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mp-node-stats">
        <p className="mp-body" style={{ color: "#d00" }}>
          {error || "No statistics available."}
        </p>
      </div>
    );
  }

  const sortedKnots = sortCountries(
    stats.knots.byCountry,
    knotsSort.field,
    knotsSort.direction
  );
  const sortedCore = sortCountries(
    stats.core.byCountry,
    coreSort.field,
    coreSort.direction
  );

  const formattedDate = stats.updatedAt
    ? new Date(stats.updatedAt).toLocaleString()
    : null;

  return (
    <div className="mp-node-stats">
      {formattedDate && (
        <p className="mp-node-stats-meta">
          Last updated: {formattedDate}
        </p>
      )}

      {/* Knots Section */}
      <div className="mp-node-stats-section">
        <div className="mp-node-stats-header">
          <h2 className="mp-heading">Knots</h2>
          <div className="mp-node-stats-total">
            Total: <strong>{stats.knots.total.toLocaleString()}</strong> nodes
          </div>
        </div>

        <div className="mp-node-stats-controls">
          <button
            className={`mp-node-sort-btn ${
              knotsSort.field === "country" ? "mp-node-sort-btn-active" : ""
            }`}
            onClick={() => toggleSort(knotsSort, "country", setKnotsSort)}
          >
            Sort by Country
            {knotsSort.field === "country" &&
              (knotsSort.direction === "asc" ? " ↑" : " ↓")}
          </button>
          <button
            className={`mp-node-sort-btn ${
              knotsSort.field === "count" ? "mp-node-sort-btn-active" : ""
            }`}
            onClick={() => toggleSort(knotsSort, "count", setKnotsSort)}
          >
            Sort by Count
            {knotsSort.field === "count" &&
              (knotsSort.direction === "asc" ? " ↑" : " ↓")}
          </button>
        </div>

        <div className="mp-node-stats-list">
          {sortedKnots.length > 0 ? (
            sortedKnots.map((item) => (
              <div key={item.countryCode} className="mp-node-stats-item">
                <span className="mp-node-stats-flag">
                  {getCountryFlag(item.countryCode)}
                </span>
                <span className="mp-node-stats-country">{item.country}</span>
                <span className="mp-node-stats-count">
                  {item.knots.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="mp-body">No Knots nodes found.</p>
          )}
        </div>
      </div>

      {/* Core Section */}
      <div className="mp-node-stats-section">
        <div className="mp-node-stats-header">
          <h2 className="mp-heading">Core</h2>
          <div className="mp-node-stats-total">
            Total: <strong>{stats.core.total.toLocaleString()}</strong> nodes
          </div>
        </div>

        <div className="mp-node-stats-controls">
          <button
            className={`mp-node-sort-btn ${
              coreSort.field === "country" ? "mp-node-sort-btn-active" : ""
            }`}
            onClick={() => toggleSort(coreSort, "country", setCoreSort)}
          >
            Sort by Country
            {coreSort.field === "country" &&
              (coreSort.direction === "asc" ? " ↑" : " ↓")}
          </button>
          <button
            className={`mp-node-sort-btn ${
              coreSort.field === "count" ? "mp-node-sort-btn-active" : ""
            }`}
            onClick={() => toggleSort(coreSort, "count", setCoreSort)}
          >
            Sort by Count
            {coreSort.field === "count" &&
              (coreSort.direction === "asc" ? " ↑" : " ↓")}
          </button>
        </div>

        <div className="mp-node-stats-list">
          {sortedCore.length > 0 ? (
            sortedCore.map((item) => (
              <div key={item.countryCode} className="mp-node-stats-item">
                <span className="mp-node-stats-flag">
                  {getCountryFlag(item.countryCode)}
                </span>
                <span className="mp-node-stats-country">{item.country}</span>
                <span className="mp-node-stats-count">
                  {item.core.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="mp-body">No Core nodes found.</p>
          )}
        </div>
      </div>

      {/* Data Source Attribution */}
      <p className="mp-node-stats-source">
        (Data source: <a href="https://bitnodes.io" target="_blank" rel="noopener noreferrer" className="mp-link">Bitnodes.io</a>, GeoIP: <a href="https://ip-api.com" target="_blank" rel="noopener noreferrer" className="mp-link">ip-api.com</a>)
      </p>
    </div>
  );
}

