import AddProduct from "../../_components/AddProduct";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  return (
    <div>
      <AddProduct id={params?.id} />
    </div>
  );
}
