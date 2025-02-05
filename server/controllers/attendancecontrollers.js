import Course from '../models/coursemodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';

export const mark_attendace = asynchandler(async (req, res, next) => {
  const { courseId, presentStudentIds } = req.body;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ApiError('Error in finding the course to attendance', 422));
  }

  // Increment the total number of classes held in the course
  course.total_classes += 1;

  // Update attendance for each student who is present
  presentStudentIds.forEach((studentId) => {
    // If the student is present, increment their attendance count
    const currentAttendance = course.student_attendance.get(studentId) || 0;
    course.student_attendance.set(studentId, currentAttendance + 1);
  });

  // Save the updated course document
  await course.save();

  res.status(201).json({
    message: 'Attendance Updated Sucessfully',
  });
});
