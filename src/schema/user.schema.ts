import { TypeOf, object, string } from "zod";

export const userSchema = object({
    body: object({
        name: string({
            required_error: "name is required."
        }),
        email: string({
            required_error: "email is required."
        }).email("Not a valid email address."),
        password: string({
            required_error: "password is required."
        }),
        confirmPassword: string({
            required_error: "confirm password is required."
        })
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match.",
        path: ["confirmPassword"]
    })
})

export type createUserInput = Omit<TypeOf<typeof userSchema>, "body.confirmPassword">