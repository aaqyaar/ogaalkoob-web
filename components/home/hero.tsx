import { Button } from "../ui/button";

const Hero = () => (
  <section>
    <div className="custom-screen py-28 text-gray-600">
      <div className="space-y-5 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl">
          Build and scale your next business idea faster
        </h1>
        <p className="max-w-xl mx-auto">
          Blinder making it simple for you to build and grow your SaaS
          applications, or any business idea.
        </p>
        <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
          <Button>Start building</Button>
          <Button variant={"outline"}>Learn more</Button>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
