import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required!",
    }),
    email: string({
      required_error: "Email is required!",
    }).email("Not a valid email!"),
    password: string({
      required_error: "Password is required!",
    }).min(6, "Password should have minimum of 6 chars"),
    confirmPassword: string({
      required_error: "Confirmed password is required!",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
});

export type CreateUserSchema = Omit<
  TypeOf<typeof createUserSchema>,
  "body.confirmPassword"
>;
