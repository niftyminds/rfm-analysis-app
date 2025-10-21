'use client';

import { useMemo, useState } from 'react';
import { Download, RefreshCw, Users, DollarSign, TrendingUp, Calendar, Filter as FilterIcon } from 'lucide-react';
import Papa from 'papaparse';
import { Customer, Stats } from '@/types';
import SegmentChart from './SegmentChart';
import CustomerTable from './CustomerTable';
import SegmentFilter from './SegmentFilter';

interface DashboardProps {
  customers: Customer[];
  onReset: () => void;
}

export default function Dashboard({ customers, onReset }: DashboardProps) {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
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

  const availableSegments = useMemo(() => {
    return Object.keys(stats.segments).sort();
  }, [stats.segments]);

  const filteredCustomers = useMemo(() => {
    if (selectedSegments.length === 0) {
      return customers;
    }
    return customers.filter(c => selectedSegments.includes(c.segment));
  }, [customers, selectedSegments]);

  const handleExport = (customersToExport: Customer[] = customers, filenameSuffix: string = 'analyza') => {
    const exportData = customersToExport.map(c => ({
      email: c.email,
      tags: c.segment, // NEW: tags column right after email
      jmeno: c.firstName,
      prijmeni: c.lastName,
      pocet_objednavek: c.orderCount,
      hodnota_objednavek: Math.round(c.totalValue * 100) / 100,
      datum_posledni_objednavky: c.lastOrderDate
        ? c.lastOrderDate.toLocaleDateString('cs-CZ')
        : '',
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
    if (selectedSegments.length === 0) {
      alert('Vyberte alespoň jeden segment pro export.');
      return;
    }

    const segmentNames = selectedSegments.join('_').replace(/\s+/g, '-');
    const suffix = `export_${segmentNames}`;
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
          <div className="flex gap-3">
            <button
              onClick={onReset}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <RefreshCw size={18} />
              Nový soubor
            </button>
            <button
              onClick={handleExportFiltered}
              disabled={selectedSegments.length === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
              title={selectedSegments.length === 0 ? 'Vyberte alespoň jeden segment' : 'Exportovat vybrané segmenty'}
            >
              <FilterIcon size={18} />
              <Download size={20} />
              Exportovat vybrané ({selectedSegments.length})
            </button>
            <button
              onClick={() => handleExport()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg"
            >
              <Download size={20} />
              Exportovat vše
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <Calendar className="text-orange-600" size={24} />
              <span className="text-sm font-medium text-orange-700">Prům. hodnota</span>
            </div>
            <p className="text-3xl font-bold text-orange-900">
              {Math.round(stats.avgValue).toLocaleString('cs-CZ')} Kč
            </p>
          </div>
        </div>
      </div>

      {/* Segment Chart */}
      <SegmentChart segments={stats.segments} total={stats.total} />

      {/* Segment Filter */}
      <SegmentFilter
        segments={availableSegments}
        selectedSegments={selectedSegments}
        onSegmentChange={setSelectedSegments}
        totalCount={customers.length}
        filteredCount={filteredCustomers.length}
      />

      {/* Customer Table */}
      <CustomerTable customers={customers} selectedSegments={selectedSegments} />
    </div>
  );
}