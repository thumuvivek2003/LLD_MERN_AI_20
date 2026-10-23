import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: false,
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required'],
      min: [0, 'Marks cannot be negative'],
    },
    maxMarks: {
      type: Number,
      required: [true, 'Maximum marks are required'],
      min: [1, 'Maximum marks must be at least 1'],
    },
    grade: {
      type: String,
      required: [true, 'Grade is required'],
      trim: true,
    },
    semester: {
      type: String,
      trim: true,
    },
    academicYear: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate percentage
marksSchema.virtual('percentage').get(function () {
  return ((this.marks / this.maxMarks) * 100).toFixed(2);
});

// Enable virtuals in JSON
marksSchema.set('toJSON', { virtuals: true });
marksSchema.set('toObject', { virtuals: true });

const Marks = mongoose.model('Marks', marksSchema);

export default Marks;