import { Button } from "@/components/ui/button";
import HeroSection from "@/components/hero";
import { features } from "@/data/features";
import { Card, CardContent } from "@/components/ui/card";
import { howItWorks } from "@/data/howItWorks";
import { testimonial } from "@/data/testimonial";
import Image from "next/image";
import Link from "next/link";
import { faqs } from "@/data/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";


export default function Home() {
  return (
    <div>
      <div className="grid-background"></div>
      <HeroSection />

      {/* FEATURES */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Powerful Features foe Your Career Growth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              return (
                <Card
                  key={index}
                  className="border-2 hover:border-primary transition-colors duration-400"
                >
                  <CardContent className="pt-6 text-center flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center">
                      {feature.icon}
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">50+</h3>
              <p className="text-muted-foreground">Industries Covered</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">1000+</h3>
              <p className="text-muted-foreground">Interview Questions</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">95%</h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">24/7</h3>
              <p className="text-muted-foreground">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mx-auto max-w-3xl mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Four Simple Steps to Accelerate Your Career
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="group transition-transform hover:scale-105 duration-300"
              >
                <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*TESTIMONIAL*/}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/60">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold  text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => {
              return (
                <Card key={index} className="bg-background">
                  <CardContent className="pt-6">
                    <div>
                      <div className="flex items-center space-x-4">
                        <Image
                          width={40}
                          height={40}
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-muted-foreground">
                        {testimonial.quote}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mx-auto max-w-3xl mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions ?
            </h2>
            <p className="text-muted-foreground">
              find answers to common questions about our platform
            </p>
          </div>
          <div className=" max-w-6xl mx-auto w-full">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => {
                return (
                  <AccordionItem key={index} value={`item=${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full">
        <div className=" mx-auto py-24 gradient rounded-lg">
          <div className="felx flex-col item-center justify-center text-center mx-auto max-w-3xl space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl pb-3">
              Ready to Accerelerate Your Career ?
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
              Join thousands of professionals who are advancing their careers
              with AI-Powered guidance.
            </p>
            <Link href="/dashboard" passHref>
              <Button size="lg" className="h-12 mt-5 animate-bounce" variant="secondary">
                Start Your Journey Today  <ArrowRight className="ml-2 h-4 w-4"/>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  );
}
