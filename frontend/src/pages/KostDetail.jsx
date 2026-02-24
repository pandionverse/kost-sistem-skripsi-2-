import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { FILE_BASE } from '../api/axios';
import { MapPin, Phone, ArrowLeft, CheckCircle, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const KostDetail = () => {
    const { id } = useParams();
    const [kost, setKost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchKost = async () => {
            try {
                const res = await api.get(`/kost/${id}`);
                setKost(res.data);
            } catch (err) {
                console.error('Error details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchKost();
    }, [id]);

    // Auto-slide effect
    useEffect(() => {
        if (!kost || !kost.images || kost.images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % kost.images.length);
        }, 5000); // 5 seconds delay

        return () => clearInterval(interval);
    }, [kost]);

    const nextImage = () => {
        if (kost && kost.images) {
            setCurrentImageIndex((prev) => (prev + 1) % kost.images.length);
        }
    };

    const prevImage = () => {
        if (kost && kost.images) {
            setCurrentImageIndex((prev) => (prev - 1 + kost.images.length) % kost.images.length);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
    if (!kost) return <div className="min-h-screen flex items-center justify-center">Kost not found</div>;

    const handleWhatsApp = () => {
        api.post('/kost/log', { activity_type: 'CONTACT_OWNER', description: `Contacted owner of ${kost.id}` });
        const text = `Halo, saya tertarik dengan kost ${kost.name}. Apakah masih tersedia?`;
        window.open(`https://wa.me/${kost.owner_phone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleMaps = () => {
        api.post('/kost/log', { activity_type: 'VIEW_LOCATION', description: `Viewed location of ${kost.id}` });
        if (kost.maps_link) {
            window.open(kost.maps_link, '_blank');
        } else {
            // Fallback to searching address if no link provided
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(kost.address)}`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-[#ecf4ff] pt-24 pb-20"> {/* Light blue bg */}
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Back Button */}
                <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Kembali
                </Link>
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left Side: Image & Title */}
                    <div className="flex-1 w-full">
                        {/* Image Carousel */}
                        <div className="relative rounded-3xl overflow-hidden shadow-lg h-[400px] md:h-[500px] mb-8 bg-gray-200 group">
                            {kost.images && kost.images.length > 0 ? (
                                <>
                                    <img
                                        src={`${FILE_BASE}${kost.images[currentImageIndex]}`}
                                        alt={`${kost.name} - View ${currentImageIndex + 1}`}
                                        className="w-full h-full object-cover transition-opacity duration-500"
                                    />

                                    {/* Navigation Arrows */}
                                    {kost.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <ChevronRight size={24} />
                                            </button>

                                            {/* Dots Indicator */}
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                                {kost.images.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setCurrentImageIndex(idx)}
                                                        className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}

                            <div className="absolute top-6 right-6">
                                <span className="px-5 py-2 bg-white rounded-full font-bold text-blue-600 shadow-md">

                                </span>
                            </div>
                        </div>

                        <div className="pl-2">
                            <h1 className="text-4xl font-extrabold text-[#2b6cb0] mb-2">{kost.name}</h1>
                        </div>
                    </div>

                    {/* Right Side: Floating Booking Card */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <p className="text-gray-500 mb-1">Harga per bulan</p>
                            <div className="flex items-baseline mb-8">
                                <span className="text-4xl font-extrabold text-blue-600">Rp {parseInt(kost.price).toLocaleString('id-ID')}</span>
                                <span className="text-gray-500 ml-1">/orang</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <button
                                    onClick={handleWhatsApp}
                                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-200 flex items-center justify-center transition-all"
                                >
                                    <Phone size={20} className="mr-2" />
                                    Hubungi Pemilik Kost
                                </button>

                                <button
                                    onClick={handleMaps}
                                    className="w-full py-3.5 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold rounded-full flex items-center justify-center transition-all"
                                >
                                    <MapPin size={20} className="mr-2" />
                                    Lihat Lokasi di Maps
                                </button>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex items-start">
                                    <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-gray-800">Kamar tersedia</p>
                                        <p className="text-gray-400 text-xs">Diupdate: {new Date(kost.last_room_update).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle size={20} className="text-green-500 mr-3" />
                                    <p className="font-bold text-gray-800">Respon chat cepat</p>
                                </div>
                            </div>
                        </div>

                        {/* Owner Mini Profile */}
                        <div className="mt-6 flex items-center p-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mr-4">
                                IB
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Ibu Budi</p>
                                <p className="text-gray-500 text-sm">Pemilik Kost</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Chat Button */}
            <div className="fixed bottom-8 right-8">
                <button className="w-16 h-16 bg-blue-600 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
                    <MessageCircle size={32} />
                </button>
            </div>
        </div>
    );
};

export default KostDetail;
