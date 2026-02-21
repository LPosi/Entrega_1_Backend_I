const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../data/products.json");
  }

  async getProducts() {
    try {
      if (!fs.existsSync(this.path)) return [];
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts();

    const newId =
      products.length > 0
        ? products[products.length - 1].id + 1
        : 1;

    const newProduct = {
      id: newId,
      ...product
    };

    products.push(newProduct);

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, 2)
    );

    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();

    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    delete updatedFields.id;

    products[index] = {
      ...products[index],
      ...updatedFields
    };

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, 2)
    );

    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();

    const filteredProducts = products.filter(p => p.id !== id);

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(filteredProducts, null, 2)
    );

    return true;
  }
}

module.exports = ProductManager;