import Layout from "@/components/Layout";

const playlists = [
  {
    label: "Basics",
    href: "https://www.youtube.com/playlist?list=PLy98WGgNrY7lCxKDenHUOtrhZ2OkhFzNf"
  },
  {
    label: "Big Picture",
    href: "https://www.youtube.com/playlist?list=PLy98WGgNrY7npMGRH4kb7ByHMhxai1PA-"
  },
  {
    label: "Analysis",
    href: "https://www.youtube.com/playlist?list=PLy98WGgNrY7lYIXlgfbDSLbIbQRJQeRYH"
  },
  {
    label: "Latest",
    href: "https://www.youtube.com/playlist?list=PLy98WGgNrY7l0xa2Dr9pkzkpUrkIdv79z"
  }
];

export default function YoutubePage() {
  return (
    <Layout title="Youtube">
      <section>
        <h2 className="mp-section-title">Money Penny</h2>
        <div className="mp-pill-buttons">
          {playlists.map((p) => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="mp-pill-button"
            >
              {p.label.toUpperCase()}
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
}


