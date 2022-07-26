const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
 
      const {rows} = await client.query(
      `
        INSERT INTO activities(name, description) 
        VALUES($1, $2) 
        ON CONFLICT (name) DO NOTHING 
        RETURNING *;
      `,
      [name, description]
    );
    return rows[0];
  } catch (error) {
    console.error(error)  
  }
}

async function getAllActivities() {
  try {
    const {
      rows
    } = await client.query(
      `
      SELECT *
      FROM activities
    `
    );

    return rows ;
  } catch (error) {
    console.error(error)
  }
}

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(`
    SELECT *   
    FROM activities
    WHERE id=${id};
    `);
    return activity
  } catch (error) {
    console.error(error)
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activity]
    } = await client.query(`
    SELECT *   
    FROM activities
    WHERE name=$1;
    `, [name]);
    return activity
  } catch (error) {
    console.error(error)
  }
}

async function attachActivitiesToRoutines(routines) {
  // no side effects
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
  const routineIds = routines.map(routine => routine.id);
  if (!routineIds?.length) return [];
  
  try {
    // get the activities, JOIN with RoutineActivities (so we can get a routineId), and only those that have those routine ids on the RoutineActivities join
    const { rows: activities } = await client.query(`
      SELECT activities.*, RoutineActivities.duration, RoutineActivities.count, RoutineActivities.id AS "routineActivityId", RoutineActivities."routineId"
      FROM activities 
      JOIN RoutineActivities ON RoutineActivities."activityId" = activities.id
      WHERE RoutineActivities."routineId" IN (${ binds });
    `, routineIds);

    // loop over the routines
    for(const routine of routinesToReturn) {
      // filter the activities to only include those that have this routineId
      const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
      // attach the activities to each single routine
      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
  } catch (error) {
    console.error(error);
  }
}

async function updateActivity({ id, ...fields }) {

    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        UPDATE activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    return activity;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
