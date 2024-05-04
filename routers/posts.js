const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('./isUserAuthenticated');
const {Users, Posts, Comments, Tags, Post_Tags} = require('../models');

// Get all posts for a user with its 
router.get('/test', isUserAuthenticated, async (req, res) => {
    const existingTags = await Tags.findAll();
    const newArray = [];
    for (const tag of existingTags) {
        newArray.push(existingTags[tag]);
    }
    console.log(newArray);
    res.json(newArray);
})

// Create a post
router.post('/', isUserAuthenticated, async (req, res) => {
    try {
        const { title, content, tags } = req.body;
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

module.exports = router;