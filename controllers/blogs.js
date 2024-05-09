const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Blog } = require('../models')
const { User } = require('../models')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

const tokenExtractor = (req, res, next) => {
    // Middleware to find authorization bearer token and decode it
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch {
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

router.get('/', async (req, res) => {
    const blogPosts = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        }
    })
    res.json(blogPosts)
})

router.post('/', tokenExtractor, async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() })
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