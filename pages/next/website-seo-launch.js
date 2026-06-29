import NextSteps from "@/components/NextSteps";

// Post-purchase page for the $1,000 Website + SEO & Launch plan.
// Set the $1,000 Stripe Payment Link's "after payment" redirect to:
//   https://YOURDOMAIN/next/website-seo-launch/
export default function WebsiteSeoLaunchNext() {
  return <NextSteps planKey="website-seo-launch" />;
}
