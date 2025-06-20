import AddProduct from "../../_components/AddProduct";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <AddProduct id={id} />
    </div>
  );
}
