import { SectionWrapper } from "@/components/section-wrapper";
import { Button } from "../ui/button";

const FooterCTA = () => (
  <SectionWrapper>
    <div className="custom-screen">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
          Get started with Blinder today
        </h2>
        <p className="mt-3 text-gray-600">
          Hire experts to create your next idea, follow best practices, remove
          roadblocks, and delivery on schedule.
        </p>
        <Button className="mt-4 inline-block">Start building</Button>
      </div>
    </div>
  </SectionWrapper>
);

export default FooterCTA;
