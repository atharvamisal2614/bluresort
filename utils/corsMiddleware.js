import { BASE_URL } from "@/utils/config";

export const corsMiddleware = (handler) => async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', BASE_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    // // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    // Call the actual handler
    return handler(req, res);
  };
  