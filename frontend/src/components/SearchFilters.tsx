import React, { useState } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

interface FiltersState {
  sector: string[];
  fundingStage: string[];
  valuationMin: number | null;
  valuationMax: number | null;
  fundingMin: number | null;
  fundingMax: number | null;
  companyAge: string | null;
}

interface SearchFiltersProps {
  onSearch: (query: string, filters: FiltersState) => void;
  entityType: 'startup' | 'investor';
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, entityType }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    sector: [],
    fundingStage: [],
    valuationMin: null,
    valuationMax: null,
    fundingMin: null,
    fundingMax: null,
    companyAge: null
  });

  const sectors = [
    'FinTech', 'HealthTech', 'EdTech', 'CleanTech', 'AgTech', 
    'E-commerce', 'AI', 'Blockchain', 'SaaS', 'Marketplace', 
    'LogisticsTech', 'Sustainability'
  ];

  const fundingStages = [
    'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+'
  ];

  const companyAgeOptions = [
    'Less than 1 year', '1-3 years', '3-5 years', '5+ years'
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, filters);
  };

  const toggleFilter = (filterType: keyof FiltersState, value: string) => {
    if (Array.isArray(filters[filterType])) {
      const currentFilters = filters[filterType] as string[];
      
      if (currentFilters.includes(value)) {
        setFilters({
          ...filters,
          [filterType]: currentFilters.filter(item => item !== value)
        });
      } else {
        setFilters({
          ...filters,
          [filterType]: [...currentFilters, value]
        });
      }
    } else {
      setFilters({
        ...filters,
        [filterType]: value
      });
    }
  };

  const handleNumberFilter = (
    filterType: 'valuationMin' | 'valuationMax' | 'fundingMin' | 'fundingMax',
    value: string
  ) => {
    const numberValue = value === '' ? null : Number(value);
    setFilters({
      ...filters,
      [filterType]: numberValue
    });
  };

  const clearFilters = () => {
    setFilters({
      sector: [],
      fundingStage: [],
      valuationMin: null,
      valuationMax: null,
      fundingMin: null,
      fundingMax: null,
      companyAge: null
    });
  };

  const activeFilterCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + value.length;
    } else if (value !== null) {
      return count + 1;
    }
    return count;
  }, 0);

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-4">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder={`Search ${entityType === 'startup' ? 'startups' : 'investors'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-teal-600 focus:outline-none"
                onClick={() => setShowFilters(!showFilters)}
              >
                <div className="flex items-center">
                  <Filter className="h-5 w-5" />
                  {activeFilterCount > 0 && (
                    <span className="ml-1 text-xs bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
                </div>
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</h3>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-500 dark:hover:text-teal-400"
                >
                  Clear all filters
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sector
                  </label>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {sectors.map(sector => (
                      <div key={sector} className="flex items-center">
                        <input
                          id={`sector-${sector}`}
                          name={`sector-${sector}`}
                          type="checkbox"
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          checked={filters.sector.includes(sector)}
                          onChange={() => toggleFilter('sector', sector)}
                        />
                        <label
                          htmlFor={`sector-${sector}`}
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          {sector}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Funding Stage
                  </label>
                  <div className="space-y-1">
                    {fundingStages.map(stage => (
                      <div key={stage} className="flex items-center">
                        <input
                          id={`stage-${stage}`}
                          name={`stage-${stage}`}
                          type="checkbox"
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          checked={filters.fundingStage.includes(stage)}
                          onChange={() => toggleFilter('fundingStage', stage)}
                        />
                        <label
                          htmlFor={`stage-${stage}`}
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          {stage}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {entityType === 'startup' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Valuation Range
                      </label>
                      <div className="flex space-x-2">
                        <div>
                          <label htmlFor="valuation-min" className="sr-only">Minimum Valuation</label>
                          <input
                            type="number"
                            id="valuation-min"
                            placeholder="Min"
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={filters.valuationMin || ''}
                            onChange={(e) => handleNumberFilter('valuationMin', e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor="valuation-max" className="sr-only">Maximum Valuation</label>
                          <input
                            type="number"
                            id="valuation-max"
                            placeholder="Max"
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={filters.valuationMax || ''}
                            onChange={(e) => handleNumberFilter('valuationMax', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Funding Amount
                      </label>
                      <div className="flex space-x-2">
                        <div>
                          <label htmlFor="funding-min" className="sr-only">Minimum Funding</label>
                          <input
                            type="number"
                            id="funding-min"
                            placeholder="Min"
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={filters.fundingMin || ''}
                            onChange={(e) => handleNumberFilter('fundingMin', e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor="funding-max" className="sr-only">Maximum Funding</label>
                          <input
                            type="number"
                            id="funding-max"
                            placeholder="Max"
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={filters.fundingMax || ''}
                            onChange={(e) => handleNumberFilter('fundingMax', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Age
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {companyAgeOptions.map(age => (
                        <button
                          key={age}
                          type="button"
                          className={`px-3 py-1 text-sm rounded-full ${
                            filters.companyAge === age 
                              ? 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-700' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          onClick={() => setFilters({
                            ...filters,
                            companyAge: filters.companyAge === age ? null : age
                          })}
                        >
                          {age}
                          {filters.companyAge === age && (
                            <X className="inline-block ml-1 h-3 w-3" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchFilters;