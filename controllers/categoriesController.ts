import {NextFunction, Request, Response} from "express";
import {createCategoryService, getAllCategoriesService} from "../services/category.service";

const getAllCategories = async (req:Request,res:Response,next:NextFunction)=>{
  const {categories,count} = await getAllCategoriesService()
  res.status(200).json({
    status:'success',
    results:count,
    data:{
      categories
    }
  })
}
const createCategory = async (req:Request,res:Response,next:NextFunction)=>{
  const category = await createCategoryService(req.body,req)
  res.status(201).json({
    status:'success',
    data:{
      category
    }
  })
}
export{getAllCategories,createCategory}