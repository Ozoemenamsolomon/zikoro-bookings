import { Loader2 } from 'lucide-react'

const Loading = ({size}:{size?:number}) => {
  return (
    <Loader2 size={size||20} className='animate-spin text-blue-600'/>
  )
}

export default Loading