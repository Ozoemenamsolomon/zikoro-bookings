'use client';

const BookingLazyLoader = () => {
  return (
    <main className="bg-baseBg px-3 sm:px-6 xl:px-12">
      <article className="relative max-w-[100rem] mx-auto flex flex-col gap-8 sm:gap-2 min-h-screen justify-between py-8 md:py-4">
        
        {/* Error State Placeholder */}
        <section className="hidden"></section>

        {/* Header */}
        <header className="shrink-0">
          <div className="h-14 w-36 bg-slate-100 animate-pulse rounded"></div>
        </header>

        {/* Main Section */}
        <section className="h-full w-full flex items-center justify-center">
          <section className="w-full max-w-7xl mx-auto grid lg:flex gap-6 lg:justify-center md:max-h-[30rem] 2xl:max-h-[33rem]">
            
            {/* Left Panel */}
            <div className="bg-white w-full lg:w-80 xl:w-96 overflow-auto hide-scrollbar flex-shrink-0 p-6 rounded-lg">
              <div className="h-6 w-48 rounded bg-slate-100 animate-pulse mb-4"></div>

              <div className="pt-24 pb-8 space-y-4">
                {['Duration', 'Location Type', 'Location', 'Price', 'Max booking', 'Desc'].map((label, index) => (
                  <div key={index} className="flex gap-1 pb-2 w-full items-start">
                    <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5">{label}</p>
                    <div className="w-32 h-5 bg-slate-100 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Placeholder */}
            <div className="flex-1 bg-white rounded-lg h-[28rem] animate-pulse"></div>
          </section>
        </section>

        {/* Footer */}
        <footer className="shrink-0 flex w-full gap-4 justify-center items-center">
          <div className="h-8 w-28 bg-slate-100 animate-pulse rounded"></div>
          <div className="h-8 w-28 bg-slate-100 animate-pulse rounded"></div>
        </footer>
      </article>
    </main>
  );
};

export default BookingLazyLoader;
