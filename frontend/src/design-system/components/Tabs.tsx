import React, { useState } from 'react';

export interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

/**
 * Tabs component - preserves exact original styling and behavior from design-system.html
 * Uses original class names: fdn-tabs, fdn-tabs__tablist, fdn-tabs__tab, fdn-tabs__tabpanel
 */
export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={`fdn-tabs fdn-tabs--feature ${className}`.trim()}>
      <div className="fdn-tabs__tablist" role="tablist" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className="fdn-tabs__tab"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            title={tab.title}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="fdn-tabs__title">{tab.title}</span>
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`tabpanel-${tab.id}`}
          className="fdn-tabs__tabpanel"
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};
