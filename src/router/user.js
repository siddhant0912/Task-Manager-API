const express = require('express')
const User = require('../models/user')
const Auth = require('../middleware/Auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')

const router = new express.Router()


router.get('', (req, res) => {
    res.render('index', {
        title: 'sign up',
        Author: 'ME'
    })
})


router.post('/users', async(req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
});
router.post('/users/login', async(req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})


router.post('/users/logout', Auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }

})

router.post('/users/logoutAll', Auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', Auth, async(req, res) => {
    res.send(req.user)


});

router.get('/users/:id', async(req, res) => {

    const _id = req.params.id
    try {
        const users = await User.findById(_id)
        if (!users) {
            return res.status(404).send()
        }
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/users/me', Auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send('Invalid Update')
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)

        //const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', Auth, async(req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
        sendCancelEmail(req.user.email, req.user.name)
    } catch (e) {
        res.status(500).send(e)
    }
})
const uploads = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Wrong File Format Entered'))

        }
        cb(undefined, true)

    }
})

router.post('/users/me/avatar', Auth, uploads.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 300 }).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()

}, (err, req, res, next) => {
    res.status(400).send({ error: err.message })
})

router.delete('/users/me/avatar', Auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
})

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        console.log(e)
        res.status(404).send()
    }
})
module.exports = router