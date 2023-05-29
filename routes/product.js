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

//GET PRODUCT BY ID
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET FEATURED PRODUCT
router.get("/featured", async (req, res) => {
    try {
        const product = await Product.find({ featured: true });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    try {
        const {
            category,
            priceMin,
            priceMax,
            sortBy,
            sortOrder,
            page = 1,
            limit = 10,
        } = req.query;
        //  const filters = {};
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

        // Set sort based on query parameters
        if (sortBy) {
            sort[sortBy] = sortOrder === "asc" ? 1 : -1;
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
        res.status(500).send("Server Error");
    }
});

module.exports = router;
