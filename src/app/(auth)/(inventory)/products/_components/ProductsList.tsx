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
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import CustomTable from "@/components/table/CustomTable";
import ConfirmationPopup from "@/components/Confirmation";
import SearchBar from "@/components/SearchBar";
import { debounce } from "lodash";
import { categories } from "@/common/constats.common";
import { number } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ProductsList() {
  //IMPORTS
  const navigate = useNavigate();

  //STATES
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isConfirm, setIsConfirm] = useState<any>(null);

  //USEMEMO
  const queryObj = useMemo(() => {
    const obj: any = {
      pageIndex,
      pageSize,
    };

    if (search) {
      obj.search = search;
      obj.pageIndex = 0;
    }

    if (category) {
      obj.category = category;
      obj.pageIndex = 0;
    }

    return obj;
  }, [pageIndex, pageSize, search, category]);

  //DATA
  const { data, isFetching, isLoading, isRefetching } = useProducts(queryObj);

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

  //SEARCH HANDLER
  const debouncedHandleSearch = useCallback(
    debounce((text: string) => {
      try {
        setSearch(text);
      } catch (error) {
        console.log(error, "error in the debounce function");
      }
    }, 1000),
    []
  );

  console.log(search, "SEARCH");
  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col md:justify-end md:flex-row gap-4">
          <div className="flex  w-full md:w-auto gap-4">
            <div className="w-[70%] md:w-[200px] relative">
              <Select
                value={category} // Controlled value
                onValueChange={(value) => {
                  setCategory(value); // Update your search state
                  debouncedHandleSearch(value);
                }}
              >
                <SelectTrigger
                  showClearButton={!!search}
                  onClear={() => {
                    setCategory(""); // Clear the search state
                    debouncedHandleSearch(""); // Trigger search with empty value
                  }}
                  className="h-12 w-full"
                >
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!!category && (
                <span
                  className="absolute top-2 right-[2rem] rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCategory("");
                  }}
                >
                  <X className="size-3 opacity-70 hover:opacity-100" />
                </span>
              )}
            </div>

            {/* Add Item Button - 30% on mobile, hidden on desktop (will appear at end) */}
            <div className="w-[30%] md:hidden">
              <Button
                onClick={() => navigate("/products/add")}
                className="bg-black text-white font-semibold  w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Search Bar - full width on mobile, flex-1 on desktop */}
          <div className="w-full md:flex-1 md:max-w-[200px]">
            <SearchBar
              className="bg-[#F5F7F9] w-full p-2"
              placeholder="Search Players"
              onChange={(e: any) => debouncedHandleSearch(e.target.value)}
            />
          </div>

          {/* Add Item Button - hidden on mobile, shown at end on desktop */}
          <div className="hidden md:block">
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
