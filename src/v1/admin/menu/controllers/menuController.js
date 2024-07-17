const { rm } = require("fs");
const Restaurant = require("../../restaurant/models/restaurantModel");
const { INTERNAL_SERVER_ERROR, OK, NOT_FOUND } = require("../../../../utils/statuscode");
const Menu = require("../models/menuModel");
const mongoose = require("mongoose");

const getAllMenuItems = async(req,res)=>{
    try {
     const menus = await Menu.find({});
     res.status(OK).json({
        status: OK,
        message: "Menu Items found successfully",
        data: menus,
    });
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while fetching all menu items." });   
    }
}

const getMenuByRestaurant = async(req,res)=>{
    try {
     const {restaurant} = req.params;
     const menu = await Menu.find({restaurant});
     res.status(OK).json({
        status: OK,
        message: "Menu found successfully",
        data: menu,
    });
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while finding menu item." });   
    }
}

const addMenuItem = async(req,res)=>{
    try {
        if(!req.file)
        return res.status(400).json({ error: "Please upload dish image" });
      
        const {resId} = req.query;
        if(!resId){
            return res.status(400).json({ error: "Please give restaurant id as query paramenter." });
        }

        req.body.image= req.file.path;
       const restaurant = new mongoose.Types.ObjectId(resId);
        req.body.restaurant= restaurant;

        const menu = new Menu(req.body);
        await menu.save();

        res.status(OK).json({
            status: OK,
            message: "Menu Item created successfully",
            data: menu,
        });
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while creating menu item." });   
    }
}

const updateMenuItem = async(req,res)=>{
    try {
        const {id} = req.params;

        let menu = await Menu.findById(id);
        if(!menu){
            return res.status(NOT_FOUND).json({status:NOT_FOUND, error: "Menu Item not found" });
        }
            
        if(req.file){
            rm(menu.image, ()=>{
                console.log("Menu Item's image deleted");  
            });
            req.body.image= req.file.path;
        }

        menu = await Menu.findByIdAndUpdate(id,req.body,{new:true});
        await menu.save();

        res.status(OK).json({
            status: OK,
            message: "Menu Item updated successfully",
            data: menu,
        });
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while updating menu item." });   
    }
}

const deleteMenuItem = async(req,res)=>{
    try {
        const {id} = req.params;

        let menu = await Menu.findById(id);
        if(!menu){
            return res.status(NOT_FOUND).json({status:NOT_FOUND, error: "Menu Item not found" });
        }
        
        rm(menu.image, ()=>{
            console.log("Menu Item's image deleted");  
        });

        await Menu.findByIdAndDelete(id);

        res.status(OK).json({
            status: OK,
            message: "Menu Item deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while deleting menu item." });   
    }
}

module.exports = {addMenuItem, getAllMenuItems, getMenuByRestaurant, updateMenuItem, deleteMenuItem};