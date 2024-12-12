import { Link2Off, PowerOff } from 'lucide-react'
import Link from 'next/link'

const BookingOff = ({errortext}:{errortext?:string}) => {
  return (
    <section className="h-full w-full flex justify-center items-center gap-4 flex-col">
      <div className="bg-baseLight rounded-full h-24 w-24 flex items-center justify-center text-purple-700/50">
       {errortext ? <Link2Off size={60} /> : <PowerOff size={60} />}
      </div>
      <h2 className="text-2xl sm:text-4xl font-bold  text-center max-w-96 mx-auto" 
        style={{
          background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {errortext?errortext:`The host has turned off this meeting link`}
        </h2>
        <p className="text-center">Get the right link from the host and try again.</p>
        <Link href={'/'} className='block text-center text-zikoroBlue mt-8 text-sm'>
          Zikoro Booking Platform
        </Link>
    </section>
  )
}

export default BookingOff