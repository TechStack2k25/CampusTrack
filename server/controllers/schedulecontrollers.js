import Task from '../models/taskmodel.js';
import asynchandler from '../utils/asynchandler.js';

const getTasksByFilter = (filterType, date) => {
  let start, end;
  const givenDate = new Date(date);

  switch (filterType) {
    case 'year':
      start = new Date(givenDate.getFullYear(), 0, 1);
      end = new Date(givenDate.getFullYear() + 1, 0, 1);
      return { start, end };
    case 'month':
      start = new Date(givenDate.getFullYear(), givenDate.getMonth(), 1);
      end = new Date(givenDate.getFullYear(), givenDate.getMonth() + 1, 1);
      return { start, end };
    case 'week': {
      // Assuming week starts on Monday.
      const dayOfWeek = givenDate.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      start = new Date(givenDate);
      start.setDate(givenDate.getDate() + diffToMonday);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 7);
      return { start, end };
    }
    case 'day':
      start = new Date(givenDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(givenDate);
      end.setHours(23, 59, 59, 999);
      return { start, end };
  }
};

export const get_schedule = asynchandler(async (req, res, next) => {
  const { year, month, day } = req.body;
  let providedDate;

  // Build the providedDate based on the request body.
  // If day is provided, assume month and year are provided.
  // If only month is provided, assume year is provided.
  if (year && month && day) {
    providedDate = new Date(year, month - 1, day);
  } else if (year && month) {
    providedDate = new Date(year, month - 1, 1);
  } else if (year) {
    providedDate = new Date(year, 0, 1);
  } else {
    // No date information provided; use the current date.
    providedDate = new Date();
  }

  let start, end;
  // Determine the filter type based on which field is provided.
  if (day) {
    ({ start, end } = getTasksByFilter('day', providedDate));
  } else if (month) {
    ({ start, end } = getTasksByFilter('month', providedDate));
  } else if (year) {
    ({ start, end } = getTasksByFilter('year', providedDate));
  } else {
    // Default to month if nothing is provided.
    ({ start, end } = getTasksByFilter('month', providedDate));
  }

  // Query the tasks with deadlines between start and end.
  const courseTasks = await Task.find({
    deadline: { $gte: start, $lt: end },
    course: { $in: req.user.course },
  });

  const eventTasks = await Task.find({
    deadline: { $gte: start, $lt: end },
    _id: { $in: req.user.events },
  });

  // Combine both task arrays.
  const alltasks = [...courseTasks, ...eventTasks];

  res.status(200).json({
    message: 'Schedule fetched successfully',
    data: { tasks: alltasks },
  });
});
