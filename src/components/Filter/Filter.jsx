import React, { useState } from 'react';
import './Filter.css';
import { AnimalTypeEnum, SizeEnum } from "../../enums/enums";
import Button from "../Button/Button";

function Filter({ onFilterChange, showCategories, isMobile  }) {
  const [filters, setFilters] = useState({
    animalType: [],
    size: [],
    ageRange: '',
    priceRange: ''
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCheckboxChange = (type, value) => {
    const updatedValues = filters[type].includes(value)
      ? filters[type].filter((t) => t !== value)
      : [...filters[type], value];
    updateFilters({ ...filters, [type]: updatedValues });
  };

  const handleRadioChange = (type, value) => {
    if (filters[type] === value) {
      updateFilters({ ...filters, [type]: '' });
    } else {
      updateFilters({ ...filters, [type]: value });
    }
  };

  const FilterContent = () => (
    <>
      {showCategories && (
        <div className="filter-group">
          <h4>Categories</h4>
          {Object.values(AnimalTypeEnum).map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                value={type}
                onChange={() => handleCheckboxChange("animalType", type)}
                checked={filters.animalType.includes(type)}
              />
              {type}
            </label>
          ))}
        </div>
      )}

      <div className="filter-group">
        <h4>Size</h4>
        {Object.values(SizeEnum).map((sizeOption) => (
          <label key={sizeOption}>
            <input
              type="checkbox"
              value={sizeOption}
              onChange={() => handleCheckboxChange("size", sizeOption)}
              checked={filters.size.includes(sizeOption)}
            />
            {sizeOption}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Age</h4>
        {["0-6", "7-13", "14-20", "21+"].map(range => (
          <label key={range}>
            <input
              type="radio"
              name="ageRange"
              value={range}
              onChange={() => handleRadioChange("ageRange", range)}
              checked={filters.ageRange === range}
            />
            {range} months
          </label>
        ))}
        {filters.ageRange && (
          <Button className="reset-button" onClick={() => handleRadioChange("ageRange", '')} text="View all" />
        )}
      </div>

      <div className="filter-group">
        <h4>Price</h4>
        {["0-5", "6-11", "12-17", "18+"].map(range => (
          <label key={range}>
            <input
              type="radio"
              name="priceRange"
              value={range}
              onChange={() => handleRadioChange("priceRange", range)}
              checked={filters.priceRange === range}
            />
            {range} €
          </label>
        ))}
        {filters.priceRange && (
          <Button className="reset-button" onClick={() => handleRadioChange("priceRange", '')} text="View all" />
        )}
      </div>
    </>
  );

  return (
    <>
      <div className="filter-toggle-mobile">
        <Button text="Filters" onClick={() => setIsMobileFilterOpen(true)}  className={"filter-toggle-button"}/>
      </div>
      <div className="pet-navigation desktop-filters">
        <FilterContent />
      </div>
      {isMobileFilterOpen && (
        <div className="mobile-filter-overlay">
          <div className="mobile-filter-panel">
            <h3>Filters</h3>
            <FilterContent />
            <Button text="Close" className="close-filter-btn" onClick={() => setIsMobileFilterOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export default Filter;
