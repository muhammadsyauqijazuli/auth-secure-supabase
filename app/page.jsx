export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Sistem Manajemen Password Aman
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Kelola password Anda dengan aman menggunakan Supabase dan Next.js
        </p>
        <div className="space-x-4">
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </a>
          <a
            href="/register"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Register
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">🔒 Keamanan Tinggi</h3>
          <p className="text-gray-600">
            Data password Anda dienkripsi dan disimpan dengan aman menggunakan Supabase
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">🚀 Akses Cepat</h3>
          <p className="text-gray-600">
            Akses password Anda kapan saja dan di mana saja dengan cepat
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">📱 Responsive</h3>
          <p className="text-gray-600">
            Dapat diakses dengan nyaman dari berbagai perangkat
          </p>
        </div>
      </div>
    </div>
  )
}
