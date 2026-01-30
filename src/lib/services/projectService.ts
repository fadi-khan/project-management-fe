import { httpService } from "./HttpService"
import { toast } from "react-toastify"

export const projectService = {

  createProject: async (body: any) => {
    try {
      const response = await httpService.post("project", body)
      toast.success("Project created successfully!")
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create project. Please try again later!")
      throw error;
    }
  },

  updateProject: async (id: number, body: any) => {
    try {
      const response = await httpService.update("project", id, body)
      toast.success("Project updated successfully!")
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update project. Please try again later!")
      throw error;
    }
  },

  deleteProject: async (id: number) => {
    try {
      const response = await httpService.delete("project", id)
      toast.success("Project deleted successfully!")
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete project. Please try again later!")
      throw error;
    }
  },

  getProjects: async (page = 1) => {
    try {
      const response = await httpService.get(`project?page=${page}`)
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  getProjectById: async (id: number) => {
    try {
      const response = await httpService.get(`project/${id}`)
      return response;
    } catch (error: any) {
      throw error;
    }
  }
}