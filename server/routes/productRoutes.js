import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  getProductController,
  singleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  realatedProductController,
  productCategoryController,
} from "../controllers/productController.js";

import formidable from "express-formidable";

const router = express.Router();

// Create Product

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// get products

router.get("/get-product", getProductController);

// get single product

router.get("/get-product/:slug", singleProductController);

// get product photo

router.get("/product-photo/:pid", productPhotoController);

// delete product

router.delete("/delete-product/:pid",requireSignIn,isAdmin, deleteProductController);


// update product

router.put("/update-product/:pid", requireSignIn, isAdmin,formidable(),updateProductController);


// filter product

router.post("/product-filters", productFilterController);

// product count

router.get("/product-count", productCountController );

// product per page 

router.get("/product-list/:page", productListController);

// Search product

router.get("/search/:keyword", searchProductController);

// similar products

router.get("/realated-product/:pid/:cid", realatedProductController );

// getting products categories wise 

router.get("/product-category/:slug", productCategoryController);


// payment routes


export default router;
