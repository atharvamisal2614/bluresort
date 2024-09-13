// import { calculateTotalAmount } from "@/helpers/calculateAmount";
// import { getDatesInRange, getIndianDate } from "@/helpers/dateOps";
// import { BASE_URL } from "@/utils/config";
// import axios from "axios";
// import React, { useEffect, useRef, useState } from "react";
// import { toast } from "react-toastify";

// const GuestDetails = ({
//   room,
//   state,
//   nights,
//   reqRooms,
//   setPage,
//   setGuest,
//   checkout,
//   roomAvailability,
//   coupon,
//   setCoupon,
// }) => {
//   const fnameRef = useRef();
//   const lnameRef = useRef();
//   const emailRef = useRef();
//   const phoneRef = useRef();
//   const requestRef = useRef();

//   const [adults, setAdults] = useState(2);
//   const [child, setChild] = useState(0);
//   const [childTen, setChildTen] = useState(0);

//   const [amount, setAmount] = useState(90000);

//   const [couponObj, setCouponObj] = useState(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const phoneNo = phoneRef.current.value;
//     if (phoneNo < 1000000000 || phoneNo > 99999999999) {
//       return toast.error("Enter Valid Phone Number");
//     }
//     checkout();
//   };

//   const handleOnChange = () => {
//     const guest = {
//       fname: fnameRef.current.value,
//       lname: lnameRef.current.value,
//       email: emailRef.current.value,
//       phone: phoneRef.current.value,
//       specialRequest: requestRef.current.value,
//       adults: adults,
//       child: child,
//       childTen: childTen,
//     };
//     console.log(guest);
//     setGuest(guest);
//   };

//   const calculateAmount = () => {
//     const dates = getDatesInRange(
//       state[0].startDate.toString(),
//       state[0].endDate.toString()
//     );
//     dates.pop();
//     const finalAmount = calculateTotalAmount(
//       state[0].startDate.toString(),
//       state[0].endDate.toString(),
//       room,
//       adults,
//       child,
//       childTen,
//       roomAvailability,
//       reqRooms,
//       couponObj,
//       dates
//     );
//     setAmount(finalAmount);
//   };

//   const addCoupon = async () => {
//     try {
//       const url = `${BASE_URL}/api/coupon/${coupon}`;
//       const res = await axios.get(url);
//       setCouponObj(res.data.coupon);
//       console.log("Coupen added successfully")
//     } catch (error) {
//       console.log(error);
//       toast.error("Invalid Coupon Code");
//     }
//   };

//   useEffect(() => {
//     calculateAmount();
//   }, [adults, child, childTen, couponObj]);

//   // useEffect(() => {
//   //   calculateAmount();
//   // }, []);

//   return (
//     <>
//       <div className="max-w-6xl  m-auto p-5">
//         <div className="flex md:flex-row flex-col gap-10 my-10 ">
//           <div className="md:w-2/3">
//             <h3 className="py-5">Guest Details</h3>

