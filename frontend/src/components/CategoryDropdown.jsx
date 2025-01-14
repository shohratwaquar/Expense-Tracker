import React, { useEffect, useState } from 'react';
const CategoryDropdown = ({ onDataPass }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);

  const categories = ['Income', 'Expense'];

  const subcategories = {
    Income: ['Salary', 'Shares', 'Other'],
    Expense: ['Food', 'Rent', 'Travel', 'Subscription', 'Grocery', 'Vegetables', 'Other'],
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
    setIsCategoryOpen(false);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsSubcategoryOpen(false);
  };

  useEffect(() => {
    if (selectedCategory && selectedSubcategory) {
      onDataPass({
        category: selectedCategory,
        subcategory: selectedSubcategory,
      });
    }
  }, [selectedCategory, selectedSubcategory, onDataPass]);
  
  return (
    <div className="flex justify-between">
      <div className="relative box-border mr-2 w-1/2 inline-block">
        <div
          className="border rounded-lg  border-gray-300 bg-white p-3 cursor-pointer"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          {selectedCategory || <span className="text-gray-400">Category</span>}
        </div>
        {isCategoryOpen && (
          <ul className="absolute left-0 mt-1 w-full border border-gray-300 bg-white z-10">
            {categories.map((category, index) => (
              <li
                key={index}
                className="p-3 cursor-pointer hover:bg-blue-500 hover:text-white"
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative box-border ml-2 w-1/2 inline-block">
        <div
          className={`border rounded-lg  border-gray-300 bg-white p-3 ${
            selectedCategory ? 'cursor-pointer' : 'cursor-not-allowed'
          }`}
          onClick={() => selectedCategory && setIsSubcategoryOpen(!isSubcategoryOpen)}
        >
          {selectedSubcategory ||
            (selectedCategory ? (
              <span>Sub Category ({selectedCategory})</span>
            ) : (
              <span className="text-gray-400">Sub Category</span>
            ))}
        </div>
        {isSubcategoryOpen && selectedCategory && (
          <ul className="absolute left-0 mt-1 w-full border border-gray-300 bg-white z-10">
            {subcategories[selectedCategory].map((subcategory, index) => (
              <li
                key={index}
                className="p-3 cursor-pointer hover:bg-blue-500 hover:text-white"
                onClick={() => handleSubcategorySelect(subcategory)}
              >
                {subcategory}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryDropdown;
