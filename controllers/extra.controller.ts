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

export const deleteExtra = async (req: Request, res: Response) => {
  await extrasService.deleteExtraService(req.params.id as string);
  res.status(204).json({
    status: "success",
    data: {},
  });
};

export const updateExtra = async (req: Request, res: Response) => {
  const extraId = req.params.id as string;
  const extra = await extrasService.updateExtraService({
    extra_id: extraId,
    data: req.body,
  });
  res.status(200).json({
    status: "success",
    data: {
      extra,
    },
  });
};
