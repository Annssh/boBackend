const express = require("express");
const { upload } = require("../../../helper/s3-Bucket");
const { addMenuItem, getAllMenuItems, updateMenuItem, deleteMenuItem, getMenuByRestaurant } = require("./controllers/menuController");
const menuRoute = express.Router();


menuRoute.get("/admin/menus", getAllMenuItems);

menuRoute.get("/menu/:restaurant", getMenuByRestaurant);

menuRoute.post("/admin/menu", upload.single("image"), addMenuItem);

menuRoute.route("/admin/menu/:id").put(upload.single("image"), updateMenuItem).delete(deleteMenuItem);


module.exports = menuRoute;

