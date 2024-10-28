
const BookingLazyoader = () => {
  return (
    <section className='relative py-8 md:py-4 sm:px-6 xl:px-12 flex flex-col gap-2 bg-baseBg  min-h-screen   '>
        <header className='max-md:pl-4 shrink-0'>
                <div className='h-14 w-36 bg-slate-100 animate-pulse'>
                </div>
        </header>

        <section className="py-10  h-full  w-full flex  items-center justify-center gap-12">
            <section className="w-full max-w-7xl lg:max-h-[70vh] mx-auto  grid lg:flex gap-6 lg:justify-center ">
                
                <div className="bg-white w-full lg:w-80 overflow-auto xl:w-96  flex-shrink-0 p-6 rounded-lg   title ">

                <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div>

                    <div className="pt-24  pb-8">
                        <div className="flex pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Duration</p>
                            <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div> : 
                        </div>
                        <div className="flex pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Location Type</p>
                            <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div>
                        </div>
                        <div className="flex pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Location</p>
                            
                            <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div> 
                        </div>
                        <div className="flex  pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Price</p>
                            <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div> 
                        </div>
                        <div className="flex  pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Max booking</p>
                            <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div> 
                        </div>
                         <div className="flex pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Desc</p>
                            <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div> 
                        </div> 
                    </div>
                </div>

                <div className="calender ..."></div>
            </section>
        </section>

        <footer className='shrink-0 flex w-full gap-4 justify-center items-center '>
            <div className='h-8 w-28 bg-slate-100 animate-pulse'>
            </div>
            <div className='h-8 w-28 bg-slate-100 animate-pulse'>
            </div>
        </footer> 
    </section>
  )
}

export default BookingLazyoader