const router = require('express').Router()
const { sequelize } = require('../util/db')

const { User } = require('../models')
const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const users = await Blog.findAll({
        attributes: [
            [sequelize.col('user.name'), 'author'],
            [sequelize.fn('COUNT', sequelize.col('*')), 'articles'], // Using Sequelize's COUNT to get the number of blog posts for each user
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes'] // Using Sequelize's SUM to get the total likes
        ],
        include: [
            {
              model: User,
              attributes: [] // Set the attributes to empty array to not include the user object. (we replace this with just the user.name above)
            }
        ],
        group: ['user.id'], // Group the results by user.id
        order: [
            ['likes', 'DESC'],
        ]
    })
    res.json(users)
})

module.exports = router