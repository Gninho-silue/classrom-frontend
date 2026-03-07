import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {useMemo, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {ClassDetails, Subject, User} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {useGetIdentity, useList} from "@refinedev/core";
import {ShowButton} from "@/components/refine-ui/buttons/show.tsx";
import {EditButton} from "@/components/refine-ui/buttons/edit.tsx";
import {DeleteButton} from "@/components/refine-ui/buttons/delete.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";
import {BACKEND_BASE_URL} from "@/constants";
import type {Identity} from "@/components/refine-ui/layout/user-avatar";

const ClassesList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedTeacher, setSelectedTeacher] = useState('all');

    const { data: identity } = useGetIdentity<Identity>();
    const isStudent = identity?.role === 'student';

    const { query: subjectsQuery } = useList<Subject>({
        resource: 'subjects',
        pagination: { pageSize: 100 }
    });

    const { query: teachersQuery } = useList<User>({
        resource: 'users',
        filters: [{ field: 'role', operator: 'eq', value: 'teacher' }],
        pagination: { pageSize: 100 },
        queryOptions: { enabled: !isStudent },
    });

    const subjects = subjectsQuery?.data?.data || [];
    const teachers = teachersQuery?.data?.data || [];

    const subjectFilters = selectedSubject === 'all' ? [] : [
        { field: 'subject', operator: 'eq' as const, value: selectedSubject}
    ];
    const teacherFilters = selectedTeacher === 'all' ? [] : [
        { field: 'teacher', operator: 'eq' as const, value: selectedTeacher}
    ];
    const searchFilters = searchQuery ? [
        { field: 'name', operator: 'contains' as const, value: searchQuery }
    ] : [];

    const classColumns = useMemo<ColumnDef<ClassDetails>[]>(() => [
        {
            id: 'bannerUrl',
            accessorKey: 'bannerUrl',
            size: 80,
            header: () => <p className="column-title ml-2">Banner</p>,
            cell: ({ getValue }) => (
                <div className="flex items-center justify-center ml-2">
                    <img
                        src={getValue<string>() || '/placeholder-class.png'}
                        alt="Class Banner"
                        className="w-10 h-10 rounded object-cover"
                    />
                </div>
            )
        },
        {
            id: 'name',
            accessorKey: 'name',
            size: 200,
            header: () => <p className="column-title">Class Name</p>,
            cell: ({ getValue }) => <span className="text-foreground font-medium">{getValue<string>()}</span>,
        },
        {
            id: 'status',
            accessorKey: 'status',
            size: 100,
            header: () => <p className="column-title">Status</p>,
            cell: ({ getValue }) => {
                const status = getValue<string>();
                return (
                    <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                );
            }
        },
        {
            id: 'subject',
            accessorKey: 'subject.name',
            size: 150,
            header: () => <p className="column-title">Subject</p>,
            cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
        },
        {
            id: 'teacher',
            accessorKey: 'teacher.name',
            size: 150,
            header: () => <p className="column-title">Teacher</p>,
            cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
        },
        {
            id: 'capacity',
            accessorKey: 'capacity',
            size: 100,
            header: () => <p className="column-title">Capacity</p>,
            cell: ({ getValue }) => <span className="text-foreground">{getValue<number>()}</span>,
        },
        {
            id: 'actions',
            size: 130,
            header: () => <p className="column-title"></p>,
            cell: ({ row }) => (
                <div className="flex items-center gap-1 justify-end">
                    <ShowButton resource="classes" recordItemId={row.original.id} size="icon" variant="ghost" />
                    {!isStudent && (
                        <>
                            <EditButton resource="classes" recordItemId={row.original.id} size="icon" variant="ghost" />
                            <DeleteButton resource="classes" recordItemId={row.original.id} size="icon" variant="ghost" />
                        </>
                    )}
                </div>
            )
        }
    ], [isStudent]);

    const classTable = useTable<ClassDetails>({
        columns: classColumns,
        refineCoreProps: {
            resource: 'classes',
            pagination: { pageSize: 10, mode: 'server' },
            filters: {
                permanent: [...subjectFilters, ...teacherFilters, ...searchFilters]
            },
            sorters: {
                initial: [
                    { field: 'id', order: 'desc' },
                ]
            },
        }
    });

    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title">Classes</h1>

            <div className="intro-row">
                <p>Manage your classes, subjects, and teachers.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />

                        <Input
                            type="text"
                            placeholder="Search by name..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                {subjects.map(subject => (
                                    <SelectItem key={subject.id} value={subject.name}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {!isStudent && (
                            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Teachers</SelectItem>
                                    {teachers.map(teacher => (
                                        <SelectItem key={teacher.id} value={teacher.name}>
                                            {teacher.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {isStudent ? (
                            <JoinClassDialog />
                        ) : (
                            <CreateButton resource="classes" />
                        )}
                    </div>
                </div>
            </div>

            <DataTable table={classTable} />
        </ListView>
    );
}

function JoinClassDialog() {
    const [open, setOpen] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleJoin = async () => {
        if (!inviteCode.trim()) {
            toast.error("Please enter an invite code.");
            return;
        }

        setIsLoading(true);
        try {
            const baseUrl = BACKEND_BASE_URL.replace(/\/api\/?$/, '');
            const res = await fetch(`${baseUrl}/api/classes/join`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inviteCode: inviteCode.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error ?? "Failed to join class.");
                return;
            }

            toast.success(`Successfully joined "${data.data.className}"!`);
            setInviteCode('');
            setOpen(false);
            window.location.reload();
        } catch {
            toast.error("Could not connect to server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Join Class</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Join a Class</DialogTitle>
                    <DialogDescription>
                        Enter the invite code provided by your teacher to enroll in a class.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2">
                    <Input
                        placeholder="Enter invite code (e.g. a3f9bc12)"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                        className="font-mono"
                        autoFocus
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleJoin} disabled={isLoading}>
                        {isLoading ? "Joining..." : "Join"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ClassesList;
