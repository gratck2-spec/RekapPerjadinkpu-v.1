import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { TripForm } from './components/TripForm';
import { TripList } from './components/TripList';
import { Modal } from './components/Modal';
import { Toast } from './components/Toast';
import { Trip } from './types';
import { initializeFirebase, subscribeToTrips, deleteTrip, addTrip } from './services/firebaseService';

const App: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Initialize Firebase and Auth
  useEffect(() => {
    const init = async () => {
      try {
        const uid = await initializeFirebase();
        setUserId(uid);
      } catch (error) {
        console.error("Firebase initialization failed:", error);
        setUserId(null);
      }
    };
    init();
  }, []);

  // Subscribe to Data
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToTrips((data) => {
      setTrips(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleAddTrip = async (tripData: Omit<Trip, 'id'>) => {
    try {
      await addTrip(tripData);
      showToast('Perjalanan berhasil disimpan!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Gagal menyimpan data.', 'error');
    }
  };

  const handleDeleteClick = (id: string) => {
    setTripToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (tripToDelete) {
      try {
        await deleteTrip(tripToDelete);
        showToast('Data berhasil dihapus.', 'success');
      } catch (error) {
        showToast('Gagal menghapus data.', 'error');
      }
    }
    setDeleteModalOpen(false);
    setTripToDelete(null);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Header userId={userId} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-4 xl:col-span-4">
            <div className="sticky top-24">
              <TripForm onSave={handleAddTrip} userId={userId} />
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-8 xl:col-span-8">
            <TripList 
              trips={trips} 
              loading={loading} 
              onDelete={handleDeleteClick} 
            />
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Konfirmasi Penghapusan"
        type="danger"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Anda yakin ingin menghapus data perjalanan dinas ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-colors"
            >
              Hapus Data
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default App;