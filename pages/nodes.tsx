import Layout from "@/components/Layout";
import BitcoinNodeStats from "@/components/BitcoinNodeStats";

export default function NodesPage() {
  return (
    <Layout title="Nodes">
      <section>
        <BitcoinNodeStats />
      </section>
    </Layout>
  );
}


