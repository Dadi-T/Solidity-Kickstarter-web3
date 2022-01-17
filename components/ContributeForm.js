import { Form, Input, Message, Button, Container } from "semantic-ui-react";
import { useState } from "react";
import Campaign from "../ethereum/campaign";
import { useRouter } from "next/router";
import web3 from "../ethereum/web3";
import campaign from "../ethereum/campaign";
export default function ContributeForm(props) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(props.address);

    setLoading(true);
    setErrorMessage("");

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });

      router.reload();
    } catch (err) {
      setErrorMessage(err.message);
    }

    setLoading(false);
    setErrorMessage("");
  };
  return (
    <Container>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            label="ether"
            labelPosition="right"
          />
        </Form.Field>

        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={loading}>
          Contribute!
        </Button>
      </Form>
    </Container>
  );
}