//             <form id="guest-details" onSubmit={(e) => handleSubmit(e)}>
//               <div className="flex gap-5">
//                 <div className="w-1/2">
//                   <p>First Name</p>
//                   <input
//                     type="text"
//                     ref={fnameRef}
//                     required
//                     onChange={handleOnChange}
//                     className="outline-none w-full border border-primary rounded p-1"
//                   />
//                 </div>
//                 <div className="w-1/2">
//                   <p>Last Name</p>
//                   <input
//                     type="text"
//                     ref={lnameRef}
//                     required
//                     onChange={handleOnChange}
//                     className="outline-none w-full border border-primary rounded p-1"
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-5 my-5">
//                 <div className="w-1/2">
//                   <p>Email Address</p>
//                   <input
//                     type="email"
//                     ref={emailRef}
//                     required
//                     onChange={handleOnChange}
//                     className="outline-none w-full border border-primary rounded p-1"
//                   />
//                 </div>
//                 <div className="w-1/2">
//                   <p>Phone Number</p>
//                   <input
//                     type="number"
//                     ref={phoneRef}
//                     onChange={handleOnChange}
//                     required
//                     className="outline-none w-full border border-primary rounded p-1"
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-5 my-5">
//                 <div className="w-1/3">
//                   <p>Adults</p>
//                   <select
//                     value={adults}
//                     onChange={(e) => setAdults(e.target.value)}
//                     className="outline-none w-full border border-primary rounded p-1"
//                   >
//                     <option value={1}>1</option>
//                     <option value={2}>2</option>
//                     <option value={3}>3</option>
//                   </select>
//                 </div>
//                 <div className="w-1/3">
//                   <p>Child 7+</p>
//                   <select
//                     value={child}
//                     onChange={(e) => setChild(e.target.value)}
//                     className="outline-none w-full border border-primary rounded p-1"
//                   >
//                     <option value={0}>0</option>
//                     <option value={1}>1</option>
//                     <option value={2}>2</option>
//                   </select>
//                 </div>
//                 <div className="w-1/3">
//                   <p>Child 10+</p>
//                   <select
//                     value={childTen}
//                     onChange={(e) => setChildTen(e.target.value)}
//                     className="outline-none w-full border border-primary rounded p-1"
//                   >
//                     <option value={0}>0</option>
//                     <option value={1}>1</option>
//                     <option value={2}>2</option>
//                   </select>
//                 </div>
//               </div>

//               <p>Special Request</p>
//               <textarea
//                 className="w-full border border-primary rounded p-1 outline-none"
//                 ref={requestRef}
//                 cols="10"
//                 rows="3"
//                 onChange={handleOnChange}
//               ></textarea>
//             </form>
//           </div>

//           <div className="md:w-1/3 bg-sky-50 rounded p-5">
//             <h4 className="mb-5">Order Summary</h4>

//             <p>
//               Room Type: <strong>{room.title}</strong>{" "}
//             </p>
//             <p>
//               Check In:{" "}
//               <strong>
//                 {" "}
//                 {state[0].startDate.getDate()}-
//                 {state[0].startDate.getMonth() + 1}-
//                 {state[0].startDate.getFullYear()}
//               </strong>
//             </p>
//             <p>
//               Check Out:{" "}
//               <strong>
//                 {" "}
//                 {state[0].endDate.getDate()}-{state[0].endDate.getMonth() + 1}-
//                 {state[0].endDate.getFullYear()}
//               </strong>
//             </p>
//             <p>
//               No Of Nights: <strong>{nights}</strong>{" "}
//             </p>
//             <p>
//               No Of Rooms: <strong> {reqRooms} </strong>{" "}
//             </p>
//             <br />
//             <div className="flex items-center gap-3">
//               <input
//                 value={coupon}
//                 onChange={(e) => {
//                   setCoupon(e.target.value.toUpperCase());
//                 }}
//                 type="text"
//                 placeholder="Coupon Code"
//                 className="inp"
//               />
//               <p
//                 onClick={() => {
//                   void addCoupon();
//                 }}
//                 className="cursor-pointer text-primary"
//               >
//                 Add
//               </p>
//             </div>
//             <br />
//             <p>
//               Amount: <strong>Rs. {amount} /-</strong>{" "}
//             </p>
//             {amount > 7500 && (
//               <p>
//                 18% GST: <strong>Rs. {0.18 * amount} /-</strong>{" "}
//               </p>
//             )}
//             {amount <= 7500 && (
//               <p>
//                 12% GST: <strong>Rs. {0.12 * amount} /-</strong>{" "}
//               </p>
//             )}
//             {amount > 7500 && (
//               <p className="font-semibold text-lg mt-5">
//                 SubTotal: <strong>Rs. {amount + 0.18 * amount} /-</strong>{" "}
//               </p>
//             )}
//             {amount <= 7500 && (
//               <p className="font-semibold text-lg mt-5">
//                 SubTotal: <strong>Rs. {amount + 0.12 * amount} /-</strong>{" "}
//               </p>
//             )}

