import dbConnect from "@/middleware/mongo";
import { verifyAdmin } from "@/middleware/verifyToken";
import { Coupon } from "@/models/Coupon";

const handler = async (req, res) => {
  const code = req.query.code;

  if (req.method === "GET") {
    try {
      await dbConnect();

      const coupon = await Coupon.findOne({ code });

      res.status(200).json({ message: "Coupon Found", coupon });
      console.log("Coupen is here",coupon)
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Unkown Error Occured" });
    }
  } else if (req.method === "DELETE") {
    try {
      await dbConnect();
      const admin = verifyAdmin(req);

      if (admin === null) {
        res.status(401).json({ message: "You are not an admin" });
        return;
      }

      await Coupon.deleteOne({ code });
      res.status(201).json({ message: "Coupon Deleated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Unkown Error Occured" });
    }
  } else {
    res.status(405).json({ message: "This method is not allowed" });
  }
};

export default handler;
