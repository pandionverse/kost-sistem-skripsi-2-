import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import KostCard from '../components/KostCard';
import { Loader } from 'lucide-react';

const Home = () => {
    const [kosts, setKosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState(2000000);

    useEffect(() => {
        fetchKosts();
    }, []);

    const fetchKosts = async (query = '') => {
        try {
            setLoading(true);
            const res = await api.get(`/kost?search=${query}`);
            setKosts(res.data);
        } catch (err) {
            console.error('Error fetching kosts:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F6FF]"> {/* Light blue background from screenshot */}

            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-20 pb-20 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2b6cb0] mb-4 leading-tight">
                    Web Chatbot AI Pencarian<br />
                    Kost Sekitar Universitas<br />
                    Klabat
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
                    Temukan kost idealmu dengan mudah dan cepat. Dibantu oleh asisten AI yang siap menjawab pertanyaanmu kapan saja.
                </p>

                <div className="flex justify-center gap-4">
                    <button onClick={() => document.getElementById('listing-section').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors">
                        Cari Kost Sekarang
                    </button>
                    <Link to="/login" className="px-8 py-3 bg-white text-blue-600 border border-blue-600 rounded-full font-bold hover:bg-blue-50 transition-colors">
                        Login Pemilik Kost
                    </Link>
                </div>
            </div>

            {/* Listing Section */}
            <div id="listing-section" className="bg-white/50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Daftar Kost Sekitar Universitas Klabat</h2>
                        <p className="text-gray-500">Temukan 12+ kost yang tersedia untuk mahasiswa</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Sidebar Filter */}
                        <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-bold text-blue-600 text-lg mb-6 border-b pb-2">Filter Pencarian</h3>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-4">Rentang Harga</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="5000000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>Rp 0</span>
                                    <span>Rp {parseInt(priceRange).toLocaleString('id-ID')}+</span>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                                Terapkan Filter
                            </button>
                        </div>

                        {/* Grid */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <Loader className="animate-spin text-blue-600" size={32} />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {kosts.map(kost => (
                                        <KostCard key={kost.id} kost={kost} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
