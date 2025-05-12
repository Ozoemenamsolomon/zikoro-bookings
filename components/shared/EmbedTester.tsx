// app/embed-tester/page.tsx (Next.js 14 with App Router)
'use client'

import { useState } from 'react'

export default function EmbedTesterPage() {
  const [embedCode, setEmbedCode] = useState<string>(`<iframe
  src="https://yourdomain.com/book-appointment/638a3d6c-cfb4-4c7a-b2ff-dfaa27566cbb"
  width="100%"
  height="600"
  style="border: none;"
  allowfullscreen
></iframe>`)

  return (
    <div className="min-h-screen p-8 bg-gray-50 ">
      <h1 className="text-2xl font-bold mb-4">Embed Tester</h1>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Paste Embed Code
      </label>
      <textarea
        value={embedCode}
        onChange={(e) => setEmbedCode(e.target.value)}
        rows={6}
        className="w-full p-4 mb-6 border rounded-md shadow-sm bg-white"
      />

      <h2 className="text-lg font-semibold mb-2">Preview:</h2>
      <div
        className="w-full border rounded-md overflow-hidden bg-white shadow"
        dangerouslySetInnerHTML={{ __html: embedCode }}
      />
    </div>
  )
}
