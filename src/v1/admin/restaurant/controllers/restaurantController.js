const { rm } = require("fs");
const Restaurant = require("../models/restaurantModel");
const { INTERNAL_SERVER_ERROR, OK, NOT_FOUND } = require("../../../../utils/statuscode");

const getAllRestaurants = async(req,res)=>{
    try {
     const restaurants = await Restaurant.find({});
     res.status(OK).json({
        status: OK,
        message: "Restaurant found successfully",
        data: restaurants,
    });
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while fetching all restaurants." });   
    }
}

const addRestaurant = async(req,res)=>{
    try {
        if(!req.file)
        return res.status(400).json({ error: "Please upload restaurant image" });

        req.body.image= req.file.path;

        const restaurant = new Restaurant(req.body);
        await restaurant.save();

        res.status(OK).json({
            status: OK,
            message: "Restaurant created successfully",
            data: restaurant,
        });
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while creating restaurant." });   
    }
}

const updateRestaurant = async(req,res)=>{
    try {
        const {id} = req.params;

        let restaurant = await Restaurant.findById(id);
        if(!restaurant){
            return res.status(NOT_FOUND).json({status:NOT_FOUND, error: "Restaurant not found" });
        }
            
        if(req.file){
            rm(restaurant.image, ()=>{
                console.log("Restaurant image deleted");  
            });
            req.body.image= req.file.path;
        }

        restaurant = await Restaurant.findByIdAndUpdate(id,req.body,{new:true});
        await restaurant.save();

        res.status(OK).json({
            status: OK,
            message: "Restaurant updated successfully",
            data: restaurant,
        });
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while updating restaurant." });   
    }
}

const deleteRestaurant = async(req,res)=>{
    try {
        const {id} = req.params;

        let restaurant = await Restaurant.findById(id);
        if(!restaurant){
            return res.status(NOT_FOUND).json({status:NOT_FOUND, error: "Restaurant not found" });
        }
        
        rm(restaurant.image, ()=>{
            console.log("Restaurant image deleted");  
        });

        await Restaurant.findByIdAndDelete(id);

        res.status(OK).json({
            status: OK,
            message: "Restaurant deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while updating restaurant." });   
    }
}

module.exports = {addRestaurant, getAllRestaurants, updateRestaurant, deleteRestaurant};