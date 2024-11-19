import { Loader2 } from 'lucide-react'

const PageLoader = ({size}:{size?:number}) => {
  return (
    <div className="flex justify-center w-full h-screen text-basePrimary/50 pt-28"><Loader2 className='animate-spin'/></div>
  )
}

export default PageLoader