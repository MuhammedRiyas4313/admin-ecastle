"use client";
import { useNavigate } from "@/hooks/useNavigate";
import {
  IProduct,
  useDeleteProduct,
  useProducts,
} from "@/services/product.service";
import { generateFilePath } from "@/services/url.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CustomTable from "@/components/table/CustomTable";
import Link from "next/link";
import ConfirmationPopup from "@/components/Confirmation";

function ProductsList() {
  //IMPORTS
  const navigate = useNavigate();

  //STATES
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isConfirm, setIsConfirm] = useState<any>(null);

  //DATA
  const { data, isFetching, isLoading, isRefetching } = useProducts();

  //MUTATION
  const { mutateAsync: deleteProject, isPending } = useDeleteProduct();

  //loading
  const loading = isFetching || isLoading || isRefetching || isPending;

  //HANDLERS
  const handleDelete = async (id: string) => {
    try {
      if (typeof window !== "undefined") {
        if (!window.confirm("Are you sure you want to delete?")) {
          return null;
        }
        const res = await deleteProject(id);
        toastSuccess(res?.data?.message);
      }
    } catch (error) {
      toastError(error);
    }
  };

  //TABLE COLUMN
  const columns = useMemo(() => {
    let cols: ColumnDef<IProduct>[] = [
      {
        header: "S.No",
        cell: ({ row: { original: row, index } }) => (
          <div className="p-3">{index + 1}</div>
        ),
      },
      {
        header: "Name",
        cell: ({ row: { original: row } }) => row.title,
      },
      {
        header: "Category",
        cell: ({ row: { original: row } }) => row.category,
      },
      {
        header: "Price",
        cell: ({ row: { original: row } }) => row.price,
      },
      {
        header: "Image",
        cell: ({ row: { original: row } }) => (
          <div>
            <Image
              src={generateFilePath(row?.image)}
              alt=""
              width={80}
              height={80}
            />
          </div>
        ),
      },
      {
        header: "Created On",
        accessorFn: (row) => format(row?.createdAt, "dd-MM-yyyy"),
      },
      {
        header: "Actions",
        cell: ({ row: { original: row } }) => {
          return (
            <div className="flex w-full flex-1 items-end space-x-3.5 text-sm">
              <button
                className="text-sm hover:text-emerald-700 cursor-pointer"
                type="button"
                onClick={() => navigate(`/products/edit/${row?._id}`)}
              >
                <IconPencil size={20} />
              </button>

              <button
                className="hover:text-red-600 cursor-pointer"
                type="button"
                onClick={() => setIsConfirm(row?._id)}
              >
                <IconTrash size={20} />
              </button>
            </div>
          );
        },
      },
    ];
    return cols;
  }, []);

  return (
    <>
      {/* Table Header Section */}
      <div className="mb-6">
        <div className="flex justify-end items-center">
          <Button
            onClick={() => navigate("/products/add")}
            className="bg-black text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>
      {/* Table Container */}
      <Card className="mb-8 p-3 shadow-lg border-0">
        <CustomTable
          columns={columns}
          data={data?.data || []}
          totalCount={data?.total || 0}
          loading={loading}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </Card>
      <ConfirmationPopup
        show={isConfirm !== null}
        onClose={() => {
          setIsConfirm(null);
        }}
        onConfirm={() => {
          handleDelete(isConfirm);
          setIsConfirm(null);
        }}
        title={"Confirm Delete"}
        message={`Do you want to delete this Product?`}
      />
    </>
  );
}

export default ProductsList;
