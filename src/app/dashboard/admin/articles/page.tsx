"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useGet, usePost } from "@/hooks/useApi";
import { ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDialog } from "@/context/DialogContext";
import Loader from "@/components/Loader";

export type Article = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
};

export default function AdminArticles() {
  const { post } = usePost();
  const router = useRouter();
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
    data: articles,
    loading,
    refetch,
  } = useGet(`/articles?${queryParams.toString()}`, { useToken: true });

  const total: number =
    typeof articles?.total === "number" ? articles.total : 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDelete = async (id: string) => {
    const response = await post({
      url: `/articles/${id}`,
      method: "DELETE",
      data: {},
      useToken: true,
      isFormData: false,
    });
    if (response) {
      closeDialog?.();
      refetch();
    }
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

  const columns: ColumnDef<Article>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: (info) => info.row.original.category.name,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (info) => new Date(info.getValue<string>()).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link
            href={`/articles/${row?.original.id}`}
            target="_blank"
            className="text-custom-blue underline"
          >
            Preview
          </Link>
          <p
            onClick={() =>
              router.push(`/dashboard/admin/articles/${row.original.id}`)
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
                "Delete Article",
                "Are you sure want to delete article?"
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
        data={Array.isArray(articles?.data) ? articles?.data : []}
        page={page}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        rowLimit={rowLimit}
        total={total}
        onPageChange={handlePageChange}
        actions={
          <Button
            onClick={() => router.push("/dashboard/admin/articles/create")}
            className="bg-custom-blue flex text-custom-white"
          >
            <PlusIcon />
            Add Article
          </Button>
        }
      />
    </AdminLayout>
  );
}
