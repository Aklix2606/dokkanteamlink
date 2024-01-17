import React, { useState, useEffect } from 'react';

export const SearchableDropdown = ({ options, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option: string) => option.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, options]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search categories..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <select onChange={e => onSelect(e.target.value)} size={10}>
        {filteredOptions.map((option: string) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};
