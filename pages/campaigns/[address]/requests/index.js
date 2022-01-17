import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Table, Container } from "semantic-ui-react";
import campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import Link from "next/link";
import RequestRow from "../../../../components/RequestRow";
export default function Home({ requests, approversCount }) {
  const router = useRouter();
  /* const requests = useState(JSON.parse(props.requests)); */

  function renderRows() {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={request.recepient}
          approversCount={approversCount}
        />
      );
    });
  }

  return (
    <Container>
      <h1>This is the index of requests of address </h1>
      <p>{router.query.address} </p>
      <Link href={`/campaigns/${router.query.address}/requests/new`}>
        <Button primary floated="right" style={{ marginBottom: 10 }}>
          Add Request
        </Button>
      </Link>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderRows()}</Table.Body>
      </Table>
      <div>Found {requests.length ? requests.length : "0"} requests.</div>
    </Container>
  );
}

export async function getServerSideProps({ params }) {
  const requestCounts = await campaign(params.address)
    .methods.getRequestCount()
    .call();
  const requests = [];
  for (let index = 0; index < parseInt(requestCounts); index++) {
    const { description, value, recepient, complete, approvalCount } =
      await campaign(params.address).methods.requests(index).call();

    requests.push({ description, value, recepient, complete, approvalCount });
  }
  const approversCount = await campaign(params.address)
    .methods.approversCount()
    .call();
  return {
    props: { requests, approversCount },
  };
}
