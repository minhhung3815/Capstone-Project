const Payment = require("../model/paymentModel");
const Appointment = require("../model/appointmentModel");
const paypal = require("paypal-rest-sdk");
const { findById, findByIdAndDelete } = require("../model/medicineModel");

exports.CreatePayment = async (req, res, next) => {
  try {
    const { appointmentId, amount } = req.body;
    if (!appointmentId || !amount) {
      return res
        .status(400)
        .json({ success: false, data: "Fail to create payment" });
    }
    const paymentReq = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Appointment Payment",
                price: amount,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: amount,
          },
          description: "Payment for appointment ID ",
        },
      ],
      redirect_urls: {
        return_url: `http://localhost:3000/payment/execute-payment`,
        cancel_url: `http://localhost:3000/payment/cancel-payment`,
      },
    };

    paypal.payment.create(paymentReq, async (err, payment) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        const tokenUrl = payment.links.find(
          link => link.rel === "approval_url",
        ).href;

        const token = tokenUrl.substring(tokenUrl.indexOf("token=") + 6);

        const paymentData = new Payment({
          user_id: req.user?.id,
          paymentId: payment.id,
          paymentToken: token,
          appointment_id: appointmentId,
          amount: amount,
        });
        await paymentData.save();
        const approvalUrl = payment.links.find(
          link => link.rel === "approval_url",
        ).href;
        // res.redirect(approvalUrl);
        return res.status(200).json({ success: true, data: approvalUrl });
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

exports.PaymentExecute = async (req, res, next) => {
  try {
    const { paymentId, PayerID } = req.query;

    // Retrieve payment from database
    const executed_payment = await Payment.findOneAndUpdate(
      { paymentId: paymentId },
      { $set: { status: "completed" } },
    );
    if (!executed_payment) {
      return res.status(400).json({ success: false, data: "Invalid payment" });
    }
    // Execute payment
    const executeReq = { payer_id: PayerID };
    paypal.payment.execute(paymentId, executeReq, async (error, payment) => {
      if (error) {
        return res.status(500).json({ success: false, data: error });
      } else {
        const appointment = await Appointment.findByIdAndUpdate(
          executed_payment.appointment_id,
          {
            status: "finished",
            payment_id: executed_payment._id,
          },
          { new: true },
        );
        if (!appointment) {
          return res
            .status(400)
            .json({ success: false, data: "Invalid appointment" });
        }
        await appointment.save();

        return res
          .status(200)
          .json({ success: true, data: "Successfully make appointment" });
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

exports.PaymentCancel = async (req, res, next) => {
  try {
    const { token } = req.query;
    const updateStatus = await Payment.findOneAndRemove({
      paymentToken: token,
    });
    if (!updateStatus) {
      return res
        .status(400)
        .json({ success: false, data: "Transaction not found" });
    }
    return res
      .status(200)
      .json({ success: true, data: "Payment is cancelled" });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

exports.GetPaymentDetail = async (req, res, next) => {
  try {
    const { payment_id } = req.params;
    const payment = await Payment.findOne(payment_id).populate([
      "appointment_id",
    ]);
    return res.status(200).send({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

exports.DeletePayment = async (req, res, next) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return res
        .status(400)
        .json({ success: false, data: "Payment not found" });
    }
    return res
      .status(200)
      .json({ success: true, data: "Delete transaction successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

exports.GetAllPayment = async (req, res, next) => {
  try {
    const allPayment = await Payment.find()
      .populate({
        path: "user_id",
        select: "email",
      })
      .populate({
        path: "appointment_id",
        select: "appointmentId patient_name",
      })
      .exec();
    return res.status(200).json({ success: true, data: allPayment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

exports.GetUserPayment = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const allPayment = await Payment.find({ user_id: userId });
    return res.status(200).json({ success: true, data: allPayment });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};
