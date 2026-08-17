import { Request, Response } from "express";
import * as sizeService from "../services/size.service";
export const getSizes = async (req: Request, res: Response) => {
  const sizes = await sizeService.getSizesService();
  res.status(200).json({
    status: "success",
    result: sizes.length,
    data: {
      sizes,
    },
  });
};
export const createSize = async (req: Request, res: Response) => {
  const size = await sizeService.createSizeService(req.body);
  res.status(201).json({
    status: "success",
    data: {
      size,
    },
  });
};
