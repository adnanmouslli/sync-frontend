import { useState, useEffect } from 'react';
import AllMaterials from './AllMaterials';

export default function WarehouseInventory({ onLogout }) {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // API Base URL
  const API_BASE_URL = 'http://158.220.104.106:3000';
  // const API_BASE_URL = 'http://localhost:3000';

  // جلب البيانات من API
  useEffect(() => {
    if (activeTab !== 'all-materials') {
      fetchWarehouseData();
    }
  }, []);

  const fetchWarehouseData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/excel/materials-by-stores`);
      
      if (!response.ok) {
        throw new Error('فشل في جلب البيانات من الخادم');
      }

      const data = await response.json();
      
      if (data.success && data.stores) {
        setWarehouses(data.stores);
      } else {
        setWarehouses([]);
      }

    } catch (err) {
      console.error('خطأ في جلب البيانات:', err);
      setError(err.message || 'حدث خطأ أثناء جلب البيانات');
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = (materials) => {
    if (!searchTerm.trim()) {
      return materials;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return materials.filter(material => {
      const nameMatch = material.name?.toLowerCase().includes(searchLower);
      const codeMatch = material.code?.toLowerCase().includes(searchLower);
      const preparationsMatch = material.preparations?.toLowerCase().includes(searchLower);
      const categoryMatch = material.category?.toLowerCase().includes(searchLower);
      
      return nameMatch || codeMatch || preparationsMatch || categoryMatch;
    });
  };

  const getFilteredWarehouses = () => {
    if (!searchTerm.trim()) {
      return warehouses;
    }

    return warehouses.map(warehouse => {
      const filteredMaterials = filterMaterials(warehouse.materials || []);
      
      return {
        ...warehouse,
        materials: filteredMaterials,
        materials_count: filteredMaterials.length,
        total_quantity: filteredMaterials.reduce((sum, item) => sum + (item.quantity || 0), 0)
      };
    }).filter(warehouse => warehouse.materials_count > 0);
  };

  const resetFilters = () => {
    setSearchTerm('');
  };

  const getActiveWarehouse = () => {
    const filteredWarehouses = getFilteredWarehouses();
    
    if (activeTab === 'all') {
      return filteredWarehouses;
    }
    return filteredWarehouses.filter(w => w.code === activeTab);
  };

  const getTabInfo = (code) => {
    const filteredWarehouses = getFilteredWarehouses();
    const warehouse = filteredWarehouses.find(w => w.code === code);
    return warehouse || { materials_count: 0, total_quantity: 0 };
  };

  // دالة تحديد الوحدة
  const getUnity = (warehouseCode, materialName = '') => {
    if (warehouseCode === '12') {
      return 'قطعة';
    } else if (warehouseCode === '102') {
      return 'Kg';
    } else if (warehouseCode === '101') {
      // شروط خاصة بمستودع المساعد
      if (materialName.includes('Hydrochloric Acid')) {
        return 'ml';
      } else if (materialName.includes('Iron Oxide Red') || materialName.includes('Iron Oxide Yellow')) {
        return 'g';
      } else {
        return 'Kg';
      }
    }
    return '';
  };

  const warehouseConfig = {
    '12': { 
      name: 'رصيد الجاهز', 
      color: 'green',
      gradient: 'from-green-600 to-green-700',
      icon: '📦'
    },
    '102': { 
      name: 'المواد الأولية الفعالة', 
      color: 'blue',
      gradient: 'from-blue-600 to-blue-700',
      icon: '💊'
    },
    '101': { 
      name: 'المواد الأولية المساعدة', 
      color: 'purple',
      gradient: 'from-purple-600 to-purple-700',
      icon: '🧪'
    }
  };

  // Mobile Warehouse Card Component
  const MobileWarehouseCard = ({ warehouse }) => {
    const config = warehouseConfig[warehouse.code];
    const isActiveWarehouse = warehouse.code === '102';

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.gradient} p-4 text-white`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <h3 className="text-lg font-bold">{warehouse.name}</h3>
                <p className="text-xs opacity-90">مستودع {warehouse.code}</p>
              </div>
            </div>
            <div className="text-center bg-white/20 rounded-lg px-3 py-1">
              <p className="text-xs opacity-90">عدد المواد</p>
              <p className="text-xl font-bold">{warehouse.materials_count}</p>
            </div>
          </div>
        </div>

        {/* Materials Table - Mobile with Scroll */}
        <div className="overflow-x-auto">
          {warehouse.materials && warehouse.materials.length > 0 ? (
            <table className="w-full text-right min-w-[600px]">
              <thead className="bg-gray-100">
                <tr className="border-b-2 border-gray-300">
                  <th className="py-2 px-2 text-gray-700 font-semibold text-xs sticky right-0 bg-gray-100">#</th>
                  {isActiveWarehouse && (
                    <th className="py-2 px-2 text-gray-700 font-semibold text-xs">الصنف</th>
                  )}
                  <th className="py-2 px-2 text-gray-700 font-semibold text-xs">اسم المادة</th>
                  <th className="py-2 px-2 text-gray-700 font-semibold text-xs">الكمية</th>
                  <th className="py-2 px-2 text-gray-700 font-semibold text-xs">الوحدة</th>
                  <th className="py-2 px-2 text-gray-700 font-semibold text-xs">المستحضرات</th>
                </tr>
              </thead>
              <tbody>
                {warehouse.materials.map((item, index) => (
                  <tr
                    key={item.code + index}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="py-2 px-2 text-gray-600 text-xs font-semibold sticky right-0 bg-inherit">
                      {index + 1}
                    </td>
                    
                    {/* عمود الصنف - فقط للمواد الفعالة */}
                    {isActiveWarehouse && (
                      <td className="py-2 px-2">
                        {item.category && (
                          <span className={`bg-gradient-to-r ${config.gradient} text-white px-1.5 py-0.5 rounded text-xs font-bold`}>
                            {item.category}
                          </span>
                        )}
                      </td>
                    )}
                    
                    {/* اسم المادة */}
                    <td className="py-2 px-2 text-gray-800 font-medium text-xs">
                      {searchTerm ? (
                        <span dangerouslySetInnerHTML={{
                          __html: item.name.replace(
                            new RegExp(searchTerm, 'gi'),
                            match => `<mark class="bg-yellow-200">${match}</mark>`
                          )
                        }} />
                      ) : (
                        item.name
                      )}
                    </td>
                    
                    {/* الكمية */}
                    <td className="py-2 px-2 text-gray-800 font-bold text-xs">
                      {item.quantity.toFixed(2)}
                    </td>

                    {/* عمود الوحدة */}
                    <td className="py-2 px-2 text-gray-700 text-xs">
                      {getUnity(warehouse.code, item.name)}
                    </td>
                    
                    {/* المستحضرات - عمود منفصل */}
                    <td className="py-2 px-2 text-gray-700 text-xs whitespace-pre-line max-w-[200px]">
                      {item.preparations ? (
                        searchTerm ? (
                          <span dangerouslySetInnerHTML={{
                            __html: item.preparations.replace(
                              new RegExp(searchTerm, 'gi'),
                              match => `<mark class="bg-yellow-200">${match}</mark>`
                            )
                          }} />
                        ) : (
                          item.preparations
                        )
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={isActiveWarehouse ? "3" : "2"} className="py-2 px-2 text-gray-800 text-xs">
                    المجموع الكلي
                  </td>
                  <td className="py-2 px-2 text-gray-800 text-xs">
                    {warehouse.total_quantity.toFixed(2)}
                  </td>
                  <td className="py-2 px-2"></td>
                  <td className="py-2 px-2"></td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-400">
              <p className="text-sm">لا توجد مواد</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Desktop Table Component
  const DesktopWarehouseTable = ({ warehouse }) => {
    const getBgColor = (code) => {
      switch (code) {
        case '12':
          return 'bg-gradient-to-r from-green-600 to-green-700';
        case '102':
          return 'bg-gradient-to-r from-blue-600 to-blue-700';
        case '101':
          return 'bg-gradient-to-r from-purple-600 to-purple-700';
        default:
          return 'bg-gradient-to-r from-gray-600 to-gray-700';
      }
    };

    const bgColor = getBgColor(warehouse.code);
    const isActiveWarehouse = warehouse.code === '102';

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className={`${bgColor} p-6 text-white`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">{warehouse.name}</h2>
              <p className="text-lg opacity-90">رقم المستودع: {warehouse.code}</p>
            </div>
            <div className="text-left">
              <p className="text-sm opacity-90">عدد المواد</p>
              <p className="text-3xl font-bold">{warehouse.materials_count}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {warehouse.materials && warehouse.materials.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="pb-3 pr-4 text-gray-700 font-semibold">#</th>
                    {isActiveWarehouse && (
                      <th className="pb-3 pr-4 text-gray-700 font-semibold">الصنف</th>
                    )}
                    <th className="pb-3 pr-4 text-gray-700 font-semibold">اسم المادة</th>
                    <th className="pb-3 pl-4 text-gray-700 font-semibold">الكمية</th>
                    <th className="pb-3 pl-4 text-gray-700 font-semibold">الوحدة</th>
                    <th className="pb-3 pr-4 text-gray-700 font-semibold">المستحضرات</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouse.materials.map((item, index) => (
                    <tr
                      key={item.code + index}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 pr-4 text-gray-600 text-sm">{index + 1}</td>
                      
                      {/* عمود الصنف - فقط للمواد الفعالة */}
                      {isActiveWarehouse && (
                        <td className="py-3 pr-4">
                          {item.category && (
                            <span className={`bg-gradient-to-r ${bgColor} text-white px-2 py-1 rounded text-xs font-bold`}>
                              {item.category}
                            </span>
                          )}
                        </td>
                      )}
                      
                      {/* اسم المادة */}
                      <td className="py-3 pr-4 text-gray-800 font-medium">
                        {searchTerm ? (
                          <span dangerouslySetInnerHTML={{
                            __html: item.name.replace(
                              new RegExp(searchTerm, 'gi'),
                              match => `<mark class="bg-yellow-200">${match}</mark>`
                            )
                          }} />
                        ) : (
                          item.name
                        )}
                      </td>
                      
                      {/* الكمية */}
                      <td className="py-3 pl-4 text-gray-800 font-bold">
                        {item.quantity.toFixed(2)}
                      </td>

                      {/* عمود الوحدة */}
                      <td className="py-3 pl-4 text-gray-700">
                        {getUnity(warehouse.code, item.name)}
                      </td>
                      
                      {/* المستحضرات - عمود منفصل */}
                      <td className="py-3 pr-4 text-gray-700 whitespace-pre-line">
                        {item.preparations ? (
                          searchTerm ? (
                            <span dangerouslySetInnerHTML={{
                              __html: item.preparations.replace(
                                new RegExp(searchTerm, 'gi'),
                                match => `<mark class="bg-yellow-200">${match}</mark>`
                              )
                            }} />
                          ) : (
                            item.preparations
                          )
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan={isActiveWarehouse ? "3" : "2"} className="py-3 pr-4 text-gray-800">
                      المجموع الكلي
                    </td>
                    <td className="py-3 pl-4 text-gray-800">
                      {warehouse.total_quantity.toFixed(2)}
                    </td>
                    <td className="py-3 pl-4"></td>
                    <td className="py-3 pr-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>لا توجد مواد في هذا المستودع</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && activeTab !== 'all-materials') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error && activeTab !== 'all-materials') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchWarehouseData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const activeWarehouses = getActiveWarehouse();
  const filteredWarehouses = getFilteredWarehouses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-6" dir="rtl">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header - Mobile Optimized */}
        <div className="sticky top-0 z-30 bg-gradient-to-br from-blue-50 to-indigo-100 pt-4 pb-3 sm:pt-6 sm:pb-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo/Title - Compact on Mobile */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">
                السعد للصناعات الدوائية
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">نظام إدارة المستودعات</p>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 text-sm sm:text-base flex-shrink-0"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">تسجيل الخروج</span>
              </button>
            )}
          </div>

          {/* Search Bar - Full Width on Mobile */}
          {activeTab !== 'all-materials' && (
            <div className="mt-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن مادة أو مستحضر..."
                  className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
                {searchTerm && (
                  <button
                    onClick={resetFilters}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base flex-shrink-0"
                  >
                    إلغاء
                  </button>
                )}
              </div>
              {searchTerm && (
                <p className="mt-2 text-xs sm:text-sm text-gray-600">
                  النتائج: <span className="font-bold text-blue-600">
                    {filteredWarehouses.reduce((sum, w) => sum + w.materials_count, 0)} مادة
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Mobile Tabs - Horizontal Scroll */}
          <div className="mt-3 -mx-3 px-3 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2.5 rounded-lg font-semibold transition-all text-sm whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 shadow-md'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  <div className="text-right">
                    <p className="font-bold">الكل</p>
                    <p className="text-xs opacity-90">
                      {filteredWarehouses.reduce((sum, w) => sum + w.materials_count, 0)}
                    </p>
                  </div>
                </div>
              </button>

              {Object.entries(warehouseConfig).map(([code, config]) => (
                <button
                  key={code}
                  onClick={() => setActiveTab(code)}
                  className={`px-4 py-2.5 rounded-lg font-semibold transition-all text-sm whitespace-nowrap ${
                    activeTab === code
                      ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg scale-105`
                      : 'bg-white text-gray-700 shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{config.icon}</span>
                    <div className="text-right">
                      <p className="font-bold">{config.name}</p>
                      <p className="text-xs opacity-90">
                        {getTabInfo(code).materials_count}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          {activeTab === 'all-materials' ? (
            <AllMaterials />
          ) : (
            <>
              {/* Statistics Cards - Mobile Grid */}
              {activeTab === 'all' && (
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                  <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center border-t-4 border-indigo-600">
                    <p className="text-gray-600 text-xs mb-1">المستودعات</p>
                    <p className="text-xl sm:text-2xl font-bold text-indigo-600">{filteredWarehouses.length}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center border-t-4 border-green-600">
                    <p className="text-gray-600 text-xs mb-1">المواد</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                      {filteredWarehouses.reduce((sum, w) => sum + w.materials_count, 0)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center border-t-4 border-purple-600">
                    <p className="text-gray-600 text-xs mb-1">الكميات</p>
                    <p className="text-xl sm:text-2xl font-bold text-purple-600">
                      {filteredWarehouses.reduce((sum, w) => sum + w.total_quantity, 0).toLocaleString('ar-SA', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              )}

              {/* Warehouse Content - Responsive */}
              {activeWarehouses.length > 0 ? (
                <div>
                  {/* Mobile View */}
                  <div className="block lg:hidden">
                    {activeWarehouses.map((warehouse, idx) => (
                      <MobileWarehouseCard key={warehouse.code + idx} warehouse={warehouse} />
                    ))}
                  </div>

                  {/* Desktop View */}
                  <div className="hidden lg:block">
                    {activeWarehouses.map((warehouse, idx) => (
                      <DesktopWarehouseTable key={warehouse.code + idx} warehouse={warehouse} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12 text-center">
                  <div className="text-gray-400 text-5xl sm:text-6xl mb-4">
                    {searchTerm ? '🔍' : '📦'}
                  </div>
                  <p className="text-lg sm:text-xl text-gray-600">
                    {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد بيانات لعرضها'}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    {searchTerm ? 'جرب كلمات بحث مختلفة' : 'الرجاء رفع ملفات Excel أولاً'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 space-y-2 pb-4">
          <p className="text-xs sm:text-sm">
            © {new Date().getFullYear()} شركة السعد للصناعات الدوائية - جميع الحقوق محفوظة
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}