const express = require('express');
const router = express.Router();
const {getAllActivities, createActivity, getActivityByName} = require('../db')
const {requireUser} = require('./utils')
// GET /api/activities/:activityId/routines

// GET /api/activities
router.get("/", async (req,res,next) => {
    try {
        const activities = await getAllActivities()
      res.send(activities)  
    } catch ({ name, message }) {
        next({ name, message, status: 401 });
    }
})
// POST /api/activities
router.post("/", requireUser, async (req,res,next) => {
    try {
        const { name, description } = req.body;
        const _activity = await getActivityByName(name)
        if (_activity) {
            next({
                name: 'ActivityExistsError',
                message: `An activity with name ${_activity.name} already exists`,
                error: 'There was an error'
            })   
        } 
        const activityObj = {name:name, description:description} 
        const activity = await createActivity(activityObj)
        res.send(activity)
    } catch ({ name, message }) {
        next({ name, message, status: 401 });
    }
}) 

// PATCH /api/activities/:activityId

module.exports = router;
