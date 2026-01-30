import { httpService } from "./HttpService"

export const userService = {
  getUsers: async () => {
    const response = await httpService.get('user')
    return response
  },
}
