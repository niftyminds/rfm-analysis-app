'use client';

import { useMemo } from 'react';
import { Customer } from '@/types';
import { TrendingUp, DollarSign } from 'lucide-react';

interface TopCLVCustomersProps {
  customers: Customer[];
  topN?: number;
}

export default function TopCLVCustomers({ customers, topN = 20 }: TopCLVCustomersProps) {
  const topCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => b.lifetimeCLV - a.lifetimeCLV)
      .slice(0, topN);
  }, [customers, topN]);

  const totalCLVOfTop = useMemo(() => {
    return topCustomers.reduce((sum, c) => sum + c.lifetimeCLV, 0);
  }, [topCustomers]);

  const totalCLVAll = useMemo(() => {
    return customers.reduce((sum, c) => sum + c.lifetimeCLV, 0);
  }, [customers]);

  const topPercentageOfTotal = ((totalCLVOfTop / totalCLVAll) * 100).toFixed(1);

  return (
    <div className="bg-card border border-black/10 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-2">
            Top {topN} zákazníků podle CLV
          </h2>
          <p className="text-sm text-mute">
            Tito zákazníci představují {topPercentageOfTotal}% celkové CLV hodnoty
          </p>
        </div>
        <div className="bg-ink p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/60 mb-1">Celkové CLV Top {topN}</p>
          <p className="text-2xl font-black text-cream tracking-tight">
            {Math.round(totalCLVOfTop).toLocaleString('cs-CZ')} Kč
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-cream-deep border-b border-line">
              <th className="text-left py-3 px-2 sm:px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
                #
              </th>
              <th className="text-left py-3 px-2 sm:px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
                Zákazník
              </th>
              <th className="text-right py-3 px-2 sm:px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
                Lifetime CLV
              </th>
              <th className="text-right py-3 px-2 sm:px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-mute hidden sm:table-cell">
                Historické
              </th>
              <th className="text-right py-3 px-2 sm:px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-mute hidden sm:table-cell">
                Predikované
              </th>
              <th className="text-center py-3 px-2 sm:px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-mute hidden md:table-cell">
                Počet obj.
              </th>
              <th className="text-center py-3 px-2 sm:px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-mute hidden md:table-cell">
                Churn Risk
              </th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((customer, index) => (
              <tr
                key={customer.email}
                className="border-b border-line hover:bg-cream-deep/50 transition-colors duration-200 ease-brand"
              >
                <td className="py-3 px-2 sm:px-4">
                  <div className="flex items-center gap-2">
                    {index < 3 && (
                      <span className="text-lg">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                    )}
                    <span className="font-mono font-semibold text-ink">{index + 1}</span>
                  </div>
                </td>
                <td className="py-3 px-2 sm:px-4">
                  <div>
                    <p className="font-semibold text-ink text-sm sm:text-base">
                      {`${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email}
                    </p>
                    <p className="text-xs text-mute truncate max-w-[150px] sm:max-w-none">
                      {customer.email}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-2 sm:px-4 text-right">
                  <div className="flex flex-col items-end">
                    <p className="font-mono font-bold text-ink text-sm sm:text-base">
                      {Math.round(customer.lifetimeCLV).toLocaleString('cs-CZ')} Kč
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs font-medium ${
                      customer.clvSegment === 'High Value' ? 'bg-green-100 text-green-800' :
                      customer.clvSegment === 'Medium Value' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.clvSegment}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 sm:px-4 text-right hidden sm:table-cell">
                  <p className="font-mono text-sm text-ink-soft">
                    {Math.round(customer.historicalCLV).toLocaleString('cs-CZ')} Kč
                  </p>
                </td>
                <td className="py-3 px-2 sm:px-4 text-right hidden sm:table-cell">
                  <p className="font-mono text-sm text-ink font-semibold">
                    +{Math.round(customer.predictedCLV).toLocaleString('cs-CZ')} Kč
                  </p>
                </td>
                <td className="py-3 px-2 sm:px-4 text-center hidden md:table-cell">
                  <span className="inline-flex items-center px-2 py-1 font-mono text-xs font-medium bg-cream-deep text-ink border border-black/10">
                    {customer.orderCount}×
                  </span>
                </td>
                <td className="py-3 px-2 sm:px-4 text-center hidden md:table-cell">
                  <span className={`inline-flex items-center px-2 py-1 font-mono text-xs font-medium ${
                    customer.churnRisk === 'low' ? 'bg-green-50 text-green-700' :
                    customer.churnRisk === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {customer.churnRisk === 'low' && '🟢'}
                    {customer.churnRisk === 'medium' && '🟡'}
                    {customer.churnRisk === 'high' && '🔴'}
                    {' '}
                    {(customer.churnProbability * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-cream-deep border border-black/10">
        <div className="flex items-start gap-3">
          <div className="text-ink text-xl">🎯</div>
          <div>
            <p className="text-sm text-ink font-medium">
              Zaměřte marketing úsilí na tyto vysoce hodnotné zákazníky
            </p>
            <p className="text-xs text-mute mt-1">
              Retence těchto zákazníků má největší dopad na vaše celkové příjmy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
