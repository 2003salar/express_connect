const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('./isUserAuthenticated');
const { Users, Posts, Comments } = require('../models');
 
// Get a specific comment in a post 
router.get('/:commentId', isUserAuthenticated, async (req, res) => {
    try {
        const { commentId } = req.params;
        if (!commentId || isNaN(commentId)) {
            return res.status(400).json({success: false, message: 'Invalid comment id'});
        }
        const comment = await Comments.findOne({
            where: {
                id: commentId,
            }, 
                include: [
                    {
                        model: Users,
                        as: 'user',
                        attributes: ['id', 'username'],
                    }, {
                        model: Comments,
                        as: 'replies',
                        include: [
                            {
                                model: Users,
                                as: 'user',
                                attributes: ['id', 'username'],
                            },
                        ],
                    },
                ],
        });
        if (!comment) {
            return res.status(404).json({success: false, message: 'Comment not found'});
        } 
        res.status(200).json({success: true, data: comment})
    } catch (error) {
        
    }
});

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
router.post('/reply/:postId/:parentId', isUserAuthenticated, async (req, res) => {
    try {
        const { parentId, postId } = req.params;
        if (!parentId || isNaN(parentId)) {
            return res.status(400).json({success: false, message: 'Invalid parent id'});
        } 
        if (!postId || isNaN(postId)) {
            return res.status(400).json({success: false, messgae: 'Invalid post id'});
        }
        const parentComment = await Comments.findByPk(parentId);
        if (!parentComment) {
            return res.status(404).json({success: false, message: 'Comment not found'});
        } 

        const post = await Posts.findByPk(postId);
        if (!post) {
            return res.status(404).json({success: false, message: 'Post not found'})
        }
        
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({success: false, messgae: 'Missing required fields'});
        }

        const newReply = await Comments.create({
            user_id: req.user.id,
            post_id: postId,
            parent_comment_id: parentId,
            content,
        });
        
        const commentWithReply = await Comments.findByPk(parentId, {
            include: [
                {
                    model: Comments,
                    as: 'replies',
                    attributes: ['user_id', 'post_id', 'content'],
                    include: [
                        {
                            model: Users,
                            as: 'user',
                            attributes: ['id', 'username'],
                        },
                    ],
                }, 
            ],
        })
        res.status(200).json({success: true, data: commentWithReply});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

// Edit a comment if the user is the commentor
router.patch('/:id', isUserAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid comment id'});
        }
        const comment = await Comments.findByPk(id);
        if (!comment) {
            return res.status(404).json({success: false, message: 'Comment not found'});
        }
        if (comment.user_id !== req.user.id) {
            return res.status(403).json({success: false, message: 'Permission denied'});
        }

        const updatedParts = {...req.body};
        delete updatedParts.created_at;
        delete updatedParts.updated_at;
        delete updatedParts.user_id;
        delete updatedParts.post_id;

        await Comments.update(updatedParts, {
            where: {
                id,
                user_id: req.user.id,
            },
        });

        const updatedComment = await Comments.findByPk(id);
        res.status(200).json({success: true, data: updatedComment});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

// Delete a comment if the users is the commentor
router.delete('/:id', isUserAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid id'});
        }
        const comment = await Comments.findByPk(id);
        if (!comment) {
            return res.status(404).json({success: false, message: 'Comment not found'});
        }
        const deletionCount = await Comments.destroy({
            where: {
                id,
                user_id: req.user.id,
            },
        });
        console.log(deletionCount)
        if (deletionCount === 0) {
            return res.status(403).json({success: false, message: 'Permission denied'});
        }
        res.status(201).json({success: true, message: 'Comment successfully deleted'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});
module.exports = router;