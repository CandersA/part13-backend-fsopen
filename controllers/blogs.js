const router = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {
    const blogPosts = await Blog.findAll()
    res.json(blogPosts)
})

router.post('/', async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        res.json(blog)
    } catch (err) {
        return res.status(400).send({ err })
    }
})

router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        res.json(req.blog)
    } else {
        res.sendStatus(404).end()
    }
})

router.delete('/:id', async (req, res) => {
    const deletedBlog = await Blog.destroy({
        where: {
            id: req.params.id
        }
    })

    res.json({
        blogsDeleted: deletedBlog
    }).end()
})

router.put('/:id', blogFinder, async(req, res) => {
    try {
        if (!req.blog) {
            res.sendStatus(404).end()
            return
        }

        if (!req.body.likes) {
            throw new Error('Only like modification is allowed!')
        }
        // Modify blog likes from body likes and save to db
        req.blog.likes = req.body.likes
        await req.blog.save()

        res.json({
            likes: req.body.likes
        })
    } catch (err) {
        res.status(400).send({ 
            error: err.message
        }).end()
    }
})

module.exports = router