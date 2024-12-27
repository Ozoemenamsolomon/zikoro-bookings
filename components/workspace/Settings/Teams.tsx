import { Button } from '@/components/ui/button'
import React from 'react'
import InviteTeams from './InviteTeams'

const Teams = () => {
  return (
    <section className="sm:py-8 sm:px-8 space-y-5">
        <div className="flex justify-end w-full border-b pb-5">
            <InviteTeams/>
        </div>

        <section className="max-w-4xl mx-auto h-96 border rounded-md">
            <table>

            </table>

        </section>
    </section>
  )
}

export default Teams