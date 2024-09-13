import crypto from "crypto";
import dbConnect from "@/middleware/mongo";
import Booking from "@/models/Booking";
import { getDatesInRange } from "@/helpers/dateOps";
import Availability from "@/models/Availability";
import Room from "@/models/Room";

import CRC32 from "crc-32";
import { sendMail } from "@/utils/mail";

// // PROD
// var mid = "283812";
// var username = "4122808";
// var password = "ZP3NYUbj";
// var secret = "W5ZNu44mda6JFBaR";



var mid = process.env.MID
var username = process.env.USERNAME
var password = process.env.PASSWORD
var secret = process.env.SECRET

// TEST
// var mid = "270462";
// var username = "1669076";
// var password = "u9RVqNzn";
// var secret = "jBtjXt2NM7Xur8h6";

// const transporter = nodemailer.createTransport({
//   host: "smtp.zoho.in",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "test.user@pranitpatil.com",
//     pass: "bc5a?aWr",
//   },
// });

const handler = async (req, res) => {
  if (req.method == "POST") {
    try {
      if (req.body.TRANSACTIONPAYMENTSTATUS !== "SUCCESS") {
        return res.status(400).json({ message: "Booking Unsuccessfull" });
      }

      await dbConnect();
      console.log(req.body);

      let txnhash = CRC32.str(
        req.body.TRANSACTIONID +
          ":" +
          req.body.APTRANSACTIONID +
          ":" +
          req.body.AMOUNT +
          ":" +
          req.body.TRANSACTIONSTATUS +
          ":" +
          req.body.MESSAGE +
          ":" +
          mid +
          ":" +
          username
      );

      var chmod = req.body.CHMOD;
      var custmvar = req.body.CUSTOMERVPA;
      if (chmod === "upi") {
        txnhash = CRC32.str(
          req.body.TRANSACTIONID +
            ":" +
            req.body.APTRANSACTIONID +
            ":" +
            req.body.AMOUNT +
            ":" +
            req.body.TRANSACTIONSTATUS +
            ":" +
            req.body.MESSAGE +
            ":" +
            mid +
            ":" +
            username +
            ":" +
            custmvar
        );
      }
      txnhash = txnhash >>> 0;
      let txndata = req.body;
      console.log("txndata.ap_SecureHash", txndata.ap_SecureHash);
      console.log("txnhash", txnhash);

      console.log("txndata.CUSTOMVAR", txndata.CUSTOMVAR);

      let booking = await Booking.findOneAndUpdate(
        { orderId: txndata.CUSTOMVAR },
        { paid: true },
        { new: true }
      );

      if (!booking) {
        return res.status(400).json({ message: "Booking Unsuccessfull" });
      }

      const { room, dates, reqRooms } = booking;

      const roomObj = await Room.findById(room);
      // TODO: room._id change
      dates.forEach(async (date) => {
        const availablilty = await Availability.findOne({
          room: room,
          date: date,
        });

        if (availablilty) {
          await Availability.findByIdAndUpdate(availablilty._id, {
            remainingCapacity: availablilty.remainingCapacity - reqRooms,
          });
        } else {
          await Availability.create({
            room: room,
            date,
            remainingCapacity: roomObj.currCapacity - reqRooms,
          });
        }
      });

      // Send confirmation email
      try {
        await axios.post("/api/send-email", {
          ...booking,
          _id: booking._id,
        });
        console.log("Email sent successfully.");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }

      return res.status(200).json({ message: "Booking Successful", booking });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Unknown error occured" });
    }
  } else {
    return res.status(405).json({ message: "This method is not allowed" });
  }
};

export default handler;
