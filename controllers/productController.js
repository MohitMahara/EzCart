import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";


// payment gateway



export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validataion

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });

      case !description:
        return res.status(500).send({ error: "Description is Required" });

      case !price:
        return res.status(500).send({ error: "Price is Required" });

      case !category:
        return res.status(500).send({ error: "Category is Required" });

      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo  is Required and should be less then 1mb" });
    }

    const product = new productModel({ ...req.fields, slug: slugify(name) });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product created Succesfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while creating product",
    });
  }
};

// get products

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All products",
      counTotal: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting the products",
    });
  }
};

// single Product

export const singleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Got the product successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting single product",
    });
  }
};

// product photo

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");

    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting product photo",
    });
  }
};

// delete product

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting the product",
    });
  }
};

// update Product

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;

    const { photo } = req.files;

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product updated Succesfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating  product",
      error,
    });
  }
};

// filter products

export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    console.log(checked);
    let args = {};

    if (checked.length > 0) {
      args.category = checked;
    }

    if (radio.length) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }

    const products = await productModel.find(args);

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering  product",
      error,
    });
  }
};

// Product count

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: false,
      error,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
       res.json(result);

  } catch (error) {
      console.log(error);
      res.status(400).send({
      message: "Error while searching product",
      error,
      success: false,
    });
  }
};


// similar products


export  const realatedProductController = async (req, res) => {
  try {
     const {pid, cid} = req.params;
     const products = await productModel.find({
       category : cid,
       _id : {$ne :pid}
     }).select("-photo").limit(6).populate("category");

     res.status(200).send({
      success : true,
      products
     })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message : "Error while getting similar products",
      error,
      success : false
    })
  }
}



export const productCategoryController = async(req, res) =>{
  try {
    const category = await categoryModel.find({slug : req.params.slug});
    const products = await productModel.find({category}).populate('category')

    res.status(200).send({
      success : true,
      products,
      category
    })

  } catch (error) {
    console.log(error);
    res.status(400).send({
      message : "Error while getting category wise product",
      error,
      success : false
    })
  }
}



// payment gateway api


