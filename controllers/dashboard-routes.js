const router = require('express').Router();
const { User, BlogPost, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/',  withAuth, async (req, res) => {
    try {
        const blogpostData = await BlogPost.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes:['id', 'name', 'blogpost', 'date_created'],
            order: [['date_created', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
            ]
        });

        const blogposts = blogpostData.map(blogpost => blogpost.get({ plain: true }));
        res.render('dashboard', { blogposts, logged_in: true });
    } catch (err){
        res.status(500).json(err)
    }
})

router.get('/addblogpost', withAuth, async (req, res) => {
    try {
        res.render('addBlogpost');
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('update/:id', withAuth, (req, res) => {
    try{
        const blogpostData = BlogPost.findByPk({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: User,
                    attributes: ['name']
                }
            ]
        })
        if (!blogpostData) {
            res.status(404).json({ message: 'No Blogpost found with this id :(.' })
        }
        const blogpost = blogpostData.get({ plain: true });

        res.render('updateBlogpost', {
            blogpost,
            loggedIn: req.session.loggedIn
        });
    } catch (err){
        res.status(500).json(err)
    }
})


module.exports = router;