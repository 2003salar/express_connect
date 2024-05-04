const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('./isUserAuthenticated');
const { Users, Posts, Comments } = require('../models');
 
// Get a specific comment in a post
router.get('/:postId/:commentId', isUserAuthenticated, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        if (!postId || isNaN(postId)) {
            return res.status(400).json({success: false, message: 'Invalid post'});
        }
        if (!commentId || isNaN(commentId)) {
            return res.status(400).json({success: false, message: 'Invalid comment id'});
        }
        const comment = await Comments.findOne({
            where: {
                id: commentId,
                post_id: postId,
            }, 
                include: [
                    {
                        model: Users,
                        as: 'user',
                        attributes: ['id', 'username'],
                    }
                ],
            
        });
        if (!comment) {
            return res.status(404).json({success: false, message: 'Comment not found'});
        } 
        res.status(200).json({success: true, data: comment})
    } catch (error) {
        
    }
})
// Comment in a post
router.post('/:id', isUserAuthenticated, async (req, res) => {
    try {
        // Validate the id parameter
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid id'});
        }
        const post = await Posts.findByPk(id);
        if (!post) {
            return res.status(404).json({success: false, message: 'Post not found'});
        }
        // Get the body of the comment 
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        }
        const newComment = await Comments.create({
            user_id: req.user.id,
            post_id: id,
            content,
        });

        const commentWithUser = await Comments.findByPk(newComment.id, {
            include: {
                model: Users,
                as: 'user',
                attributes: ['id', 'username'],
            },
        });
        res.status(200).json({success: true, data: commentWithUser});

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
    
});
// Reply to a comment
// Edit a comment if the user is the commentor

// Delete a comment if the users is the commentor

module.exports = router;