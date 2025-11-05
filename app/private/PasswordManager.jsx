'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function PasswordManager({ user, initialPasswords }) {
  const [passwords, setPasswords] = useState(initialPasswords)
  const [isAdding, setIsAdding] = useState(false)
  const [showPassword, setShowPassword] = useState({})
  const [newPassword, setNewPassword] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const handleAddPassword = async (e) => {
    e.preventDefault()
    
    const { data, error } = await supabase
      .from('passwords')
      .insert([
        {
          user_id: user.id,
          ...newPassword
        }
      ])
      .select()

    if (error) {
      console.error('Error adding password:', error)
      return
    }

    setPasswords([data[0], ...passwords])
    setIsAdding(false)
    setNewPassword({
      title: '',
      username: '',
      password: '',
      url: '',
      notes: ''
    })
  }

  const handleDeletePassword = async (id) => {
    if (!window.confirm('Are you sure you want to delete this password?')) {
      return
    }

    const { error } = await supabase
      .from('passwords')
      .delete()
      .match({ id })

    if (error) {
      console.error('Error deleting password:', error)
      return
    }

    setPasswords(passwords.filter(pwd => pwd.id !== id))
  }

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Copied to clipboard!'))
      .catch(err => console.error('Failed to copy:', err))
  }

  const filteredPasswords = passwords.filter(pwd =>
    pwd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pwd.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pwd.url?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="w-full sm:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            {isAdding ? (
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            )}
          </svg>
          {isAdding ? 'Cancel' : 'Add New Password'}
        </button>
      </div>

      {isAdding && (
        <div className="mb-8">
          <form onSubmit={handleAddPassword} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Add New Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newPassword.title}
                  onChange={(e) => setNewPassword({...newPassword, title: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username/Email</label>
                <input
                  type="text"
                  value={newPassword.username}
                  onChange={(e) => setNewPassword({...newPassword, username: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={newPassword.password}
                  onChange={(e) => setNewPassword({...newPassword, password: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
                <input
                  type="url"
                  value={newPassword.url}
                  onChange={(e) => setNewPassword({...newPassword, url: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                <textarea
                  value={newPassword.notes}
                  onChange={(e) => setNewPassword({...newPassword, notes: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Save Password
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPasswords.map((pwd) => (
          <div key={pwd.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pwd.title}</h3>
                <button
                  onClick={() => handleDeletePassword(pwd.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Username</div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white">{pwd.username}</span>
                    <button
                      onClick={() => copyToClipboard(pwd.username)}
                      className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Password</div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white font-mono">
                      {showPassword[pwd.id] ? pwd.password : '•'.repeat(8)}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(pwd.id)}
                      className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        {showPassword[pwd.id] ? (
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        ) : (
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        )}
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => copyToClipboard(pwd.password)}
                      className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                </div>
                {pwd.url && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Website</div>
                    <a
                      href={pwd.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px]"
                    >
                      {pwd.url}
                    </a>
                  </div>
                )}
                {pwd.notes && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</div>
                    <p className="text-gray-900 dark:text-white text-sm">{pwd.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredPasswords.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-9a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No passwords found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try different search terms' : 'Start by adding a new password'}
          </p>
        </div>
      )}
    </div>
  )
}
