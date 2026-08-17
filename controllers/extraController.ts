import { Request, Response } from "express";
import * as extrasService from "../services/extra.service";
export const getExtras = async (req: Request, res: Response) => {
  const extras = await extrasService.getExtrasService();
  res.status(200).json({
    status: "success",
    result: extras.length,
    data: {
      extras,
    },
  });
};
export const createExtra = async (req: Request, res: Response) => {
  const extra = await extrasService.createExtraService(req.body);
  res.status(201).json({
    status: "success",
    data: {
      extra,
    },
  });
};
