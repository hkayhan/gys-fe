import * as Yup from 'yup'



export const LoginSchema =Yup.object().shape({
    password: Yup.string()
        .required()
        .min(6)
})