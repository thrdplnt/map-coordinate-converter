/**
 * @fileoverview Reusable Tabs component.
 */

import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

/**
 * Reusable tab navigation component.
 * @param props - Tabs props including tabs array, activeTab, and onTabChange handler
 */
export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all duration-150 ${
            activeTab === tab.id
              ? 'bg-white text-sky-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
