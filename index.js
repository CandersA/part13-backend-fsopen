require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()
app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model {}
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        default: 0
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})

Blog.sync()

app.get('/api/blogs', async (req, res) => {
    const blogPosts = await Blog.findAll()
    res.json(blogPosts)
})

app.post('/api/blogs', async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        res.json(blog)
    } catch (err) {
        return res.status(400).json({ err })
    }
})

app.get('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        console.log(blog.toJSON())
        res.json(blog)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/blogs/:id', async (req, res) => {
    const deletedBlog = await Blog.destroy({
        where: {
            id: req.params.id
        }
    })
    
    res.json({
        blogsDeleted: deletedBlog
    })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})