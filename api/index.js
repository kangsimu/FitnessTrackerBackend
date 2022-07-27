const express = require('express');
const router = express.Router();

// GET /api/health  
router.get('/health', async (req, res, next) => {
    res.send("All is well, server is running")
});

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/RoutineActivities
const RoutineActivitiesRouter = require('./routineActivities');
router.use('/routineActivities', RoutineActivitiesRouter);

module.exports = router;
