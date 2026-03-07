import { CreateButton } from '@/components/refine-ui/buttons/create'
import { ShowButton } from '@/components/refine-ui/buttons/show'
import { EditButton } from '@/components/refine-ui/buttons/edit'
import { DeleteButton } from '@/components/refine-ui/buttons/delete'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Subject } from '@/types'
import { useGetIdentity, useList } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Identity } from '@/components/refine-ui/layout/user-avatar'

type DeptItem = { id: number; name: string };

const SubjectList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const { data: identity } = useGetIdentity<Identity>();
  const isStudent = identity?.role === 'student';

  const { result: deptResult } = useList<DeptItem>({
    resource: 'departments',
    pagination: { pageSize: 1000 },
  });
  const departments = deptResult.data ?? [];

  const departmentFilters = selectedDepartment === 'all' ? [] :
    [{ field: 'department', operator: 'eq' as const, value: selectedDepartment }];
  const searchFilter = searchQuery ? [{ field: 'name', operator: 'contains' as const, value: searchQuery }] : [];

  const subjectTable = useTable<Subject>({
    columns: useMemo<ColumnDef<Subject>[]>(() => [
      {
        id: 'code',
        accessorKey: 'code',
        header: () => <p className='column-title ml-2'>Code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>
      },
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: () => <p className='column-title'>Name</p>,
        cell: ({ getValue }) => <span className='text-foreground'>{getValue<string>()}</span>,
        filterFn: 'includesString'
      },
      {
        id: 'department',
        accessorKey: 'department.name',
        size: 150,
        header: () => <p className='column-title'>Department</p>,
        cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>()}</Badge>
      },
      {
        id: 'description',
        accessorKey: 'description',
        size: 300,
        header: () => <p className='column-title'>Description</p>,
        cell: ({ getValue }) => <span className='truncate line-clamp-2'>{getValue<string>()}</span>,
      },
      {
        id: 'actions',
        size: 100,
        header: () => <p className='column-title'></p>,
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
      resource: 'subjects',
      pagination: { pageSize: 10, mode: 'server' },
      filters: { permanent: [...departmentFilters, ...searchFilter] },
      sorters: { initial: [{ field: 'id', order: 'desc' as const }] }
    }
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className='page-title'>Subjects</h1>
      <div className='intro-row'>
        <p>Browse and manage academic subjects</p>
        <div className="actions-row">
          <div className="search-field">
            <Search className='search-icon' />
            <Input
              type='text'
              placeholder='Search by name...'
              className='pl-10 w-full'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isStudent && <CreateButton />}
          </div>
        </div>
      </div>
      <DataTable table={subjectTable} />
    </ListView>
  )
}

export default SubjectList
