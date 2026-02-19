'use client'
import { useState } from 'react'
import BookmarkForm from './BookmarkForm'
import BookmarkList from './BookmarkList'

export default function DashboardClient({ initialBookmarks, user }: any) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks)

  const addBookmark = (newB: any) => {
    setBookmarks((prev: any) => prev.find((b: any) => b.id === newB.id) ? prev : [newB, ...prev])
  }
  const removeBookmark = (id: string) => {
    setBookmarks((prev: any) => prev.filter((b: any) => b.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-gray-200">
      {/* Subtle Top Utility Bar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-white rotate-45" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Smart Bookmarks</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">
              {user?.email}
            </span>
            <form action="/auth/signout" method="post">
              <button 
                type="submit"
                className="text-xs font-medium text-gray-500 hover:text-black border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-all"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto pt-32 px-6 pb-20">
        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Bookmarks</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and organize your bookmarks.</p>
        </header>

        <section className="mb-12">
          {/* Label for the input section adds to the "structured" feel */}
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">
            Add New Entry
          </label>
          <BookmarkForm user={user} onAdd={addBookmark} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Saved Resources
            </label>
            <span className="text-[10px] font-mono text-gray-400">
              {bookmarks.length.toString().padStart(2, '0')}
            </span>
          </div>
          <BookmarkList 
            bookmarks={bookmarks} 
            userId={user.id} 
            onAdd={addBookmark} 
            onRemove={removeBookmark} 
          />
        </section>
      </div>
    </div>
  )
}