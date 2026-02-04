import { toast } from "react-toastify";
import { httpService } from "./HttpService"
import { store } from "../store/store";
import { clearCredentials, setCredentials } from "../store/authSlice";
type LoginPayload = {
    email: string;
    password: string;
};
type SignUpPayload = {
    email: string;
    password: string;
    name: string;
};
type VerifyOtpPayload = {
    email: string;
    otp: string;
};
export const authService = {
 

    login: async ({ password, email }: LoginPayload) => {

        try {
            const response = await httpService.post("auth/sign-in", { password, email })
            store.dispatch(setCredentials(response?.data?.user))
            toast.success(response?.data?.message )
            return response;
        } catch (error: any) {

            toast.error(error.response.data.message || " Failed to process request . Please try again later !")
            throw error;

        }
    },
    signUp: async ({ password, email , name }: SignUpPayload) => {

        try {
            const response = await httpService.post("auth/sign-up", { password, email, name })
            toast.success(response?.data?.message || "Account created successfully !")
            return response;
        } catch (error: any) {

            toast.error(error.response.data.message || " Failed to process request . Please try again later !")
            throw error;

        }
    },

    verifyOtp: async ({ email, otp }: VerifyOtpPayload) => {

        const payload = {
            email: email,
            otp: otp

        }

        try {

            const response = await httpService.post("auth/verify-otp", payload)
            toast.success("Login Successful!")
            return response;


        } catch (error: any) {

            toast.error(error.response.data.message || " Failed to process request . Please try again later !")

            throw error;
        }


    },

    getProfile: async () => {
        try {
            const response = await httpService.get("auth/profile");

            return response;

        } catch (error: any) {
            toast.error(error.response.data.message || " Failed to process request . Please try again later !")

            throw error;

        }
    },
    logout: async () => {
        try {
            const response = await httpService.post("auth/logout");
            store.dispatch(clearCredentials())
            window.location.href = '/login';
            return response;

        } catch (error: any) {
            toast.error(error.response.data.message || " Failed to process request . Please try again later !")

            throw error;

        }
    }
    ,
    getUserDataFromGoogle:  (params:any) => {
        const email = params.email;
        const name = params.name;
        const role = params.role;

        if (typeof email !== 'string' || typeof name !== 'string' || typeof role !== 'string') {
            console.error('Invalid params received:', params);
            return;
        }

         store.dispatch(setCredentials({email, name, role}));
    }



}  