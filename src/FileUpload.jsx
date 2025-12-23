import { useState } from 'react';

export default function FileUpload({ onLogout }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // API Base URL
  const API_BASE_URL = 'http://158.220.104.106:3000';
  // const API_BASE_URL = 'http://localhost:3000';

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setUploadSuccess(false);
    setUploadMessage('');
  };

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) {
      setUploadMessage('الرجاء اختيار ملفات للرفع');
      return;
    }

    setUploading(true);
    setUploadSuccess(false);
    setUploadMessage('');

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
        setUploadMessage('تم رفع الملفات بنجاح!');
        setSelectedFiles([]);
        // إعادة تعيين input الملفات
        document.getElementById('file-input').value = '';
      } else {
        throw new Error(data.message || 'فشل رفع الملفات');
      }
    } catch (err) {
      setUploadSuccess(false);
      setUploadMessage('خطأ في رفع الملفات: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setUploadSuccess(false);
    setUploadMessage('');
    document.getElementById('file-input').value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1"></div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                شركة السعد للصناعات الدوائية
              </h1>
              <p className="text-xl text-gray-600">رفع ملفات Excel لتحديث المخزون</p>
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

        {/* Main Upload Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">رفع ملفات Excel</h2>
              <p className="text-gray-600 mt-1">قم برفع ملفات Excel لتحديث كميات المخزون</p>
            </div>
          </div>

          {/* File Input Area */}
          <div className="mb-6">
            <label
              htmlFor="file-input"
              className="block w-full border-4 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <div className="flex flex-col items-center gap-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    اضغط هنا لاختيار الملفات
                  </p>
                  <p className="text-sm text-gray-500">
                    يمكنك اختيار ملف واحد أو عدة ملفات Excel (.xlsx, .xls)
                  </p>
                </div>
              </div>
              <input
                id="file-input"
                type="file"
                multiple
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-lg font-semibold text-gray-800">
                  الملفات المحددة ({selectedFiles.length})
                </p>
                <button
                  onClick={handleClearAll}
                  className="text-red-600 hover:text-red-700 text-sm font-semibold transition-colors"
                >
                  مسح الكل
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 max-h-96 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <svg className="w-8 h-8 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-medium truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 p-2 transition-colors flex-shrink-0"
                      title="إزالة الملف"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUploadFiles}
            disabled={uploading || selectedFiles.length === 0}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform ${
              uploading || selectedFiles.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                جاري رفع الملفات...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                رفع الملفات
              </span>
            )}
          </button>

          {/* Status Messages */}
          {uploadMessage && (
            <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
              uploadSuccess
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {uploadSuccess ? (
                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className={`font-semibold ${uploadSuccess ? 'text-green-800' : 'text-red-800'}`}>
                {uploadMessage}
              </p>
            </div>
          )}
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            تعليمات الاستخدام
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">1.</span>
              <span>اختر ملف Excel أو عدة ملفات تحتوي على بيانات المخزون</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">2.</span>
              <span>تأكد من أن الملفات بصيغة .xlsx أو .xls</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">3.</span>
              <span>اضغط على زر "رفع الملفات" لبدء عملية الرفع</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">4.</span>
              <span>انتظر حتى يتم رفع الملفات ومعالجتها بنجاح</span>
            </li>
          </ul>
        </div>

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
