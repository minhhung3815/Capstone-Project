const Payment = require("../model/paymentModel");
const Appointment = require("../model/appointmentModel");
const paypal = require("paypal-rest-sdk");

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
        return_url: "http://localhost:8098/payment/paypal/execute-payment",
        cancel_url: "http://localhost:8098/payment/paypal/cancel-payment",
      },
    };

    paypal.payment.create(paymentReq, async (err, payment) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        const paymentData = new Payment({
          paymentId: payment.id,
          appointment_id: appointmentId,
          amount: amount,
        });
        await paymentData.save();
        console.log(payment);
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
    const executed_payment = await Payment.findOne({ paymentId: paymentId });
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
            payment_id: payment._id,
          },
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
    console.log(req.query);
    return res
      .status(200)
      .json({ success: true, data: "Payment is cancelled" });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

exports.GetPaymentDetail = async (req, res, next) => {
  const payment_id = req.params.id;
  const payment = await Payment.find().populate(["appointment_id", "user_id"]);
  return res.status(200).send({ success: true, data: payment });
};
