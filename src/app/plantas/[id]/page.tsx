'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Plant {
  id: string;
  name: string;
  genetics?: string;
  phase: string;
  germinationDate?: string;
  vegetationDate?: string;
  floweringDate?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PlantDetail() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlant = useCallback(async () => {
    try {
      const response = await fetch(`/api/plants/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPlant(data);
      } else if (response.status === 404) {
        router.push('/plantas');
      }
    } catch (error) {
      console.error('Error fetching plant:', error);
      router.push('/plantas');
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated' && params.id) {
      fetchPlant();
    }
  }, [status, params.id, router, fetchPlant]);

  // Función para calcular días de edad
  const calculateAge = (plant: Plant) => {
    const today = new Date();
    let startDate: Date | null = null;

    // Usar la fecha más temprana disponible
    if (plant.germinationDate) {
      startDate = new Date(plant.germinationDate);
    } else if (plant.vegetationDate) {
      startDate = new Date(plant.vegetationDate);
    } else if (plant.floweringDate) {
      startDate = new Date(plant.floweringDate);
    }

    if (!startDate) return 0;

    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Función para calcular días en cada fase
  const calculatePhaseAge = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando planta...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!plant) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Planta no encontrada</h1>
            <button
              onClick={() => router.push('/plantas')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Volver a Plantas
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full min-h-[600px]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/plantas')}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              ← Volver
            </button>
            <h1 className="text-3xl font-bold text-green-700">
              {plant.name}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              plant.phase === 'germinacion' 
                ? 'bg-yellow-100 text-yellow-800'
                : plant.phase === 'vegetacion'
                ? 'bg-green-100 text-green-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {plant.phase === 'germinacion' ? 'Germinación' :
               plant.phase === 'vegetacion' ? 'Vegetación' : 'Floración'}
            </span>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Imagen de la planta */}
            <div className="lg:col-span-1">
              <div className="w-full h-64 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                {plant.imageUrl ? (
                  <Image src={plant.imageUrl} alt={plant.name} width={256} height={256} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-8xl">🌱</div>
                )}
              </div>
            </div>

            {/* Información general */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información básica */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Información General</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-gray-600">Nombre:</span>
                      <p className="text-gray-800">{plant.name}</p>
                    </div>
                    {plant.genetics && (
                      <div>
                        <span className="font-semibold text-gray-600">Genética:</span>
                        <p className="text-gray-800">{plant.genetics}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-gray-600">Fase Actual:</span>
                      <p className="text-gray-800">
                        {plant.phase === 'germinacion' ? 'Germinación' :
                         plant.phase === 'vegetacion' ? 'Vegetación' : 'Floración'}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">Edad Total:</span>
                      <p className="text-gray-800 font-bold text-lg text-green-600">
                        {calculateAge(plant)} días
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fechas importantes */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Fechas Importantes</h3>
                  <div className="space-y-3">
                    {plant.germinationDate && (
                      <div className="border-l-4 border-yellow-400 pl-3">
                        <span className="font-semibold text-yellow-700">Germinación:</span>
                        <p className="text-gray-800">{new Date(plant.germinationDate).toLocaleDateString()}</p>
                        {plant.vegetationDate && (
                          <p className="text-sm text-gray-600">
                            {calculatePhaseAge(plant.germinationDate, plant.vegetationDate)} días en germinación
                          </p>
                        )}
                      </div>
                    )}
                    
                    {plant.vegetationDate && (
                      <div className="border-l-4 border-green-400 pl-3">
                        <span className="font-semibold text-green-700">Vegetación:</span>
                        <p className="text-gray-800">{new Date(plant.vegetationDate).toLocaleDateString()}</p>
                        {plant.floweringDate && (
                          <p className="text-sm text-gray-600">
                            {calculatePhaseAge(plant.vegetationDate, plant.floweringDate)} días en vegetación
                          </p>
                        )}
                      </div>
                    )}
                    
                    {plant.floweringDate && (
                      <div className="border-l-4 border-purple-400 pl-3">
                        <span className="font-semibold text-purple-700">Floración:</span>
                        <p className="text-gray-800">{new Date(plant.floweringDate).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">
                          {calculatePhaseAge(plant.floweringDate)} días en floración
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline visual */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Línea de Tiempo</h3>
                <div className="flex items-center space-x-4">
                  {/* Germinación */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${plant.germinationDate ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                    <span className="text-xs mt-1 text-gray-600">Germinación</span>
                    {plant.germinationDate && (
                      <span className="text-xs text-gray-500">
                        {new Date(plant.germinationDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {/* Línea conectora */}
                  <div className={`flex-1 h-0.5 ${plant.vegetationDate ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  
                  {/* Vegetación */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${plant.vegetationDate ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                    <span className="text-xs mt-1 text-gray-600">Vegetación</span>
                    {plant.vegetationDate && (
                      <span className="text-xs text-gray-500">
                        {new Date(plant.vegetationDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {/* Línea conectora */}
                  <div className={`flex-1 h-0.5 ${plant.floweringDate ? 'bg-purple-400' : 'bg-gray-300'}`}></div>
                  
                  {/* Floración */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${plant.floweringDate ? 'bg-purple-400' : 'bg-gray-300'}`}></div>
                    <span className="text-xs mt-1 text-gray-600">Floración</span>
                    {plant.floweringDate && (
                      <span className="text-xs text-gray-500">
                        {new Date(plant.floweringDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Información del Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">Creada:</span>
                    <p>{new Date(plant.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Última actualización:</span>
                    <p>{new Date(plant.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 