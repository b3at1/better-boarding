import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-col sm:flex-row items-center justify-between min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
        <h1 className="text-7xl font-bold mb-6">Better Boarding</h1>
        <p className="text-2xl mb-20">Experience a smoother boarding process</p>
        <div className="flex justify-center w-full mt-10">
          <button className="rounded-full border border-solid border-transparent transition-colors duration-500 flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#edeffd] text-lg sm:text-3xl h-20 sm:h-24 w-3/4 sm:w-1/2 mb-4">
            Start
          </button>
        </div>
      </div>
      <div className="w-full sm:w-2/5 sm:ml-8">
        <Image
          className="transform -scale-x-100"
          src="/airplane-departure.png"
          alt="Airplane departure"
          layout="responsive"
          width={300}
          height={200}
          priority
        />
      </div>
    </div>
  );
}
