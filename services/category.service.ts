import db from "../lib/prisma"
import {Category} from "../generated/prisma/client";
import {Request} from "express";
import uploadImage from "../utils/uploadImage";

const getAllCategoriesService = async()=>{
  const categories = await db.category.findMany();
  return {
    categories,
    count: categories.length,
  };
}
const createCategoryService = async ({name}:Category,req:Request)=>{
  let image={}
  if(req.file){
    const {url,public_id} = await uploadImage(req.file.buffer,'Categories')
    image={url,public_id}
  }
  const category = await db.category.create({data:{name,image}})
  return category
}
export {getAllCategoriesService,createCategoryService}