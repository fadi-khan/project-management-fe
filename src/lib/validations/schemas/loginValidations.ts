import * as yup from 'yup';

export const loginValidationSchema = yup.object().shape(

    {
        email: yup.string()
        .required("Email is required")
        .email("Please enter a valid email")
        .min(5,"Email must be atleast 5 characters"),
        password:yup.string()
        .required("Password is required")
        
    }

)