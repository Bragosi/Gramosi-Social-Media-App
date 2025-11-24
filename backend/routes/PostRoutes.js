const express = require('express')
const isAuthenticated = require('../middleware/isAuthenticated')
const upload = require('../middleware/multer')
const { CreatePost, GetAllPost, GetUserPost, SaveOrUnsavePost, DeletePost,AddComment, LikeAndDislikePost, GetSinglePost } = require('../controllers/postController')

const router = express.Router()

router.post("/createPost", isAuthenticated, upload.single('media'), CreatePost)
router.get("/all", GetAllPost)
router.get("/userPost/:id", GetUserPost)
router.post("/saveAndUnsavePosts/:postId", isAuthenticated, SaveOrUnsavePost )
router.delete("/deletePost/:id", isAuthenticated, DeletePost)
router.post("/likeAndDislikePost/:id", isAuthenticated, LikeAndDislikePost)
router.post("/comment/:id", isAuthenticated, AddComment)
router.get("/singlePosts/:id", isAuthenticated, GetSinglePost )
module.exports =router