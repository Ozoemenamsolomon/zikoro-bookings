 
import ShopfrontLayout from '@/components/workspace/Shopfront'
import React from 'react'

const ShopFrontLayoutPage = ({children}:{children:React.ReactNode})=> {
  return (
    <ShopfrontLayout>
        {children}
    </ShopfrontLayout>
  )
}

export default ShopFrontLayoutPage