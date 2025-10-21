'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronRight, Search, Download, Calendar, TrendingUp } from 'lucide-react';
import React from 'react';
import { Customer, AdvancedFilters } from '@/types';
import { SEGMENT_COLORS } from './SegmentFilter';

interface CustomerTableProps {
  customers: Customer[];
  selectedSegments?: string[];
  advancedFilters?: AdvancedFilters;
  totalCount: number;
  filteredCount: number;
  activeFilterCount: number;
  onExportFiltered: () => void;
  onExportAll: () => void;
}

type SortField = 'name' | 'orderCount' | 'totalValue' | 'lastOrderDate' | 'RFM_Total' | 'segment';
type SortOrder = 'asc' | 'desc';

const DEFAULT_ADVANCED_FILTERS: AdvancedFilters = {
  rfmScoreMin: 3,
  rfmScoreMax: 15,
  valueMin: 0,
  valueMax: Infinity,
  orderCountMin: 0,
  orderCountMax: Infinity,
  dateFrom: null,
  dateTo: null
};

export default function CustomerTable({
  customers,
  selectedSegments = [],
  advancedFilters = DEFAULT_ADVANCED_FILTERS,
  totalCount,
  filteredCount,
  activeFilterCount,
  onExportFiltered,
  onExportAll
}: CustomerTableProps) {
  const [sortField, setSortField] = useState<SortField>('totalValue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const itemsPerPage = 20;

  // Reset pagination na stránku 1 při změně filtrů
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSegments, searchTerm, advancedFilters]);

  const toggleRow = (email: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(email)) {
      newExpanded.delete(email);
    } else {
      newExpanded.add(email);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedAndFilteredCustomers = useMemo(() => {
    let filtered = customers.filter(c => {
      // Filter by selected segments
      const segmentMatch = selectedSegments.length === 0 || selectedSegments.includes(c.segment);

      // Filter by advanced filters
      const rfmMatch = c.RFM_Total >= advancedFilters.rfmScoreMin && c.RFM_Total <= advancedFilters.rfmScoreMax;
      const valueMatch = c.totalValue >= advancedFilters.valueMin && c.totalValue <= advancedFilters.valueMax;
      const orderMatch = c.orderCount >= advancedFilters.orderCountMin && c.orderCount <= advancedFilters.orderCountMax;

      let dateMatch = true;
      if (advancedFilters.dateFrom && c.lastOrderDate) {
        dateMatch = dateMatch && c.lastOrderDate >= advancedFilters.dateFrom;
      }
      if (advancedFilters.dateTo && c.lastOrderDate) {
        dateMatch = dateMatch && c.lastOrderDate <= advancedFilters.dateTo;
      }

      // Filter by search term
      const searchLower = searchTerm.toLowerCase();
      const searchMatch = (
        c.email.toLowerCase().includes(searchLower) ||
        c.firstName.toLowerCase().includes(searchLower) ||
        c.lastName.toLowerCase().includes(searchLower) ||
        c.segment.toLowerCase().includes(searchLower)
      );

      return segmentMatch && rfmMatch && valueMatch && orderMatch && dateMatch && searchMatch;
    });

    return filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortField) {
        case 'name':
          aVal = `${a.firstName} ${a.lastName}`;
          bVal = `${b.firstName} ${b.lastName}`;
          break;
        case 'lastOrderDate':
          aVal = a.lastOrderDate?.getTime() || 0;
          bVal = b.lastOrderDate?.getTime() || 0;
          break;
        default:
          aVal = a[sortField];
          bVal = b[sortField];
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [customers, sortField, sortOrder, searchTerm, selectedSegments, advancedFilters]);

  const totalPages = Math.ceil(sortedAndFilteredCustomers.length / itemsPerPage);
  const paginatedCustomers = sortedAndFilteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Top zákazníci ({sortedAndFilteredCustomers.length})
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
          <input
            type="text"
            placeholder="Hledat zákazníka..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-4 w-12"></th>
              <th
                className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Zákazník <SortIcon field="name" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th 
                className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('orderCount')}
              >
                <div className="flex items-center justify-end gap-2">
                  Objednávky <SortIcon field="orderCount" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('totalValue')}
              >
                <div className="flex items-center justify-end gap-2">
                  Hodnota <SortIcon field="totalValue" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('lastOrderDate')}
              >
                <div className="flex items-center gap-2">
                  Poslední obj. <SortIcon field="lastOrderDate" />
                </div>
              </th>
              <th 
                className="text-center py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('RFM_Total')}
              >
                <div className="flex items-center justify-center gap-2">
                  RFM <SortIcon field="RFM_Total" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('segment')}
              >
                <div className="flex items-center gap-2">
                  Segment <SortIcon field="segment" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer) => {
              const isExpanded = expandedRows.has(customer.email);
              return (
                <React.Fragment key={customer.email}>
                  {/* Main row */}
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleRow(customer.email)}
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                        aria-label={isExpanded ? 'Sbalit detaily' : 'Rozbalit detaily'}
                      >
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{customer.email}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {customer.orderCount}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {Math.round(customer.totalValue).toLocaleString('cs-CZ')} Kč
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {customer.lastOrderDate?.toLocaleDateString('cs-CZ') || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {customer.RFM_Score}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${SEGMENT_COLORS[customer.segment] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                        {customer.segment}
                      </span>
                    </td>
                  </tr>

                  {/* Expanded details row */}
                  {isExpanded && (
                    <tr className="border-b border-gray-100">
                      <td colSpan={8} className="bg-indigo-50 p-6">
                        <div className="max-w-4xl">
                          {/* Timeline metrics */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* First Order */}
                            <div className="bg-white rounded-lg p-4 border border-indigo-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="text-green-600" size={18} />
                                <span className="text-xs font-semibold text-gray-700">První objednávka</span>
                              </div>
                              <p className="text-lg font-bold text-gray-900">
                                {customer.firstOrderDate?.toLocaleDateString('cs-CZ') || '-'}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {customer.firstOrderDate && `před ${customer.lifetime} dny`}
                              </p>
                            </div>

                            {/* Last Order */}
                            <div className="bg-white rounded-lg p-4 border border-indigo-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="text-blue-600" size={18} />
                                <span className="text-xs font-semibold text-gray-700">Poslední objednávka</span>
                              </div>
                              <p className="text-lg font-bold text-gray-900">
                                {customer.lastOrderDate?.toLocaleDateString('cs-CZ') || '-'}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {customer.lastOrderDate && `před ${customer.recency} dny`}
                              </p>
                            </div>

                            {/* Customer Lifetime */}
                            <div className="bg-white rounded-lg p-4 border border-indigo-200">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="text-purple-600" size={18} />
                                <span className="text-xs font-semibold text-gray-700">Zákaznická doba</span>
                              </div>
                              <p className="text-lg font-bold text-gray-900">
                                {customer.lifetime} dní
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {Math.round(customer.lifetime / 30)} měsíců
                              </p>
                            </div>
                          </div>

                          {/* Timeline visualization */}
                          {customer.firstOrderDate && customer.lastOrderDate && (
                            <div className="bg-white rounded-lg p-4 border border-indigo-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-700">Časová osa zákazníka</span>
                                <span className="text-xs text-gray-600">
                                  {customer.orderCount} {customer.orderCount === 1 ? 'objednávka' : customer.orderCount < 5 ? 'objednávky' : 'objednávek'}
                                </span>
                              </div>
                              <div className="relative h-8 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 rounded-full overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-between px-3">
                                  <span className="text-xs font-medium text-gray-700">Start</span>
                                  <span className="text-xs font-medium text-gray-700">Teď</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-600">
                                  {customer.firstOrderDate.toLocaleDateString('cs-CZ')}
                                </span>
                                <span className="text-xs text-gray-600">
                                  {new Date().toLocaleDateString('cs-CZ')}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-900">
            Zobrazeno {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, sortedAndFilteredCustomers.length)} z {sortedAndFilteredCustomers.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700"
            >
              Předchozí
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700"
            >
              Další
            </button>
          </div>
        </div>
      )}

      {/* Export Panel */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Export filtrovaných */}
          <button
            onClick={onExportFiltered}
            disabled={selectedSegments && selectedSegments.length === 0 && activeFilterCount === 0 && searchTerm === ''}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 text-white px-6 py-4 rounded-xl font-semibold transition-colors shadow-lg"
            title={selectedSegments && selectedSegments.length === 0 && activeFilterCount === 0 && searchTerm === '' ? 'Vyberte segment nebo použijte filtry' : 'Exportovat filtrované zákazníky'}
          >
            <Download size={20} />
            <span>
              Exportovat filtrované
              {filteredCount > 0 && ` (${filteredCount.toLocaleString('cs-CZ')})`}
            </span>
          </button>

          {/* Export všech */}
          <button
            onClick={onExportAll}
            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-colors"
          >
            <Download size={20} />
            <span>
              Exportovat vše
              {totalCount > 0 && ` (${totalCount.toLocaleString('cs-CZ')})`}
            </span>
          </button>
        </div>

        {/* Info text */}
        {selectedSegments && selectedSegments.length > 0 && (
          <div className="mt-3 text-center text-sm text-gray-600">
            <p>
              📊 Export bude obsahovat pouze vybrané segmenty:
              <span className="font-semibold ml-1">
                {selectedSegments.join(', ')}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}