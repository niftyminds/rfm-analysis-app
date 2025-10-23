'use client';

import { useMemo, useState } from 'react';
import { RefreshCw, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import Papa from 'papaparse';
import { Customer, Stats, AdvancedFilters } from '@/types';
import SegmentChart from './SegmentChart';
import CustomerTable from './CustomerTable';
import FilterPanel from './FilterPanel';

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
  const stats: Stats = useMemo(() => {
    const segments: Record<string, number> = {};
    customers.forEach(c => {
      segments[c.segment] = (segments[c.segment] || 0) + 1;
    });

    return {
      total: customers.length,
      totalValue: customers.reduce((sum, c) => sum + c.totalValue, 0),
      avgOrders: customers.reduce((sum, c) => sum + c.orderCount, 0) / customers.length,
      avgValue: customers.reduce((sum, c) => sum + c.totalValue, 0) / customers.length,
      avgRecency: customers.reduce((sum, c) => sum + c.recency, 0) / customers.length,
      segments
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

  const handleExport = (customersToExport: Customer[] = customers, filenameSuffix: string = 'analyza') => {
    const exportData = customersToExport.map(c => ({
      email: c.email,
      tags: c.segment, // NEW: tags column right after email
      jmeno: c.firstName,
      prijmeni: c.lastName,
      pocet_objednavek: c.orderCount,
      hodnota_objednavek: Math.round(c.totalValue * 100) / 100,
      datum_prvni_objednavky: c.firstOrderDate
        ? c.firstOrderDate.toISOString().split('T')[0]
        : '',
      datum_posledni_objednavky: c.lastOrderDate
        ? c.lastOrderDate.toISOString().split('T')[0]
        : '',
      lifetime_dny: c.lifetime,
      RFM_skore: c.RFM_Score,
      R_skore: c.R_Score,
      F_skore: c.F_Score,
      M_skore: c.M_Score,
      segment: c.segment,
      recency_dny: c.recency
    }));

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

    handleExport(filteredCustomers, suffix);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Výsledky analýzy</h2>
            <p className="text-gray-600">RFM segmentace {stats.total.toLocaleString('cs-CZ')} zákazníků</p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <RefreshCw size={18} />
            Nový soubor
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-blue-600" size={24} />
              <span className="text-sm font-medium text-blue-700">Celkem zákazníků</span>
            </div>
            <p className="text-3xl font-bold text-blue-900">{stats.total.toLocaleString('cs-CZ')}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-green-600" size={24} />
              <span className="text-sm font-medium text-green-700">Celková hodnota</span>
            </div>
            <p className="text-3xl font-bold text-green-900">
              {Math.round(stats.totalValue).toLocaleString('cs-CZ')} Kč
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-purple-600" size={24} />
              <span className="text-sm font-medium text-purple-700">Prům. objednávek</span>
            </div>
            <p className="text-3xl font-bold text-purple-900">{stats.avgOrders.toFixed(2)}</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-orange-600" size={24} />
              <span className="text-sm font-medium text-orange-700">Prům. hodnota</span>
            </div>
            <p className="text-3xl font-bold text-orange-900">
              {Math.round(stats.avgValue).toLocaleString('cs-CZ')} Kč
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-amber-600" size={24} />
              <span className="text-sm font-medium text-amber-700">Prům. dny od poslední obj.</span>
            </div>
            <p className="text-3xl font-bold text-amber-900">
              {Math.round(stats.avgRecency).toLocaleString('cs-CZ')} dní
            </p>
            <p className="text-xs text-amber-700 mt-1">Průměrná recency všech zákazníků</p>
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

      {/* Customer Table */}
      <CustomerTable
        customers={customers}
        selectedSegments={selectedSegments}
        advancedFilters={advancedFilters}
        totalCount={customers.length}
        filteredCount={filteredCustomers.length}
        activeFilterCount={activeFilterCount}
        onExportFiltered={handleExportFiltered}
        onExportAll={() => handleExport()}
      />
    </div>
  );
}