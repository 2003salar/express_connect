const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('./isUserAuthenticated');
const {Users, Posts, Comments, Tags, Post_Tags} = require('../models');

// get all posts with their creator users
router.get('/', isUserAuthenticated, async (req, res) => {
    try {
        const posts = await Posts.findAll({
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'username'],
                }, {
                    model: Comments,
                    as: 'comments',
                    include: [
                        {
                            model: Users,
                            as: 'user',
                            include: [
                                {
                                    model: Comments,
                                    as: 'comments',
                                    include: [
                                        {
                                            model: Users,
                                            as: 'user',
                                            attributes: ['id', 'username'],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [['created_at', 'DESC']],
        });
        res.status(200).json({success: true, data: posts});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

// Create a post
router.post('/', isUserAuthenticated, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        }
        const newPost = await Posts.create({
            user_id: req.user.id,
            title,
            content,
        });

        res.status(200).json({ success: true, data: newPost });    
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

// Get a specific post
router.get('/:id', isUserAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid id'});
        }
        const post = await Posts.findByPk(id, {
            include: [
                {
                    model: Comments,
                    as: 'comments',
                    include:  [
                        {
                            model: Users,
                            as: 'user',
                            attributes: ['id', 'username'],
                        },
                        {
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
                },
            ],
        });
        if (!post) {
            return res.status(404).json({success: false, message: 'Post not found'});
        }
        res.status(200).json({success: true, data: post});  
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }    
});

// Edit a post 
router.patch('/:id', isUserAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid project'});
        }
        const post = await Posts.findByPk(id);
        if (!post) {
            return res.status(404).json({success: false, message: 'Post not found'});
        }
        if (post.user_id !== req.user.id) {
            return res.status(403).json({success: false, message: 'Access denied'});
        }
        
        const updatedParts = {...req.body};
        delete updatedParts.created_at;
        delete updatedParts.updated_at;
        delete updatedParts.user_id;

        await Posts.update(updatedParts, {
            where: {
                id,
                user_id: req.user.id,
            },
        });

        const updatedPost = await Posts.findByPk(id);
        res.status(200).json({success: true, message: updatedPost});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Servere error'});
    }
});

// Delete a post if the creator is the user
router.delete('/:id', isUserAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid post id'});
        }
        const post = await Posts.findByPk(id);
        if (!post) {
            return res.status(404).json({success: false, message: 'Post not found'});
        }
        if (post.user_id !== req.user.id) {
            return res.status(400).json({success: false, messgae: 'Access denied'});
        }
        const deletionCount = await Posts.destroy({
            where: {
                id,
            }
        }); 
        if (deletionCount === 0) {
            return res.status(403).json({success: false, message: 'Access denied'});
        }
        res.status(201).json({success: true, messgae: 'Post successfully deleted'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});
module.exports = router;