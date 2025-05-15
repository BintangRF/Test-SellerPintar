"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDialog } from "@/context/DialogContext";

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
  const { getData, pushData } = useApi();
  const router = useRouter();
  const { showDialog, closeDialog } = useDialog() || {};

  const [articles, setArticles] = useState<Article[]>([]);
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
      `/articles?${queryParams.toString()}`,
      undefined,
      true
    );
    setArticles(result?.data || []);
    setTotal(result?.total || 0);
  };

  useEffect(() => {
    fetchData();
  }, [page, globalFilter, getData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDelete = async (id: string) => {
    const result = await pushData(
      `/articles/${id}`,
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

  return (
    <AdminLayout>
      <DataTable
        columns={columns}
        data={articles}
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
