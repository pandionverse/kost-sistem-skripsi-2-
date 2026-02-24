import React from 'react';
import { FILE_BASE } from '../api/axios';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const KostCard = ({ kost }) => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative h-48 bg-gray-200">
                {kost.image_url ? (
                    <img
                        src={`${FILE_BASE}${kost.image_url}`}
                        alt={kost.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}

                {/* Badge "Putri" / "Campur" - Using static for now or random based heavily on screenshot */}
                <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-blue-600 shadow-sm">
                        Campur
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{kost.name}</h3>
                {/* Facilities Tags */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    {['WiFi', 'KM. Dalam', 'AC'].map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] font-medium rounded border border-gray-100">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div>
                        <p className="text-blue-600 font-bold text-lg">Rp {parseInt(kost.price).toLocaleString('id-ID')}</p>
                        <p className="text-gray-400 text-xs">/ bulan</p>
                    </div>
                    <Link to={`/kost/${kost.id}`} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
                        Lihat Detail
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default KostCard;
