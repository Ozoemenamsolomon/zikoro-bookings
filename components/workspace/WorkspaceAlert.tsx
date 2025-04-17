'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, X } from 'lucide-react'

export default function WorkspaceAlert() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    const message = searchParams.get('msg')
    if (message) {
      setMsg(decodeURIComponent(message))

      // Remove message after 5 seconds
      const timer = setTimeout(() => {
        setMsg(null)
        // Remove query param from URL without refresh
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('msg')
        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [searchParams, pathname, router])

  if (!msg) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <Alert className="border-purple-500 bg-purple-50">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 mt-1 text-purple-700" />
            <div>
              <AlertTitle className="text-purple-800">Heads up!</AlertTitle>
              <AlertDescription className="text-purple-700">{msg}</AlertDescription>
            </div>
          </div>
          <button onClick={() => setMsg(null)}>
            <X className="h-4 w-4 text-purple-700" />
          </button>
        </div>
      </Alert>
    </div>
  )
}
