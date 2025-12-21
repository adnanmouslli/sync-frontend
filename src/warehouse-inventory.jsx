import { useState, useEffect } from 'react';
import AllMaterials from './AllMaterials';

export default function WarehouseInventory({ onLogout }) {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // حالة رفع الملفات
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // API Base URL
  const API_BASE_URL = 'http://158.220.104.106:3000';
  // const API_BASE_URL = 'http://localhost:3000';

  // Mapping المواد إلى المستحضرات
  const materialsToPreparations = {
    'Acetyl Salicylic Acid Crystals': 'S-PRIN (81 - 100)\nCLOPID PULS (75 - 150)',
    'Acyclovir': 'مقدم ترخيص',
    'Adefovir Dipoxivel': 'HEPSOVER',
    'Adrenaline Tartrate': 'Adrenaline Elssad - Amb',
    'Alfuzosin Hydrochlride': 'ALFUZOSINE (2.5 - 5)',
    'Amikacin Sulphate': 'KAMICIN - AMP',
    'Amiloride Hydrochloride': 'FRUMILINE 5mg',
    'Amiodaron Hydrochloride': 'AMIODARONE-ELSAAD',
    'Amlodipine Besylate': 'MICARD ROXI EXTRA\nNORVEK',
    'Balsalazide Disodium': 'BALCOZIDE - CAP',
    'Beclomethasone Dipropionate': 'BECOZOL - CREAM',
    'Miconazole Nitrare': 'BECOZOL - CREAM',
    'Neomycine Sulfate': 'BECOZOL - CREAM',
    'Bismuth Potassium Citrate': 'Bismol - tablet',
    'Benzydamin Hydrochloride': 'DE-FLAM-ORL RISE',
    'Betamethasne Dipropionate': 'DIPROMET - CREAM',
    'Betamethasone Sodium Phosphate': 'DIPROMET - AMPOUL',
    'Carbocysteine': 'MUCOLAR CAPSULE\nMUCOLAR SYRUP (100 - 250)',
    'Chlophenamine Maleate': 'FLU-REST - CAPSULE',
    'Vitamin C-- Ascorbic Acid': 'FLU-REST - CAPSULE',
    'Paracetamol - powder': 'NEW CETAMOL - TABLETS\nFLU-REST - CAPSUL\nPARFLAM - SUSP - PARACETAMOL( L . V )',
    'Cimetidine Base': 'CIMETINE-AMP',
    'Ciprofloxacin Hydrochloride': 'CEPROZ - 500 & 750',
    'Clindamycine Phosphate': 'CLINDO - (CREAM & GEL) + AMP',
    'Clindamycin Hydrochloride': 'CLINDO - CAPSULES',
    'Clobutinol Hydrochloride': 'SILCOF - SYRUP',
    'Clopidogrel Bisulphate': 'CLOPID\nCLOPID PULS',
    'Dapagliflozin Propanadiol Monohydrate': 'DAPAXIN (5 - 10)',
    'Dexpathenol - VIT B5 GEL': 'ELSACARE - CREAM',
    'Diclofenac Diethylamine': 'DICLOFENAC EMUL GEL',
    'Diclofenac Sodium': 'DICLOFENAC E 50 ECT & 100 XR - AMP',
    'Dobutamine Hydrochloride': 'DOBUTAMINE ELSAAD - AMP',
    'Dopamine Hydrochloride': 'DOPAMINE ELSAAD (50 - 200) - AMP',
    'Drotaverine Hydrochloride': 'DROTAVERINE ( AMP + TABLETS)',
    'Eplerenone': 'SPRANONE (25 - 50)',
    'Famotidine': 'FAMOX COMPLET',
    'Flavoxate Hydrochloride': 'URITAC TAB',
    'Fluconazole - powder': 'FLUKNAZOL ( CAPSUL (50 - 200) +DRY POWDER)',
    'Frusemide': 'FRUMEX\nFRUMILLNE',
    'Flunarizine HCL': 'NARIZINE 5',
    'Glyburide': 'GLUVANS (2 - 3)',
    'Metformine Hydrochloride': 'GLUVANS (2 - 3)\nMETFOEMINE (500-850-1000)',
    'Glyclazide': 'GLYCON (80 - 30 XR)',
    'Haloperidol': 'HALOPERIDOL AMP',
    'Hydrochlorothiazide': 'MICARD ROXI PLUS (40 - 80)\nVALSAMAK PLUS (80 - 160)\nCO - RAMIPRIL ELSAAD - CAPSULE\nLOSARTAN PLUS',
    'Hydroxyzine Hydrochloride': 'MULTRAXIN - SYRUP',
    'Ibubrofen Micronized': 'POFFEN - 100 - SYRUP\nPARAFLAM - SUSP',
    'Ibubrofen Powder': 'POFEN (400 - 600) TABLETS',
    'Ivabradine Hydrochlorid': 'CONIPAN (5 - 7.5)',
    'Iron Hyroxide Polymaltose Tablete Grade': 'MIGHTY FER -TABLETS',
    'Iron Hyroxide Polymaltose Syrup': 'MIGHTY FER -SYRUP',
    'Lamivudine': 'LAMIFIX ( TABLETS + SYRUP)',
    'Lidocaine Hydrochloride': 'LIDOCAINE - (AMP + LV)\nPROCTO-SID-CREAM',
    'Linezolid': 'LIZOLID (AMP + TABLETS)',
    'Loratadine': 'DE-HISTAMINE (TABLETS + SYRUP)',
    'Losartan Potassium': 'LOSARTAN (25 - 50 -  100)\nLOSARTAN PLUS',
    'Levofloxacin': 'VENO-TAVOX (500 - 750)',
    'Mebeverine Hydrochloride': 'DE-SPASM TABLETS',
    'Meclizine Hydrochloride': 'MECLOVERT (50 - 12.5)\nNAVIFEMM',
    'Menthol Crystal': 'BENGO CREAM',
    'Methyl Salicylate': 'BENGO CREAM',
    'Methylodopa': 'HYPOJET (125 - 250)',
    'Metoprolo Succinate Er Micro Pellets 60%': 'MOPROL (25 - 50 - 100 -200)',
    'Metronidazole': 'STATIZOL (LV + TABLETS (250 - 500)',
    'Metronidazole Benzoate': 'STATIZOL SUSP',
    'Mometasone Furoate': 'OLMISONE - CREAM',
    'Moxifloxacin Hydrochloride': 'ELSALOX -  TABLETS',
    'Nateglinide': 'STARNID 120',
    'Neostigmine Methyl Sulphate Sterile': 'INTESTIGMIN 2.5',
    'Niacinamide - VIT B5': 'CIMETINE-AMP',
    'Noradrenaline Bitartarate': 'Noradrenaline Elssad - Amb',
    'Norfloxacin': 'URIFLOX',
    'Ondansetron Hydrochloride Sterile (FOR INJECTION)': 'DE-VOMIT - (SYRUP+AMP)',
    'Ondansetron Hydrochloride Powder': 'DE-VOMIT - TABLETS',
    'Oseltamivir Phosphate': 'TE - FLU ( CAPS - DRY POWDER',
    'Pamaprom': 'PARABOM - TABLETS',
    'Pantoprazole Sodium': 'PROTOM 40',
    'Pefloxacin Mesylate Dihydrate': 'PEMEFLOX 400 - AMP',
    'Phenytoin Sodium': 'PHENYTOIN - AMP',
    'Piroxicam': 'ROKAM (AMP + CAPSUL (10 - 20) )',
    'Prasugrel Hydrochloride': 'SORFENT( 5 - 10 ) TABLETS',
    'Prednisolone Base': 'PREDLONE (5 - 20 - 50) - TABLETS',
    'Prednisolone Sodium Phosphate': 'PREDLONE - SYRUP + AMPOUL',
    'Pyridoxine Hydrochloride VIT B6': 'NAVIFEMM',
    'Ramipril': 'RAMIPRIL ELSAAD - CAPSUL',
    'Ranitidine Bismuth Substrate': 'PYLOTAC',
    'Rivaroxaban': 'REVADAY (2.5 - 10 - 15 - 20)',
    'Rosuvatatin Calcium': 'ROSUVASTATIN',
    'Salbutamol Sulphate': 'PULMO-NEB (2 - 4) TABLETS',
    'Telmisartan': 'MICARD ROXI (40 - 80)\nMICARD ROXI PLUS (40 - 80)\nMICARD ROXI EXTRA (5/40 - 5/80 - 10/40 - 10/80)',
    'Terbinafine Hydrochloride': 'TERBINA (CREAM + TABLETS)',
    'Tizanidine Hydrochloride': 'DE-PAIN (2 - 4)',
    'Tolterodine Tartrate': 'DETROTAC (1 - 2)',
    'Trazodone Hydrochloride': 'DEPRICO (50 - 150)',
    'Tribenoside': 'PROCTO-SID',
    'Triprolidine Hydrochloride': 'ACT-SMART (TABLETS + SYRUP)',
    'Valsartan': 'VALSAMAK PLUS (80 - 160)\nVALSAMAK EXTRA (80 - 160)\nVALSAMAK (80 - 160)',
    'Vardenafil Hydrochloride': 'TIGER MAN',
    'Verapamil Hydrochloride': 'VERACARD (AMP - TABLETS',
    'Vinopoctine': 'CAVANTINE (5 mg TABLETS)',
    'Amoxicillin 3H2O Compacted': 'CLAVOXIL - TABLETS',
    'Clavulanat Potassium + Avesil / M.C.C': 'CLAVOXIL - TABLETS',
    'Amoxicillin Sodium + Potassium Clavulanat (7:1)': 'CLAVOXIL - TABLETS',
    'Amoxicillin 3H2O Powder': 'CLAVOXIL - DRY POWDER',
    'Amoxicillin Sodium + Potassium Clavulanat (4:1)': 'CLAVOXIL - DRY POWDER',
    'Clavulanat Potassium With Silicon Dioxide': 'CLAVOXIL - DRY POWDER',
    'Amoxicillin Sodium + Potassium Clavulanat Sterile 5:1': 'CLAVOXIL - VIAL',
    'Amoxicillin Sodium Sterile': 'PANAMOXY - VIAL',
    'Ampicillin 3H2O Compacted': 'LACTOXAM - CAPSULE',
    'Ampicillin 3H2O Micronized': 'LACTOXAM - DRY POWDER',
    'Ampicillin 3H2O Powder': 'LACTOXAM - DRY POWDER',
    'Cloxacillin Sodium Powder': 'LACTOXAM - DRY POWDER',
    'Cloxacillin Sodium Compacted': 'LACTOXAM - CAPSULE',
    'Ampicillin Sodium Sterile': 'AMPI - VIAL',
    'Ampicillin Sodium + Sulbactam Sudium Sterile 2:1': 'AMPICTAM - VIAL',
    'Benzathine Benzyl Penicillin Sterile': 'LONGERPEN - VIAL',
    'Cloxacillin Sodium Sterile': 'MAXIM - VIAL',
    'Piperacillin Sodium + Tazobactam Sodium Sterile': 'TAZO - PLUS - VIAL',
    'Vancomycin Hydrochloride': 'VANCOMYCIN - CAPSULE +VIAL',
    'Cefixime Powder': 'CEFIXIME - ELSAAD -DRY POWDER',
    'Cefixime Micronised': 'CEFIXIME - ELSAAD -DRY POWDER',
    'Cefixime Compacted': 'CEFIXIME - ELSAAD -TABLETS',
    'Cefepime For Injection': 'CEFIPIME',
    'Cefadroxil Monohydrate Powder': 'CEDROX ( CAPSULE + DRY POWER)',
    'Ceftazidime Sterile': 'CEFTADIME -VIAL',
    'Cefuroxime Axetil Powder': 'Cefurox dry powder',
    'Cefuroxime Axetil Compacted': 'CEFUROX - TABLETS',
    'Cefpirome Sulphate Buffered Sterile': 'PIROM - VIAL',
    'Cefteriaxone Sodium + Sulbactam Sodium Sterile': 'ROSACTAM - VIAL',
    'Cefaclor Monohydrate Powder': 'OMNICLOR ( CAPSULE + DRY POWER)',
    'Cefpodoxime Proxetil Powder': 'ORACEF - DRY POWDER',
    'Cefpodoxime Proxetil Compacted': 'ORACEF - TABLETS',
    'Cefteriaxone Sodium Sterile': 'ROSS - VIAL',
    'Cefotaxime Sodium Sterile': '3 - CEF - VIAL',
    'Caffeine': 'NEW CETAMOL',
    'Clorazepate Dipotassium': 'TRANQUIL (5 - 10) - CAPSULES',
    'Diazepam': 'ALSAVAL (AMP + TABLETS)',
    'Ketamine Hydrochlorid': 'KETAMINE (AMP + LV)',
    'Lamotrigine': 'LAMETRE',
    'Midazolam': 'DORMITA (TABLETS + AMP)',
    'Pregabalin': 'GABALYR (25 - 50 - 75 - 100 - 150 - 200 - 300)',
    'Tramadol Hydrochloride': 'TRAMADOL ( AMP + TABLETS)'
  };

  const getPreparation = (materialName) => {
    return materialsToPreparations[materialName] || '-';
  };

  useEffect(() => {
    if (activeTab !== 'all-materials') {
      fetchWarehouseData();
    }
  }, [activeTab]);

  const fetchWarehouseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // جلب جميع البيانات بدون فلتر البحث (سيتم الفلترة في الفرونت)
      let url = `${API_BASE_URL}/api/excel/materials-by-stores`;

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

  // دالة رفع الملفات
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) {
      alert('الرجاء اختيار ملفات للرفع');
      return;
    }

    setUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/excel/upload-reports`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setUploadSuccess(true);
        setSelectedFiles([]);
        // إعادة تحميل البيانات بعد الرفع
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadSuccess(false);
          if (activeTab !== 'all-materials') {
            fetchWarehouseData();
          }
        }, 2000);
      } else {
        throw new Error(data.message || 'فشل رفع الملفات');
      }
    } catch (err) {
      alert('خطأ في رفع الملفات: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // دالة الفلترة المحلية
  const filterMaterials = (materials) => {
    if (!searchTerm.trim()) {
      return materials;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return materials.filter(material => {
      // البحث في اسم المادة
      const nameMatch = material.name?.toLowerCase().includes(searchLower);
      
      // البحث في الكود (إذا كان موجوداً)
      const codeMatch = material.code?.toLowerCase().includes(searchLower);
      
      // البحث في الوحدة (إذا كانت موجودة)
      const unityMatch = material.unity?.toLowerCase().includes(searchLower);
      
      return nameMatch || codeMatch || unityMatch;
    });
  };

  // دالة للحصول على المستودعات المفلترة
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
    }).filter(warehouse => warehouse.materials_count > 0); // إزالة المستودعات التي لا تحتوي على نتائج
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

  const WarehouseTable = ({ warehouse }) => {
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
              {warehouse.source_file && (
                <p className="text-sm opacity-75 mt-1">المصدر: {warehouse.source_file}</p>
              )}
            </div>
            <div className="text-left">
              <p className="text-sm opacity-90">عدد المواد</p>
              <p className="text-3xl font-bold">{warehouse.materials_count}</p>
              {searchTerm && (
                <p className="text-xs opacity-75 mt-1">(نتائج البحث)</p>
              )}
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
                    {!isActiveWarehouse && (
                      <th className="pb-3 pr-4 text-gray-700 font-semibold">الوحدة</th>
                    )}
                    <th className="pb-3 pl-4 text-gray-700 font-semibold">الكمية</th>
                    {isActiveWarehouse && (
                      <th className="pb-3 pr-4 text-gray-700 font-semibold">المستحضرات</th>
                    )}
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
                      {!isActiveWarehouse && (
                        <td className="py-3 pr-4 text-gray-600">{item.unity}</td>
                      )}
                      <td className="py-3 pl-4 text-gray-800 font-bold">
                        {item.quantity.toFixed(2)}
                      </td>
                      {isActiveWarehouse && (
                        <td className="py-3 pr-4 text-gray-700 whitespace-pre-line">
                          {getPreparation(item.name)}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan={isActiveWarehouse ? "2" : "3"} className="py-3 pr-4 text-gray-800">
                      المجموع الكلي
                    </td>
                    <td className="py-3 pl-4 text-gray-800">
                      {warehouse.total_quantity.toFixed(2)}
                    </td>
                    {isActiveWarehouse && (
                      <td className="py-3 pr-4"></td>
                    )}
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
  const filteredWarehouses = getFilteredWarehouses();

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
            <div className="flex-1 flex justify-end gap-3">
              {/* زر رفع الملفات */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                رفع ملفات Excel
              </button>

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

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowUploadModal(false)}>
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">رفع ملفات Excel</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  اختر ملفات Excel (يمكنك اختيار عدة ملفات)
                </label>
                <input
                  type="file"
                  multiple
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-700 font-semibold mb-2">الملفات المحددة:</p>
                  <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {uploadSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-800 font-semibold">تم رفع الملفات بنجاح!</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleUploadFiles}
                  disabled={uploading || selectedFiles.length === 0}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    uploading || selectedFiles.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      جاري الرفع...
                    </span>
                  ) : (
                    'رفع الملفات'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                    setUploadSuccess(false);
                  }}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        {activeTab !== 'all-materials' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">البحث عن المواد</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن مادة بالاسم أو الكود أو الوحدة..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <button
                onClick={resetFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                إعادة تعيين
              </button>
            </div>
            {searchTerm && (
              <p className="mt-3 text-sm text-gray-600">
                عدد النتائج: <span className="font-bold text-blue-600">
                  {filteredWarehouses.reduce((sum, w) => sum + w.materials_count, 0)} مادة
                </span>
              </p>
            )}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            
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
                  {filteredWarehouses.reduce((sum, w) => sum + w.materials_count, 0)} مادة
                </p>
              </div>
            </button>

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

        {/* Content based on active tab */}
        {activeTab === 'all-materials' ? (
          <AllMaterials />
        ) : (
          <>
            {activeTab === 'all' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-indigo-600">
                  <p className="text-gray-600 text-sm mb-2">عدد المستودعات</p>
                  <p className="text-3xl font-bold text-indigo-600">{filteredWarehouses.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-green-600">
                  <p className="text-gray-600 text-sm mb-2">إجمالي المواد</p>
                  <p className="text-3xl font-bold text-green-600">
                    {filteredWarehouses.reduce((sum, w) => sum + w.materials_count, 0)}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-purple-600">
                  <p className="text-gray-600 text-sm mb-2">إجمالي الكميات</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {filteredWarehouses.reduce((sum, w) => sum + w.total_quantity, 0).toLocaleString('ar-SA')}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {activeWarehouses.length > 0 ? (
                activeWarehouses.map((warehouse, idx) => (
                  <WarehouseTable key={warehouse.code + idx} warehouse={warehouse} />
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                  <div className="text-gray-400 text-6xl mb-4">
                    {searchTerm ? '🔍' : '📦'}
                  </div>
                  <p className="text-xl text-gray-600">
                    {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد بيانات لعرضها'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {searchTerm ? 'جرب كلمات بحث مختلفة' : 'الرجاء رفع ملفات Excel أولاً'}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 space-y-2">
          <p className="text-sm">
            © {new Date().getFullYear()} شركة السعد للصناعات الدوائية - جميع الحقوق محفوظة
          </p>
          <p className="text-sm">
            الدعم التقني: <span className="font-bold">عمر البيك</span> |{" "}
            <a
              href="https://wa.me/963936292813"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline font-medium"
            >
              0936292813
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}