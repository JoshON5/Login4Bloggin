const router = require('express').Router();
const { BlogPost, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req,res) => {
    try {
        const blogpostData = await BlogPost.findAll({
            order: [['date_created', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
            ]
        })

        res.status(200).json(blogpostData);
    } catch (err){
        res.status(500).json(err);
    }
});

router.get('/:id', withAuth, async (req, res) => {
    try {
        const blogpostData = await BlogPost.findByPk({
            where: {
                id: req.params.id
            },
            inclue: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Comment,
                    include: {
                        model: User,
                        attributes: ['name']
                    }
                }
            ]
        })

        res.status(200).json(blogpostData);
    } catch (err) {
        res.status(500).json(err)
    }
})

router.post('/', withAuth, async (req, res) => {
    try {
        const newBlogpost = await BlogPost.create({
            title: req.body.title,
            blogpost: req.body.blogpost,
            user_id: req.session.user_id,
        });

        res.status(200).json(newBlogpost);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const blogpostData = await BlogPost.update({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            }
        });

        if (!blogpostData) {
            res.status(404).json({ message: 'No blogpost found with this id :(.' });
            return;
        }

        res.status(200).json(blogpostData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const blogpostData = await BlogPost.destroy({
                where: {
                    id: req.params.id,
                    user_id: req.session.user_id,
                },
            });

            if(!blogpostData) {
                res.status(404).json({ message: 'No blogpost found with this id :(.' });
                return;
            }

            res.status(200).json(blogpostData);
        } catch (err) {
            res.status(500).json(err);
        }
});

module.exports = router;