const User = require("../model/userModel");
const Doctor = require("../model/doctorModel");
const Payment = require("../model/paymentModel");
const Appointment = require("../model/appointmentModel");

exports.GetTotalUserAndApt = async (req, res, next) => {
  try {
    const totalUser = Promise.resolve(User.countDocuments({ role: "user" }));
    const totalDoctor = Promise.resolve(Doctor.countDocuments());
    const totalManager = Promise.resolve(
      User.countDocuments({ role: "manager" }),
    );
    const statistics = await Promise.all([
      totalUser,
      totalDoctor,
      totalManager,
    ]);
    return res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: "Error occurred",
    });
  }
};

exports.GetAppointmentByMonths = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const result = await Appointment.aggregate([
      {
        $match: {
          appointment_date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$appointment_date" } },
          total: { $sum: 1 },
        },
      },
      {
        $addFields: {
          monthNumber: "$_id.month",
        },
      },
      {
        $sort: {
          monthNumber: 1,
        },
      },
      {
        $group: {
          _id: null,
          data: {
            $push: {
              monthNumber: "$monthNumber",
              total: "$total",
            },
          },
        },
      },
      {
        $addFields: {
          monthsInYear: {
            $map: {
              input: { $range: [1, 13] },
              as: "month",
              in: {
                monthNumber: "$$month",
                name: {
                  $let: {
                    vars: {
                      monthsInYear: [
                        null,
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                    },
                    in: {
                      $arrayElemAt: ["$$monthsInYear", "$$month"],
                    },
                  },
                },
                total: {
                  $reduce: {
                    input: "$data",
                    initialValue: 0,
                    in: {
                      $cond: [
                        { $eq: ["$$this.monthNumber", "$$month"] },
                        "$$this.total",
                        "$$value",
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          monthsInYear: 1,
        },
      },
    ]);
    return res
      .status(200)
      .json({ success: true, data: result[0].monthsInYear });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      data: "Error occurred",
    });
  }
};

exports.GetDetailAppointments = async (req, res, next) => {
  
}
