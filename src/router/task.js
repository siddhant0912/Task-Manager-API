const express = require('express')
const Task = require('../models/Task')
const Auth = require('../middleware/Auth')
const router = new express.Router()


router.post('/tasks', Auth, async(req, res) => {
        //const task = new Task(req.body)
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        try {
            await task.save()
            res.status(201).send(task);
        } catch (e) {
            res.status(400).send(e);
        }
    })
    // /tasks/?Status=true or false
    // /tasks/?limit=2&skip=1
    // /tasks/?sortBy=CreatedAt_asc

router.get('/tasks', Auth, async(req, res) => {
    var match = {}
    var sort = {}

    if (req.query.Status) {
        match.Status = req.query.Status === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort(parts[0]) = parts[1] === 'desc' ? -1 : 1
    }
    try {
        /// const tasks = await Task.findById({ owner: req.user._id })
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e)
    }
});

router.get('/tasks/:id', Auth, async(req, res) => {
    const _id = req.params.id
    try {
        const tasks = await Task.findOne({ _id, owner: req.user._id })
        if (!tasks) {
            return res.status(404).send('Error 404:Task NOT FOUND')
        }
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', Auth, async(req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const updatable = ["Description", "Status"]
    const isValidOperation = updates.every(update => updatable.includes(update))

    if (!isValidOperation) {
        return res.status(400).send('You Cannot update this field')
    }
    try {
        //const tasks = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        const tasks = await Task.findOne({ _id, owner: req.user._id })
        if (!tasks) {
            return res.status(404).send()
        }

        updates.forEach(update => tasks[update] = req.body[update])
        await tasks.save()
        res.send(tasks)

    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id', Auth, async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('No Task Found')
        }
        res.send(task);
    } catch (e) {
        return res.status(500).send(e)
    }
})
module.exports = router