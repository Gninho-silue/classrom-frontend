import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useGetIdentity } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Navigate } from "react-router";
import { User } from "@/types";
import type { Identity } from "@/components/refine-ui/layout/user-avatar";

const roleColors: Record<string, string> = {
    admin: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    teacher: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    student: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export default function UsersList() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const { data: identity } = useGetIdentity<Identity>();

    // Students have no access to users
    if (identity && identity.role === "student") {
        return <Navigate to="/" replace />;
    }

    const searchFilter = search ? [{ field: "search", operator: "eq" as const, value: search }] : [];
    const roleFilterArr = roleFilter !== "all" ? [{ field: "role", operator: "eq" as const, value: roleFilter }] : [];

    const userTable = useTable<User>({
        columns: useMemo<ColumnDef<User>[]>(() => [
            {
                id: "name",
                accessorKey: "name",
                size: 250,
                header: () => <p className="column-title">User</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <Avatar className="size-9 border">
                            <AvatarImage src={row.original.image} />
                            <AvatarFallback className="bg-primary/5 text-primary font-bold text-xs">
                                {(row.original.name || "U")[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">{row.original.name}</p>
                            <p className="text-xs text-muted-foreground">{row.original.email}</p>
                        </div>
                    </div>
                ),
            },
            {
                id: "role",
                accessorKey: "role",
                size: 120,
                header: () => <p className="column-title">Role</p>,
                cell: ({ row }) => (
                    <Badge className={`${roleColors[row.original.role] ?? ""} capitalize`}>
                        {row.original.role}
                    </Badge>
                ),
            },
            {
                id: "createdAt",
                accessorKey: "createdAt",
                size: 120,
                header: () => <p className="column-title">Joined</p>,
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
                        <EditButton recordItemId={row.original.id} size="icon" variant="ghost" />
                        <DeleteButton recordItemId={row.original.id} size="icon" variant="ghost" />
                    </div>
                ),
            },
        ], []),
        refineCoreProps: {
            resource: "users",
            pagination: { pageSize: 10, mode: "server" },
            filters: {
                permanent: [...searchFilter, ...roleFilterArr],
            },
        },
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Users</h1>
            <div className="intro-row">
                <p>Manage user accounts across your institution</p>
                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            className="pl-10 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <DataTable table={userTable} />
        </ListView>
    );
}
