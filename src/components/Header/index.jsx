import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import RecycleIcon from '../icons/recycleIcon';
import SearchIcon from '../icons/searchIcon';
import DownCaret from '../icons/downCaret';

const Header = () => {
  const [searchFilter, setSearchFilter] = useState('storeFronts');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropDownRef = useRef(null);

  const handleSelectChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const getPlaceholderText = () => {
    if (searchFilter === 'storeFronts') {
      return 'Search Storefronts...';
    } else if (searchFilter === 'parts') {
      return 'Search Parts...';
    }
    return '';
  };

  const toggleDropdown = (brand) => {
    setActiveDropdown((prev) => (prev === brand ? null : brand));
  };

  const brandList = [
    'HP',
    'Lenovo',
    'Microsoft',
    'DELL',
    'Apple',
    'Chromebooks',
    'Intel',
    'ASUS',
    'MSI',
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header>
      {/* Grey overlay when nav dropdown is active */}
      {activeDropdown && (
        <div className='fixed inset-0 bg-gray-700 bg-opacity-50 z-40 pointer-events-none' />
      )}

      <div className='relative'>
        {/* Top Nav Bar */}
        <div className='flex flex-row items-center justify-between py-3 px-8 bg-[#385b4f] text-white relative z-50'>
          <Link to='/' className='flex-shrink-0'>
            <RecycleIcon />
          </Link>
          {/* Search Section */}
          <div className='flex flex-1 justify-center mx-4'>
            <form className='flex items-center w-3/4 border border-gray-300 rounded-md focus-within:border-[#d88a59]'>
              <div className='m-0'>
                <label htmlFor='searchFilter' className='sr-only'></label>
                {/* Filter */}
                <select
                  name='searchFilter'
                  id='searchFilter'
                  className='h-10 px-3 text-black rounded-l-md focus:outline-none'
                  value={searchFilter}
                  onChange={handleSelectChange}>
                  <option value='storeFronts'>Store Fronts</option>
                  <option value='parts'>Parts</option>
                </select>
              </div>
              {/* Search Input */}
              <div className='flex-grow m-0'>
                <input
                  type='text'
                  placeholder={getPlaceholderText()}
                  className='h-10 w-full px-3 border-l border-r text-black border-transparent focus:outline-none'
                />
              </div>
              {/* Search Button */}
              <div className='m-0'>
                <button className='h-10 px-3.5 bg-[#d88a59] text-white rounded-r-md focus:outline-none'>
                  <SearchIcon />
                </button>
              </div>
            </form>
          </div>
        </div>

        {activeDropdown && (
          <div className='fixed inset-0 top-[80px] bg-gray-700 bg-opacity-50 z-30 pointer-events-auto' />
        )}

        {/* Bottom Nav Bar */}
        <div className='flex flex-row items-center py-0 px-0 bg-black text-[#f8f6ea] relative z-50 leading-normal'>
          {brandList.map((brand) => (
            <div
              key={brand}
              className='flex items-center py-2 pl-6 pr-10 cursor-pointer font-semibold text-base relative'
              onClick={() => toggleDropdown(brand)}>
              {brand} <DownCaret fillColor={'#d88a59'} />
              {activeDropdown === brand && (
                <div
                  ref={dropDownRef}
                  className='absolute top-full left-0 mt-2 bg-white text-black shadow-lg rounded-md w-max z-50'>
                  {/* DropDown Header */}
                  <div className='flex flex-row pt-8 pb-4 px-6 bg-[#f8f9f9] items-center'>
                    <div className='text-xl mr-5 leading-normal font-bold'>
                      {brand}
                    </div>
                    <span>
                      <Link to={`/shop/${brand.toLowerCase()}`}>Shop All</Link>
                    </span>
                  </div>
                  {/* DropDown Body */}
                  <div className='flex flex-col p-6'>
                    <div className='grid grid-cols-2 gap-x-8'>
                      {/* Laptops */}
                      <div className='mb-8'>
                        <div className='pb-2 mb-2 leading-tight font-bold border-b border-zinc-200'>
                          <span>
                            <Link to={`${brand.toLowerCase()}/laptops`}>
                              Laptops
                            </Link>
                          </span>
                        </div>
                        <ul>
                          {Array.from({ length: 5 }, (_, index) => (
                            <li
                              key={`${brand}-laptop-${index}`}
                              className='hover:bg-[#f8f6ea] mb-1 text-sm leading-normal font-semibold'>
                              <Link
                                to={`/product/${brand.toLowerCase()}laptop${
                                  index + 1
                                }`}>
                                {brand} Laptop {index + 1}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Desktops */}
                      <div className='mb-8'>
                        <div className='pb-2 mb-2 leading-tight font-bold border-b border-zinc-200'>
                          <span>
                            <Link to={`${brand.toLowerCase()}/desktops`}>
                              Desktops
                            </Link>
                          </span>
                        </div>
                        <ul>
                          {Array.from({ length: 5 }, (_, index) => (
                            <li
                              key={`${brand}-desktop-${index}`}
                              className='hover:bg-[#f8f6ea] mb-1 text-sm leading-normal font-semibold'>
                              <Link
                                to={`/product/${brand.toLowerCase()}desktop${
                                  index + 1
                                }`}>
                                {brand} Desktop {index + 1}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Monitors */}
                      <div className='mb-8'>
                        <div className='pb-2 mb-2 leading-tight font-bold border-b border-zinc-200'>
                          <span>
                            <Link to={`${brand.toLowerCase()}/monitors`}>
                              Monitors
                            </Link>
                          </span>
                        </div>
                        <ul>
                          {Array.from({ length: 5 }, (_, index) => (
                            <li
                              key={`${brand}-monitor-${index}`}
                              className='hover:bg-[#f8f6ea] mb-1 text-sm leading-normal font-semibold'>
                              <Link
                                to={`/product/${brand.toLowerCase()}monitor${
                                  index + 1
                                }`}>
                                {brand} Monitor {index + 1}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Accessories */}
                      <div className='mb-8'>
                        <div className='pb-2 mb-2 leading-tight font-bold border-b border-zinc-200'>
                          <span>
                            <Link to={`${brand.toLowerCase()}/accessories`}>
                              Accessories
                            </Link>
                          </span>
                        </div>
                        <ul>
                          {Array.from({ length: 5 }, (_, index) => (
                            <li
                              key={`${brand}-accessory-${index}`}
                              className='hover:bg-[#f8f6ea] mb-1 text-sm leading-normal font-semibold'>
                              <Link
                                to={`/product/${brand.toLowerCase()}accessory${
                                  index + 1
                                }`}>
                                {brand} Accessory {index + 1}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
