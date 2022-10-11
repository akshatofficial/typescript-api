import { Express, Request, Response } from "express";
import {
  createProductHandler,
  DeleteProductHandler,
  FindProductHandler,
  updateProductHandler,
} from "./controllers/Product.controller";
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessionshandler,
} from "./controllers/session.controller";
import { createUserHandler } from "./controllers/user.controller";
import requireUser from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import {
  CreateProductSchema,
  DeleteSchemaProduct,
  ReadProductSchema,
  UpdateProductSchema,
} from "./schema/product.schema";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";

function routes(app: Express) {
  app.get("/health-check", (req: Request, res: Response) =>
    res.sendStatus(200)
  );

  app.post("/api/user", validateResource(createUserSchema), createUserHandler);

  app.post(
    "/api/session",
    validateResource(createSessionSchema),
    createSessionHandler
  );

  app.get("/api/session", requireUser, getUserSessionshandler);

  app.delete("/api/session", requireUser, deleteSessionHandler);

  app.post(
    "/api/product",
    [requireUser, validateResource(CreateProductSchema)],
    createProductHandler
  );

  app.put(
    "/api/product/:productId",
    [requireUser, validateResource(UpdateProductSchema)],
    updateProductHandler
  );

  app.get(
    "/api/product/:productId",
    validateResource(ReadProductSchema),
    FindProductHandler
  );

  app.delete(
    "/api/product/:productId",
    [requireUser, validateResource(DeleteSchemaProduct)],
    DeleteProductHandler
  );
}

export default routes;
