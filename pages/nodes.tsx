import dynamic from "next/dynamic";
import Layout from "@/components/Layout";

const BitcoinNodeGlobe = dynamic(
  () => import("@/components/BitcoinNodeGlobe"),
  {
    ssr: false
  }
);

export default function NodesPage() {
  return (
    <Layout title="Nodes">
      <section>
        <p className="mp-body">
          Interactive 3D globe showing Bitcoin nodes across the world. Orange
          dots represent Knots nodes, red dots represent Core nodes.
        </p>
        <div className="mp-node-globe-container">
          <BitcoinNodeGlobe />
        </div>
      </section>
    </Layout>
  );
}


