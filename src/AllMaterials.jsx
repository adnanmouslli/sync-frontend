import { useState, useEffect } from 'react';

const AllMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [pagination, setPagination] = useState(null);

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

  // دالة للحصول على المستحضر من اسم المادة
  const getPreparation = (materialName) => {
    return materialsToPreparations[materialName] || '-';
  };

  // Fetch Materials
  const fetchMaterials = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // بناء الـ URL مع البارامترات
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortBy,
        sortOrder: sortOrder
      });
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      
      const url = `http://158.220.104.106:3000/api/database/materials?${params.toString()}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('فشل في جلب البيانات من الخادم');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMaterials(data.materials);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'فشل في جلب البيانات');
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ في الاتصال بالخادم');
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchMaterials();
  }, [currentPage, itemsPerPage, sortBy, sortOrder]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page
    fetchMaterials();
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination?.total_pages) {
      setCurrentPage(newPage);
    }
  };

  // Handle sort change
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Render pagination buttons
  const renderPagination = () => {
    if (!pagination) return null;

    const { current_page, total_pages, has_previous, has_next } = pagination;
    const pages = [];
    
    // Calculate page range
    let startPage = Math.max(1, current_page - 2);
    let endPage = Math.min(total_pages, current_page + 2);
    
    // Add first page
    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageChange(1)} className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="px-2 text-gray-500">...</span>);
      }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 border rounded-md transition-colors ${
            i === current_page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Add last page
    if (endPage < total_pages) {
      if (endPage < total_pages - 1) {
        pages.push(<span key="dots2" className="px-2 text-gray-500">...</span>);
      }
      pages.push(
        <button key={total_pages} onClick={() => handlePageChange(total_pages)} className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          {total_pages}
        </button>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => handlePageChange(current_page - 1)}
          disabled={!has_previous}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          السابق
        </button>
        
        <div className="flex gap-2 flex-wrap justify-center">
          {pages}
        </div>
        
        <button
          onClick={() => handlePageChange(current_page + 1)}
          disabled={!has_next}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          التالي
        </button>
        
        <div className="w-full text-center text-gray-600 text-sm mt-2">
          صفحة {current_page} من {total_pages} - إجمالي المواد: {pagination.total_items}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="ابحث عن مادة (الاسم، الكود، الباركود)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              بحث
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                  setTimeout(fetchMaterials, 100);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                مسح
              </button>
            )}
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-gray-700 font-medium">عدد النتائج:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={1000}>1000</option>
                <option value={2000}>2000</option>
                <option value={3000}>3000</option>
                <option value={4000}>4000</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-gray-700 font-medium">الترتيب حسب:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">الاسم</option>
                <option value="code">الكود</option>
                <option value="qty">الكمية</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-gray-700 font-medium">الاتجاه:</label>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="asc">تصاعدي</option>
                <option value="desc">تنازلي</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">جاري التحميل...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={fetchMaterials} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Materials Table */}
      {!loading && !error && materials.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    <th 
                      onClick={() => handleSort('name')} 
                      className="px-4 py-4 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      اسم المادة {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      onClick={() => handleSort('qty')} 
                      className="px-4 py-4 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      الكمية {sortBy === 'qty' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-4">المستحضرات</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material, index) => (
                    <tr 
                      key={material.guid}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-800 font-medium">{material.name}</td>
                      <td className="px-4 py-3 font-bold text-green-600">{material.quantity.toFixed(3)}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-pre-line">
                        {getPreparation(material.name)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {renderPagination()}
        </>
      )}

      {/* Empty State */}
      {!loading && !error && materials.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <p className="text-xl text-gray-600">لا توجد مواد تطابق معايير البحث</p>
        </div>
      )}
    </div>
  );
};

export default AllMaterials;