import { useState, useEffect } from 'react';

export default function WarehouseInventory({ onLogout }) {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, 12, 102, 101
  const [searchTerm, setSearchTerm] = useState('');

  // جلب البيانات من الـ API
  useEffect(() => {
    fetchWarehouseData();
  }, []);

  const fetchWarehouseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // بناء الـ URL مع الفلاتر
      let url = 'http://158.220.104.106:3000/api/database/materials-by-stores?limit=10000';
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('فشل في جلب البيانات من الخادم');
      }

      const data = await response.json();

      if (data.success) {
        setWarehouses(data.stores);
      } else {
        throw new Error(data.message || 'حدث خطأ غير متوقع');
      }
    } catch (err) {
      setError(err.message);
      console.error('خطأ في جلب البيانات:', err);
    } finally {
      setLoading(false);
    }
  };

  // تطبيق الفلاتر
  const applyFilters = () => {
    fetchWarehouseData();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
    setTimeout(() => fetchWarehouseData(), 100);
  };

  // الحصول على المستودع النشط حسب التاب
  const getActiveWarehouse = () => {
    if (activeTab === 'all') {
      return warehouses;
    }
    return warehouses.filter(w => w.code === activeTab);
  };

  // الحصول على معلومات التاب
  const getTabInfo = (code) => {
    const warehouse = warehouses.find(w => w.code === code);
    return warehouse || { materials_count: 0, total_quantity: 0 };
  };

  const WarehouseTable = ({ warehouse }) => {
    // تحديد اللون حسب كود المستودع
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
                    <th className="pb-3 pr-4 text-gray-700 font-semibold">اسم المادة</th>
                    <th className="pb-3 pr-4 text-gray-700 font-semibold">الوحدة</th>
                    <th className="pb-3 pl-4 text-gray-700 font-semibold">الكمية</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouse.materials.map((item, index) => (
                    <tr
                      key={item.guid}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 pr-4 text-gray-600 text-sm">{index + 1}</td>
                      <td className="py-3 pr-4 text-gray-800 font-medium">{item.name}</td>
                      <td className="py-3 pr-4 text-gray-600">{item.unity}</td>
                      <td className="py-3 pl-4 text-gray-800 font-bold">
                        {item.total_qty.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan="4" className="py-3 pr-4 text-gray-800">
                      المجموع الكلي
                    </td>
                    <td className="py-3 pl-4 text-gray-800">
                      {warehouse.total_quantity.toFixed(2)}
                    </td>
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

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1"></div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                شركة السعد للصناعات الدوائية
              </h1>
              <p className="text-xl text-gray-600">نظام إدارة المستودعات</p>
            </div>
            <div className="flex-1 flex justify-end">
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  تسجيل الخروج
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">البحث عن المواد</h3>
          <div className="flex gap-4">
            {/* فلتر البحث */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              placeholder="ابحث عن مادة بالاسم أو الكود..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />

            {/* أزرار الفلاتر */}
            <button
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              بحث
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              إعادة تعيين
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {/* تاب الكل */}
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors min-w-max ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div>
                <p className="text-lg">جميع المستودعات</p>
                <p className="text-sm opacity-90 mt-1">
                  {warehouses.reduce((sum, w) => sum + w.materials_count, 0)} مادة
                </p>
              </div>
            </button>

            {/* تاب رصيد الجاهز */}
            <button
              onClick={() => setActiveTab('12')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors min-w-max ${
                activeTab === '12'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div>
                <p className="text-lg">رصيد الجاهز</p>
                <p className="text-sm opacity-90 mt-1">
                  {getTabInfo('12').materials_count} مادة | مستودع 12
                </p>
              </div>
            </button>

            {/* تاب المواد الأولية الفعالة */}
            <button
              onClick={() => setActiveTab('102')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors min-w-max ${
                activeTab === '102'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div>
                <p className="text-lg">المواد الأولية الفعالة</p>
                <p className="text-sm opacity-90 mt-1">
                  {getTabInfo('102').materials_count} مادة | مستودع 102
                </p>
              </div>
            </button>

            {/* تاب المواد الأولية المساعدة */}
            <button
              onClick={() => setActiveTab('101')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors min-w-max ${
                activeTab === '101'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div>
                <p className="text-lg">المواد الأولية المساعدة</p>
                <p className="text-sm opacity-90 mt-1">
                  {getTabInfo('101').materials_count} مادة | مستودع 101
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Statistics Summary for Active Tab */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-indigo-600">
              <p className="text-gray-600 text-sm mb-2">عدد المستودعات</p>
              <p className="text-3xl font-bold text-indigo-600">{warehouses.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-green-600">
              <p className="text-gray-600 text-sm mb-2">إجمالي المواد</p>
              <p className="text-3xl font-bold text-green-600">
                {warehouses.reduce((sum, w) => sum + w.materials_count, 0)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-purple-600">
              <p className="text-gray-600 text-sm mb-2">إجمالي الكميات</p>
              <p className="text-3xl font-bold text-purple-600">
                {warehouses.reduce((sum, w) => sum + w.total_quantity, 0).toLocaleString('ar-SA')}
              </p>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        <div className="space-y-8">
          {activeWarehouses.length > 0 ? (
            activeWarehouses.map((warehouse) => (
              <WarehouseTable key={warehouse.guid} warehouse={warehouse} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <p className="text-xl text-gray-600">لا توجد بيانات لعرضها</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            © {new Date().getFullYear()} شركة السعد للصناعات الدوائية - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}