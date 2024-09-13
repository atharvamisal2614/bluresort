export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://bluwaterresort.in"
    : "http://localhost:3000";




// export const BASE_URL =
//   process.env.NODE_ENV === "production"
//     ? `https://${process.env.VERCEL_URL || "https://bluwaterresort.in"}`
//     : "http://localhost:3000";



// export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
