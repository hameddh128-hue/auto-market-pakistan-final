import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0b1220]">

      <div className="absolute inset-0">

        <Image
          src="/hero-car.png"
          alt="Hero Car"
          fill
          priority
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#081018]/90 via-[#081018]/60 to-transparent"></div>

      </div>

      <div className="relative z-10 mx-auto flex h-[520px] max-w-7xl items-center justify-between px-6">

        <div className="max-w-[560px]">

          <span className="rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white">
            #1 VEHICLE MARKETPLACE
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Find Your Dream
            <br />
            Vehicle Today
          </h1>

          <p className="mt-5 text-slate-200 leading-7">
            Buy, Sell and Exchange Cars, Bikes, Trucks and Spare Parts
            anywhere in Pakistan.
          </p>

          <div className="mt-8 flex gap-4">

            <button className="rounded-xl bg-green-600 px-7 py-3 font-semibold text-white">
              Browse Cars
            </button>

            <button className="rounded-xl bg-white/10 backdrop-blur border border-white/20 px-7 py-3 font-semibold text-white">
              Sell Vehicle
            </button>

          </div>

        </div>

        <div className="hidden lg:flex justify-end flex-1">

          <Image
            src="/hero-car.png"
            alt="Hero"
            width={760}
            height={470}
            className="drop-shadow-[0_35px_45px_rgba(0,0,0,0.45)]"
          />

        </div>

      </div>

    </section>
  );
}
