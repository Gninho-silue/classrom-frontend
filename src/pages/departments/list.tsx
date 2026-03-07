import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useGetIdentity } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Identity } from "@/components/refine-ui/layout/user-avatar";

type Department = {
    id: number;
    code: string;
    name: string;
    description: string;
    createdAt: string;
};

export default function DepartmentsList() {
    const [search, setSearch] = useState("");
    const { data: identity } = useGetIdentity<Identity>();
    const isStudent = identity?.role === "student";

    const searchFilter = search ? [{ field: "name", operator: "eq" as const, value: search }] : [];

    const deptTable = useTable<Department>({
        columns: useMemo<ColumnDef<Department>[]>(() => [
            {
                id: "code",
                accessorKey: "code",
                header: () => <p className="column-title ml-2">Code</p>,
                cell: ({ getValue }) => <Badge variant="outline" className="font-mono">{getValue<string>()}</Badge>,
            },
            {
                id: "name",
                accessorKey: "name",
                size: 200,
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => <span className="font-semibold">{getValue<string>()}</span>,
            },
            {
                id: "description",
                accessorKey: "description",
                size: 300,
                header: () => <p className="column-title">Description</p>,
                cell: ({ getValue }) => (
                    <span className="text-sm text-muted-foreground truncate max-w-[300px] block">
                        {getValue<string>() || "—"}
                    </span>
                ),
            },
            {
                id: "createdAt",
                accessorKey: "createdAt",
                size: 100,
                header: () => <p className="column-title">Created</p>,
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">
                        {new Date(row.original.createdAt).toLocaleDateString()}
                    </span>
                ),
            },
            {
                id: "actions",
                size: 100,
                header: () => <p className="column-title"></p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-1 justify-end">
                        <ShowButton recordItemId={row.original.id} size="icon" variant="ghost" />
                        {!isStudent && (
                            <>
                                <EditButton recordItemId={row.original.id} size="icon" variant="ghost" />
                                <DeleteButton recordItemId={row.original.id} size="icon" variant="ghost" />
                            </>
                        )}
                    </div>
                ),
            },
        ], [isStudent]),
        refineCoreProps: {
            resource: "departments",
            pagination: { pageSize: 10, mode: "server" },
            filters: { permanent: searchFilter },
        },
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Departments</h1>
            <div className="intro-row">
                <p>Manage academic departments</p>
                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name or code..."
                            className="pl-10 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {!isStudent && (
                        <div className="flex gap-2 w-full sm:w-auto">
                            <CreateButton />
                        </div>
                    )}
                </div>
            </div>
            <DataTable table={deptTable} />
        </ListView>
    );
}
