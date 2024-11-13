'use client'
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { 
  FaChartLine, 
  FaUsers, 
  FaCog, 
  FaQuestionCircle,
  FaArrowRight 
} from 'react-icons/fa';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('implementation');
  const [showHelp, setShowHelp] = useState(false);
  const [metrics, setMetrics] = useState({
    implementation: Array(3).fill(0),
    development: Array(3).fill(0),
    capacity: Array(3).fill(0)
  });
  
  // Move random data generation to useEffect
  useEffect(() => {
    setMetrics({
      implementation: Array(3).fill(0).map(() => Math.floor(Math.random() * 100)),
      development: Array(3).fill(0).map(() => Math.floor(Math.random() * 100)),
      capacity: Array(3).fill(0).map(() => Math.floor(Math.random() * 100))
    });
  }, []); // Empty dependency array means this runs once after mount

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Progress',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const barChartData = {
    labels: ['Target 1', 'Target 2', 'Target 3', 'Target 4'],
    datasets: [{
      label: 'Completion Rate',
      data: [65, 45, 80, 30],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  };

  const HelpPopup = () => (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 id="help-title" className="text-xl font-bold mb-4">Dashboard Help</h2>
        <div className="mb-4">
          <p>This dashboard provides an overview of NDC implementation, development, and capacity tracking metrics.</p>
        </div>
        <div 
          onClick={() => setShowHelp(false)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setShowHelp(false)}
        >
          Close
        </div>
      </div>
    </div>
  );

  const MetricCard = ({ title, children, className = '' }) => (
    <section className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </section>
  );

  const MetricValue = ({ index, value }) => (
    <div className="bg-gray-50 p-4 rounded">
      <h4 className="font-medium mb-2">Metric {index + 1}</h4>
      <p className="text-2xl font-bold">{value}%</p>
    </div>
  );

  const TabPanel = ({ children, id, active }) => (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={`tab-${id}`}
      className={active ? 'block' : 'hidden'}
    >
      {children}
    </div>
  );

  const TabContent = () => (
    <div className="tab-panels">
      <TabPanel id="implementation" active={activeTab === 'implementation'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard title="Key Metrics">
            <Line data={lineChartData} />
          </MetricCard>
          <MetricCard title="Governance and Skills">
            <Bar data={barChartData} />
          </MetricCard>
          <MetricCard title="Institutions Framework" className="col-span-1 md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metrics.implementation.map((value, index) => (
                <MetricValue key={`impl-${index}`} index={index} value={value} />
              ))}
            </div>
          </MetricCard>
        </div>
      </TabPanel>

      <TabPanel id="development" active={activeTab === 'development'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard title="Strategy Metrics">
            <Line data={lineChartData} />
          </MetricCard>
          <MetricCard title="Stakeholder Engagement">
            <Bar data={barChartData} />
          </MetricCard>
          <MetricCard title="Regulatory Frameworks" className="col-span-1 md:col-span-2">
            <ul className="space-y-4">
              {metrics.development.map((value, index) => (
                <li key={`dev-${index}`} className="bg-gray-50 p-4 rounded flex justify-between items-center">
                  <span>Framework {index + 1}</span>
                  <span className="text-green-500 font-medium">{value}%</span>
                </li>
              ))}
            </ul>
          </MetricCard>
        </div>
      </TabPanel>

      <TabPanel id="capacity" active={activeTab === 'capacity'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard title="Areas for Improvement">
            <Bar data={barChartData} />
          </MetricCard>
          <MetricCard title="Capacity Resources">
            <ul className="space-y-4">
              {metrics.capacity.map((value, index) => (
                <li key={`cap-${index}`} className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium mb-2">Resource {index + 1}</h4>
                  <div className="flex justify-between items-center">
                    <span>Utilization</span>
                    <span className="text-blue-500 font-medium">{value}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </MetricCard>
          <MetricCard title="Interactive Visualizations" className="col-span-1 md:col-span-2">
            <Line data={lineChartData} />
          </MetricCard>
        </div>
      </TabPanel>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">NDC Dashboard</h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-full hover:bg-gray-200"
            aria-label="Show help"
          >
            <FaQuestionCircle className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            Enter Data <FaArrowRight aria-hidden="true" />
          </button>
        </div>
      </header>

      <nav>
        <div
          role="tablist"
          aria-label="Dashboard Sections"
          className="mb-6 flex flex-wrap gap-2"
        >
          {[
            { id: 'implementation', icon: FaChartLine, label: 'Implementation' },
            { id: 'development', icon: FaCog, label: 'Development' },
            { id: 'capacity', icon: FaUsers, label: 'Capacity' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              role="tab"
              type="button"
              id={`tab-${id}`}
              aria-controls={id}
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <article className="bg-white rounded-lg shadow-lg p-6">
        <TabContent />
      </article>

      {showHelp && <HelpPopup />}
    </main>
  );
};

export default Dashboard;