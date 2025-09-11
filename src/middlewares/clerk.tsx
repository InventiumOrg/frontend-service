import { useAuth } from "@clerk/clerk-react";
import { Request, Response, NextFunction } from "express";

// Type definitions for middleware
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// For React frontend - use Clerk hooks instead of server middleware
export const useAuthGuard = () => {
  const { isSignedIn, userId, getToken } = useAuth();

  const verifyAndGetToken = async (): Promise<string | null> => {
    if (!isSignedIn || !userId) {
      throw new Error("User not authenticated");
    }

    try {
      const token = await getToken();
      return token;
    } catch (error) {
      console.error("Failed to get auth token:", error);
      throw new Error("Failed to get authentication token");
    }
  };

  return {
    isAuthenticated: isSignedIn,
    userId,
    getAuthToken: verifyAndGetToken,
  };
};

// If you need server-side middleware (for API routes), use this instead:
export const verifyAuthToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing or invalid authorization header" });
      return;
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    // For client-side verification, you"d typically validate the token
    // against your backend or Clerk"s verification endpoint
    req.userId = "user-id-from-token"; // This should be extracted from the verified token
    next();
  } catch (error) {
    console.error("Auth verification error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};