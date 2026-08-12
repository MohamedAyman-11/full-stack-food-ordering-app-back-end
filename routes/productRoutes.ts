import express from 'express'
import { getAllProducts } from '../controllers/productController'
const router = express.Router()

router.route('/').get(getAllProducts)
// router.route('/:id').patch().delete()

export default router