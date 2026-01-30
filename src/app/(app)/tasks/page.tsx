'use client'

import { useMemo, useState } from 'react'
import { useTasks, useUpdateTask } from '@/lib/hooks/useTaskQueries'
import { TaskStatus } from '@/data/enums/TaskStatus'
import { TaskPriority } from '@/data/enums/TaskPriority'
import { Select } from '@headlessui/react'
import { useUsers } from '@/lib/hooks/useUserQueries'
import Link from 'next/link'
import { Spinner } from 'flowbite-react'
import { UserType } from '@/data/enums/UserType'

export default function TasksPage() {
  const [status, setStatus] = useState<string>('')
  const [priority, setPriority] = useState<string>('')
 const [assignedTo, setAssignedTo] = useState<string>('')

  const [page, setPage] = useState(1)

  const params = useMemo(() => {
    return {
      page,
      limit:8,
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(assignedTo ? { assignedTo: Number(assignedTo) } : {}),
    }
  }, [page, status, priority, assignedTo])

  const { data, isLoading, error } = useTasks(params)
  const updateTask = useUpdateTask()
const { data: users } = useUsers()
const tasks = data?.data ?? []
const totalPages = data?.total
const currentPage = data?.page

  const user = localStorage.getItem("user")
  const isAdmin = user ? JSON.parse(user)?.role === UserType.ADMIN : false

  if (isLoading) {
    return(
      <div className='fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <Spinner   size='xl'/>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-900">Tasks</h1>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
           <div className=" flex gap-3 justify-between">
          <Select className="border border-blue-900 rounded px-3 py-2 min-w-[120px]" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Status</option>
            {Object.values(TaskStatus).map((s) => (
              <option className='py-4' key={s} value={s}>{s}</option>
            ))}
          </Select>

          <Select className="border border-blue-900 rounded px-3 py-2 min-w-[120px]" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">Priority</option>
            {Object.values(TaskPriority).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
          
          {
            isAdmin &&<Select className="border border-blue-900 rounded px-3 py-2 min-w-[140px]" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">Assigned To</option>
            {users?.map((user:any) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </Select>
          }
        </div>

        </div>
       
    

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Assigned To
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((t: any) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="capitalize px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.title}</td>
                  <td className="capitalize px-6 py-4 font-medium hover:underline hover:underline-offset-4 text-sm text-blue-800"><Link href={`/projects/${t.project?.id}`}>{t.project?.name ?? '-'}</Link></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select
                      disabled={!isAdmin}
                      className="text-blue-900 border rounded px-2 py-1 min-w-[120px]"
                      value={t.status}
                      onChange={(e) => updateTask.mutate({ id: t.id, data: { status: e.target.value } })}
                    >
                      {Object.values(TaskStatus).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 select-none inline-flex text-xs leading-5 font-semibold rounded-full ${
                        t.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : t.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="capitalize px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t.assignedTo?.name ?? 'Unassigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tasks.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No tasks found
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
          <div className="text-sm text-blue-900 ">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center text-blue-900 gap-2">
            <button
              className="px-3 py-1 cursor-pointer border-blue-900 rounded border disabled:opacity-60"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 cursor-pointer border-blue-900 rounded border disabled:opacity-60"
              disabled={currentPage >= totalPages ||isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>

    </div>
  )
}
