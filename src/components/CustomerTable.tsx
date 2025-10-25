'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronRight, Search, Download, Calendar, TrendingUp, DollarSign } from 'lucide-react';
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

interface TooltipData {
  orderNumber: number | null;
  date: Date;
  value: number | null;
  daysSincePrevious: number | null;
  isToday: boolean;
}

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
  const [hoveredOrder, setHoveredOrder] = useState<TooltipData | null>(null);
  const [pinnedOrder, setPinnedOrder] = useState<TooltipData | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset pagination na stránku 1 při změně filtrů
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSegments, searchTerm, advancedFilters]);

  // Close pinned tooltip on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setPinnedOrder(null);
    };

    if (pinnedOrder) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [pinnedOrder]);

  const toggleRow = (email: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(email)) {
      newExpanded.delete(email);
    } else {
      newExpanded.add(email);
    }
    setExpandedRows(newExpanded);
  };

  const handleToggleAll = () => {
    if (expandedRows.size === paginatedCustomers.length && paginatedCustomers.every(c => expandedRows.has(c.email))) {
      // Všechno na aktuální stránce rozbaleno → Sbalit vše
      setExpandedRows(new Set());
    } else {
      // Něco sbaleno → Rozbalit vše (pouze aktuální stránka)
      const allEmails = paginatedCustomers.map(c => c.email);
      setExpandedRows(new Set(allEmails));
    }
  };

  const renderOrderMarkers = (customer: Customer) => {
    const orderDates = customer.orderDates || [];
    const orderValues = customer.orderValues || [];
    const firstDate = customer.firstOrderDate;
    const lastDate = customer.lastOrderDate;

    if (!firstDate || !lastDate || orderDates.length === 0) return null;

    const today = new Date();

    // Vypočítej celkovou délku timeline (od první obj. do dnes)
    const totalTimelineDays = Math.floor(
      (today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <>
        {/* Všechny objednávky (včetně poslední) */}
        {orderDates.map((orderDate, index) => {
          const isFirst = index === 0;
          const isLast = index === orderDates.length - 1;

          // Vypočítej pozici na timeline (0-100%)
          // 100% = dnes, ne poslední objednávka
          const daysFromStart = Math.floor(
            (orderDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          const position = (daysFromStart / totalTimelineDays) * 100;

          // Interval od předchozí objednávky
          let daysSincePrevious = null;
          if (index > 0) {
            const prevDate = orderDates[index - 1];
            daysSincePrevious = Math.floor(
              (orderDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
            );
          }

          const orderValue = orderValues[index] || 0;

          // Barvy: první zelená, ostatní indigo
          const dotColor = isFirst
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-indigo-600 hover:bg-indigo-700';

          const dotSize = isFirst
            ? 'w-3 h-3'
            : 'w-2.5 h-2.5';

          const isHovered = hoveredOrder?.orderNumber === index + 1 && !hoveredOrder?.isToday;
          const isPinned = pinnedOrder?.orderNumber === index + 1 && !pinnedOrder?.isToday;
          const showTooltip = isHovered || isPinned;

          // Určení tooltip alignmentu
          let tooltipAlignment: 'left' | 'center' | 'right' = 'center';
          if (isFirst || position < 15) {
            tooltipAlignment = 'left'; // První bod nebo blízko začátku
          } else if (position > 85) {
            tooltipAlignment = 'right'; // Blízko konce
          }

          // Tooltip classes based on alignment
          const tooltipPositionClass = {
            left: 'left-0',
            center: 'left-1/2 -translate-x-1/2',
            right: 'right-0'
          }[tooltipAlignment];

          const arrowPositionClass = {
            left: 'left-4',
            center: 'left-1/2 -translate-x-1/2',
            right: 'right-4'
          }[tooltipAlignment];

          return (
            <div
              key={`order-${index}`}
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 group"
              style={{
                left: isFirst ? '0' : `${Math.min(95, position)}%`,
                ...(isFirst && { transform: 'translateY(-50%)' })
              }}
              onMouseEnter={() => {
                setHoveredOrder({
                  orderNumber: index + 1,
                  date: orderDate,
                  value: orderValue,
                  daysSincePrevious,
                  isToday: false
                });
              }}
              onMouseLeave={() => {
                // Only clear hover if not pinned
                if (!isPinned) {
                  setHoveredOrder(null);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Toggle pin
                if (isPinned) {
                  setPinnedOrder(null);
                } else {
                  setPinnedOrder({
                    orderNumber: index + 1,
                    date: orderDate,
                    value: orderValue,
                    daysSincePrevious,
                    isToday: false
                  });
                }
              }}
            >
              <div
                className={`${dotSize} ${dotColor} rounded-full border-2 border-white shadow-md
                           transition-all duration-200 cursor-pointer z-10 relative
                           ${showTooltip ? 'scale-150' : ''}`}
              ></div>

              {!isFirst && daysSincePrevious !== null && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2
                               text-[11.5px] text-gray-700 whitespace-nowrap
                               opacity-0 group-hover:opacity-100 transition-opacity font-semibold z-20">
                  +{daysSincePrevious}d
                </span>
              )}

              {/* Tooltip - INSIDE parent, přímo nad tímto bodem */}
              {showTooltip && (
                <div
                  className={`absolute bottom-full mb-3
                             bg-white rounded-lg shadow-xl border border-gray-200 p-3
                             pointer-events-auto z-50 transition-opacity
                             ${tooltipPositionClass}`}
                  style={{ minWidth: '200px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Tooltip Arrow - pointing DOWN */}
                  <div className={`absolute top-full ${arrowPositionClass}`}>
                    <div className="w-0 h-0
                                    border-l-8 border-l-transparent
                                    border-r-8 border-r-transparent
                                    border-t-8 border-t-white">
                    </div>
                  </div>

                  {/* Pin indicator */}
                  {isPinned && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-indigo-600">
                      Objednávka #{index + 1}
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <p className="text-sm font-semibold text-gray-900">
                        {orderDate.toLocaleDateString('cs-CZ', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-gray-500" />
                      <p className="text-sm font-semibold text-gray-900">
                        {Math.round(orderValue).toLocaleString('cs-CZ')} Kč
                      </p>
                    </div>
                    {daysSincePrevious !== null && (
                      <div className="pt-1.5 mt-1.5 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">{daysSincePrevious} dní</span>
                          {' '}od předchozí objednávky
                        </p>
                      </div>
                    )}
                    {isPinned && (
                      <p className="text-[10px] text-indigo-600 mt-2 pt-2 border-t">
                        📌 Připnuto - klikni pro odepnutí
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* "DNES" Marker */}
        <div
          className="absolute top-1/2 right-0 transform -translate-y-1/2 group"
          onMouseEnter={() => {
            setHoveredOrder({
              orderNumber: null,
              date: today,
              value: null,
              daysSincePrevious: customer.recency,
              isToday: true
            });
          }}
          onMouseLeave={() => {
            if (!pinnedOrder?.isToday) {
              setHoveredOrder(null);
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (pinnedOrder?.isToday) {
              setPinnedOrder(null);
            } else {
              setPinnedOrder({
                orderNumber: null,
                date: today,
                value: null,
                daysSincePrevious: customer.recency,
                isToday: true
              });
            }
          }}
        >
          {/* "Dnes" Dot */}
          <div
            className={`w-3 h-3 bg-purple-600 hover:bg-purple-700 rounded-full border-2 border-white shadow-md
                       transition-all duration-200 cursor-pointer z-10 relative
                       ${(hoveredOrder?.isToday || pinnedOrder?.isToday) ? 'scale-150' : ''}`}
          ></div>

          {/* Tooltip pro Dnes */}
          {(hoveredOrder?.isToday || pinnedOrder?.isToday) && (
            <div
              className="absolute right-0 bottom-full mb-3
                         bg-white rounded-lg shadow-xl border border-gray-200 p-3
                         pointer-events-auto z-50"
              style={{ minWidth: '200px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tooltip Arrow - aligned right */}
              <div className="absolute top-full right-4">
                <div className="w-0 h-0
                                border-l-8 border-l-transparent
                                border-r-8 border-r-transparent
                                border-t-8 border-t-white">
                </div>
              </div>

              {/* Pin indicator */}
              {pinnedOrder?.isToday && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
              )}

              <div className="space-y-1.5">
                <p className="text-xs font-bold text-purple-600">Dnes</p>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-500" />
                  <p className="text-sm font-semibold text-gray-900">
                    {today.toLocaleDateString('cs-CZ', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="pt-1.5 mt-1.5 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">{customer.recency} dní</span>
                    {' '}od poslední objednávky
                  </p>
                </div>
                {pinnedOrder?.isToday && (
                  <p className="text-[10px] text-purple-600 mt-2 pt-2 border-t">
                    📌 Připnuto - klikni pro odepnutí
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );
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

      // Filter by search term (including additional fields)
      const searchLower = searchTerm.toLowerCase();
      let searchMatch = (
        c.email.toLowerCase().includes(searchLower) ||
        c.firstName.toLowerCase().includes(searchLower) ||
        c.lastName.toLowerCase().includes(searchLower) ||
        c.segment.toLowerCase().includes(searchLower)
      );

      // Search in additional fields
      if (!searchMatch && c.additionalFields) {
        searchMatch = Object.values(c.additionalFields).some(value =>
          value.toLowerCase().includes(searchLower)
        );
      }

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
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Top zákazníci ({sortedAndFilteredCustomers.length})
            </h2>

            {/* Expand/Collapse All tlačítko - hidden on mobile */}
            <button
              onClick={handleToggleAll}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium
                         text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50
                         rounded-lg transition-colors border border-indigo-200"
            >
              {expandedRows.size === paginatedCustomers.length && paginatedCustomers.every(c => expandedRows.has(c.email)) ? (
                <>
                  <ChevronUp size={16} />
                  Sbalit vše
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Rozbalit vše
                </>
              )}
            </button>
          </div>

          <div className="relative w-full sm:w-auto sm:min-w-[280px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Hledat zákazníka..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base text-gray-900 placeholder:text-gray-600 min-h-[44px]"
            />
          </div>
        </div>
      </div>

      {/* MOBILE CARD LAYOUT */}
      <div className="lg:hidden space-y-3">
        {paginatedCustomers.map((customer) => {
          const isExpanded = expandedRows.has(customer.email);
          return (
            <div
              key={customer.email}
              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              {/* Card Header - Always visible */}
              <div
                onClick={() => toggleRow(customer.email)}
                className="p-4 cursor-pointer active:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base truncate">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 truncate mt-0.5">{customer.email}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${SEGMENT_COLORS[customer.segment] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                      {customer.segment}
                    </span>
                    {isExpanded ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Objednávky</p>
                    <p className="font-semibold text-gray-900">{customer.orderCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Hodnota</p>
                    <p className="font-semibold text-gray-900">{Math.round(customer.totalValue).toLocaleString('cs-CZ')} Kč</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Poslední obj.</p>
                    <p className="text-sm text-gray-700">{customer.lastOrderDate?.toLocaleDateString('cs-CZ') || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">RFM skóre</p>
                    <p className="font-semibold text-indigo-600">{customer.RFM_Score}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-indigo-50 p-4">
                  <div className="space-y-4">
                    {/* Timeline metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* First Order */}
                      <div className="bg-white rounded-lg p-3 border border-indigo-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="text-green-600" size={16} />
                          <span className="text-xs font-semibold text-gray-700">První objednávka</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          {customer.firstOrderDate?.toLocaleDateString('cs-CZ') || '-'}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {customer.firstOrderDate && `před ${customer.lifetime} dny`}
                        </p>
                      </div>

                      {/* Last Order */}
                      <div className="bg-white rounded-lg p-3 border border-indigo-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="text-blue-600" size={16} />
                          <span className="text-xs font-semibold text-gray-700">Poslední objednávka</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          {customer.lastOrderDate?.toLocaleDateString('cs-CZ') || '-'}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {customer.lastOrderDate && `před ${customer.recency} dny`}
                        </p>
                      </div>

                      {/* Customer Lifetime */}
                      <div className="bg-white rounded-lg p-3 border border-indigo-200">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="text-purple-600" size={16} />
                          <span className="text-xs font-semibold text-gray-700">Zákaznická doba</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          {customer.lifetime} dní
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {Math.round(customer.lifetime / 30)} měsíců
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Timeline s objednávkami */}
                    {customer.firstOrderDate && customer.lastOrderDate && (
                      <div className="bg-white rounded-lg p-3 border border-indigo-200">
                        <div className="mb-2 flex justify-between items-center">
                          <p className="text-xs font-semibold text-gray-700">
                            Časová osa zákazníka
                          </p>
                          <p className="text-xs text-gray-600">
                            {customer.orderCount} {customer.orderCount === 1 ? 'objednávka' :
                             customer.orderCount < 5 ? 'objednávky' : 'objednávek'}
                          </p>
                        </div>

                        {/* Timeline Container - zmenšený pro mobil */}
                        <div className="relative h-20 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded-lg px-2 py-8">
                          {/* Labels NAD timeline */}
                          <div className="absolute top-1 left-2 right-2 flex justify-between text-[9px] font-medium text-gray-600">
                            <span>Start</span>
                            <span>Dnes</span>
                          </div>

                          {/* Timeline Bar */}
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transform -translate-y-1/2 rounded-full"></div>

                          {/* Order Markers - zjednodušené pro mobil */}
                          {renderOrderMarkers(customer)}

                          {/* Labels POD timeline */}
                          <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] text-gray-600">
                            {customer.orderCount === 1 ? (
                              <div className="w-full text-center">
                                <p className="text-gray-500 uppercase tracking-wide">
                                  Jediná obj.
                                </p>
                                <p className="font-semibold text-gray-900 text-[10px]">
                                  {customer.firstOrderDate?.toLocaleDateString('cs-CZ', {
                                    day: 'numeric',
                                    month: 'numeric',
                                    year: '2-digit'
                                  })}
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="text-left">
                                  <p className="text-gray-500 uppercase tracking-wide">
                                    První
                                  </p>
                                  <p className="font-semibold text-gray-900 text-[10px]">
                                    {customer.firstOrderDate?.toLocaleDateString('cs-CZ', {
                                      day: 'numeric',
                                      month: 'numeric',
                                      year: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-gray-500 uppercase tracking-wide">
                                    Poslední
                                  </p>
                                  <p className="font-semibold text-gray-900 text-[10px]">
                                    {customer.lastOrderDate?.toLocaleDateString('cs-CZ', {
                                      day: 'numeric',
                                      month: 'numeric',
                                      year: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Fields */}
                    {customer.additionalFields && Object.keys(customer.additionalFields).length > 0 && (
                      <div className="bg-white rounded-lg p-3 border border-indigo-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Dodatečná data
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {Object.entries(customer.additionalFields).map(([fieldName, value]) => (
                            <div key={fieldName} className="bg-gray-50 rounded p-2">
                              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">
                                {fieldName}
                              </p>
                              <p className="text-xs font-medium text-gray-900">
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE LAYOUT */}
      <div className="hidden lg:block overflow-x-auto">
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

                          {/* Enhanced Timeline s objednávkami */}
                          {customer.firstOrderDate && customer.lastOrderDate && (
                            <div className="bg-white rounded-lg p-4 border border-indigo-200">
                              <div className="mb-3 flex justify-between items-center">
                                <p className="text-xs font-semibold text-gray-700">
                                  Časová osa zákazníka
                                </p>
                                <p className="text-xs text-gray-600">
                                  {customer.orderCount} {customer.orderCount === 1 ? 'objednávka' :
                                   customer.orderCount < 5 ? 'objednávky' : 'objednávek'}
                                </p>
                              </div>

                              {/* Timeline Container */}
                              <div className="relative h-28 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded-lg px-3 py-10">
                                {/* Labels NAD timeline */}
                                <div className="absolute top-2 left-3 right-3 flex justify-between text-[10px] font-medium text-gray-600">
                                  <span>Start</span>
                                  <span>Dnes</span>
                                </div>

                                {/* Timeline Bar */}
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transform -translate-y-1/2 rounded-full"></div>

                                {/* Order Markers s Tooltips */}
                                {renderOrderMarkers(customer)}

                                {/* Labels POD timeline */}
                                <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] text-gray-600">
                                  {customer.orderCount === 1 ? (
                                    // Jen 1 objednávka - zobraz ji uprostřed
                                    <div className="w-full text-center">
                                      <p className="text-gray-500 uppercase tracking-wide mb-0.5">
                                        Jediná objednávka
                                      </p>
                                      <p className="font-semibold text-gray-900 text-xs">
                                        {customer.firstOrderDate?.toLocaleDateString('cs-CZ', {
                                          day: 'numeric',
                                          month: 'numeric',
                                          year: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                  ) : (
                                    // Více objednávek - zobraz první a poslední
                                    <>
                                      <div className="text-left">
                                        <p className="text-gray-500 uppercase tracking-wide mb-0.5">
                                          První objednávka
                                        </p>
                                        <p className="font-semibold text-gray-900 text-xs">
                                          {customer.firstOrderDate?.toLocaleDateString('cs-CZ', {
                                            day: 'numeric',
                                            month: 'numeric',
                                            year: 'numeric'
                                          })}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-gray-500 uppercase tracking-wide mb-0.5">
                                          Poslední objednávka
                                        </p>
                                        <p className="font-semibold text-gray-900 text-xs">
                                          {customer.lastOrderDate?.toLocaleDateString('cs-CZ', {
                                            day: 'numeric',
                                            month: 'numeric',
                                            year: 'numeric'
                                          })}
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Additional Fields */}
                          {customer.additionalFields && Object.keys(customer.additionalFields).length > 0 && (
                            <div className="bg-white rounded-lg p-4 border border-indigo-200 mt-4">
                              <p className="text-xs font-semibold text-gray-700 mb-3">
                                Dodatečná data
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(customer.additionalFields).map(([fieldName, value]) => (
                                  <div key={fieldName} className="bg-gray-50 rounded p-2">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                                      {fieldName}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {value}
                                    </p>
                                  </div>
                                ))}
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
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-xs sm:text-sm text-gray-900 text-center sm:text-left">
              Zobrazeno {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, sortedAndFilteredCustomers.length)} z {sortedAndFilteredCustomers.length}
            </p>
            <div className="hidden sm:flex items-center gap-2">
              <label htmlFor="items-per-page" className="text-xs text-gray-600 whitespace-nowrap">
                Zobrazit:
              </label>
              <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 text-gray-700 text-sm min-h-[44px] sm:min-h-0"
            >
              Předchozí
            </button>
            <div className="hidden sm:flex items-center gap-1">
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
            {/* Mobile page indicator */}
            <div className="sm:hidden flex items-center px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 text-gray-700 text-sm min-h-[44px] sm:min-h-0"
            >
              Další
            </button>
          </div>
        </div>
      )}

      {/* Export Panel */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Export filtrovaných */}
          <button
            onClick={onExportFiltered}
            disabled={selectedSegments && selectedSegments.length === 0 && activeFilterCount === 0 && searchTerm === ''}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-colors shadow-lg min-h-[52px] text-sm sm:text-base"
            title={selectedSegments && selectedSegments.length === 0 && activeFilterCount === 0 && searchTerm === '' ? 'Vyberte segment nebo použijte filtry' : 'Exportovat filtrované zákazníky'}
          >
            <Download size={18} className="flex-shrink-0" />
            <span className="truncate">
              Exportovat filtrované
              {filteredCount > 0 && ` (${filteredCount.toLocaleString('cs-CZ')})`}
            </span>
          </button>

          {/* Export všech */}
          <button
            onClick={onExportAll}
            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 active:bg-gray-100 border-2 border-gray-300 text-gray-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-colors min-h-[52px] text-sm sm:text-base"
          >
            <Download size={18} className="flex-shrink-0" />
            <span className="truncate">
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