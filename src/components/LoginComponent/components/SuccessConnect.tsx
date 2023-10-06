import { useAccounts } from "gateway-api/gateway-service";
import {
  ProviderT,
  useConnectedProviders,
  useLoginProvider,
  useTransferingProvider,
} from "utils/state-utils";
import { Button, Space, Typography, theme } from "antd";
import { useEffect } from "react";
import Loader from "components/Loader";
import { errorNotifier } from "utils/helpers";

type Props = {
  onBack: () => void;
  onSubmit?: () => void;
};

export default function SuccessConnect({ onSubmit, onBack }: Props) {
  const { token } = theme.useToken();
  const searchParams = new URLSearchParams(document.location.search);
  const [provider, setProvider] = useLoginProvider();
  const [_cp, setConnectedProviders] = useConnectedProviders();
  const [_tp, setTransferingProvider] = useTransferingProvider();
  const { isFetching, data, error } = useAccounts(provider?.sid);
  const accountsNumber = data?.accounts.length || 0;
  const isPluralAccounts = accountsNumber > 1;

  useEffect(() => {
    // @TODO handle the case if there are no any accounts
    if (onSubmit && data?.accounts.length) {
      setTransferingProvider(provider as ProviderT);
      onSubmit();
    }
    if (!onSubmit && data?.accounts.length) {
      setConnectedProviders((prev) => [...prev, provider as ProviderT]);
      setProvider(null);
      if (window.parent) {
        window.parent.postMessage(provider, "*");
      }
    }
  }, [data?.accounts]);

  useEffect(() => {
    if (error)
      errorNotifier({
        description: (
          <pre>
            Fetch accounts error:{"\n"}
            {JSON.stringify(error, null, 2)}
          </pre>
        ),
      });
  }, [error]);

  const handleSubmit = () => {
    const redirectLink = searchParams.get("redirect");
    if (redirectLink) window.parent.location.href = redirectLink;
  };

  if (isFetching) {
    return (
      <Space
        direction="vertical"
        style={{ alignItems: "center", marginTop: 100 }}
      >
        <Loader />
      </Space>
    );
  }

  return (
    <>
      <Space direction="vertical" style={{ alignItems: "center", gap: 0 }}>
        <Typography.Text style={{ fontWeight: "bold" }}>
          {accountsNumber} {isPluralAccounts ? "accounts" : "account"}
        </Typography.Text>
        <Typography.Text>
          {isPluralAccounts ? "were" : "was"} successfully
        </Typography.Text>
        <Typography.Text>connected from your bank!</Typography.Text>
      </Space>
      <Space direction="vertical" style={{ marginTop: 50 }}>
        {!onSubmit && (
          <Button
            block
            style={{
              height: 40,
              borderRadius: 20,
              borderColor: token.colorPrimary,
              borderWidth: 2,
            }}
            onClick={onBack}
          >
            Add Bank
          </Button>
        )}
        <Button
          type="primary"
          block
          style={{
            height: 40,
            borderRadius: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => (onSubmit ? onSubmit() : handleSubmit())}
        >
          Done
        </Button>
      </Space>
    </>
  );
}