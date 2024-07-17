const express = require('express');
const { createPost, getAllPostOfUsers, likeAPost, commentOnAPost, getAllLikesByPostId, getAllCommentsByPostId } = require('./controllers/postController');
const { upload } = require('../../helper/s3-Bucket');
const postRouter= express.Router();


postRouter.get("/posts/:user", getAllPostOfUsers);

postRouter.get("/likes/:postId", getAllLikesByPostId);

postRouter.get("/comments/:postId", getAllCommentsByPostId);

postRouter.post("/post", upload.single("media"), createPost);

postRouter.post("/post-like", likeAPost);

postRouter.post("/post-comment", commentOnAPost);

module.exports = postRouter;