import Image from "next/image";
import { SectionWrapper } from "@/components/section-wrapper";
import { Button } from "../ui/button";
import ctaImage from "../../public/cta-image.jpg";

const CTA = () => {
  return (
    <SectionWrapper id="cta" className="pb-0">
      <div className="custom-screen">
        <div className="items-center gap-x-12 lg:flex">
          <div className="flex-1 sm:hidden lg:block relative">
            <Image
              src={ctaImage}
              className="rounded-lg md:max-w-lg"
              alt="Create Successful Business Models with Our IT Solutions"
            />
          </div>
          <div className="max-w-xl mt-6 md:mt-0 lg:max-w-2xl">
            <h2 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
              Create Successful Business Models with Our IT Solutions
            </h2>
            <p className="mt-3 text-gray-600">
              Blinder, a software development company, helps to digitize
              businesses by focusing on client’s business challenges, needs. We
              value close transparent cooperation and encourage our clients to
              participate actively in the project development life cycle.
            </p>
            <Button className="inline-block mt-4">Get started</Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CTA;
