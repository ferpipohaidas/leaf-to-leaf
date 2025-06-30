'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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

export default function Plantas() {
  const { status } = useSession();
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 10;
  const [newPlant, setNewPlant] = useState({
    name: '',
    genetics: '',
    phase: 'germinacion',
    germinationDate: '',
    vegetationDate: '',
    floweringDate: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchPlants();
    }
  }, [status, router]);

  const fetchPlants = async () => {
    try {
      const response = await fetch('/api/plants');
      if (response.ok) {
        const data = await response.json();
        setPlants(data);
      }
    } catch (error) {
      console.error('Error fetching plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlant),
      });

      if (response.ok) {
        const plant = await response.json();
        setPlants([...plants, plant]);
        setNewPlant({ name: '', genetics: '', phase: 'germinacion', germinationDate: '', vegetationDate: '', floweringDate: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding plant:', error);
    }
  };

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

  // Función para ir al detalle
  const goToDetail = (plantId: string) => {
    router.push(`/plantas/${plantId}`);
  };

  const deletePlant = async (plantId: string, plantName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la planta "${plantName}"? Esta acción no se puede deshacer.`)) {
      try {
        const response = await fetch(`/api/plants/${plantId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPlants(plants.filter(plant => plant.id !== plantId));
          // Si estamos en la última página y eliminamos todas las plantas, ir a la página anterior
          const newTotalPages = Math.ceil((plants.length - 1) / plantsPerPage);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }
        } else {
          alert('Error al eliminar la planta');
        }
      } catch (error) {
        console.error('Error deleting plant:', error);
        alert('Error al eliminar la planta');
      }
    }
  };

  // Cálculos de paginación
  const totalPages = Math.ceil(plants.length / plantsPerPage);
  const startIndex = (currentPage - 1) * plantsPerPage;
  const endIndex = startIndex + plantsPerPage;
  const currentPlants = plants.slice(startIndex, endIndex);



  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando plantas...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-2">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full min-h-[600px]">
        {/* Header con título y botón */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800">
          Plantas
        </h1>
            <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
              {plants.length}
            </span>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md"
          >
            Agregar Planta
          </button>
        </div>

        {/* Contenido principal */}
        <div className="">
          {plants.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/sad-leaf.png"
                  alt="Hoja triste"
                  width={128}
                  height={128}
                  className="object-contain opacity-60"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                No tienes ninguna planta
              </h2>
              <p className="text-gray-600 mb-8">
                Comienza tu jardín agregando tu primera planta
              </p>
            </div>
          ) : (
            <div>
              {/* Tabla de plantas */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-200 p-6">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Genética
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Fase
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Días de Edad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPlants.map((plant) => (
                      <tr key={plant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{plant.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {plant.genetics || 'No especificada'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${plant.phase === 'germinacion'
                              ? 'bg-yellow-100 text-yellow-800'
                              : plant.phase === 'vegetacion'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                            {plant.phase === 'germinacion' ? 'Germinación' :
                              plant.phase === 'vegetacion' ? 'Vegetación' : 'Floración'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {calculateAge(plant)} días
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => goToDetail(plant.id)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-md transition-colors duration-200"
                              title="Ver detalle"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deletePlant(plant.id, plant.name)}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors duration-200"
                              title="Eliminar planta"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

                            {/* Footer de la sección - siempre visible */}
              <div className="border-t border-gray-200">
                
                {/* Paginación simple */}
                <div className="flex items-center justify-center gap-2">
                  {/* Botón Anterior */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1 || totalPages <= 1}
                    className={`w-8 h-8 flex items-center justify-center text-lg font-bold transition-colors duration-200 ${
                      currentPage === 1 || totalPages <= 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 cursor-pointer hover:text-gray-800'
                    }`}
                  >
                    &lt;
                  </button>
                  
                  {/* Número de página actual */}
                  <span className="text-gray-700 font-medium mx-2">
                    {currentPage}
                  </span>
                  
                  {/* Botón Siguiente */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages || totalPages <= 1}
                    className={`w-8 h-8 flex items-center justify-center text-lg font-bold transition-colors duration-200 ${
                      currentPage === totalPages || totalPages <= 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 cursor-pointer hover:text-gray-800'
                    }`}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para agregar planta */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Agregar Nueva Planta</h3>
            <form onSubmit={handleAddPlant}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={newPlant.name}
                  onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-800"
                  placeholder="Ej: Mi Rosa Favorita"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Genética
                </label>
                <input
                  type="text"
                  value={newPlant.genetics}
                  onChange={(e) => setNewPlant({ ...newPlant, genetics: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-800"
                  placeholder="Ej: OG Kush, White Widow, etc."
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Fase Actual *
                </label>
                <select
                  required
                  value={newPlant.phase}
                  onChange={(e) => setNewPlant({ ...newPlant, phase: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-800"
                >
                  <option value="germinacion">Germinación</option>
                  <option value="vegetacion">Vegetación</option>
                  <option value="floracion">Floración</option>
                </select>
              </div>

              {/* Fecha de Germinación - Siempre mostrar para vegetación y floración */}
              {(newPlant.phase === 'germinacion' || newPlant.phase === 'vegetacion' || newPlant.phase === 'floracion') && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Fecha de Germinación {newPlant.phase === 'germinacion' ? '*' : '(opcional)'}
                  </label>
                  <input
                    type="date"
                    required={newPlant.phase === 'germinacion'}
                    value={newPlant.germinationDate}
                    onChange={(e) => setNewPlant({ ...newPlant, germinationDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-800"
                  />
                </div>
              )}

              {/* Fecha de Vegetación - Solo para vegetación y floración */}
              {(newPlant.phase === 'vegetacion' || newPlant.phase === 'floracion') && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Fecha de Vegetación {newPlant.phase === 'vegetacion' ? '*' : '(opcional)'}
                  </label>
                  <input
                    type="date"
                    required={newPlant.phase === 'vegetacion'}
                    value={newPlant.vegetationDate}
                    onChange={(e) => setNewPlant({ ...newPlant, vegetationDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-800"
                  />
                </div>
              )}

              {/* Fecha de Floración - Solo para floración */}
              {newPlant.phase === 'floracion' && (
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Fecha de Floración *
                  </label>
                  <input
                    type="date"
                    required
                    value={newPlant.floweringDate}
                    onChange={(e) => setNewPlant({ ...newPlant, floweringDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-800"
                  />
                </div>
              )}

              {newPlant.phase !== 'floracion' && <div className="mb-6"></div>}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Agregar Planta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
} 