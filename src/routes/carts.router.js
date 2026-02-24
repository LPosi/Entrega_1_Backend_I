const express = require("express");
const CartManager = require("../managers/CartManager");

const router = express.Router();
const manager = new CartManager();

router.post("/", async (req, res) => {
  const newCart = await manager.createCart();
  res.status(201).json(newCart);
});

router.get("/:cid", async (req, res) => {
  const id = parseInt(req.params.cid);
  const cart = await manager.getCartById(id);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart.products);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  const result = await manager.addProductToCart(cid, pid);

  if (result === null) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  if (result === "PRODUCT_NOT_FOUND") {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(result);
});

module.exports = router;