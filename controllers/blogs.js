const router = require('express').Router()
const { Op } = require("sequelize")
const sequelize = require('../util/db')

const { Blog } = require('../models')
const { User } = require('../models')

const tokenExtractor = require('./helpers')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {
    let where = {}

    if (req.query.search) {
        const searchQueryCaseInsens = req.query.search.toLowerCase()

        // iLike operator is case insensitive
        // All operators listed here: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
        // Title or author should contain search query
        where = {
            [Op.or]: [
                { title: { 
                    [Op.iLike]: `%${searchQueryCaseInsens}%` } 
                }, 
                { author: { 
                    [Op.iLike]: `%${searchQueryCaseInsens}%` } 
                }
            ]
        }
    }

    const blogPosts = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        },
        where,
        order: [
            ['likes', 'DESC'],
        ]
    })
    res.json(blogPosts)
})

router.post('/', tokenExtractor, async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)

        if (!user) {
            return response.status(401).json({
                error: 'invalid user'
            })
        }

        if (req.body.year) {
            const yearToNumber = Number(req.body.year)
            const currentYear = new Date().getFullYear()
            if (
                yearToNumber > currentYear ||
                yearToNumber < 1991
            ) {
                return res.status(400).json({
                    error: 'year must be between 1991 and current year'
                })
            }
        }

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

router.delete('/:id', tokenExtractor, async (req, res) => {
    const deletedBlog = await Blog.destroy({
        where: {
            id: req.params.id,
            userId: req.decodedToken.id
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