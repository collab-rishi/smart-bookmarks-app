'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function BookmarkList({ bookmarks, userId, onAdd, onRemove }: any) {
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase.channel('realtime_bookmarks')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bookmarks', 
        filter: `user_id=eq.${userId}` 
      }, (payload) => {
        if (payload.eventType === 'INSERT') onAdd(payload.new)
        if (payload.eventType === 'DELETE') onRemove(payload.old.id)
      }).subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, onAdd, onRemove])

  const deleteBookmark = async (id: string) => {
    onRemove(id)
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
        <p className="text-sm text-gray-400 font-medium">No bookmarks saved yet.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">
      {bookmarks.map((bookmark: any) => (
        <div 
          key={bookmark.id} 
          className="group flex items-center justify-between p-4 hover:bg-gray-50/50 transition-all duration-200"
        >
          <div className="flex flex-col min-w-0 pr-4">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {bookmark.title}
            </h3>
            <a 
              href={bookmark.url} 
              target="_blank" 
              className="text-xs text-gray-400 hover:text-black transition-colors truncate"
            >
              {bookmark.url}
            </a>
          </div>
          <button 
            onClick={() => deleteBookmark(bookmark.id)} 
            className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}