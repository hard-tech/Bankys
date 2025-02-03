import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TransactionStats } from '../../type/common.types';

interface DashboardChartsProps {
  currentStats: TransactionStats[string];
  prepareChartData: (stats: TransactionStats[string]) => any[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ currentStats, prepareChartData }) => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Graphique Solde */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Solde</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareChartData(currentStats)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="solde" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique Entrées */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Entrées</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareChartData(currentStats)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="entrees" stroke="#4CAF50" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique Sorties */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Sorties</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareChartData(currentStats)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sorties" stroke="#f44336" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Graphique combiné */}
      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h2 className="text-xl font-bold mb-4">Flux de trésorerie</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={prepareChartData(currentStats)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="solde" stroke="#8884d8" name="Solde" />
              <Line type="monotone" dataKey="entrees" stroke="#4CAF50" name="Entrées" />
              <Line type="monotone" dataKey="sorties" stroke="#f44336" name="Sorties" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;