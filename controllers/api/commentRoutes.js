const router = require('express').Router();
const { Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            where: {
                user_id: req.session.user_id,
            },
            attributes: ['id', 'text'],
            include: {
                model: User,
                attributes: ['name']
            }
        });
        const comments = commentData.map((comment) => comment.get({ plain: true }));
        res.render('allComments', {
            layout: 'main.handlebars',
            comments,
            logged_in: req.session.logged_in,
        })
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/:id', withAuth, async (req, res) => {
    try {
        console.log(req.body);
        const commentData = await Comment.findByPk(req.params.id, {
            where: {
                id: req.params.id
            },
            attributes: ['id', 'text', 'user_id', 'post_id'],
            include: [{
                model: User,
                attributes: ['id', 'name'],
            }]
        });
        const comment = commentData.get({ plain: true });
        res.render('editComment', {
            layout: 'main.handlebars',
            comment,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.create({
            text: req.body.text,
            user_id: req.session.user_id,
            post_id: req.body.post_id,
        });
        res.render('singlePost');
        // res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }

});

router.put('/:id', withAuth, async (req, res) => {
    try {
        console.log(req.body.text);
        const comment = await Comment.findOne({
            where: { id: req.params.id, user_id: req.session.user_id },
            attributes: ['id', 'text', 'user_id', 'post_id']
        });
        await comment.update({
            text: req.body.text,
        });

        res.json(comment);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const deleteComment = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });
        if (!deleteComment) {
            res.status(400).json({ message: 'Comment not found' });
            return;
        }
        // res.render('/');
        res.json({ message: "deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;