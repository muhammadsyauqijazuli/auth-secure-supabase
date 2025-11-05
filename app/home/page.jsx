import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import PasswordManager from '../private/PasswordManager'
import Navbar from '../components/Navbar'

export default async function HomePage() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  const { data: passwords } = await supabase
    .from('passwords')
    .select('*')
    .eq('user_id', data.user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar user={data.user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Password Manager Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your passwords securely in one place
          </p>
        </div>
        
        <PasswordManager user={data.user} initialPasswords={passwords || []} />
      </div>
    </div>
  )
}