import Layout from "@/components/Layout";

type Book = {
  imgBasename: string;
  href: string;
  title: string;
  author: string;
  tag: "beginners guide" | "deep dive" | "technical";
};

const books: Book[] = [
  {
    imgBasename: "1",
    href: "https://www.amazon.com/Beginners-Guide-Bitcoin-Matthew-Kratter/dp/B08RRKNNBK",
    title: "A Beginner's Guide To Bitcoin",
    author: "Matthew R. Kratter",
    tag: "beginners guide",
  },
  {
    imgBasename: "2",
    href: "https://www.amazon.de/Bitcoin-f%C3%BCr-Einsteiger-Marco-B%C3%BChler/dp/3969673976",
    title: "Bitcoin für Einsteiger",
    author: "Marco Bühler",
    tag: "beginners guide",
  },
  {
    imgBasename: "3",
    href: "https://www.amazon.com/Bitcoin-Standard-Decentralized-Alternative-Central/dp/1119473861/ref=sr_1_1?s=books&sr=1-1",
    title: "The Bitcoin Standard",
    author: "Saifedean Ammous",
    tag: "deep dive",
  },
  {
    imgBasename: "4",
    href: "https://21lessons.com/",
    title: "21 Lessons",
    author: "Gigi",
    tag: "deep dive",
  },
  {
    imgBasename: "5",
    href: "https://www.amazon.com/Mastering-Bitcoin-Programming-Open-Blockchain/dp/1098150090/ref=sr_1_1?s=books&sr=1-1",
    title: "Mastering Bitcoin",
    author: "Andreas M. Antonopoulos",
    tag: "technical",
  },
];

function resolvePicturePath(basename: string): string {
  // Prefer .jpg, then .png in /pictures under public
  // At runtime we can't check existence; keep .jpg as default, allow user to rename if needed.
  return `/pictures/${basename}.jpg`;
}

export default function LibraryPage() {
  return (
    <Layout title="Library">
      <section className="mp-library">
        <div className="mp-library-grid">
          {books.map((b) => (
            <a
              key={b.imgBasename}
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mp-library-card"
              aria-label={`Open ${b.title}`}
              title={b.title}
            >
              <div className="mp-library-cover-box">
                <img
                  className="mp-library-cover"
                  src={resolvePicturePath(b.imgBasename)}
                  alt={b.title}
                  loading="lazy"
                />
              </div>
              <div className="mp-library-caption">
                <span className="mp-library-author">{b.author}</span>
                <span className="mp-library-dot">·</span>
                <span className="mp-library-tag">{b.tag}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
}

