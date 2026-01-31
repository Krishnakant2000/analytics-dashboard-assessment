import React, { useState, useMemo } from 'react';
import useEVData from './hooks/useEVData';
import { calculateAnalytics } from './utils/analytics';
import StatCard from './components/StatCard';
import DataTable from './components/DataTable'; 
import { Car, Zap, TrendingUp, BatteryCharging, Filter } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];

const App = () => {
  const { data, loading } = useEVData('/Electric_Vehicle_Population_Data.csv');
  const [selectedCounty, setSelectedCounty] = useState('All');

  const counties = useMemo(() => {
    const unique = new Set(data.map(d => d.County).filter(Boolean));
    return ['All', ...Array.from(unique).sort()];
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedCounty === 'All') return data;
    return data.filter(d => d.County === selectedCounty);
  }, [data, selectedCounty]);

  const { trendData, pieData, barData } = useMemo(() => {
    if (!filteredData.length) return { trendData: [], pieData: [], barData: [] };
    return calculateAnalytics(filteredData);
  }, [filteredData]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">
      <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>)}
      </div>
      <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">EV Analytics Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Displaying {filteredData.length.toLocaleString()} records 
            {selectedCounty !== 'All' && ` in ${selectedCounty} County`}
          </p>
        </div>

        <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <Filter className="text-gray-400 mr-2" size={20} />
          <select 
            className="bg-transparent outline-none text-gray-700 font-medium cursor-pointer"
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
          >
            {counties.map(c => (
              <option key={c} value={c}>{c} County</option>
            ))}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Vehicles" 
          value={filteredData.length.toLocaleString()} 
          icon={Car} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Avg Range" 
          value={`${barData[0]?.avgRange || 0} mi`} 
          icon={BatteryCharging} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Top Maker" 
          value={barData[0]?.name || "N/A"} 
          icon={Zap} 
          color="bg-yellow-500" 
        />
        <StatCard 
          title="Latest Year" 
          value={trendData[trendData.length - 1]?.year || "N/A"} 
          icon={TrendingUp} 
          color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Adoption Trends (By Year)</h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Market Share (BEV vs PHEV)</h2>
          <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Top 10 Brands by Average Range (Miles)</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="avgRange" fill="#8b5cf6" barSize={24} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <DataTable data={filteredData} />
      </div>
    </div>
  );
};

export default App;