import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { CheckCircle, XCircle, Loader, MapPin, Search } from 'lucide-react';

const AdminDashboard = () => {
    const [pendingKosts, setPendingKosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingKosts();
    }, []);

    const fetchPendingKosts = async () => {
        try {
            const res = await api.get('/admin/kost/pending');
            setPendingKosts(res.data);
        } catch (err) {
            console.error('Error fetching pending kosts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Approve this listing?')) return;
        try {
            await api.put(`/admin/kost/${id}/approve`);
            setPendingKosts(pendingKosts.filter(k => k.id !== id));
        } catch (err) {
            console.error('Error approving kost:', err);
            alert('Failed to approve');
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Reject this listing?')) return;
        try {
            await api.put(`/admin/kost/${id}/reject`);
            setPendingKosts(pendingKosts.filter(k => k.id !== id));
        } catch (err) {
            console.error('Error rejecting kost:', err);
            alert('Failed to reject');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-gray-800">Pending Approvals</h2>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {pendingKosts.length} Request(s)
                    </span>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader className="animate-spin text-blue-600" size={32} />
                    </div>
                ) : pendingKosts.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No pending listings at the moment.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {pendingKosts.map((kost) => (
                            <div key={kost.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50 transition-colors">
                                {/* Image */}
                                <div className="w-full md:w-48 h-32 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                                    {kost.image_url ? (
                                        <img src={`http://localhost:5000${kost.image_url}`} alt={kost.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-xl text-gray-900">{kost.name}</h3>
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">PENDING</span>
                                    </div>

                                    <div className="text-sm text-gray-500 mb-4 space-y-1">
                                        <p className="flex items-center"><MapPin size={14} className="mr-1" /> {kost.address}</p>
                                        <p>Owner: <span className="font-medium text-gray-900">{kost.owner_name}</span> ({kost.owner_email})</p>
                                        <p>Price: <span className="font-medium text-blue-600">Rp {parseInt(kost.price).toLocaleString()}</span></p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleApprove(kost.id)}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                                        >
                                            <CheckCircle size={16} className="mr-2" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(kost.id)}
                                            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                        >
                                            <XCircle size={16} className="mr-2" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
