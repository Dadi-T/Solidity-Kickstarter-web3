import { useState } from "react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Form, Button, Input, Message, Container } from "semantic-ui-react";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();
  const [minimumContribution, setMinimumContribution] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  async function submit(evt) {
    evt.preventDefault();
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setLoading(true);
    setErrorMessage("");
    try {
      await factory.methods
        .createCampaign(web3.utils.toWei(minimumContribution, "ether"))
        .send({
          from: accounts[0],
        });
      router.push("/");
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    }
    setLoading(false);
    setErrorMessage("");
  }
  return (
    <Container>
      <h3>Create a Campaign</h3>

      <Form onSubmit={submit} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="Ether"
            labelPosition="right"
            value={minimumContribution}
            placeholder="Insert the minimum contribution..."
            onChange={(event) => setMinimumContribution(event.target.value)}
          />
        </Form.Field>

        <Message error header="Oops!" content={errorMessage} />
        <Button loading={loading} primary>
          Create!
        </Button>
      </Form>
    </Container>
  );
}
