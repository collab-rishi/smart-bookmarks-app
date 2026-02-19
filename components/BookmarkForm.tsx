'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function BookmarkForm({ user, onAdd }: any) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !title) return
    setLoading(true)

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ 
        url, 
        title, // Now using the user-provided title
        user_id: user.id 
      }])
      .select().single()

    if (!error && data) {
      onAdd(data)
      setUrl('')
      setTitle('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row items-stretch gap-2 p-1.5 bg-white border border-gray-200 rounded-xl shadow-sm focus-within:border-gray-400 transition-all">
        {/* Name/Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Resource name"
          className="flex-[0.4] px-3 py-2 text-sm outline-none border-b md:border-b-0 md:border-r border-gray-100 placeholder:text-gray-400 font-medium"
          required
        />
        
        {/* URL Input */}
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 px-3 py-2 text-sm outline-none placeholder:text-gray-400 font-mono text-[13px]"
          required
        />
        
        <button
          disabled={loading || !url || !title}
          className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-black active:scale-[0.98] disabled:opacity-30 disabled:scale-100 transition-all"
        >
          {loading ? 'Adding...' : 'Save'}
        </button>
      </div>
      <p className="mt-2 text-[10px] text-gray-400 px-1">
        Press <kbd className="font-sans">Enter</kbd> to save immediately
      </p>
    </form>
  )
}