//             <button
//               type="submit"
//               form="guest-details"
//               className="my-5 bg-primary w-full"
//             >
//               Proceed to Checkout
//             </button>
//             <button
//               onClick={() => setPage(0)}
//               className="bg-white border border-primary text-primary w-full"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default GuestDetails;








import { calculateTotalAmount } from "@/helpers/calculateAmount";
import { getDatesInRange, getIndianDate } from "@/helpers/dateOps";
import { BASE_URL } from "@/utils/config";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const GuestDetails = ({
  room,
  state,
  nights,
  reqRooms,
  setPage,
  setGuest,
  checkout,
  roomAvailability,
  coupon,
  setCoupon,
}) => {
  const fnameRef = useRef();
  const lnameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const requestRef = useRef();

  const [adults, setAdults] = useState(2);
  const [child, setChild] = useState(0);
  const [childTen, setChildTen] = useState(0);

  const [amount, setAmount] = useState(90000);

  const [couponObj, setCouponObj] = useState(null);
  const [hasWeekend, setHasWeekend] = useState(false); // New state to track weekends
  const [isInputDisabled, setIsInputDisabled] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneNo = phoneRef.current.value;
    if (phoneNo < 1000000000 || phoneNo > 99999999999) {
      return toast.error("Enter Valid Phone Number");
    }
    checkout();
  };

  const handleOnChange = () => {
    const guest = {
      fname: fnameRef.current.value,
      lname: lnameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      specialRequest: requestRef.current.value,
      adults: adults,
      child: child,
      childTen: childTen,
    };
    setGuest(guest);
  };

  const calculateAmount = () => {
    const dates = getDatesInRange(
      state[0].startDate.toString(),
      state[0].endDate.toString()
    );
    const hasWeekendDate = dates.some((date) => {
      const day = new Date(date).getDay();
      return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
    });
    const isTwoDaysWeekdays = dates.length === 3 && !hasWeekendDate;
    
    setIsInputDisabled(!isTwoDaysWeekdays);
    dates.pop();

  


    const finalAmount = calculateTotalAmount(
      state[0].startDate.toString(),
      state[0].endDate.toString(),
      room,
      adults,
      child,
      childTen,
      roomAvailability,
      reqRooms,
      couponObj,
      dates
    );
    setAmount(finalAmount);

    // Check if any date in the range is a weekend
    const hasWeekendDates = dates.some((date) => {
      const day = new Date(date).getDay();
      return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
    });
    setHasWeekend(hasWeekendDates);
  };

  const addCoupon = async () => {
    try {
      const url = `${BASE_URL}/api/coupon/${coupon}`;
      const res = await axios.get(url);
      setCouponObj(res.data.coupon);
    } catch (error) {
      console.log(error);
      toast.error("Invalid Coupon Code");
    }
  };

  useEffect(() => {
    calculateAmount();
  }, [adults, child, childTen, couponObj, state]);

  return (
    <>
      <div className="max-w-6xl  m-auto p-5">
        <div className="flex md:flex-row flex-col gap-10 my-10 ">
          <div className="md:w-2/3">
            <h3 className="py-5">Guest Details</h3>

            <form id="guest-details" onSubmit={(e) => handleSubmit(e)}>
              {/* Form fields... */}

               <div className="flex gap-5">
                 <div className="w-1/2">
                   <p>First Name</p>
                   <input
                    type="text"
                    ref={fnameRef}
                    required
                    onChange={handleOnChange}
                    className="outline-none w-full border border-primary rounded p-1"
                  />
                </div>
                <div className="w-1/2">
                  <p>Last Name</p>
                  <input
                    type="text"
                    ref={lnameRef}
                    required
                    onChange={handleOnChange}
                    className="outline-none w-full border border-primary rounded p-1"
                  />
                </div>
              </div>
              <div className="flex gap-5 my-5">
                <div className="w-1/2">
                  <p>Email Address</p>
                  <input
                    type="email"
                    ref={emailRef}
                    required
                    onChange={handleOnChange}
                    className="outline-none w-full border border-primary rounded p-1"
                  />
                </div>
                <div className="w-1/2">
                  <p>Phone Number</p>
                  <input
                    type="number"
                    ref={phoneRef}
                    onChange={handleOnChange}
                    required
                    className="outline-none w-full border border-primary rounded p-1"
                  />
                </div>
              </div>

              <div className="flex gap-5 my-5">
                <div className="w-1/3">
                  <p>Adults</p>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    className="outline-none w-full border border-primary rounded p-1"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>
                <div className="w-1/3">
                  <p>Child 7+</p>
                  <select
                    value={child}
                    onChange={(e) => setChild(e.target.value)}
                    className="outline-none w-full border border-primary rounded p-1"
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
                <div className="w-1/3">
                  <p>Child 10+</p>
                  <select
                    value={childTen}
                    onChange={(e) => setChildTen(e.target.value)}
                    className="outline-none w-full border border-primary rounded p-1"
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
              </div>

              <p>Special Request</p>
              <textarea
                className="w-full border border-primary rounded p-1 outline-none resize-none"
                ref={requestRef}
                cols="10"
                rows="3"
                onChange={handleOnChange}
              ></textarea>
            
            </form>
          </div>

          <div className="md:w-1/3 bg-sky-50 rounded p-5">
            <h4 className="mb-5">Order Summary</h4>

            

                         <p>
               Room Type: <strong>{room.title}</strong>{" "}
             </p>
             <p>
               Check In:{" "}
               <strong>
                 {" "}
                 {state[0].startDate.getDate()}-
                 {state[0].startDate.getMonth() + 1}-
                 {state[0].startDate.getFullYear()}
               </strong>
             </p>
             <p>
               Check Out:{" "}
               <strong>
                 {" "}
                 {state[0].endDate.getDate()}-{state[0].endDate.getMonth() + 1}-
                 {state[0].endDate.getFullYear()}
               </strong>
             </p>
             <p>
               No Of Nights: <strong>{nights}</strong>{" "}
             </p>
             <p>
               No Of Rooms: <strong> {reqRooms} </strong>{" "}
             </p>
             <br />

            <div className="flex items-center gap-3">
      

              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                type="text"
                placeholder="Coupon Code"
                className="inp"
                disabled={hasWeekend || isInputDisabled} // Disable input if weekend is present
                style={{ cursor:( hasWeekend || isInputDisabled) ? "not-allowed" : "text" }}
                // style={{ cursor: isInputDisabled  ? "not-allowed" : "text" }} // Change cursor
              />
              <p
                onClick={() => {
                  if (!hasWeekend) addCoupon();
                }}
                className={`cursor-pointer text-primary ${
                  hasWeekend ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Add
              </p>
            </div>

            <p>
              Amount: <strong>Rs. {amount} /-</strong>
            </p>
            {amount > 7500 && (
              <p>
                18% GST: <strong>Rs. {0.18 * amount} /-</strong>
              </p>
            )}
            {amount <= 7500 && (
              <p>
                12% GST: <strong>Rs. {0.12 * amount} /-</strong>
              </p>
            )}
            {amount > 7500 && (
              <p className="font-semibold text-lg mt-5">
                SubTotal: <strong>Rs. {amount + 0.18 * amount} /-</strong>
              </p>
            )}
            {amount <= 7500 && (
              <p className="font-semibold text-lg mt-5">
                SubTotal: <strong>Rs. {amount + 0.12 * amount} /-</strong>
              </p>
            )}

            <button
              type="submit"
              form="guest-details"
              className="my-5 bg-primary rounded w-full"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => setPage(0)}
              className="bg-white border border-primary text-green-600 w-full"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestDetails;