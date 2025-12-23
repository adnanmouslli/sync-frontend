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

  const filterMaterials = (materials) => {
    if (!searchTerm.trim()) {
      return materials;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return materials.filter(material => {
      const nameMatch = material.name?.toLowerCase().includes(searchLower);
      const codeMatch = material.code?.toLowerCase().includes(searchLower);
      return nameMatch || codeMatch;
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

        {/* Materials List */}
        <div className="divide-y divide-gray-100">
          {warehouse.materials && warehouse.materials.length > 0 ? (
            warehouse.materials.map((item, index) => (
              <div key={item.code + index} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-gray-500 mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
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
                        </p>
                        {isActiveWarehouse && (
                          <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">
                            {getPreparation(item.name)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-left">
                    <div className={`bg-gradient-to-r ${config.gradient} text-white px-2 py-1 rounded-md`}>
                      <p className="text-xs font-medium">{item.quantity.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400">
              <p className="text-sm">لا توجد مواد</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {warehouse.materials && warehouse.materials.length > 0 && (
          <div className={`bg-gradient-to-r ${config.gradient} p-3 text-white`}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">المجموع الكلي</span>
              <span className="text-lg font-bold">{warehouse.total_quantity.toFixed(2)}</span>
            </div>
          </div>
        )}
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
                    <th className="pb-3 pr-4 text-gray-700 font-semibold">اسم المادة</th>
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
                    <td colSpan={isActiveWarehouse ? "2" : "2"} className="py-3 pr-4 text-gray-800">
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
                  placeholder="ابحث عن مادة..."
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
          <p className="text-xs sm:text-sm">
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