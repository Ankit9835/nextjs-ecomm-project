import React from "react";
import HeroCaresoul from "./HeroCaresoul";

const Hero = () => {
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          <h1 className="max-w-2xl font-bold text-4xl sm:text-6xl tracking-tight items-center">
            We are changing the way people shop
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
            ut maxime ea, officia est cupiditate officiis iusto quidem alias.
            Non.
          </p>
        </div>
        <HeroCaresoul />
      </section>
    </>
  );
};

export default Hero;
