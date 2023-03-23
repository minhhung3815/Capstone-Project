const Payment = require("../model/paymentModel");
const Appointment = require("../model/appointmentModel");
const paypal = require("../utils/paypalConfig");



exports.CreatePayment = async (req, res, next) => {
  try {
    // console.log(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
    const userId = req.user.id;
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
                price: "20.00",
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
        return_url: "http://localhost:8098/paypal/execute-payment",
        cancel_url: "http://localhost:8098/paypal/cancel-payment",
      },
    };

    paypal.payment.create(paymentReq, async (err, payment) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        const paymentData = new Payment({
          paymentId: payment.id,
          appointment_id: appointmentId,
          user_id: userId,
          amount: amount,
        });
        await paymentData.save();

        const approvalUrl = payment.links.find(
          link => link.rel === "approval_url",
        ).href;
        return res.json({ success: true, data: approvalUrl });
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
    const payment = await Payment.findOne({ paymentId: paymentId });

    // Execute payment
    const executeReq = { payer_id: PayerID };
    paypal.payment.execute(paymentId, executeReq, async (err, payment) => {
      if (err) {
        res.status(500).send(err);
      } else {
        // Update appointment status in database
        // const appointment = await Appointment.findById(payment.appointmentId);
        // // appointment.status = "confirmed";
        // await appointment.save();

        // Render success page
        return res
          .status(200)
          .json({ success: true, data: "Successfully make appointment" });
      }
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.PaymentCancel = async (req, res, next) => {
  return res.status(200).json({ success: true, data: "Payment is cancelled" });
};

exports.GetPaymentDetail = async (req, res, next) => {
  const payment_id = req.params.id;
  const payment = await Payment.find().populate(["appointment_id", "user_id"]);
  return res.status(200).send({ success: true, data: payment });
};
