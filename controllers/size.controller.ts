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

export const deleteSize = async (req: Request, res: Response) => {
  await sizeService.deleteSizeService(req.params.id as string);
  res.status(204).json({
    status: "success",
    data: {},
  });
};

export const updateSize = async (req: Request, res: Response) => {
  const sizeId = req.params.id as string;
  const size = await sizeService.updateSizeService({
    size_id: sizeId,
    data: req.body,
  });
  res.status(200).json({
    status: "success",
    data: {
      size,
    },
  });
};
