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
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Top {topN} zákazníků podle CLV
          </h2>
          <p className="text-sm text-gray-600">
            Tito zákazníci představují {topPercentageOfTotal}% celkové CLV hodnoty
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
          <p className="text-xs font-medium text-emerald-700 mb-1">Celkové CLV Top {topN}</p>
          <p className="text-2xl font-bold text-emerald-900">
            {Math.round(totalCLVOfTop).toLocaleString('cs-CZ')} Kč
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                #
              </th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                Zákazník
              </th>
              <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                Lifetime CLV
              </th>
              <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">
                Historické
              </th>
              <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">
                Predikované
              </th>
              <th className="text-center py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">
                Počet obj.
              </th>
              <th className="text-center py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">
                Churn Risk
              </th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((customer, index) => (
              <tr
                key={customer.email}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-2 sm:px-4">
                  <div className="flex items-center gap-2">
                    {index < 3 && (
                      <span className="text-lg">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                    )}
                    <span className="font-semibold text-gray-900">{index + 1}</span>
                  </div>
                </td>
                <td className="py-3 px-2 sm:px-4">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {`${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-none">
                      {customer.email}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-2 sm:px-4 text-right">
                  <div className="flex flex-col items-end">
                    <p className="font-bold text-emerald-700 text-sm sm:text-base">
                      {Math.round(customer.lifetimeCLV).toLocaleString('cs-CZ')} Kč
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium ${
                      customer.clvSegment === 'High Value' ? 'bg-green-100 text-green-800' :
                      customer.clvSegment === 'Medium Value' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.clvSegment}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 sm:px-4 text-right hidden sm:table-cell">
                  <p className="text-sm text-gray-700">
                    {Math.round(customer.historicalCLV).toLocaleString('cs-CZ')} Kč
                  </p>
                </td>
                <td className="py-3 px-2 sm:px-4 text-right hidden sm:table-cell">
                  <p className="text-sm text-indigo-600 font-semibold">
                    +{Math.round(customer.predictedCLV).toLocaleString('cs-CZ')} Kč
                  </p>
                </td>
                <td className="py-3 px-2 sm:px-4 text-center hidden md:table-cell">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    {customer.orderCount}×
                  </span>
                </td>
                <td className="py-3 px-2 sm:px-4 text-center hidden md:table-cell">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-indigo-600 text-xl">🎯</div>
          <div>
            <p className="text-sm text-indigo-900 font-medium">
              Zaměřte marketing úsilí na tyto vysoce hodnotné zákazníky
            </p>
            <p className="text-xs text-indigo-700 mt-1">
              Retence těchto zákazníků má největší dopad na vaše celkové příjmy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
