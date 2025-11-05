import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import PasswordManager from './PasswordManager'

export default async function PrivatePage() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/')
  }

  const { data: passwords } = await supabase
    .from('passwords')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Password Manager</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome, {data.user.email}</span>
          <form action="/logout/actions">
            <button
              type="submit"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
      
      <PasswordManager user={data.user} initialPasswords={passwords || []} />
    </div>
  )
}