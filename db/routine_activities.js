const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        INSERT INTO RoutineActivities("routineId", "activityId", count, duration) 
        VALUES($1, $2, $3, $4) 
        RETURNING *;
      `,
      [routineId, activityId, count, duration]
    );
    return routine;
  } catch (error) {
    console.error(error)  
  }
}

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(`
    SELECT *    
    FROM RoutineActivities
    WHERE id=${id};
    `);
    return routine
  } catch (error) {
    console.error(error)
  }
}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
