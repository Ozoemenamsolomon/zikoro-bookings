import { redirect } from 'next/navigation'
import React from 'react'

const SettingsPage = ({children}:{
  children: React.ReactNode
}) => {
  redirect('/workspace/settings/profile')
}

export default SettingsPage