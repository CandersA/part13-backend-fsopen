const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User } = require('../models')
const { Blog } = require('../models')

// Add User.scope('withPassword') to return user with password hash if neccessary

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] }
        }
    })
    res.json(users)
})

router.post('/', async (req, res) => {
    const { username, name, password } = req.body

    // About salt rounds - https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    try {
        const user = await User.create({
            username,
            name,
            passwordHash
        })
        res.json(user)
    } catch(error) {
        return res.status(400).json({ error })
    }
})

router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id)
    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})

module.exports = router