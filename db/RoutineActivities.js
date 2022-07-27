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

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const {
      rows
    } = await client.query(`
    SELECT *    
    FROM RoutineActivities
    WHERE "routineId"=$1;
    `, [id]);
    return rows
  } catch (error) {
    console.error(error)
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        UPDATE RoutineActivities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    return routine;
  } catch (error) {
    console.error(error);
  }
}

async function destroyRoutineActivity(id) {
  const {rows: [routine]} = await client.query(
    `
    DELETE FROM RoutineActivities
    WHERE id=$1
    RETURNING id;
  `,
    [id]
  );
  return routine
}

async function canEditRoutineActivity(routineActivityId, userId) {
try {
  const {
    rows
  } = await client.query(`
  SELECT RoutineActivities.*   
  FROM RoutineActivities
  JOIN routines ON routines.id=RoutineActivities."routineId"
  WHERE "creatorId"=$1;
  `, [userId]);
  if (rows.length === 0) {
    return false 
  }
  return true
} catch (error) {
  console.error(error)
}
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
