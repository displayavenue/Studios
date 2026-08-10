import { googleOAuthConfigured, getGoogleClientId } from "@/lib/googleAuth";
import { jsonOk } from "@/lib/api";
import { getBookingFeeInr } from "@/lib/payments/razorpay";

export async function GET() {
  return jsonOk({
    googleConfigured: googleOAuthConfigured(),
    googleClientIdPresent: Boolean(getGoogleClientId()),
    razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    bookingFeeInr: getBookingFeeInr(),
  });
}
