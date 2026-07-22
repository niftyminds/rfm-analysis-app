'use client';

import { useMemo, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Customer } from '@/types';
import { SEGMENT_COLORS } from './SegmentFilter';

interface VirtualizedTableProps {
  customers: Customer[];
  expandedRows: Set<string>;
  toggleRow: (email: string) => void;
}

interface RowData {
  customers: Customer[];
  expandedRows: Set<string>;
  toggleRow: (email: string) => void;
}

const ROW_HEIGHT = 60; // Base row height
const EXPANDED_ROW_HEIGHT = 400; // Height when expanded

export default function VirtualizedCustomerTable({
  customers,
  expandedRows,
  toggleRow
}: VirtualizedTableProps) {
  const listRef = useRef<List>(null);

  // Calculate item size based on whether row is expanded
  const getItemSize = (index: number) => {
    const customer = customers[index];
    return expandedRows.has(customer.email)
      ? ROW_HEIGHT + EXPANDED_ROW_HEIGHT
      : ROW_HEIGHT;
  };

  // Row renderer
  const Row = ({ index, style, data }: { index: number; style: React.CSSProperties; data: RowData }) => {
    const customer = data.customers[index];
    const isExpanded = data.expandedRows.has(customer.email);

    return (
      <div style={style} className="border-b border-line">
        {/* Main row */}
        <div className="flex items-center hover:bg-cream-deep/50 h-[60px]">
          <div className="py-3 px-4 w-12">
            <button
              onClick={() => data.toggleRow(customer.email)}
              className="text-mute hover:text-ink transition-colors duration-200 ease-brand"
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
          <div className="py-3 px-4 flex-1 min-w-0">
            <div className="font-medium text-ink truncate">
              {`${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email}
            </div>
          </div>
          <div className="py-3 px-4 flex-1 text-mute text-sm truncate">
            {customer.email}
          </div>
          <div className="py-3 px-4 w-24 text-right font-mono font-semibold text-ink">
            {customer.orderCount}
          </div>
          <div className="py-3 px-4 w-32 text-right font-mono font-semibold text-ink">
            {Math.round(customer.totalValue).toLocaleString('cs-CZ')} Kč
          </div>
          <div className="py-3 px-4 w-32 text-sm text-mute">
            {customer.lastOrderDate?.toLocaleDateString('cs-CZ') || '-'}
          </div>
          <div className="py-3 px-4 w-24 text-center">
            <span className="inline-flex items-center px-2.5 py-0.5 font-mono text-xs font-medium bg-lime text-ink">
              {customer.RFM_Score}
            </span>
          </div>
          <div className="py-3 px-4 w-40">
            <span className={`inline-flex items-center px-3 py-1 text-xs font-medium border ${SEGMENT_COLORS[customer.segment] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
              {customer.segment}
            </span>
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className="bg-cream-deep p-6 h-[400px] overflow-y-auto">
            <div className="max-w-4xl">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-card p-4 border border-black/10">
                  <p className="text-xs font-semibold text-ink-soft mb-2">První objednávka</p>
                  <p className="text-lg font-black text-ink tracking-tight">
                    {customer.firstOrderDate?.toLocaleDateString('cs-CZ') || '-'}
                  </p>
                  <p className="text-xs text-mute mt-1">
                    {customer.firstOrderDate && `před ${customer.lifetime} dny`}
                  </p>
                </div>
                <div className="bg-card p-4 border border-black/10">
                  <p className="text-xs font-semibold text-ink-soft mb-2">Poslední objednávka</p>
                  <p className="text-lg font-black text-ink tracking-tight">
                    {customer.lastOrderDate?.toLocaleDateString('cs-CZ') || '-'}
                  </p>
                  <p className="text-xs text-mute mt-1">
                    {customer.lastOrderDate && `před ${customer.recency} dny`}
                  </p>
                </div>
                <div className="bg-card p-4 border border-black/10">
                  <p className="text-xs font-semibold text-ink-soft mb-2">Zákaznická doba</p>
                  <p className="text-lg font-black text-ink tracking-tight">{customer.lifetime} dní</p>
                  <p className="text-xs text-mute mt-1">{Math.round(customer.lifetime / 30)} měsíců</p>
                </div>
              </div>

              {customer.additionalFields && Object.keys(customer.additionalFields).length > 0 && (
                <div className="bg-card p-4 border border-black/10">
                  <p className="text-xs font-semibold text-ink-soft mb-3">Dodatečná data</p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(customer.additionalFields).map(([fieldName, value]) => (
                      <div key={fieldName} className="bg-cream-deep p-2">
                        <p className="font-mono text-[10px] text-mute uppercase tracking-wide mb-1">{fieldName}</p>
                        <p className="text-sm font-medium text-ink">{value}</p>
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
  };

  const itemData: RowData = {
    customers,
    expandedRows,
    toggleRow
  };

  return (
    <div className="border border-black/10 overflow-hidden">
      {/* Table Header */}
      <div className="bg-cream-deep border-b border-line flex items-center h-[50px]">
        <div className="py-3 px-4 w-12"></div>
        <div className="py-3 px-4 flex-1 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">Zákazník</div>
        <div className="py-3 px-4 flex-1 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">Email</div>
        <div className="py-3 px-4 w-24 text-right font-mono text-[11px] uppercase tracking-[0.14em] text-mute">Objednávky</div>
        <div className="py-3 px-4 w-32 text-right font-mono text-[11px] uppercase tracking-[0.14em] text-mute">Hodnota</div>
        <div className="py-3 px-4 w-32 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">Poslední obj.</div>
        <div className="py-3 px-4 w-24 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-mute">RFM</div>
        <div className="py-3 px-4 w-40 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">Segment</div>
      </div>

      {/* Virtualized List */}
      <List
        ref={listRef}
        height={Math.min(customers.length * ROW_HEIGHT, 600)} // Max 600px height
        itemCount={customers.length}
        itemSize={getItemSize}
        width="100%"
        itemData={itemData}
      >
        {Row}
      </List>
    </div>
  );
}
