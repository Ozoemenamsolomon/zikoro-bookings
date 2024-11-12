import { PowerOff } from 'lucide-react'

const BookingOff = () => {
  return (
    <section className="h-full w-full flex justify-center items-center gap-4 flex-col">
      <div className="bg-baseLight rounded-full h-24 w-24 flex items-center justify-center text-purple-700/50">
        <PowerOff size={60} />
      </div>
      <h2 className="text-2xl sm:text-4xl font-bold  text-center max-w-96 mx-auto" 
        style={{
          background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>This meeting link is turned off by the host</h2>
    </section>
  )
}

export default BookingOff