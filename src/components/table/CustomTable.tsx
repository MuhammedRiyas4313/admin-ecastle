"use client";
import {
  PaginationState,
  TableOptions,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel, //client auto pagination
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, Suspense, useMemo } from "react";

import {
  IconChevronLeft,
  IconChevronLeftPipe,
  IconChevronRight,
  IconChevronRightPipe,
} from "@tabler/icons-react";

import { usePathname, useSearchParams } from "next/navigation";
import { useNavigateReplace } from "@/hooks/useNavigate";
import Loader from "../Loader";

export default function CustomTable({
  columns,
  data,
  totalCount,
  loading,
  reload,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
}: {
  columns: any[];
  data: any[];
  totalCount: number;
  loading?: boolean;
  reload?: Function;
  pageIndex: number;
  pageSize: number;
  setPageIndex?: Dispatch<SetStateAction<number>>;
  setPageSize?: Dispatch<SetStateAction<number>>;
}) {
  const final_columns = useMemo(() => columns, [columns]);
  const final_data = useMemo(() => data, [data]);

  const isReloadAvailable = useMemo(
    () => reload && typeof reload == "function",
    [reload]
  );

  const pathname = usePathname();
  const navigate = useNavigateReplace();
  const searchParams = useSearchParams();

  let reactTableObj = useMemo(() => {
    let finalObj: TableOptions<unknown> = {
      data: final_data?.length ? final_data : [],
      columns: final_columns,
      getCoreRowModel: getCoreRowModel(),
      pageCount: Math.ceil(totalCount / pageSize),
      state: {
        pagination: { pageIndex, pageSize },
      },
      onPaginationChange: (newPagination: any) => {
        const { pageIndex: page, pageSize: size }: PaginationState = newPagination({
          pageIndex,
          pageSize,
        });
        if (typeof page === "number" && setPageIndex) {
          setPageIndex(page);
        }
        if (typeof size === "number" && setPageSize) {
          setPageSize(size);
        }
      },
      manualPagination: true,
    };

    return finalObj;
  }, [final_data, final_columns, totalCount, navigate, pathname, searchParams]);

  const table = useReactTable(reactTableObj);

  const handleReload = () => {
    if (isReloadAvailable && reload) {
      reload();
    }
  };

  const start =
    table.getState().pagination?.pageIndex *
      table.getState().pagination?.pageSize +
    (table.getRowModel().rows.length > 0 ? 1 : 0);
  const end =
    table.getState().pagination?.pageIndex *
      table.getState().pagination?.pageSize +
    table.getRowModel().rows.length;

  return (
    <Suspense>
      <div className="relative overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          {/* Table container with horizontal scrolling */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stroke dark:divide-strokedark">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className={`px-4 py-4.5 text-left text-sm font-medium dark:text-white`}
                        colSpan={header.colSpan}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-stroke dark:divide-strokedark">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-4 py-4.5 text-sm text-black dark:text-white"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <div
              className="absolute left-0 top-0 flex h-full w-full items-center justify-center p-4"
              style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
            >
              <Loader />
            </div>
          )}

          {table.getRowModel().rows.length === 0 && !loading && (
            <div className="mt-2 flex flex-1 items-center justify-center py-8">
              <h6 className="text-gray-500">No Records Found</h6>
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-col items-center justify-between gap-4 p-2 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm dark:text-white">Items per page:</span>
            <select
              className="rounded border-[0.5px] border-stroke bg-gray p-1 text-sm dark:border-strokedark dark:bg-meta-4 dark:text-white"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm dark:text-white">
            {start}-{end} of {totalCount}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray p-1 dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeftPipe size={16} />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray p-1 dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft size={16} />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray p-1 dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight size={16} />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray p-1 dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRightPipe size={16} />
            </button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
