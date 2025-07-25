import categoryModel from "../models/categoryModel.js";

export const createCategory = async (req,res)=>{
    try {
        const {name} = req.body;

        const category = await categoryModel.create({
            name
        })

        return res.status(201).json({
            status:"Success",
            message:"Category  Created Successfuly",
            category
        })
        
    } catch (error) {
        return res.status(400).json({
            status:"Failed",
            message:error.message
        })
    }
}

export const getAllCategories = async (req,res)=>{
    try {
        const categories = await categoryModel.find();
        return res.status(200).json({
            status:"Success",
            data:categories
        })
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}


export const updateCategory = async (req,res)=>{
    try {
        const {id} = req.params;
        const {name} = req.body;
        const category = await categoryModel.findByIdAndUpdate(id,{name},{new:true,runValidators:true});
        return res.status(200).json({
            status:"Success",
            message:"Category Updated Successfuly",
            data:category
        })
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const deleteCategory = async (req,res)=>{
    try {
        const {id} = req.params;
        const category = await categoryModel.deleteOne({_id:id});
        return res.status(200).json({
            status:"Success",
            message:"Category Deleted Successfuly",
            data:category
        })
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}


