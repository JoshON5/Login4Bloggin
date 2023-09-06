const router = require('express').Router();
const withAuth = require('../utils/auth');
const { BlogPost, User, Comment } = require('../models');

router.get('/', withAuth, async (req, res) => {
    try {
		const blogpostData = await BlogPost.findAll({
			order: [['date_created', 'DESC']],
			include: [
				{
					model: User,
					attributes: ['name'],
				},
				{
					model: Comment,
					include: {
						model: User,
						attributes: ['name'],
					},
				},
			],
		});
		const blogposts = blogpostData.map((post) => post.get({ plain: true }));

		res.render('homepage', {
			blogposts,
			logged_in: req.session.logged_in,
		});
	} catch (err) {
        console.log(err);
		res.status(500).json(err);
	}
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/')
        return;
    }
    res.render('login')
})

router.get('/blogpost/:id', withAuth, async (req, res) => {
    try {
        const blogpostData = await BlogPost.findByPk({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Comment,
                },
                {
                    model: User,
                    attributes: ['name']
                }
            ]
        })
        if (!blogpostData) {
            res.status(404).json({ message: 'No blogpost found with this id :(.' });
            return;
        }
        const blogpost = blogpostData.get({ plain: true });

        res.render('blogpost', {
            blogpost,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;