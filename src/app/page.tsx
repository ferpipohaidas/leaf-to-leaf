import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Main content area */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bienvenido a Leaf to Leaf
            </h2>
            <p className="text-lg text-gray-600">
              Tu contenido principal irá aquí
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
