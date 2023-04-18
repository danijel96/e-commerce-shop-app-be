const Product = require("../models/Product");

const router = require("express").Router();

//CREATE

router.post("/", async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT
router.get("/featured", async (req, res) => {
    try {
        const product = await Product.find({ featured: true });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//// GET products with filters and sorters
//router.get('/products', async (req, res) => {
//    try {
//      const { category, priceMin, priceMax, sortBy, sortOrder } = req.query;
//      const filters = {};
//      const sort = {};
  
//      // Set filters based on query parameters
//      if (category) {
//        filters.category = category;
//      }
//      if (priceMin) {
//        filters.price = { $gte: priceMin };
//      }
//      if (priceMax) {
//        filters.price = { ...filters.price, $lte: priceMax };
//      }
  
//      // Set sort based on query parameters
//      if (sortBy) {
//        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
//      }
  
//      // Query the database with filters and sorters
//      const products = await Product.find(filters).sort(sort);
  
//      res.json(products);
//    } catch (error) {
//      console.error(error);
//      res.status(500).send('Server Error');
//    }
//  });

router.get('/', async (req, res) => {
    try {
      const { category, priceMin, priceMax, sortBy, sortOrder, page = 1, limit = 10 } = req.query;
      const filters = {};
      const sort = {};
  
      // Set filters based on query parameters
      if (category) {
        filters.category = category;
      }
      if (priceMin) {
        filters.price = { $gte: priceMin };
      }
      if (priceMax) {
        filters.price = { ...filters.price, $lte: priceMax };
      }
      console.log(filters);
      // Set sort based on query parameters
      if (sortBy) {
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      }
  
      // Calculate skip and limit based on page and limit
      const skip = (page - 1) * limit;
  
      // Query the database with filters, sorters and pagination
      const products = await Product.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));
  
      const count = await Product.countDocuments(filters);
  
      res.json({
        products,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalProducts: count,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  

//GET ALL PRODUCTS
//router.get("/", async (req, res) => {
//    const pageOptions = {
//        page: parseInt(req.query.page, 10) || 1,
//        limit: parseInt(req.query.limit, 10) || 10,
//        priceRange: req.query.priceRange || null,
//        category: req.query.categories || null,
//    };
//    console.log('pageOptions', pageOptions);

//    try {
//        let products;

//        console.log("usao gore", pageOptions.priceRange);
//        if (pageOptions.priceRange) {
//            console.log("usao ovde", pageOptions.priceRange);
//            products = await Product.find({
//                price: { $gt: 20, $lt: 100 },
//            })
//                .skip(
//                    pageOptions.page === 1
//                        ? 0
//                        : pageOptions.page * pageOptions.limit -
//                              pageOptions.limit
//                )
//                .limit(pageOptions.limit);
//        } else {
//            products = await Product.find()
//                .skip(
//                    pageOptions.page === 1
//                        ? 0
//                        : pageOptions.page * pageOptions.limit -
//                              pageOptions.limit
//                )
//                .limit(pageOptions.limit);
//        }
//        res.status(200).json(products);
//    } catch (err) {
//        res.status(500).json(err);
//    }
//});

module.exports = router;
