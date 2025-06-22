export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center fade-in">
          <h1 className="mb-6 --font-title text-4xl font-bold">
            Leaf to Leaf
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto --font-body">
            Tu plataforma completa para el seguimiento y gestión de cultivos. 
            Monitorea, planifica y optimiza cada etapa del crecimiento.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="btn-primary">
              Ver Mis Plantas
            </button>
            <button className="btn-outline">
              Nuevo Cultivo
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="card scale-in">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">12</div>
              <p className="text-sm text-slate-600" style={{ fontFamily: 'var(--font-body)' }}>
                Plantas Activas
              </p>
            </div>
          </div>

          <div className="card scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <p className="text-sm text-slate-600" style={{ fontFamily: 'var(--font-body)' }}>
                Experimentos
              </p>
            </div>
          </div>

          <div className="card scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">45</div>
              <p className="text-sm text-slate-600" style={{ fontFamily: 'var(--font-body)' }}>
                Días Promedio
              </p>
            </div>
          </div>

          <div className="card scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">89%</div>
              <p className="text-sm text-slate-600" style={{ fontFamily: 'var(--font-body)' }}>
                Tasa de Éxito
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card scale-in">
            <h3 className="text-gradient-primary mb-4" style={{ fontFamily: 'var(--font-title)' }}>
              🌱 Seguimiento de Plantas
            </h3>
            <p style={{ fontFamily: 'var(--font-body)' }}>
              Monitorea el crecimiento, salud y desarrollo de cada planta en tiempo real.
            </p>
          </div>

          <div className="card-gradient scale-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-slate-800 mb-4" style={{ fontFamily: 'var(--font-title)' }}>
              📅 Calendario Inteligente
            </h3>
            <p className="text-slate-700" style={{ fontFamily: 'var(--font-body)' }}>
              Planifica riegos, fertilización y cuidados con recordatorios automáticos.
            </p>
          </div>

          <div className="card scale-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-gradient-secondary mb-4" style={{ fontFamily: 'var(--font-title)' }}>
              📊 Métricas Avanzadas
            </h3>
            <p style={{ fontFamily: 'var(--font-body)' }}>
              Analiza datos de crecimiento, rendimiento y optimiza tus cultivos.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
