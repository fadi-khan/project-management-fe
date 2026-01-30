'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useProject } from '@/lib/hooks/useProjectQueries'
import { useCreateTask, useProjectTasks, useUpdateTask } from '@/lib/hooks/useTaskQueries'
import { useUsers } from '@/lib/hooks/useUserQueries'
import { TaskStatus } from '@/data/enums/TaskStatus'
import { TaskPriority } from '@/data/enums/TaskPriority'
import { TaskWizard } from '@/components/wizards/TaskWizard'
import { Select } from '@headlessui/react'
import { Spinner } from 'flowbite-react'

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const projectId = Number(params?.id)

  const [status, setStatus] = useState<string>('')
  const [priority, setPriority] = useState<string>('')
  const [assignedTo, setAssignedTo] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const limit = 5

  useEffect(() => {
    setPage(1)
  }, [status, priority, assignedTo])

  const filters = useMemo(() => {
    return {
      page,
      limit,
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(assignedTo ? { assignedTo: Number(assignedTo) } : {}),
    }
  }, [page, status, priority, assignedTo])

  const projectQuery = useProject(projectId)
  const tasksQuery = useProjectTasks(projectId, filters)
  const usersQuery = useUsers()

  const createTask = useCreateTask()
  const updateTask = useUpdateTask()

  const project = projectQuery.data
  const tasks = tasksQuery.data?.data ?? []
  const users = usersQuery.data ?? []

  const totalPages = tasksQuery.data?.totalPages ?? 1
  const currentPage = tasksQuery.data?.page ?? page

  const [isTaskOpen, setIsTaskOpen] = useState(false)
  const [viewTask, setViewTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  if (projectQuery.isLoading) return <div className="fixed top-1/2 left-1/2"><Spinner size='lg' /></div>
  // if (projectQuery.error) return <div className="p-6 text-red-600">No Project Found</div>

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white border rounded-lg p-5">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="">
            <h1 className="text-xl text-blue-900 font-semibold">{project?.name}</h1>
          </div>
          <div className={`w-fit  ${project?.status === 'Completed' ? 'bg-green-100 text-green-800' : project?.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : ' bg-blue-100 text-blue-800'} p-2 rounded-lg text-sm font-medium `}>Status: {project?.status}</div>
        </div>
        <div className="text-gray-600  w-full rounded-lg max-w-[200px] overflow-y-auto  flex   pb-3 me-7">{project?.description}</div>

      </div>

      <div className="bg-white border rounded-lg p-5">  
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <button
            onClick={() => setIsTaskOpen(true)}
            className="px-4 py-2 rounded bg-blue-900 text-white hover:bg-blue-800 transition-colors"
          >
            Create Task
          </button>
        </div>
        <div className="text-sm text-gray-600 mt-1">Total: {tasksQuery.data?.total ?? 0}</div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        </div>
        <div className="p-4 flex gap-3 flex-wrap">
          <Select className="border border-blue-900 rounded px-3 py-2 min-w-[120px]" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Status</option>
            {Object.values(TaskStatus).map((s) => (
              <option className="py-4" key={s} value={s}>{s}</option>
            ))}
          </Select>

          <Select className="border border-blue-900 rounded px-3 py-2 min-w-[120px]" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">Priority</option>
            {Object.values(TaskPriority).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>

          <Select className="border border-blue-900 rounded px-3 py-2 min-w-[140px]" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">Assigned To</option>
            {users.map((user: any) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </Select>
        </div>

        {tasksQuery.isLoading && <div className="p-6 flex items-center justify-center"><Spinner size='lg' /></div>}
        {/* {tasksQuery.error && <div className="p-6 text-red-600">No tasks found</div>} */}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Title
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
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((t: any) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="capitalize px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select
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
                      className={`px-2 select-none inline-flex text-xs leading-5 font-semibold rounded-full ${t.priority === 'High'
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
                    <Select
                      className="border border-blue-900 rounded px-2 py-1.5 text-blue-900 min-w-[120px]"
                      value={t.assignedTo?.id ?? ''}
                      onChange={(e) => updateTask.mutate({ id: t.id, data: { assignedToId: e.target.value ? Number(e.target.value) : null } })}
                    >
                      <option value="">Unassigned</option>
                      {users.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="px-3 py-1 rounded border text-blue-600 hover:bg-blue-500 cursor-pointer"
                      onClick={() => {
                        setSelectedTask(t)
                        setViewTask(true)
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



        {(tasks.length === 0 && !tasksQuery.isLoading  ) && <div className="text-gray-500 mx-3 flex items-center px-3 py-3">No tasks found.</div>}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded border disabled:opacity-60"
            disabled={currentPage <= 1 || tasksQuery.isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 rounded border disabled:opacity-60"
            disabled={currentPage >= totalPages || tasksQuery.isLoading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
      {isTaskOpen && (
        <TaskWizard
          projectId={projectId}
          isTaskOpen={isTaskOpen}
          toggleTask={() => setIsTaskOpen(false)}
          users={users}
        />
      )}
      {viewTask && (
        <TaskWizard
          projectId={projectId}
          isTaskOpen={viewTask}
          toggleTask={() => setViewTask(false)}
          users={users}
          viewOnly={true}
          task={selectedTask}
        />
      )}
    </div>
  )
}
