import { Request, Response } from "express";
import {
  CreateProductInput,
  DeleteProductInput,
  ReadProductInput,
  UpdateProductInput,
} from "../schema/product.schema";
import {
  createProduct,
  deleteProduct,
  findProduct,
  findProductAndUpdate,
} from "../service/product.service";

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const body = req.body;

  const product = await createProduct({ ...body, user: userId });

  return res.send(product);
}

export async function updateProductHandler(
  req: Request<UpdateProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const productId = req.params.productId;

  // For checking authority of user that the actual user is asking to update which have created it.
  const product = await findProduct({ productId });

  if (!product) return res.status(400).send("No product found!");

  if (String(product.user) != userId)
    return res.status(403).send("Forbidden request!");
  // we use the String() as product.user is have type mongoose.type an userId is string

  const update = req.body;

  const updatedProduct = await findProductAndUpdate({ productId }, update, {
    new: true,
  });

  return res.status(200).send(updatedProduct);
}

export async function DeleteProductHandler(
  req: Request<DeleteProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const productId = req.params.productId;

  // For checking authority of user that the actual user is asking to update which have created it.
  const product = await findProduct({ productId });

  if (!product) return res.status(400).send("No product found!");

  if (String(product.user) != userId)
    return res.status(403).send("Forbidden request!");
  // we use the String() as product.user is have type mongoose.type an userId is string

  const deletedProduct = await deleteProduct({ productId });

  return res.status(200).send(deletedProduct);
}

export async function FindProductHandler(
  req: Request<ReadProductInput["params"]>,
  res: Response
) {
  const productId = req.params.productId;

  const product = await findProduct({ productId });

  if(!product) return res.status(404).send("No Product find!");

  return res.status(200).send(product);
}
