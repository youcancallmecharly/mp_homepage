import Layout from "@/components/Layout";

export default function EducationPage() {
  return (
    <Layout title="Education">
      <section>
        <h2 className="mp-heading">WHAT IS MONEY</h2>

        <h3 className="mp-subheading">Medium of Exchange</h3>
        <p className="mp-body">
          Money facilitates the buying and selling of goods and services without
          the need for bartering.
        </p>

        <h3 className="mp-subheading">Unit of Account</h3>
        <p className="mp-body">
          Money provides a standard measure to value goods, services, and
          economic transactions uniformly.
        </p>

        <h3 className="mp-subheading">Store of Value</h3>
        <p className="mp-body">
          Money can be saved and retrieved in the future while retaining its
          purchasing power over time.
        </p>

        <table className="mp-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Bitcoin</th>
              <th>Gold</th>
              <th>USD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Durability</td>
              <td>++</td>
              <td>++</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Portability</td>
              <td>++</td>
              <td>-</td>
              <td>+</td>
            </tr>
            <tr>
              <td>Fungibility</td>
              <td>++</td>
              <td>+</td>
              <td>+</td>
            </tr>
            <tr>
              <td>Verifiability</td>
              <td>++</td>
              <td>+</td>
              <td>+</td>
            </tr>
            <tr>
              <td>Divisibility</td>
              <td>++</td>
              <td>-</td>
              <td>+</td>
            </tr>
            <tr>
              <td>Scarcity</td>
              <td>++</td>
              <td>+</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Long History</td>
              <td>-</td>
              <td>++</td>
              <td>+</td>
            </tr>
            <tr>
              <td>Censorship Resistance</td>
              <td>++</td>
              <td>+</td>
              <td>--</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Score</td>
              <td>13</td>
              <td>6</td>
              <td>0</td>
            </tr>
          </tfoot>
        </table>
      </section>
    </Layout>
  );
}


