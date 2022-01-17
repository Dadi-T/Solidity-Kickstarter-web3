import { useRouter } from "next/router";
import { useState } from "react";
import web3 from "../../../../ethereum/web3";
import {
  Form,
  Input,
  Message,
  Button,
  Container,
  TextArea,
} from "semantic-ui-react";
import campaign from "../../../../ethereum/campaign";
export default function createRequest() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [value, setValue] = useState(0);
  const [recepient, setRecepient] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  async function handleSubmit(evt) {
    evt.preventDefault();
    /*  string description,
    uint256 value,
    address recepient */
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setErrorMessage("");
    setLoading(true);
    try {
      await campaign(router.query.address)
        .methods.createRequest(
          description,
          web3.utils.toWei(value, "ether"),
          recepient
        )
        .send({
          from: accounts[0],
        });
      router.push(`/campaigns/${router.query.address}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
    setLoading(false);
  }

  return (
    <Container>
      <h1>Create request about campaign address</h1>
      <p> {router.query.address} </p>

      <Form onSubmit={handleSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>description</label>
          <TextArea
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>Amount to transfer</label>
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            label="ether"
            labelPosition="right"
          />
          <label>Address of the recepient</label>
          <Input
            value={recepient}
            onChange={(event) => setRecepient(event.target.value)}
            label="Address"
            labelPosition="right"
          />
        </Form.Field>

        <Message error header="Oops!" content={errorMessage} />
        <Button
          primary
          loading={loading}
          disabled={!(description && value && recepient)}
        >
          Create a Request
        </Button>
      </Form>
    </Container>
  );
}
