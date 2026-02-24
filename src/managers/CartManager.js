const ProductManager = require("./ProductManager");
const fs = require("fs");
const path = require("path");

class CartManager {
  constructor() {
    this.path = path.join(__dirname, "../data/carts.json");
  }

  async getCarts() {
    try {
      if (!fs.existsSync(this.path)) return [];
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw error;
    }
  }

  async createCart() {
    const carts = await this.getCarts();

    const newId =
      carts.length > 0
        ? Math.max(...carts.map(c => c.id)) + 1
        : 1;

    const newCart = {
      id: newId,
      products: []
    };

    carts.push(newCart);

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(carts, null, 2)
    );

    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const productManager = new ProductManager();

    const product = await productManager.getProductById(pid);
    if (!product) return "PRODUCT_NOT_FOUND";


    const cartIndex = carts.findIndex(c => c.id === cid);
    if (cartIndex === -1) return null;

    const productIndex = carts[cartIndex].products.findIndex(
      p => p.product === pid
    );

    if (productIndex !== -1) {
      carts[cartIndex].products[productIndex].quantity += 1;
    } else {
      carts[cartIndex].products.push({
        product: pid,
        quantity: 1
      });
    }

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(carts, null, 2)
    );

    return carts[cartIndex];
  }
}

module.exports = CartManager;