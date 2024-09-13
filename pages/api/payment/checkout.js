import dbConnect from "@/middleware/mongo";
import Room from "@/models/Room";
import Availability from "@/models/Availability";
import Booking from "@/models/Booking";
import { getDatesInRange } from "@/helpers/dateOps";
import sha256 from "sha256";
import dateFormat from "dateformat";
import { calculateTotalAmount } from "@/helpers/calculateAmount";
import { Coupon } from "@/models/Coupon";
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

const handler = async (req, res) => {
  if (req.method == "POST") {
    const {
      roomId,
      checkIn,
      checkOut,
      reqRooms,
      fname,
      lname,
      email,
      phone,
      specialRequest,
      address = "",
      city = "",
      state = "",
      country = "",
      adults,
      child,
      childTen,
      dates,
      coupon,
    } = req.body;

    console.log(req.body);

    try {
      await dbConnect();

      // const dates = getDatesInRange(checkIn, checkOut);
      dates.pop();

      const roomAvailability = await Availability.find({
        room: roomId,
        date: { $in: dates },
      });

      // check if on every date remaining capacity is greaterthan equal to requiredRooms
      for (let i = 0; i < roomAvailability.length; i++) {
        const room = roomAvailability[i];
        if (room.remainingCapacity < reqRooms) {
          return res.status(404).json({ message: "You Just Missed It" });
        }
      }

      const room = await Room.findById(roomId);

      if (reqRooms > room.currCapacity) {
        return res.status(404).json({ message: "You Just Missed It" });
      }

      // const amount = room.price * dates.length * reqRooms;

      const couponObj = await Coupon.findOne({
        code: coupon,
      });

      // Calculate Amount

      let amount = calculateTotalAmount(
        checkIn,
        checkOut,
        room,
        adults,
        child,
        childTen,
        roomAvailability,
        reqRooms,
        couponObj,
        dates
      );

      if (amount > 7500) {
        amount = amount + amount * 0.18;
      } else {
        amount = amount + amount * 0.12;
      }

      const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
      let orderid = "";
      for (var i = 0; i <= 24; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        orderid += chars.substring(randomNumber, randomNumber + 1);
      }

      const alldata =
        email +
        fname +
        lname +
        address +
        city +
        state +
        country +
        amount.toFixed(2) +
        orderid;

      const udata = username + ":|:" + password;

      const privatekey = sha256(secret + "@" + udata);

      const keySha256 = sha256(username + "~:~" + password);

      const now = new Date();

      const aldata = alldata + dateFormat(now, "yyyy-mm-dd");

      const checksum = sha256(keySha256 + "@" + aldata);

      const fdata = alldata;

      const booking = await Booking.create({
        fname: fname,
        lname: lname,
        email: email,
        phone: phone,
        specialRequest: specialRequest,
        reqRooms: reqRooms,
        orderId: orderid,
        amount: amount,
        room: roomId,
        checkIn: checkIn,
        checkOut: checkOut,
        receipt: orderid,
        adults: adults,
        childs: child,
        childTen: childTen,
        dates: dates,
        coupon: couponObj?.code ?? "",
      });
      console.log("FROM-CHECKOUT", booking);
      return res.status(200).json({
        mid: mid,
        data: fdata,
        privatekey: privatekey,
        checksum: checksum,
        booking: booking,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Some Unknown Error occured" });
    }
  } else {
    return res.status(405).json({ message: "This method is not allowed" });
  }
};

export default handler;
