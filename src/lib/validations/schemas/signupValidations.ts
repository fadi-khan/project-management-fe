import * as yup from 'yup';

export const signupValidationSchema = yup.object().shape(

    {
        email: yup.string()
        .required("Email is required")
        .email("Please enter a valid email")
        .min(5,"Email must be atleast 5 characters"),
        password:yup.string()
        .required("Password is required")
        .min(6, "Password must be atleast 6 characters long"),
        name:yup.string()
        .required("Name is required")
        .min(3, "Name must be atleast 3 characters long")
    }

)