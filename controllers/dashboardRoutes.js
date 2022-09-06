const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {

    try {
        const postData = await Post.findAll({
            where: {
                user_id: req.session.user_id,
            },
            attributes: [
                'id',
                'title',
                'text',
                'created_at'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'text', 'user_id', 'post_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['name']
                    }
                },
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });
        const post = postData.map((post) => post.get({ plain: true }));
        res.render('allPosts', {
            layout: 'dashboard.handlebars',
            post,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/new', async (req, res) => {
    try {
        const postData = await Post.findAll({
            where: {
                user_id: req.session.user_id,
            },
            attributes: [
                'id',
                'title',
                'text',
                'created_at'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'text', 'user_id', 'post_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['name']
                    }
                },
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });
        const post = postData.map((post) => post.get({ plain: true }));

        const user = await User.findOne({
            where: {
                id: req.session.id,
            }
        })
        res.render('newPost', {
            layout: 'dashboard.handlebars',
            user,
            post,
            logged_in: req.session.logged_in,
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            where: {
                id: req.params.id
            },
            attributes: ['id', 'title', 'text', 'created_at'],
            include: [
                {
                    model: User,
                    attributes: ['id', 'name'],
                },
                {
                    model: Comment,
                    attributes: ['id', 'text', 'user_id', 'post_id', 'created_at',],
                    include: {
                        model: User,
                        attributes: ['name'],
                    },
                }]
        });
        const post = postData.get({ plain: true });
        res.render('editPost', {
            layout: 'dashboard.handlebars',
            post,
            logged_in: req.session.logged_in
        });
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;