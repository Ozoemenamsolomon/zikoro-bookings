import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

const DiscountButton = () => {
    const [show, setShow] = useState(false)
  return (
    <>
    {show ?
    <div className='flex gap-0 w-full h-10 items-center rounded overflow-hidden border'>
        <Input 
        placeholder='Enter a valid discount code'
        className='w-full   py-2 border-none'
        />
        <Button onClick={()=>setShow(false)} type='button' className='shrink-0 px-3   rounded-l-none py-2'>Redeem</Button>
    </div>
    :
    <p onClick={()=>setShow(true)} className='text-zikoroBlue text-sm cursor-pointer'>Have a discount code? Click here to enter the code</p>}
    </> )
}

export default DiscountButton