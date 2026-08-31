import { User } from "../../generated/prisma/client";
import { ProductQuerySchemaType } from "../../validations";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      validatedQuery?: ProductQuerySchemaType;
    }
  }
}
