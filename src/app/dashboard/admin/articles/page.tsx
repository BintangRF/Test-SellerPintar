"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";

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
  const { getData } = useApi();

  const [articles, setArticles] = useState<Article[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const rowLimit = 5;

  useEffect(() => {
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
    fetchData();
  }, [page, globalFilter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
          <Button size="sm" onClick={() => handleEdit(row.original)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (article: Article) => {
    console.log("Edit", article);
    // Show modal or navigate to edit page
  };

  const handleDelete = (id: string) => {
    console.log("Delete", id);
    // Confirm and call API to delete
  };
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
            onClick={() => console.log("Add new")}
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
