import NextSteps from "@/components/NextSteps";

// Post-purchase page for the $500 Custom Website plan.
// Set the $500 Stripe Payment Link's "after payment" redirect to:
//   https://YOURDOMAIN/next/custom-website/
export default function CustomWebsiteNext() {
  return <NextSteps planKey="custom-website" />;
}
