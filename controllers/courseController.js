import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Course } from "../models/Course.js";
import { Stats } from "../models/Stats.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";

export const getAllCourses = catchAsyncErrors(async (req, res, next) => {
  const courses = await Course.find().select("-lectures");
  res.status(200).json({
    success: true,
    courses,
  });
});
export const createCourse = catchAsyncErrors(async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new ErrorHandler("Please add all fields", 400));
  }

  const file = req.file;
  // console.log(file);
  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

  await Course.create({
    title,
    description,
    category,
    createdBy,
    poster: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully. You can add lectures now.",
  });
});

export const getCourseLectures = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new ErrorHandler("Course Not Found", 404));

  course.views += 1;
  await course.save();

  res.status(200).json({
    success: true,
    lectures: course.lectures,
  });
});

// Max Video Size 100 mb
export const addLectures = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  // const file=req.file;
  const course = await Course.findById(req.params.id);
  if (!course) return next(new ErrorHandler("Course Not Found", 404));

  // Upload file here
  const file = req.file;
  // console.log(file);
  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    resource_type: "video",
  });

  course.lectures.push({
    title,
    description,
    video: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  course.numOfVideos = course.lectures.length;
  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture added in course",
    lectures: course.lectures,
  });
});

export const deleteCourse = catchAsyncErrors(async (req, res, next) => {
  const {id}=req.params;

  const course=await Course.findById(id);
  if(!course) return next(new ErrorHandler("Course not found",404));

  await cloudinary.v2.uploader.destroy(course.poster.public_id);

  for(let i=0;i<course.lectures.length;i++){
    const singleElement=course.lectures[i].video.public_id;
    await cloudinary.v2.uploader.destroy(singleElement),{
      resource_type:"video",
    };
  }

  await course.remove();



  res.status(200).json({
    success:true,
    message:"Course deleted successfully",
  })

});


export const deleteLecture=catchAsyncErrors(async (req,res,next)=>{
  const {courseId,lectureId}=req.query;

  const course = await Course.findById(courseId);

  if(!course) return next(new ErrorHandler("Course not found",404));

  const lecture=course.lectures.find(item=>{
    if(item._id.toString()===lectureId.toString()) return item;
  })

  await cloudinary.v2.uploader.destroy(lecture.video.public_id,{
    resource_type:"video",
  });

  course.lectures=course.lectures.filter(item=>{
    if(item._id.toString()!==lectureId.toString()) return item;
  })

  course.numOfVideos=course.lectures.length;

  await course.save();

  res.status(200).json({
    success:true,
    message:"Lecture deleted successfully",

  })

})

Course.watch().on("change",async ()=>{
  const stats=await Stats.find({}).sort({createdAt:"desc"}).limit(1);
  const courses=await Course.find({});

  let totalViews=0;

  for (let i = 0; i < courses.length; i++) {
    totalViews += courses[i].views;
    
  }
  stats[0].views=totalViews;
  stats[0].createdAt=new Date(Date.now());
  await stats[0].save();



})


