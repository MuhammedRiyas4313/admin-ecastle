"use client"
import { useSearchParams } from "next/navigation";
import AddProduct from "../_components/AddProduct";

export default function Page() {

  const searchParams = useSearchParams();
  const id = searchParams.get("id")

  return (
    <div>
      <AddProduct id={id} />
    </div>
  );
}
