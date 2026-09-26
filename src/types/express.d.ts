import { DeliveryBoy, User } from "../../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      deliveryBoy?: DeliveryBoy;
    }
  }
}
