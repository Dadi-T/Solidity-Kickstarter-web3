import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import web3 from "../../ethereum/web3";
import campaign from "../../ethereum/campaign";
import Link from "next/link";
import { Card, Grid, Button, Container } from "semantic-ui-react";
import ContributeForm from "../../components/ContributeForm";
export default function campaignDetails(props) {
  const router = useRouter();
  const [balance, setBalance] = useState(props.balance);
  const [minimumContribution, setMinimumContribution] = useState(props.minimum);
  const [requestsCount, setRequestsCount] = useState(props.requestsCount);
  const [contributers, setContributers] = useState(props.approversCount);
  const [manager, setManager] = useState(props.manager);

  function renderCards() {
    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(minimumContribution),
        meta: "Minimum Contribution (ether)",
        description:
          "You must contribute at least this much Ether to become a contributer",
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by contributers",
      },
      {
        header: contributers,
        meta: "Number of contributers",
        description:
          "Number of people who have already donated to this campaign",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend.",
      },
    ];

    return <Card.Group items={items} />;
  }
  return (
    <Container>
      <h3>Campaign Show</h3>
      <h3> {router.query.address} </h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCards()}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={router.query.address} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${router.query.address}/requests`}>
              <Button primary>View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export async function getServerSideProps({ params }) {
  //The factory is used to retrieve the initial data
  //but to call a method that requires send, use context of an ether account

  // Fetch data from external API
  const summary = await campaign(params.address).methods.getSummary().call();

  // Pass data to the page via props
  return {
    props: {
      minimum: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    },
  };
}
