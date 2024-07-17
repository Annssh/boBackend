const express = require("express");
const { upload } = require("../../../helper/s3-Bucket");
const { addRestaurant, getAllRestaurants, updateRestaurant, deleteRestaurant } = require("./controllers/restaurantController");
const restaurantRoute = express.Router();


restaurantRoute.get("/admin/restaurants", getAllRestaurants);

restaurantRoute.post("/admin/restaurant", upload.single("image"), addRestaurant);

restaurantRoute.route("/admin/restaurant/:id").put(upload.single("image"), updateRestaurant).delete(deleteRestaurant);


module.exports = restaurantRoute;

