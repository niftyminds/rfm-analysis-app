'use client';

import { useMemo, useState, useEffect } from 'react';
import { RefreshCw, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import Papa from 'papaparse';
import { Customer, Stats, AdvancedFilters } from '@/types';
import SegmentChart from './SegmentChart';
import CustomerTable from './CustomerTable';
import FilterPanel from './FilterPanel';
import ExportModal from './ExportModal';
import ExportSuccessModal from './ExportSuccessModal';
import BatchProgressModal from './BatchProgressModal';
import CLVDistributionChart from './CLVDistributionChart';
import CLVTrendChart from './CLVTrendChart';
import TopCLVCustomers from './TopCLVCustomers';

interface DashboardProps {
  customers: Customer[];
  onReset: () => void;
}

const DEFAULT_FILTERS: AdvancedFilters = {
  rfmScoreMin: 3,
  rfmScoreMax: 15,
  valueMin: 0,
  valueMax: Infinity,
  orderCountMin: 0,
  orderCountMax: Infinity,
  dateFrom: null,
  dateTo: null
};

export default function Dashboard({ customers, onReset }: DashboardProps) {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(DEFAULT_FILTERS);
  const [isExportingToSheets, setIsExportingToSheets] = useState(false);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [savedEmail, setSavedEmail] = useState<string>(''); // Manuálně zadaný email z localStorage
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'sheets'>('csv');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
  const [processingPhase, setProcessingPhase] = useState('');
  const [showBatchProgressModal, setShowBatchProgressModal] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const stats: Stats = useMemo(() => {
    const segments: Record<string, number> = {};
    const clvSegments: Record<string, number> = {};

    customers.forEach(c => {
      segments[c.segment] = (segments[c.segment] || 0) + 1;
      clvSegments[c.clvSegment] = (clvSegments[c.clvSegment] || 0) + 1;
    });

    const totalCLV = customers.reduce((sum, c) => sum + c.lifetimeCLV, 0);
    const totalPredicted = customers.reduce((sum, c) => sum + c.predictedCLV, 0);
    const totalChurn = customers.reduce((sum, c) => sum + c.churnProbability, 0);

    return {
      total: customers.length,
      totalValue: customers.reduce((sum, c) => sum + c.totalValue, 0),
      avgOrders: customers.reduce((sum, c) => sum + c.orderCount, 0) / customers.length,
      avgValue: customers.reduce((sum, c) => sum + c.totalValue, 0) / customers.length,
      avgRecency: customers.reduce((sum, c) => sum + c.recency, 0) / customers.length,
      segments,

      // CLV Stats
      avgCLV: totalCLV / customers.length,
      totalPredictedCLV: totalPredicted,
      avgChurnProbability: totalChurn / customers.length,
      highValueCustomers: clvSegments['High Value'] || 0,
      clvSegments
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // Segment filter
      if (selectedSegments.length > 0 && !selectedSegments.includes(c.segment)) {
        return false;
      }

      // RFM score filter
      if (c.RFM_Total < advancedFilters.rfmScoreMin || c.RFM_Total > advancedFilters.rfmScoreMax) {
        return false;
      }

      // Value filter
      if (c.totalValue < advancedFilters.valueMin || c.totalValue > advancedFilters.valueMax) {
        return false;
      }

      // Order count filter
      if (c.orderCount < advancedFilters.orderCountMin || c.orderCount > advancedFilters.orderCountMax) {
        return false;
      }

      // Date filter
      if (advancedFilters.dateFrom && c.lastOrderDate) {
        if (c.lastOrderDate < advancedFilters.dateFrom) {
          return false;
        }
      }
      if (advancedFilters.dateTo && c.lastOrderDate) {
        if (c.lastOrderDate > advancedFilters.dateTo) {
          return false;
        }
      }

      return true;
    });
  }, [customers, selectedSegments, advancedFilters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.rfmScoreMin > 3 || advancedFilters.rfmScoreMax < 15) count++;
    if (advancedFilters.valueMin > 0 || advancedFilters.valueMax !== Infinity) count++;
    if (advancedFilters.orderCountMin > 0 || advancedFilters.orderCountMax !== Infinity) count++;
    if (advancedFilters.dateFrom || advancedFilters.dateTo) count++;
    return count;
  }, [advancedFilters]);

  const minValue = useMemo(() => Math.min(...customers.map(c => c.totalValue)), [customers]);
  const maxValue = useMemo(() => Math.max(...customers.map(c => c.totalValue)), [customers]);

  const handleClearAdvancedFilters = () => {
    setAdvancedFilters(DEFAULT_FILTERS);
  };

  const handleExportCSVInternal = (customersToExport: Customer[] = customers, filenameSuffix: string = 'analyza') => {
    const exportData = customersToExport.map(c => {
      const baseData: Record<string, any> = {
        email: c.email,
        tags: c.segment, // NEW: tags column right after email
        jmeno: c.firstName || '',
        prijmeni: c.lastName || '',
        pocet_objednavek: c.orderCount,
        hodnota_objednavek: Math.round(c.totalValue * 100) / 100,
        datum_prvni_objednavky: c.firstOrderDate
          ? `${c.firstOrderDate.getFullYear()}-${String(c.firstOrderDate.getMonth() + 1).padStart(2, '0')}-${String(c.firstOrderDate.getDate()).padStart(2, '0')}`
          : '',
        datum_posledni_objednavky: c.lastOrderDate
          ? `${c.lastOrderDate.getFullYear()}-${String(c.lastOrderDate.getMonth() + 1).padStart(2, '0')}-${String(c.lastOrderDate.getDate()).padStart(2, '0')}`
          : '',
        lifetime_dny: c.lifetime,
        RFM_skore: c.RFM_Score,
        R_skore: c.R_Score,
        F_skore: c.F_Score,
        M_skore: c.M_Score,
        segment: c.segment,
        recency_dny: c.recency
      };

      // Přidat dodatečná pole
      if (c.additionalFields) {
        Object.entries(c.additionalFields).forEach(([fieldName, value]) => {
          baseData[fieldName] = value;
        });
      }

      return baseData;
    });

    const csv = Papa.unparse(exportData, {
      delimiter: ';',
      header: true
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `RFM_${filenameSuffix}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportFiltered = () => {
    if (selectedSegments.length === 0 && activeFilterCount === 0) {
      alert('Vyberte alespoň jeden segment nebo aktivujte filtry pro export.');
      return;
    }

    let suffix = 'export';
    if (selectedSegments.length > 0) {
      const segmentNames = selectedSegments.join('_').replace(/\s+/g, '-');
      suffix += `_${segmentNames}`;
    }
    if (activeFilterCount > 0) {
      suffix += '_filtered';
    }

    handleExportCSVInternal(filteredCustomers, suffix);
  };

  // Zkontrolovat autentizaci a načíst uložený email při mount
  useEffect(() => {
    // Kontrola Google auth
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => setIsGoogleAuthenticated(data.authenticated))
      .catch(() => setIsGoogleAuthenticated(false));

    // Načíst uložený email z localStorage
    const storedEmail = localStorage.getItem('rfm_user_email');
    if (storedEmail) {
      setSavedEmail(storedEmail);
    }
  }, []);

  // Helper funkce pro optimalizaci dat (komprese)
  const optimizeCustomerData = (customer: Customer) => ({
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    orderCount: customer.orderCount,
    totalValue: Math.round(customer.totalValue),
    lastOrderDate: customer.lastOrderDate?.getTime() || null,
    firstOrderDate: customer.firstOrderDate?.getTime() || null,
    lifetime: customer.lifetime,
    recency: customer.recency,
    frequency: customer.frequency,
    monetary: Math.round(customer.monetary),
    R_Score: customer.R_Score,
    F_Score: customer.F_Score,
    M_Score: customer.M_Score,
    RFM_Score: customer.RFM_Score,
    RFM_Total: customer.RFM_Total,
    segment: customer.segment,
    // CLV fields
    aov: Math.round(customer.aov),
    purchaseFrequency: Math.round(customer.purchaseFrequency * 100) / 100,
    historicalCLV: Math.round(customer.historicalCLV),
    churnProbability: Math.round(customer.churnProbability * 100) / 100,
    churnRisk: customer.churnRisk,
    predictedCLV: Math.round(customer.predictedCLV),
    lifetimeCLV: Math.round(customer.lifetimeCLV),
    clvSegment: customer.clvSegment,
    additionalFields: customer.additionalFields,
    // DŮLEŽITÉ: Zahrnout orderDates a orderValues s optimalizací
    orderDates: customer.orderDates?.map(d => d.getTime()) || [],
    orderValues: customer.orderValues?.map(v => Math.round(v)) || []
  });

  // Batch export pro velké datasety
  const performBatchExport = async (optimizedCustomers: any[]) => {
    const BATCH_SIZE = 500;
    const batches = [];

    for (let i = 0; i < optimizedCustomers.length; i += BATCH_SIZE) {
      batches.push(optimizedCustomers.slice(i, i + BATCH_SIZE));
    }

    console.log(`📦 Batch export: ${batches.length} dávek po ${BATCH_SIZE} zákazníků`);

    // Show batch progress modal
    setTotalBatches(batches.length);
    setShowBatchProgressModal(true);

    let spreadsheetId = '';
    let spreadsheetUrl = '';

    // První batch - vytvoří spreadsheet
    setCurrentBatch(1);
    setProcessingPhase(`Vytvářím spreadsheet a exportuji dávku 1/${batches.length}...`);

    const firstBatchData = {
      customers: batches[0],
      stats: {
        total: stats.total,
        totalRevenue: stats.totalValue,
        avgOrderValue: stats.avgValue,
        avgOrdersPerCustomer: stats.avgOrders
      },
      segments: stats.segments,
      isFirstBatch: true,
      totalBatches: batches.length
    };

    const firstResponse = await fetch('/api/sheets/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firstBatchData)
    });

    if (!firstResponse.ok) {
      setShowBatchProgressModal(false);
      throw new Error(`First batch failed with status ${firstResponse.status}`);
    }

    const firstResult = await firstResponse.json();
    spreadsheetId = firstResult.spreadsheetId;
    spreadsheetUrl = firstResult.url;

    // Následující batche - přidávají data
    for (let i = 1; i < batches.length; i++) {
      setCurrentBatch(i + 1);
      setProcessingPhase(`Přidávám dávku ${i + 1}/${batches.length}...`);

      const batchData = {
        customers: batches[i],
        spreadsheetId,
        batchNumber: i,
        isFirstBatch: false
      };

      const response = await fetch('/api/sheets/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchData)
      });

      if (!response.ok) {
        setShowBatchProgressModal(false);
        throw new Error(`Batch ${i + 1} failed with status ${response.status}`);
      }
    }

    // Hide batch progress modal
    setShowBatchProgressModal(false);

    return spreadsheetUrl;
  };

  // Single export pro menší datasety
  const performSingleExport = async (optimizedCustomers: any[]) => {
    const exportData = {
      customers: optimizedCustomers,
      stats: {
        total: stats.total,
        totalRevenue: stats.totalValue,
        avgOrderValue: stats.avgValue,
        avgOrdersPerCustomer: stats.avgOrders
      },
      segments: stats.segments,
      isFirstBatch: true,
      totalBatches: 1
    };

    const response = await fetch('/api/sheets/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exportData)
    });

    if (response.status === 413) {
      throw new Error('PAYLOAD_TOO_LARGE');
    }

    if (!response.ok) {
      throw new Error(`Export failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.url;
  };

  // Hlavní funkce pro export (hybrid: komprese + batch fallback)
  const performExportToSheetsInternal = async () => {
    setIsExportingToSheets(true);
    setProcessingPhase('Příprava dat...');

    try {
      // 1. Optimalizace dat (komprese)
      const optimizedCustomers = customers.map(optimizeCustomerData);

      // 2. Zkontrolovat velikost payloadu
      const testPayload = JSON.stringify({
        customers: optimizedCustomers,
        stats: {},
        segments: {}
      });
      const payloadSize = new Blob([testPayload]).size;
      const payloadMB = (payloadSize / (1024 * 1024)).toFixed(2);

      console.log(`📊 Payload size: ${payloadMB} MB (${optimizedCustomers.length} zákazníků)`);

      let spreadsheetUrl = '';

      // 3. Rozhodnout mezi single/batch export
      const MAX_PAYLOAD_SIZE = 3 * 1024 * 1024; // 3 MB limit

      if (payloadSize > MAX_PAYLOAD_SIZE) {
        console.log(`⚠️ Payload > 3 MB, použiji batch export`);
        spreadsheetUrl = await performBatchExport(optimizedCustomers);
      } else {
        console.log(`✅ Payload < 3 MB, použiji single export`);
        try {
          spreadsheetUrl = await performSingleExport(optimizedCustomers);
        } catch (error: any) {
          // Fallback na batch pokud single selže s 413
          if (error.message === 'PAYLOAD_TOO_LARGE') {
            console.log(`⚠️ Single export selhal (413), fallback na batch`);
            spreadsheetUrl = await performBatchExport(optimizedCustomers);
          } else {
            throw error;
          }
        }
      }

      // 4. Zobrazit success modal
      setSpreadsheetUrl(spreadsheetUrl);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Export error:', error);
      alert('Chyba při exportu do Google Sheets. Zkuste to prosím znovu.');
    } finally {
      setIsExportingToSheets(false);
      setProcessingPhase('');
    }
  };

  // Helper pro čekání na dokončení OAuth s timeout
  const waitForOAuthCompletion = (popup: Window | null): Promise<boolean> => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const checkAuthInterval = setInterval(async () => {
        try {
          // Poll /api/auth/check místo kontroly popup.closed (COOP policy fix)
          const authCheck = await fetch('/api/auth/check');
          const authData = await authCheck.json();

          if (authData.authenticated) {
            clearInterval(checkAuthInterval);
            if (popup && !popup.closed) {
              try {
                popup.close();
              } catch (e) {
                // Ignore COOP errors when closing
              }
            }
            resolve(true);
          }

          // Zkontrolovat timeout
          if (Date.now() - startTime > 300000) { // 5 minut
            clearInterval(checkAuthInterval);
            if (popup && !popup.closed) {
              try {
                popup.close();
              } catch (e) {
                // Ignore COOP errors when closing
              }
            }
            resolve(false);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          // Pokračovat v pollování i při chybách
        }
      }, 1000); // Poll každou sekundu
    });
  };

  // Handler pro Google Sheets export (internal) - VRACÍ PROMISE!
  const handleExportToSheetsInternal = async (): Promise<void> => {
    if (!isGoogleAuthenticated) {
      // Otevřít OAuth v novém okně (popup)
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        '/api/auth/google',
        'Google OAuth',
        `width=${width},height=${height},left=${left},top=${top},toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0`
      );

      if (!popup) {
        throw new Error('Povolte vyskakovací okna pro přihlášení k Google');
      }

      // ČEKAT na dokončení autentizace (AWAIT!)
      const authenticated = await waitForOAuthCompletion(popup);

      if (!authenticated) {
        // Uživatel zavřel popup bez přihlášení nebo autentizace selhala
        throw new Error('Přihlášení ke Google bylo zrušeno nebo selhalo. Zkuste to znovu.');
      }

      // Nastavit authenticated flag
      setIsGoogleAuthenticated(true);
    }

    // Pokračovat s exportem
    await performExportToSheetsInternal();
  };

  // Wrapper functions for lead generation modal
  const handleExportClick = (type: 'csv' | 'sheets') => {
    setExportType(type);

    // Kontrola: Pokud už máme identitu (Google auth NEBO uložený email), skipnout modal
    if (isGoogleAuthenticated || savedEmail) {
      // Přímo exportovat bez modalu
      if (type === 'csv') {
        handleExportCSVInternal();
      } else {
        handleExportToSheetsInternal().catch((error) => {
          console.error('Export error:', error);
          alert('Chyba při exportu do Google Sheets. Zkuste to prosím znovu.');
        });
      }
      return;
    }

    // Nemáme identitu → zobrazit modal pro sběr emailu
    setShowExportModal(true);
  };

  const handleEmailSubmit = async (email: string, newsletter: boolean) => {
    // Uložit email do localStorage (pro příští exporty)
    localStorage.setItem('rfm_user_email', email);
    setSavedEmail(email);

    // Uložit lead do DB
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newsletter, exportType })
    });

    if (!response.ok) {
      throw new Error('Nepodařilo se uložit email. Zkuste to znovu.');
    }

    // Export podle typu
    if (exportType === 'csv') {
      // CSV export je synchronní - zavřít modal hned
      handleExportCSVInternal();
      setShowExportModal(false);
    } else {
      // Google Sheets export je async - MUSÍME POČKAT na dokončení OAuth
      try {
        await handleExportToSheetsInternal(); // AWAIT!
        // Úspěch - zavřít modal AŽ po dokončení exportu
        setShowExportModal(false);
      } catch (error: any) {
        // Propagovat chybu zpět do ExportModal (zobrazí se uživateli)
        console.error('Google Sheets export error:', error);
        throw new Error(error.message || 'Export do Google Sheets selhal. Zkuste to znovu.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsGoogleAuthenticated(false);
      alert('✓ Odhlášen z Google účtu');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleChangeEmail = () => {
    localStorage.removeItem('rfm_user_email');
    setSavedEmail('');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Výsledky analýzy</h2>
            <p className="text-sm sm:text-base text-gray-600">RFM segmentace {stats.total.toLocaleString('cs-CZ')} zákazníků</p>
          </div>
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            {/* User Identity Badge */}
            {(isGoogleAuthenticated || savedEmail) && (
              <div className="flex items-center justify-between sm:justify-end gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-green-800">
                    {isGoogleAuthenticated ? 'Přihlášen do Google' : savedEmail}
                  </span>
                </div>
                <button
                  onClick={isGoogleAuthenticated ? handleLogout : handleChangeEmail}
                  className="text-xs text-green-700 hover:text-green-900 font-medium underline"
                >
                  {isGoogleAuthenticated ? 'Odhlásit se' : 'Změnit email'}
                </button>
              </div>
            )}

            {/* Export Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleExportClick('sheets')}
              disabled={isExportingToSheets}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-3 sm:py-2 rounded-lg font-semibold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {isExportingToSheets ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="text-base sm:text-sm">
                    {processingPhase || 'Exportuji...'}
                  </span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                  <span className="text-base sm:text-sm">
                    {isGoogleAuthenticated ? 'Export do Sheets' : 'Přihlásit a exportovat'}
                  </span>
                </>
              )}
            </button>
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 px-4 py-3 sm:py-2 rounded-lg font-medium transition-colors min-h-[44px]"
            >
              <RefreshCw size={18} />
              <span className="text-base sm:text-sm">Nový soubor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info box o Google OAuth */}
        {!isGoogleAuthenticated && (
          <div className="mb-4 sm:mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <div className="text-xs sm:text-sm text-blue-800">
                <strong>První přihlášení:</strong> Google zobrazí varování "unverified app".
                Klikněte na <span className="font-semibold">Advanced</span> → <span className="font-semibold">Go to RFM Analýza (unsafe)</span>.
                Aplikace má přístup pouze k souborům, které vytvoří.
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 border border-blue-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Users className="text-blue-600 flex-shrink-0" size={20} />
              <span className="text-xs sm:text-sm font-medium text-blue-700">Celkem zákazníků</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-900">{stats.total.toLocaleString('cs-CZ')}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6 border border-green-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <DollarSign className="text-green-600 flex-shrink-0" size={20} />
              <span className="text-xs sm:text-sm font-medium text-green-700">Celková hodnota</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-900">
              {Math.round(stats.totalValue).toLocaleString('cs-CZ')} Kč
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 sm:p-6 border border-purple-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <TrendingUp className="text-purple-600 flex-shrink-0" size={20} />
              <span className="text-xs sm:text-sm font-medium text-purple-700">Prům. objednávek</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-purple-900">{stats.avgOrders.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 sm:p-6 border border-orange-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <DollarSign className="text-orange-600 flex-shrink-0" size={20} />
              <span className="text-xs sm:text-sm font-medium text-orange-700">Prům. hodnota</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-orange-900">
              {Math.round(stats.avgValue).toLocaleString('cs-CZ')} Kč
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 sm:p-6 border border-amber-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Calendar className="text-amber-600 flex-shrink-0" size={20} />
              <span className="text-xs sm:text-sm font-medium text-amber-700">Prům. dny od poslední obj.</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-amber-900">
              {Math.round(stats.avgRecency).toLocaleString('cs-CZ')} dní
            </p>
            <p className="text-xs text-amber-700 mt-1">Průměrná recency všech zákazníků</p>
          </div>
        </div>

        {/* CLV Metrics Section */}
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💰</span>
            Customer Lifetime Value (CLV) Metriky
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Average CLV */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 sm:p-6 border border-emerald-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <DollarSign className="text-emerald-600 flex-shrink-0" size={20} />
                <span className="text-xs sm:text-sm font-medium text-emerald-700">Průměrné CLV</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-900">
                {Math.round(stats.avgCLV).toLocaleString('cs-CZ')} Kč
              </p>
              <p className="text-xs text-emerald-700 mt-1">Historické + predikované</p>
            </div>

            {/* Total Predicted CLV */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 sm:p-6 border border-teal-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <TrendingUp className="text-teal-600 flex-shrink-0" size={20} />
                <span className="text-xs sm:text-sm font-medium text-teal-700">Celkové predikované CLV</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-teal-900">
                {Math.round(stats.totalPredictedCLV).toLocaleString('cs-CZ')} Kč
              </p>
              <p className="text-xs text-teal-700 mt-1">Projekce na 12 měsíců</p>
            </div>

            {/* High Value Customers */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 sm:p-6 border border-cyan-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Users className="text-cyan-600 flex-shrink-0" size={20} />
                <span className="text-xs sm:text-sm font-medium text-cyan-700">High Value zákazníků</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-cyan-900">
                {stats.highValueCustomers.toLocaleString('cs-CZ')}
              </p>
              <p className="text-xs text-cyan-700 mt-1">
                {((stats.highValueCustomers / stats.total) * 100).toFixed(1)}% z celkového počtu
              </p>
            </div>

            {/* Average Churn Probability */}
            <div className={`bg-gradient-to-br rounded-xl p-4 sm:p-6 border ${
              stats.avgChurnProbability < 0.3
                ? 'from-green-50 to-green-100 border-green-200'
                : stats.avgChurnProbability < 0.6
                ? 'from-yellow-50 to-yellow-100 border-yellow-200'
                : 'from-red-50 to-red-100 border-red-200'
            }`}>
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <svg className={`w-5 h-5 flex-shrink-0 ${
                  stats.avgChurnProbability < 0.3
                    ? 'text-green-600'
                    : stats.avgChurnProbability < 0.6
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className={`text-xs sm:text-sm font-medium ${
                  stats.avgChurnProbability < 0.3
                    ? 'text-green-700'
                    : stats.avgChurnProbability < 0.6
                    ? 'text-yellow-700'
                    : 'text-red-700'
                }`}>Prům. churn riziko</span>
              </div>
              <p className={`text-2xl sm:text-3xl font-bold ${
                stats.avgChurnProbability < 0.3
                  ? 'text-green-900'
                  : stats.avgChurnProbability < 0.6
                  ? 'text-yellow-900'
                  : 'text-red-900'
              }`}>
                {(stats.avgChurnProbability * 100).toFixed(1)}%
              </p>
              <p className={`text-xs mt-1 ${
                stats.avgChurnProbability < 0.3
                  ? 'text-green-700'
                  : stats.avgChurnProbability < 0.6
                  ? 'text-yellow-700'
                  : 'text-red-700'
              }`}>
                {stats.avgChurnProbability < 0.3 ? 'Nízké riziko ✓' : stats.avgChurnProbability < 0.6 ? 'Střední riziko' : 'Vysoké riziko ⚠️'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Segment Chart */}
      <SegmentChart
        segments={stats.segments}
        total={stats.total}
        selectedSegments={selectedSegments}
        filteredCount={filteredCustomers.length}
        onSegmentClick={(segment) => {
          if (selectedSegments.includes(segment)) {
            setSelectedSegments(selectedSegments.filter(s => s !== segment));
          } else {
            setSelectedSegments([...selectedSegments, segment]);
          }
        }}
      />

      {/* Advanced Filters */}
      <FilterPanel
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        onClearFilters={handleClearAdvancedFilters}
        activeFilterCount={activeFilterCount}
        minValue={minValue}
        maxValue={maxValue}
      />

      {/* CLV Distribution Chart */}
      <CLVDistributionChart customers={customers} />

      {/* CLV Trend Chart */}
      <CLVTrendChart customers={customers} />

      {/* Top CLV Customers */}
      <TopCLVCustomers customers={customers} topN={20} />

      {/* Customer Table */}
      <CustomerTable
        customers={customers}
        selectedSegments={selectedSegments}
        advancedFilters={advancedFilters}
        totalCount={customers.length}
        filteredCount={filteredCustomers.length}
        activeFilterCount={activeFilterCount}
        onExportFiltered={handleExportFiltered}
        onExportAll={() => handleExportClick('csv')}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onSubmit={handleEmailSubmit}
        exportType={exportType}
      />

      {/* Batch Progress Modal */}
      <BatchProgressModal
        isOpen={showBatchProgressModal}
        currentBatch={currentBatch}
        totalBatches={totalBatches}
        phase={processingPhase}
      />

      {/* Success Modal */}
      <ExportSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        spreadsheetUrl={spreadsheetUrl}
      />
    </div>
  );
}