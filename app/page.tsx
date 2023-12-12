"use client";
import { GradientWrapper } from "@/components/gradient-wrapper";
import {
  CTA,
  Features,
  FooterCTA,
  Hero,
  LogoGrid,
  Testimonials,
  ToolKit,
} from "@/components/home";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoGrid />
      <GradientWrapper>
        <Features />
        <CTA />
      </GradientWrapper>
      <ToolKit />
      <GradientWrapper>
        <Testimonials />
      </GradientWrapper>
      <FooterCTA />
    </>
  );
}
