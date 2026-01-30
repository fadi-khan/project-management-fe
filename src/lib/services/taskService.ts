import { httpService } from "./HttpService"
import { toast } from "react-toastify"

export const taskService = {

  createTask: async (body: any) => {
    try {
      const response = await httpService.post("task", body)
      toast.success("Task created successfully!")
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create task. Please try again later!")
      throw error;
    }
  },

  updateTask: async (id: number, body: any) => {
    try {
      const response = await httpService.update("task", id, body)
      toast.success("Task updated successfully!")
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update task. Please try again later!")
      throw error;
    }
  },

  deleteTask: async (id: number) => {
    try {
      const response = await httpService.delete("task", id)
      toast.success("Task deleted successfully!")
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete task. Please try again later!")
      throw error;
    }
  },

  getTasks: async (params?: {
    page?: number
    limit?: number
    projectId?: number
    status?: string
    priority?: string
    assignedTo?: number
  }) => {
    try {
      const query = new URLSearchParams()
      if (params?.page) query.set('page', String(params.page))
      if (params?.limit) query.set('limit', String(params.limit))
      if (params?.projectId) query.set('projectId', String(params.projectId))
      if (params?.status) query.set('status', params.status)
      if (params?.priority) query.set('priority', params.priority)
      if (params?.assignedTo) query.set('assignedTo', String(params.assignedTo))

      const qs = query.toString()
      const response = await httpService.get(qs ? `task?${qs}` : 'task')
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  getTaskById: async (id: number) => {
    try {
      const response = await httpService.get(`task/${id}`)
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  updateTaskStatus: async (id: number, status: string) => {
    return taskService.updateTask(id, { status })
  },

  assignTaskToUser: async (id: number, assignedToId: number | null) => {
    return taskService.updateTask(id, { assignedToId })
  },
}