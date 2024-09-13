import { getDatesInRange } from "./dateOps";

export const calculateTotalAmount = (
  startDate,
  endDate,
  room,
  adults,
  child,
  childTen,
  roomAvailability,
  reqRooms,
  coupon,
  dates
) => {
  let amount = 0;

  // const dates = getDatesInRange(startDate, endDate);
  // dates.pop();
  const weekDayExtraCost =
    room.adultWeekdays * (adults - 2) +
    room.child7Weekdays * child +
    room.child10Weekdays * childTen;

  const weekEndExtraCost =
    room.adultWeekend * (adults - 2) +
    room.child7Weekend * child +
    room.child10Weekend * childTen;

  dates.forEach((date) => {
    let weekend = false;
    const day = new Date(date).getDay();
    if (day === 5 || day === 6 || day === 0) {
      weekend = true;
    }
    const aval = roomAvailability.find((val) => {
      return val.date == date.toString();
    });

    if (aval && aval.price) {
      if (weekend) {
        amount = amount + aval.price + weekEndExtraCost;
      } else {
        // weekday
        amount = amount + aval.price + weekDayExtraCost;
      }
    } else {
      // not available base pricing of weekend
      if (weekend) {
        amount = amount + room.weekendRates + weekEndExtraCost;
      } else {
        // weekday
        amount = amount + room.price + weekDayExtraCost;
      }
    }
  });
  console.log(coupon);
  if (coupon == undefined || coupon == null) {
    return amount * reqRooms;
  }
  return (amount * reqRooms * (100 - coupon.discount)) / 100;
};








