// src/components/PackageViewer.jsx

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaClock } from 'react-icons/fa';
import axiosClient from '~/api/axiosClient'; // Dùng đường dẫn phù hợp với cấu trúc của bạn
import PackageDetailModal from './PackageDetailModal'; // Import Modal

// Component mô phỏng thẻ gói tập trên màn hình (Giống hình ảnh bạn cung cấp)
const PackageCard = ({ packageInfo, onDetailsClick, isLoading }) => {
    const formatVND = (amount) => {
        if (typeof amount !== 'number') return '0 VND';
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    return (
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition text-slate-800 dark:text-slate-100 max-w-[300px]">
            <h3 className="font-bold text-orange-600 dark:text-orange-400 mb-1 text-lg">{packageInfo.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-3">{packageInfo.subtitle || 'PT kèm 1-1 cho người mới bắt đầu'}</p>
            <div className="flex items-center mb-3">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {formatVND(packageInfo.price)}
                </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-1.5">
                <FaClock className="text-slate-400 text-xs" /> Thời lượng: {packageInfo.durationDays || '?'} ngày
            </p>
            
            <button 
                onClick={() => onDetailsClick(packageInfo._id)}
                className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold text-xs transition shadow-xs cursor-pointer"
                disabled={isLoading}
            >
                {isLoading ? 'Đang tải...' : 'Xem chi tiết'}
            </button>
        </div>
    );
};

// Dữ liệu giả định cho danh sách gói tập
const dummyPackages = [
    { _id: '60c72b1f9b3e1c001f8f8f8f', name: 'Gói 8 buổi / 1 tháng', price: 1200000, durationDays: 30 },
    // Thêm các gói khác nếu cần
];


const PackageViewer = () => {
    // Trạng thái quản lý Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [packageDetails, setPackageDetails] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);

    // 1. Hàm gọi API và hiển thị Modal
    const fetchAndShowDetails = async (packageId) => {
        if (!packageId) return;

        setIsLoading(true);
        setPackageDetails(null); 
        
        try {
            // Gọi API GET /api/packages/:id
            const response = await axiosClient.get(`/packages/${packageId}`); 
            
            setPackageDetails(response.data.data); 
            setIsModalOpen(true); 

        } catch (error) {
            // Lỗi đã được xử lý bằng toast.error trong interceptor
            console.error('Lỗi khi tải chi tiết gói:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => setIsModalOpen(false);

    // 2. Hàm Placeholder cho nút Thanh toán (Không xử lý logic)
    const handleProceedToPayment = (packageId) => {
        console.log(`[PAYMENT TRIGGERED] Chuẩn bị chuyển sang bước thanh toán cho Gói ID: ${packageId}`);
        toast.info("Chức năng Thanh toán (Logic của người khác) được gọi thành công.");
        // closeModal(); // Có thể đóng modal sau khi trigger thanh toán
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Danh sách Gói Tập PT</h1>
            
            <div style={{ display: 'flex', gap: '20px' }}>
                {dummyPackages.map(pkg => (
                    // Chỉ truyền trạng thái loading chung nếu cần, hoặc quản lý loading riêng
                    <PackageCard 
                        key={pkg._id} 
                        packageInfo={pkg} 
                        onDetailsClick={fetchAndShowDetails} 
                        isLoading={isLoading} 
                    />
                ))}
            </div>

            {/* Modal Chi Tiết */}
            <PackageDetailModal
                isOpen={isModalOpen}
                onClose={closeModal}
                packageData={packageDetails}
                onProceedToPayment={handleProceedToPayment} 
            />
        </div>
    );
};

export default PackageViewer;