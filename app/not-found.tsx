import { redirect } from 'next/navigation'
import React from 'react'

const PageNotFound = () => {
   redirect('/?msg=The page was not found. Keep browsing for more')
}

export default PageNotFound