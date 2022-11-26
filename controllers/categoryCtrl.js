const express= require("express");
const {  CategoryModel } = require("../models/categoryModel");
const {validateCategory} =require("../validations/categoryValid")
const router = express.Router();

exports.categoryCtrl = {
    getCategorylist: async(req,res)=> {
        let perPage = req.query.perPage || 50;
        let page = req.query.page || 1;
        try{
          let data = await CategoryModel.find({})
          .limit(perPage)
          .skip((page - 1) * perPage)
          .sort({_id:-1})
          res.json(data);
        }
        catch(err){
          console.log(err);
          res.status(500).json({msg:"there error try again later",err})
        }
      },
      
      
       addCategory : async(req,res) => {
        let validBody = validateCategory(req.body);
        if(validBody.error){
          res.status(400).json(validBody.error.details)
        }
        try{
          let category = new CategoryModel(req.body);
          await category.save();

          return res.json(category);

        }
        catch(err){
          console.log(err)
          return res.status(500).json({msg:"err",err})
        }
      },
      
      
     editCategory: async(req,res) => {
        let validBody = validateCategory(req.body);
        if(validBody.error){
          res.status(400).json(validBody.error.details)
        }
        try{
          
          let idEdit = req.params.idEdit
          let data = await CategoryModel.updateOne({_id:idEdit},req.body);
          let category = await CategoryModel.findOne({_id:idEdit})
          category.updatedAt = new Date(Date.now() +2 * 60 * 60 * 1000)
          category.save()
          res.json(data);
        }
        catch(err){
          console.log(err)
          res.status(500).json({msg:"err",err})
        }
      },
      
      deleteCategory: async(req,res) => {
        try{
          let idDel = req.params.idDel
          let data = await CategoryModel.deleteOne({_id:idDel});
          res.json(data);
        }
        catch(err){
          console.log(err)
          res.status(500).json({msg:"err",err})
        }
      },
      countCategory: async (req, res) => {
        try {
          let count = await CategoryModel.countDocuments({});
          res.json({ count });
        } catch (err) {
          console.log(err);
          res.status(500).json({ msg: "err", err });
        }
      }
}



