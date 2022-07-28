const express = require('express');
const router = express.Router();
const {getAllActivities} = require('../db')
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

// PATCH /api/activities/:activityId

module.exports = router;
