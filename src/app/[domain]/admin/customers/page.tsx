import { getTenantFromHost } from "@/lib/tenant";
import CustomersClient from "./CustomersClient";

export default async function CustomersPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const store = await getTenantFromHost(params.domain);

  return <CustomersClient storeId={store?.id} currency={store?.currency || 'DH'} />;
}
