const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');



router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password'] },
        });

        const users = userData.map((user) => user.get({ plain: true }));

        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name'],
                },
                {
                    model: Comment,
                    attributes: ['id', 'text', 'user_id', 'post_id', 'created_at'],
                    include: [
                        {
                            model: User,
                            attributes: ['name']
                        }]

                }

            ],
        });
        const post = postData.map((post) => post.get({ plain: true }));
        res.render('homepage', {
            post,
            users,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
}
);

router.get('/comment/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            },
            attributes: ['id', 'text', 'user_id', 'post_id'],
            include: [
                {
                    model: User,
                    attributes: ['name', 'id']
                }
            ]
        });

        if (!commentData) {
            res.status(404).json({ message: 'not found' });
            return;
        } const comment = commentData.get({ plain: true });
        res.render('editComment', {
            layout: 'main.handlebars',
            comment,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/post/:id', async (req, res) => {
    try {

        const postData = await Posts.findByPk(req.params.id, {
            attributes: ['id', 'title', 'text', 'created_at'],
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Comment,
                    attributes: ['id', 'text', 'user_id', 'post_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['name', 'id']
                    },
                },
            ],
        })
        if (!postData) {
            res.status(404).json({ message: 'not found' });
            return;
        } const post = postData.get({ plain: true });
        res.render('singlePost', { post, logged_in: req.session.logged_in })
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

module.exports = router;