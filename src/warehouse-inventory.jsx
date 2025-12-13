import React from 'react';

export default function WarehouseInventory() {
  // بيانات وهمية للمستودعات
  const finishedGoodsInventory = [
    { id: 1, name: 'باراسيتامول 500 ملغ', quantity: 15000 },
    { id: 2, name: 'أموكسيسيلين 500 ملغ', quantity: 8500 },
    { id: 3, name: 'أومبرازول 20 ملغ', quantity: 12000 },
    { id: 4, name: 'ميتفورمين 850 ملغ', quantity: 6200 },
    { id: 5, name: 'أتورفاستاتين 20 ملغ', quantity: 9800 },
  ];

  const activeIngredients = [
    { id: 1, name: 'باراسيتامول (مادة فعالة)', quantity: 2500 },
    { id: 2, name: 'أموكسيسيلين ثلاثي الهيدرات', quantity: 1800 },
    { id: 3, name: 'أومبرازول (قاعدة)', quantity: 950 },
    { id: 4, name: 'ميتفورمين هيدروكلوريد', quantity: 3200 },
    { id: 5, name: 'أتورفاستاتين كالسيوم', quantity: 1500 },
  ];

  const excipients = [
    { id: 1, name: 'نشاء الذرة', quantity: 5000 },
    { id: 2, name: 'لاكتوز أحادي الهيدرات', quantity: 8500 },
    { id: 3, name: 'ستيرات المغنيزيوم', quantity: 1200 },
    { id: 4, name: 'بوفيدون K30', quantity: 2800 },
    { id: 5, name: 'كروسكارميلوز الصوديوم', quantity: 1900 },
    { id: 6, name: 'ثاني أكسيد السيليكون الغروي', quantity: 850 },
  ];

  const WarehouseCard = ({ title, warehouseNumber, items, bgColor }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className={`${bgColor} p-6 text-white`}>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-lg opacity-90">رقم المستودع: {warehouseNumber}</p>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="pb-3 pr-4 text-gray-700 font-semibold">اسم المادة</th>
                <th className="pb-3 pl-4 text-gray-700 font-semibold">الكمية (كغ)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <td className="py-3 pr-4 text-gray-800">{item.name}</td>
                  <td className="py-3 pl-4 text-gray-600 font-medium">
                    {item.quantity.toLocaleString('ar-SA')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td className="py-3 pr-4 text-gray-800">المجموع</td>
                <td className="py-3 pl-4 text-gray-800">
                  {items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString('ar-SA')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            شركة السعد للصناعات الدوائية
          </h1>
          <p className="text-xl text-gray-600">نظام إدارة المستودعات</p>
          <div className="mt-4 inline-block bg-white px-6 py-2 rounded-full shadow-md">
            <span className="text-gray-600">التاريخ: </span>
            <span className="font-semibold text-gray-800">
              {new Date().toLocaleDateString('ar-SA')}
            </span>
          </div>
        </div>

        {/* Warehouse Cards */}
        <div className="space-y-8">
          <WarehouseCard
            title="رصيد الجاهز"
            warehouseNumber="12"
            items={finishedGoodsInventory}
            bgColor="bg-gradient-to-r from-green-600 to-green-700"
          />

          <WarehouseCard
            title="المواد الأولية الفعالة"
            warehouseNumber="102"
            items={activeIngredients}
            bgColor="bg-gradient-to-r from-blue-600 to-blue-700"
          />

          <WarehouseCard
            title="المواد الأولية المساعدة"
            warehouseNumber="101"
            items={excipients}
            bgColor="bg-gradient-to-r from-purple-600 to-purple-700"
          />
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