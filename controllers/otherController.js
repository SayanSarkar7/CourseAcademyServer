import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Stats } from "../models/Stats.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";

export const contact = catchAsyncErrors(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return next(new ErrorHandler("All Fields are mandetory", 400));

  const to = process.env.MY_MAIL;
  const subject = "Contact Form Course Academy";
  const text = `I am ${name} and my email is ${email}. \n ${message}`;

  await sendEmail(to, subject, text);

  res.status(200).json({
    success: true,
    message: "Your message has been sent",
  });
});
export const courseRequest = catchAsyncErrors(async (req, res, next) => {
  const { name, email, course } = req.body;

  if (!name || !email || !course)
    return next(new ErrorHandler("All Fields are mandetory", 400));

  const to = process.env.MY_MAIL;
  const subject = "Requesting for a course on Course Academy";
  const text = `I am ${name} and my email is ${email}. \n ${course}`;

  await sendEmail(to, subject, text);

  res.status(200).json({
    success: true,
    message: "Your request has been sent",
  });
});


export const getAdminDashboardStats = catchAsyncErrors(
  async (req, res, next) => {
    
    const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(12);
    // console.log(stats);
    
    const statsData = [];

    for (let i = 0; i < stats.length; i++) {
      statsData.unshift(stats[i]);
    }
    const requiredSize = 12 - stats.length;
    for (let i = 0; i < requiredSize; i++) {
      statsData.unshift({
        users: 0,
        subscriptions: 0,
        views: 0,
      });
    }
    // console.log(statsData);
    
    const usersCount = statsData[11].users;
    const subscriptionCount = statsData[11].subscriptions;
    const viewsCount = statsData[11].views;

    let usersPercentage = true,
      subscriptionPercentage = true,
      viewsPercentage = true;
    let usersProfit = true,
      subscriptionProfit = true,
      viewsProfit = true;

    if (statsData[10].users === 0) usersPercentage = usersCount * 100;
    if (statsData[10].subscriptions === 0)
      subscriptionPercentage = subscriptionCount * 100;
    if (statsData[10].views === 0) viewsPercentage = viewsCount * 100;
    else {
      const difference = {
        users: statsData[11].users - statsData[10].users,
        subscriptions:
          statsData[11].subscriptions - statsData[10].subscriptions,
        views: statsData[11].views - statsData[10].views,
      };
      usersPercentage = (difference.users / statsData[10].users) * 100;
      subscriptionPercentage =
        (difference.subscriptions / statsData[10].subscriptions) * 100;
      viewsPercentage = (difference.views / statsData[10].views) * 100;

      if (usersPercentage < 0) usersProfit = false;
      if (subscriptionPercentage < 0) subscriptionProfit = false;
      if (viewsPercentage < 0) viewsProfit = false;
    }

    res.status(200).json({
      success: true,
      stats: statsData,
      usersCount,
      subscriptionCount,
      viewsCount,
      usersPercentage,
      subscriptionPercentage,
      viewsPercentage,
      usersProfit,
      subscriptionProfit,
      viewsProfit,
    });
  }
);

// export const getAdminDashboardStats = catchAsyncErrors(
//   async (req, res, next) => {
//     try {
//       const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(12);

//       const statsData = [];

//       for (let i = 0; i < stats.length; i++) {
//         statsData.unshift(stats[i]);
//       }

//       const requiredSize = 12 - stats.length;
//       for (let i = 0; i < requiredSize; i++) { // Fixed `requiredSize.length` to `requiredSize`
//         statsData.unshift({
//           users: 0,
//           subscriptions: 0,
//           views: 0,
//         });
//       }

//       const usersCount = statsData[11]?.users || 0;
//       const subscriptionCount = statsData[11]?.subscriptions || 0;
//       const viewsCount = statsData[11]?.views || 0;

//       let usersPercentage = true,
//         subscriptionPercentage = true,
//         viewsPercentage = true;
//       let usersProfit = true,
//         subscriptionProfit = true,
//         viewsProfit = true;

//       if (statsData[10]?.users === 0) usersPercentage = usersCount * 100;
//       if (statsData[10]?.subscriptions === 0)
//         subscriptionPercentage = subscriptionCount * 100;
//       if (statsData[10]?.views === 0) viewsPercentage = viewsCount * 100;
//       else {
//         const difference = {
//           users: statsData[11]?.users - statsData[10]?.users,
//           subscriptions:
//             statsData[11]?.subscriptions - statsData[10]?.subscriptions,
//           views: statsData[11]?.views - statsData[10]?.views,
//         };
//         usersPercentage = (difference.users / statsData[10]?.users) * 100 || 0;
//         subscriptionPercentage =
//           (difference.subscriptions / statsData[10]?.subscriptions) * 100 || 0;
//         viewsPercentage = (difference.views / statsData[10]?.views) * 100 || 0;

//         if (usersPercentage < 0) usersProfit = false;
//         if (subscriptionPercentage < 0) subscriptionProfit = false;
//         if (viewsPercentage < 0) viewsProfit = false;
//       }

//       res.status(200).json({
//         success: true,
//         stats: statsData,
//         usersCount,
//         subscriptionCount,
//         viewsCount,
//         usersPercentage,
//         subscriptionPercentage,
//         viewsPercentage,
//         usersProfit,
//         subscriptionProfit,
//         viewsProfit,
//       });
//     } catch (err) {
//       // Add file location and line number to the error
//       const stack = new Error().stack;
//       err.fileLocation = stack.split("\n")[1]?.trim(); // Extract file and line
//       next(err);
//     }
//   }
// );

