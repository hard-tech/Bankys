// src/components/transactions/TransactionTabs.tsx
interface TransactionTabsProps {
    activeTab: 'all' | 'income' | 'expense';
    onTabChange: (tab: 'all' | 'income' | 'expense') => void;
  }
  
  const TransactionTabs = ({ activeTab, onTabChange }: TransactionTabsProps) => {
    const tabs = [
      { id: 'all', label: 'Transactions' },
      { id: 'income', label: 'Recettes' },
      { id: 'expense', label: 'Dépenses' }
    ];
  
    return (
      <div className="flex space-x-4 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as 'all' | 'income' | 'expense')}
            className={`px-4 py-2 ${
              activeTab === tab.id
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };
  
  export default TransactionTabs;  