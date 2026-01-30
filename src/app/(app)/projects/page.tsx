'use client'

import Link from 'next/link'
import { useProjects } from '@/lib/hooks/useProjectQueries'
import { useDeleteProject } from '@/lib/hooks/useProjectQueries'
import { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { MdMoreVert } from 'react-icons/md'
import { Spinner } from 'flowbite-react'
import { ProjectWizard } from '@/components/wizards/ProjectWizard'
import { TaskWizard } from '@/components/wizards/TaskWizard'
import { useUsers } from '@/lib/hooks/useUserQueries'
import { useRouter } from 'next/navigation'
import { UserType } from '@/data/enums/UserType'



export default function ProjectsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useProjects(page)
  const { data: users, isLoading: userLoading, error: userError } = useUsers()
  const deleteProject = useDeleteProject()
  const [editingProject, setEditingProject] = useState<any | null>(null)
  const [createProject, setCreateProject] = useState(false)
  const [createTask, setCreateTask] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const router = useRouter()
  const user = localStorage.getItem("user")
    const isAdmin = user ? JSON.parse(user)?.role === UserType.ADMIN : false
    
  if (isLoading) {
    return (
      <div className='fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <Spinner className='text-blue-900' size='xl' />
      </div>
    )
  }

  if (error) return <div className="p-6 text-red-600">Failed to load projects</div>

  const projects = data?.data ?? []
  const pagination = data?.pagination



  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <button
          disabled={!isAdmin}
          onClick={() => setCreateProject(true)}
          className="px-4 py-2 disabled:bg-blue-900/90 cursor-pointer rounded bg-blue-900 text-white "
        >
          Create Project
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((p: any) => (
                <tr
                
                key={p.id} className="hover:bg-gray-50 cursor-pointer">
                  <td 
                  onClick={() => isAdmin ? router.push(`/projects/${p.id}`):"#"}
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium cursor-pointer hover:underline hover:underline-offset-4 text-blue-900">{p.name}</td>
                  <td className="px-6 py-4 flex text-sm max-w-[250px] overflow-y-auto  max-h-[80px] text-gray-500">{p.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === 'COMPLETED' || p.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : p.status === 'IN_PROGRESS' || p.status === 'active' || p.status === 'ACTIVE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-900'
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p?.createdBy?.name || 'Unknown'}
                  </td>
                  <td  
            
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Menu >
                      <MenuButton
                      disabled={!isAdmin}
                      >
                        <MdMoreVert
                          size={20}
                          className="focus:outline-none active:outline-none hover:outline-none focus:ring-0 active:border-none cursor-pointer text-blue-900"
                        />
                      </MenuButton>
                      <MenuItems className="bg-white border rounded-md shadow-lg border-blue-900" anchor="bottom start">
                        <MenuItem>
                          <button
                            onClick={() => {
                              setSelectedProjectId(p.id)
                              setCreateTask(true)
                            }}
                            className="cursor-pointer w-full block py-2 px-4 text-start hover:bg-green-600 hover:text-white"
                          >
                            Create Task
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button
                            onClick={() => setEditingProject(p)}
                            className="cursor-pointer w-full block py-2 px-4 text-start hover:bg-yellow-400 hover:text-white"
                          >
                            Edit Project
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button
                            onClick={async () => {
                              const ok = window.confirm('Delete this project? This cannot be undone.')
                              if (!ok) return
                              await deleteProject.mutateAsync(p.id)
                            }}
                            className="cursor-pointer w-full block py-2 px-4 text-start hover:bg-red-600 hover:text-white"
                          >
                            Delete Project
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            className="cursor-pointer w-full block py-2 px-4 text-start hover:bg-green-600 hover:text-white"
                            href={`/projects/${p.id}`}
                          >
                            View Project
                          </Link>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {projects.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No projects found
          </div>
        )}
      </div>

      {pagination && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {projects.length} of {pagination.total} projects
          </div>
          <div className="flex text-blue-900 items-center gap-3">
            <button
              className="px-3 cursor-pointer py-1 rounded border border-blue-900 disabled:opacity-60"
              disabled={pagination.currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <div>
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <button
              className="px-3 cursor-pointer py-1 rounded border border-blue-900 disabled:opacity-60"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {editingProject && (
        <ProjectWizard
          project={editingProject}
          isProjectOpen={true}
          toggleProject={() => setEditingProject(false)}
        />
      )}
      
      {createProject && (
        <ProjectWizard
          project={null}
          isProjectOpen={true}
          toggleProject={() => setCreateProject(false)}
        />
      )}
      
      {createTask && (
        <TaskWizard
          users={users}
          projectId={selectedProjectId}
          isTaskOpen={true}
          toggleTask={() => setCreateTask(false)}
        />
      )}
    </div>
  )
}
