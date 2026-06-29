import NextSteps from "@/components/NextSteps";

// Post-purchase page for the $5,000 Custom / Tailored Package.
// Set the $5,000 Stripe Payment Link's "after payment" redirect to:
//   https://YOURDOMAIN/next/custom-build/
export default function CustomBuildNext() {
  return <NextSteps planKey="custom-build" />;
}
