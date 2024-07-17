const { default: mongoose } = require("mongoose");
const Post = require("../models/postModel");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = require("../../../utils/statuscode");
const fs = require('fs');

const IMAGE_MAX_SIZE = 50 * 1024 * 1024; // 50 MB
const VIDEO_MAX_SIZE = 100 * 1024 * 1024; // 100 MB

const createPost = async(req,res)=>{
    try {
        var {content, user} = req.body;
        if(!content || !user){
            return res.status(BAD_REQUEST).json({
              success:false,
              message:"Please give all details"
            })
        }
        var media;
        if(!req.file){
            return res.status(BAD_REQUEST).json({
                success:false,
                message:"Please upload media file"
              })
          }

            const fileSize = req.file.size;
            const mimeType = req.file.mimetype;

            if (mimeType.startsWith('image/') && fileSize > IMAGE_MAX_SIZE) {
                fs.unlink(req.file.path, (err) => {
                  if (err) console.error(err);
                  return res.status(400).json({success:false, error: 'Image file size exceeds the 50 MB limit' });
                });
                return;
              } else if (mimeType.startsWith('video/') && fileSize > VIDEO_MAX_SIZE) {
                fs.unlink(req.file.path, (err) => {
                  if (err) console.error(err);
                  return res.status(400).json({success:false, error: 'Video file size exceeds the 100 MB limit' });
                });
                return;
            }
            
            media=req.file.filename;
            console.log(req.file);


        user = new mongoose.Types.ObjectId(user);

        const post = new Post({media,content,user});
        console.log(post);
        await post.save();
        return res.status(OK).json({
            success:true,
            message:"Post created successfully",
            post
          })
    } catch (error){
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

const getAllPostOfUsers= async(req,res)=>{
    try {
        const {user} = req.params;
        const posts = await Post.find({user});
        return res.status(OK).json({
            success:true,
            message:"Posts found successfully",
            posts
          })
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

const likeAPost= async(req,res)=>{
    try {
        const {postId} = req.body;
        if(!postId){
            return res.status(BAD_REQUEST).json({
                success:false,
                message:"Please provide Post Id",
              })
        }
        const post = await Post.findOne({_id:postId});
        var userLiked= post.likes.slice();
        const userId= new mongoose.Types.ObjectId(req.userId);
         const idx= userLiked.findIndex((id)=> id.equals(userId));

         if(idx===-1)
         userLiked.push(userId);
        
         post.likes= userLiked;
         await post.save();

        return res.status(OK).json({
            success:true,
            message:"Posts liked successfully",
            likes:userLiked,
          })
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

const commentOnAPost= async(req,res)=>{
    try {
        const {postId, text} = req.body;
        if(!postId){
            return res.status(BAD_REQUEST).json({
                success:false,
                message:"Please provide Post Id",
              })
        }

        if(!text){
            return res.status(BAD_REQUEST).json({
                success:false,
                message:"Please provide comment text",
              })
        }
        const post = await Post.findOne({_id:postId});
        const allComments = post.comments;
        const newComment = {
            user:new mongoose.Types.ObjectId(req.userId),
            text,
            time:new Date(Date.now())
        }
        allComments.push(newComment);
        post.comments = allComments;
        await post.save();


        return res.status(OK).json({
            success:true,
            message:"Posts commented successfully",
            comments:allComments,
          })
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

const getAllLikesByPostId= async(req,res)=>{
    try {
        const {postId} = req.params;
        if(!postId){
            return res.status(BAD_REQUEST).json({
                success:false,
                message:"Please provide Post Id",
              })
        }
        const post = await Post.findOne({_id:postId}).populate("likes");
        const likes = post.likes;
        return res.status(OK).json({
            success:true,
            message:"Likes found successfully",
            likes:{count:likes.length, user:likes},
          })
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

const getAllCommentsByPostId= async(req,res)=>{
    try {
        const {postId} = req.params;
        if(!postId){
            return res.status(BAD_REQUEST).json({
                success:false,
                message:"Please provide Post Id",
              })
        }
        const post = await Post.findOne({_id:postId}).populate("comments.user");
        const comments= post.comments;
        return res.status(OK).json({
            success:true,
            message:"Comments found successfully",
            comments:{count:comments.length,details:comments}
          })
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

module.exports = {createPost, getAllPostOfUsers, likeAPost, commentOnAPost, getAllLikesByPostId, getAllCommentsByPostId};