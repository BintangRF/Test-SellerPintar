"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useApi } from "@/hooks/useApi";
import { useDialog } from "@/context/DialogContext";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import CreateCategoryForm from "@/components/category/CreateForm";

export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export default function AdminCategory() {
  const { getData, pushData } = useApi();
  const { showDialog, closeDialog } = useDialog() || {};

  const [categories, setCategories] = useState<Category[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const rowLimit = 5;

  const fetchData = async () => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: rowLimit.toString(),
      search: globalFilter,
    });

    const result = await getData(
      `/categories?${queryParams.toString()}`,
      undefined,
      true
    );
    setCategories(result?.data || []);
    setTotal(result?.totalData || 0);
  };

  useEffect(() => {
    fetchData();
  }, [page, globalFilter, fetchData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDelete = async (id: string) => {
    const result = await pushData(
      `/categories/${id}`,
      "delete",
      {},
      undefined,
      true
    );
    if (result) {
      closeDialog?.();
      fetchData();
    }
  };

  const CreateDialog = ({
    id,
    refetch,
    onCancel,
  }: {
    id?: string;
    refetch?: () => void;
    onCancel: () => void;
  }) => {
    return (
      <div>
        <CreateCategoryForm id={id} refetch={refetch!} onCancel={onCancel} />
      </div>
    );
  };

  const DeleteDialog = ({
    id,
    onCancel,
  }: {
    id: string;
    onCancel: () => void;
  }) => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-end gap-2 mt-4 font-medium">
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            onClick={() => handleDelete(id)}
            className="bg-red-500 text-custom-white"
          >
            Delete
          </Button>
        </div>
      </div>
    );
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Category",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (info) =>
        new Date(info.getValue<string>()).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <p
            onClick={() =>
              showDialog &&
              showDialog(
                <CreateDialog
                  id={row.original.id}
                  refetch={fetchData}
                  onCancel={() => closeDialog?.()}
                />,
                "Edit Category"
              )
            }
            className="text-custom-blue underline cursor-pointer"
          >
            Edit
          </p>
          <p
            onClick={() =>
              showDialog &&
              showDialog(
                <DeleteDialog
                  id={row.original.id}
                  onCancel={() => closeDialog?.()}
                />,
                "Delete Category",
                "Are you sure want to delete category?"
              )
            }
            className="text-red-500 underline cursor-pointer"
          >
            Delete
          </p>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <DataTable
        columns={columns}
        data={categories}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        rowLimit={rowLimit}
        total={total}
        onPageChange={handlePageChange}
        actions={
          <Button
            onClick={() =>
              showDialog &&
              showDialog(
                <CreateDialog
                  refetch={fetchData}
                  onCancel={() => closeDialog?.()}
                />,
                "Create Category"
              )
            }
            className="bg-custom-blue flex text-custom-white"
          >
            <PlusIcon />
            Add Category
          </Button>
        }
      />
    </AdminLayout>
  );
}
