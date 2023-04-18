const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        currency: { type: String, required: true },
        image: {
            src: {
                type: String, required: true
            },
            alt: {
                type: String, required: true
            },
        },
        bestseller: { type: Boolean, required: true },
        featured: { type: Boolean, required: true },
        //details: { type: Boolean, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
