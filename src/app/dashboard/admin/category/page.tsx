"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useDialog } from "@/context/DialogContext";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import CreateCategoryForm from "@/components/category/CreateForm";
import { useGet, usePost } from "@/hooks/useApi";
import Loader from "@/components/Loader";

export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export default function AdminCategory() {
  const { post } = usePost();
  const { showDialog, closeDialog } = useDialog() || {};

  const [globalFilter, setGlobalFilter] = useState("");
  const [page, setPage] = useState(1);
  const rowLimit = 5;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: rowLimit.toString(),
    search: globalFilter,
  });

  const {
    data: category,
    loading,
    refetch,
  } = useGet(`/categories?${queryParams.toString()}`, { useToken: true });

  const total: number =
    typeof category?.totalData === "number" ? category.totalData : 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDelete = async (id: string) => {
    const result = await post({
      url: `/categories/${id}`,
      method: "DELETE",
      data: {},
      useToken: true,
      isFormData: false,
    });

    if (result) {
      closeDialog?.();
      refetch();
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
                  refetch={refetch}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[25rem] mt-9">
        <Loader />
      </div>
    );
  }

  return (
    <AdminLayout>
      <DataTable
        columns={columns}
        data={Array.isArray(category?.data) ? category?.data : []}
        page={page}
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
                  refetch={refetch}
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
