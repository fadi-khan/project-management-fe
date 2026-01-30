import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { taskService } from '../services/taskService'

export const useTasks = (params?: {
  page?: number
  limit?: number
  projectId?: number
  status?: string
  priority?: string
  assignedTo?: number
}) => {
  return useQuery({
    queryKey: ['tasks', params ?? {}],
    queryFn: () => taskService.getTasks(params),
    select: (response) => response.data,
  })
}

export const useProjectTasks = (projectId: number, filters?: {
  status?: string
  priority?: string
  assignedTo?: number
  page?: number
  limit?: number
}) => {
  return useTasks({ ...filters, projectId })
}

export const useTask = (id: number) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTaskById(id),
    select: (response) => response.data,
    enabled: !!id,
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['projectTasks'] })
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task'] })
      queryClient.invalidateQueries({ queryKey: ['projectTasks'] })
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['projectTasks'] })
    },
  })
}