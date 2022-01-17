import Link from "next/link";
import factory from "../ethereum/factory";
import { Card, Button, Container } from "semantic-ui-react";

export default function Home(props) {
  function renderCampaigns() {
    const items = props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link href={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }
  return (
    <Container>
      <h1>Kickstarter Web 3.0</h1>
      <h3>Open Campaigns</h3>
      <Link href="/campaigns/new">
        <Button
          floated="right"
          content="Create Campaign"
          icon="add circle"
          primary
        />
      </Link>
      {renderCampaigns()}
    </Container>
  );
}

export async function getServerSideProps() {
  //The factory is used to retrieve the initial data
  //but to call a method that requires send, use context of an ether account

  // Fetch data from external API
  const campaigns = await factory.methods.getAllCampaigns().call();
  // Pass data to the page via props
  return { props: { campaigns } };
}

/* Home.getInitialProps = async (ctx) => {
  const campaigns = await factory.methods.getAllCampaigns().call();
  return { campaigns };
};
 */
