import { redirect } from 'next/navigation'
import React from 'react'

const InvalidPage = () => {
  redirect('/?msg=The page url was not found!')
}

export default InvalidPage