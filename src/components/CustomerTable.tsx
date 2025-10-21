'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { Customer, AdvancedFilters } from '@/types';
import { SEGMENT_COLORS } from './SegmentFilter';

interface CustomerTableProps {
  customers: Customer[];
  selectedSegments?: string[];
  advancedFilters?: AdvancedFilters;
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
  advancedFilters = DEFAULT_ADVANCED_FILTERS
}: CustomerTableProps) {
  const [sortField, setSortField] = useState<SortField>('totalValue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Hledat zákazníka..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
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
            {paginatedCustomers.map((customer, index) => (
              <tr key={customer.email} className="border-b border-gray-100 hover:bg-gray-50">
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Zobrazeno {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, sortedAndFilteredCustomers.length)} z {sortedAndFilteredCustomers.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
                        : 'border border-gray-300 hover:bg-gray-50'
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
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Další
            </button>
          </div>
        </div>
      )}
    </div>
  );
}