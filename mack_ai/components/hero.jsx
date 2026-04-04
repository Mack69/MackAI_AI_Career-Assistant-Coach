"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="w-full pt-40 md:pt-50 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-7 mx-auto">
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl gradient-title">
            Your AI Career Coach
            <br />
            Professional Success
          </h1>
          <p className="md:text-xl max-w-150 mx-auto leading-relaxed text-muted-foreground">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>
        </div>

        <div className="flex justify-center space-x-8">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 ">
              Get Started
            </Button>
          </Link>
          <Link href="https://github.com/Mack69/MackAI_AI_Career-Assistant-Coach">
            <Button size="lg" className="px-8.5" variant="outline">
              Github Repo
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image ">
            <Image
              src={"/banner.jpeg"}
              width={1480}
              height={720}
              alt="Dashboard Banner"
              className="rouned-lg shadow-2xl border mx-auto"
              priority
              
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
