import { object, number, string, TypeOf } from "zod";

const payload = {
  body: object({
    title: string({
      required_error: "Produt tittle is required!",
    }),
    description: string({
      required_error: "Product description is required!",
    }).min(120, "Product description should be atleast 120 characters long!"),
    price: number({
      required_error: "Product price is required!",
    }),
    image: string({
      required_error: "Product image is required!",
    }),
  }),
};

const params = {
  params: object({
    productId: string({
      required_error: "Product id is required!",
    }),
  }),
};

export const CreateProductSchema = object({
  ...payload,
});

export const UpdateProductSchema = object({
  ...payload,
  ...params,
});

export const ReadProductSchema = object({
  ...params,
});

export const DeleteSchemaProduct = object({
  ...params,
});

export type CreateProductInput = TypeOf<typeof CreateProductSchema>;
export type UpdateProductInput = TypeOf<typeof UpdateProductSchema>;
export type ReadProductInput = TypeOf<typeof ReadProductSchema>;
export type DeleteProductInput = TypeOf<typeof DeleteSchemaProduct>;
