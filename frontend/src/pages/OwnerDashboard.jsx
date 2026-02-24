import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Edit, Trash2, MapPin, Loader } from 'lucide-react';

const OwnerDashboard = () => {
    const [myKosts, setMyKosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyKosts();
    }, []);

    const fetchMyKosts = async () => {
        try {
            const res = await api.get('/kost/owner/my-kosts');
            setMyKosts(res.data);
        } catch (err) {
            console.error('Error fetching my kosts:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
                <button className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-shadow shadow-md">
                    <Plus size={20} className="mr-2" />
                    Add New Property
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader className="animate-spin text-blue-600" size={32} />
                </div>
            ) : myKosts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No properties listed yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Get started by adding your boarding house to our directory.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myKosts.map((kost) => (
                        <div key={kost.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                            <div className="h-48 bg-gray-200 relative">
                                {/* Status Badge */}
                                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${kost.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        kost.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {kost.status}
                                </div>
                                {kost.image_url ? (
                                    <img src={`http://localhost:5000${kost.image_url}`} alt={kost.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg text-gray-900 mb-1">{kost.name}</h3>
                                <p className="text-gray-500 text-sm mb-4 flex items-center">
                                    <MapPin size={14} className="mr-1" />
                                    {kost.address}
                                </p>

                                <div className="mt-auto flex gap-2">
                                    <button className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
                                        <Edit size={16} className="mr-2" />
                                        Edit
                                    </button>
                                    <button className="py-2 px-3 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
