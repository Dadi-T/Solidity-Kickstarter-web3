import { Table, Button, Container } from "semantic-ui-react";
import { useRouter } from "next/router";
import web3 from "../ethereum/web3";
import campaign from "../ethereum/campaign";
import { useState } from "react";
export default function RequestRow({ request, approversCount, id, address }) {
  const router = useRouter();
  const readyToFinalize = useState(request.approvalCount > approversCount)[0];
  const [approvalLoading, setapprovalLoading] = useState(false);
  const [finalizeLoading, setfinalizeLoading] = useState(false);
  async function approveRequest() {
    setapprovalLoading(true);
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    try {
      await campaign(router.query.address).methods.approveRequest(id).send({
        from: accounts[0],
      });
      router.reload();
    } catch (error) {
      console.log(error);
    }
    setapprovalLoading(false);
  }
  async function finalizeRequest() {
    setfinalizeLoading(true);
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    try {
      await campaign(router.query.address).methods.finalizeRequest(id).send({
        from: accounts[0],
      });
      router.reload();
    } catch (error) {
      console.log(error);
    }
    setfinalizeLoading(false);
  }
  return (
    <Table.Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
    >
      <Table.Cell>{id}</Table.Cell>
      <Table.Cell>{request.description}</Table.Cell>
      <Table.Cell>{web3.utils.fromWei(request.value, "ether")}</Table.Cell>
      <Table.Cell>{address}</Table.Cell>
      <Table.Cell>
        {request.approvalCount}/{approversCount}
      </Table.Cell>
      <Table.Cell>
        {request.complete ? null : (
          <Button
            loading={approvalLoading}
            color="green"
            basic
            onClick={approveRequest}
          >
            Approve
          </Button>
        )}
      </Table.Cell>
      <Table.Cell>
        {request.complete ? null : (
          <Button
            loading={finalizeLoading}
            color="teal"
            basic
            onClick={finalizeRequest}
          >
            Finalize
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
