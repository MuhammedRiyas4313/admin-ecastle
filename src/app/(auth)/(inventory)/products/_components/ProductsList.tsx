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
import React, { useCallback, useMemo, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import CustomTable from "@/components/table/CustomTable";
import ConfirmationPopup from "@/components/Confirmation";
import SearchBar from "@/components/SearchBar";
import { debounce } from "lodash";

function ProductsList() {
  //IMPORTS
  const navigate = useNavigate();

  //STATES
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [isConfirm, setIsConfirm] = useState<any>(null);

  //DATA
  const { data, isFetching, isLoading, isRefetching } = useProducts({
    pageIndex,
    pageSize,
    search,
  });

  //MUTATION
  const { mutateAsync: deleteProject, isPending } = useDeleteProduct();

  //loading
  const loading = isFetching || isLoading || isRefetching || isPending;

  //HANDLERS
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteProject(id);
      if (res?.data?.message) {
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
                onClick={() => navigate(`/products/edit?id=${row?._id}`)}
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

  //SEARCH HANDLER
    const debouncedHandleSearch = useCallback(
    debounce((text: string) => {
      try {
        setSearch(text);
      } catch (error) {
        console.log(error, "error in the debounce function");
      }
    }, 1000),
    [],
  );

  return (
    <>
      {/* Table Header Section */}
      <div className="mb-6">
        <div className="flex justify-end items-center">
          <div className="flex gap-4">
            <SearchBar
              className="bg-[#F5F7F9]"
              placeholder="Search Players"
              onChange={(e: any) => debouncedHandleSearch(e.target.value)}
            />
            <Button
              onClick={() => navigate("/products/add")}
              className="bg-black text-white font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
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
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
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
