

'use client'

import { useProjects } from '@/lib/hooks/useProjectQueries'
import { useDeleteProject } from '@/lib/hooks/useProjectQueries'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MdMoreVert } from 'react-icons/md';
import Link from 'next/link';
import { useState } from 'react';
import { ProjectWizard } from '@/components/wizards/ProjectWizard';
import { TaskWizard } from '@/components/wizards/TaskWizard';
import { useUsers } from '@/lib/hooks/useUserQueries';
import { Spinner } from 'flowbite-react';

export const Metadata = {
    title: "Task Management Dashboard",
    description: "Task Management Dashboard",
}

interface Project {
    id: number;
    name: string;
    description: string;
    status: string;
    createdAt: string;
    createdBy: {
        id: number;
        name: string;
        email: string;
    };
}

interface DashboardData {
    stats: {
        totalProjects: number;
        completedProjects: number;
        completedTasks: number;
        totalTasks: number;
    };
    data: Project[];
    pagination: {
        total: number;
        currentPage: number;
        totalPages: number;
        limit: number;
    };
    message: string;
}

export default function Dashboard() {
    const { data: dashboardData, isLoading, error } = useProjects(1);
    const deleteProject = useDeleteProject();
    const { data: users } = useUsers();
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [createTask, setCreateTask] = useState(false);
    const [editingProject, setEditingProject] = useState<any | null>(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size='lg'/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Error: {error.message}</div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">No data available</div>
            </div>
        );
    }

    const { stats, data: projects, pagination } = dashboardData;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalProjects}</div>
                    <div className="text-gray-600">Total Projects</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">{stats.completedProjects}</div>
                    <div className="text-gray-600">Completed Projects</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="text-2xl font-bold text-purple-600">{stats.totalTasks}</div>
                    <div className="text-gray-600">Total Tasks</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="text-2xl font-bold text-orange-600">{stats.completedTasks}</div>
                    <div className="text-gray-600">Completed Tasks</div>
                </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
                </div>
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
                            {projects.map((project: Project) => (
                                <tr key={project.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {project.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {project.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.status === 'COMPLETED'
                                            ? 'bg-green-100 text-green-800'
                                            : project.status === 'IN_PROGRESS'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {project?.createdBy?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Menu>
                                            <MenuButton>
                                                <MdMoreVert
                                                    size={20}
                                                    className="focus:outline-none active:outline-none hover:outline-none focus:ring-0 active:border-none cursor-pointer text-blue-900"
                                                />
                                            </MenuButton>
                                            <MenuItems className="bg-white border rounded-md shadow-lg border-blue-900" anchor="bottom start">
                                                <MenuItem>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProjectId(project.id)
                                                            setCreateTask(true)
                                                        }}
                                                        className="cursor-pointer w-full block py-2 px-4 text-start hover:bg-blue-600 hover:text-white"
                                                    >
                                                        Create Task
                                                    </button>
                                                </MenuItem>
                                                <MenuItem>
                                                    <button
                                                        onClick={() => setEditingProject(project)}
                                                        className="cursor-pointer w-full block py-2 px-4 text-start hover:bg-blue-600 hover:text-white"
                                                    >
                                                        Edit Project
                                                    </button>
                                                </MenuItem>
                                                <MenuItem>
                                                    <button
                                                        onClick={async () => {
                                                            const ok = window.confirm('Delete this project? This cannot be undone.')
                                                            if (!ok) return
                                                            await deleteProject.mutateAsync(project.id)
                                                        }}
                                                        className="cursor-pointer w-full block py-2 px-4 text-start hover:bg-red-600 hover:text-white"
                                                    >
                                                        Delete Project
                                                    </button>
                                                </MenuItem>
                                                <MenuItem>
                                                    <Link
                                                        className="cursor-pointer w-full block py-2 px-4 text-start hover:bg-green-600 hover:text-white"
                                                        href={`/projects/${project.id}`}
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

            {/* Pagination Info */}
            <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                    Showing {projects.length} of {pagination.total} projects
                </div>
                <div>
                    Page {pagination.currentPage} of {pagination.totalPages}
                </div>
            </div>

            {/* Modals */}
            {editingProject && (
                <ProjectWizard
                    project={editingProject}
                    isProjectOpen={!!editingProject}
                    toggleProject={() => setEditingProject(null)}
                />
            )}
            
            {createTask && (
                <TaskWizard
                    users={users}
                    projectId={selectedProjectId}
                    isTaskOpen={createTask}
                    toggleTask={() => setCreateTask(false)}
                />
            )}
        </div>
    );
}