const express = require("express");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

router.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await manager.getProductById(id);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product);
});

router.post("/", async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (typeof price !== "number" || typeof stock !== "number") {
    return res.status(400).json({ error: "Price y stock deben ser números" });
  }

  const newProduct = await manager.addProduct(req.body);
  res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const updatedProduct = await manager.updateProduct(id, req.body);

  if (!updatedProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(updatedProduct);
});

router.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  await manager.deleteProduct(id);
  res.json({ message: "Producto eliminado" });
});

module.exports = router;