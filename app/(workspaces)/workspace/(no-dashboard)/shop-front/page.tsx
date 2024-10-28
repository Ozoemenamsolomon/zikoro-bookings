import { redirect } from 'next/navigation'
 
import React from 'react'

const ShopFrontPage = ()=> {
  redirect('/appointments/store-front/booking')
}

export default ShopFrontPage