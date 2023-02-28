const Payment = require('../model/paymentModel');
const Appointment = require('../model/appointmentModel');

exports.CreatPayment = async (req, res, next) => {
  const payment = new Payment({
    user_id: '63e39ecaa1cba93416ea7a51',
    appointment_id: '63fd6a30f4b156a7f739b28c',
    amount: 2000000,
    paymentId: 'jfhsajkfashfsajklfasfas',
  });
  await payment.save();
  return res.status(200).json({
    success: true,
    data: 'Create new payment information successfully',
  });
};

exports.GetPaymentDetail = async (req, res, next) => {
  const payment = Payment.find()
    .populate('appointment_id')
    .exec((err, data) => {
      console.log(data);
    });
  return res.status(200).send({ success: true, data: payment });
};
