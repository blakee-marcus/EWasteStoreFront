import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart,
  LinearScale,
  LineController,
  CategoryScale,
  PointElement,
  LineElement,
  BarController,
  BarElement,
} from 'chart.js';

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BoxArrowUpRight,
  InfoCircle,
  XIcon,
  CircleIcon,
  SelectedCircle,
  DownCaret,
} from '../components/icons';


Chart.register(
  LinearScale,
  LineController,
  CategoryScale,
  PointElement,
  LineElement,
  BarController,
  BarElement
);

const IndividualItem = () => {
  const dropDownRef = useRef(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [reportProblemModal, setReportModal] = useState(null);
  const [activeFeedback, setActiveFeedback] = useState(null);
  const [sortByDropdown, setSortByDropdown] = useState(false);
  const [paginationDropdown, setPaginationDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sellWithUsModal, setSellWithUsModal] = useState(false);
  const [sellWithUsStage, setSellWIthUsStage] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [addListing, setAddListing] = useState({
    condition: '',
    price: '',
  });
  const [hover, setHover] = useState({
    'Incorrect Image': false,
    'Incorrect Product Details': false,
    'Inappropriate Content': false,
    'Other Feedback': false,
  });
  const [activeAllListingFilter, setActiveAllListingFilter] = useState({
    'Price + Shipping': true,
    'Item Price Only': false,
  });
  const [activeAllListingPagination, setActiveAllListingPagination] = useState({
    10: true,
    25: false,
    50: false,
  });

  const productExample = {
    brand: 'ASUS',
    model: 'ROG Strix G15',
    part: 'G512LV-ES74',
    serialNumber: 'Y7NTCX000032XXX',
    specs: 'AMD Ryzen™ 9 5900HX CPU and GeForce RTX™ 3070 GPU',
    description:
      'Focused firepower streamlines and elevates the core Windows 10 Pro gaming experience in the ROG Strix G15/17. With up to a powerful AMD Ryzen™ 9 5900HX CPU and GeForce RTX™ 3070 GPU, everything from gaming to multitasking is fast and fluid. Go full-throttle on esports speed with a competition-grade display up to 300Hz/3ms, or immerse in rich detail on a WQHD 165Hz/3ms panel. Adaptive-Sync makes gameplay ultrasmooth, while advanced thermal upgrades help you stay cool under pressure. No matter what your game is, you can achieve your perfect play.',
    condition: 'Nearly New',
    listingsCount: 145,
    lowestPrice: 56.91,
    lowestPriceQuantity: 1,
    lowestPriceSeller: 'TradingElectronicEmpire',
    listings: [
      {
        storeName: '',
        reputation: { rating: '', totalSales: '' },
        condition: '',
        price: '',
        shipping: '',
        availableQuantity: '',
      },
    ],
    pastListings: [
      { condition: '', priceSoldFor: '', dateSold: '', quantitySold: '' },
    ],
  };

  // Random Product Listings
  const generateRandomPrice = () => (Math.random() * 100 + 2).toFixed(2);
  const generateRandomStoreName = () =>
    `Store_${Math.random().toString(36).substring(7)}`;
  const generateRandomReputation = () => ({
    rating: (Math.random() * 100).toFixed(1), // Random rating between 0 and 5
    totalSales: Math.floor(Math.random() * 1000), // Random sales count between 0 and 1000
  });
  const generateRandomCondition = () =>
    ['New', 'Used', 'Refurbished'][Math.floor(Math.random() * 3)];
  const generateRandomShipping = () => (Math.random() * 5 + 5).toFixed(2); // Random shipping cost between 5 and 35
  const generateRandomQuantity = () => Math.floor(Math.random() * 20) + 1; // Random quantity between 1 and 20

  const generateRandomListings = () => {
    const listingsCount = Math.floor(Math.random() * 100) + 10; // Random listings between 10 and 110
    const listings = [];

    let lowestPrice = Infinity;
    let lowestPriceSeller = '';
    let lowestPriceQuantity = 0;

    for (let i = 0; i < listingsCount; i++) {
      const price = parseFloat(generateRandomPrice()).toFixed(2);
      const storeName = generateRandomStoreName();
      const reputation = generateRandomReputation();
      const condition = generateRandomCondition();
      const shipping = parseFloat(generateRandomShipping()).toFixed(2);
      const quantity = generateRandomQuantity();

      listings.push({
        storeName,
        reputation,
        condition,
        price,
        shipping,
        availableQuantity: quantity, // Individual quantity
      });

      // Update lowest price and seller information
      if (price < lowestPrice) {
        lowestPrice = price;
        lowestPriceSeller = storeName;
        lowestPriceQuantity = quantity;
      }
    }
    return { listings, lowestPrice, lowestPriceSeller, lowestPriceQuantity };
  };

  const [product, setProduct] = useState(productExample);

  // End of random generator

  const handleReportProblemModal = () => {
    setReportModal((prev) => !prev);
  };

  const handleActiveFeedback = (feedback) => {
    setActiveFeedback((prev) => (prev === feedback ? null : feedback));
  };

  const handleSortByDropdown = () => {
    setSortByDropdown((prev) => !prev);
  };

  const handlePaginationDropdown = () => {
    setPaginationDropdown((prev) => !prev);
  };

  const handleSellWithUsModal = () => {
    setSellWithUsModal((prev) => !prev);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const getActivePaginationValue = () => {
    return Object.keys(activeAllListingPagination).find(
      (key) => activeAllListingPagination[key]
    );
  };

  // Sort By Logic
  const getSortedListings = useMemo(() => {
    if (activeAllListingFilter['Price + Shipping']) {
      return [...product.listings].sort(
        (a, b) =>
          (parseInt(a.price) || 0) +
          (parseInt(a.shipping) || 0) -
          ((parseInt(b.price) || 0) + (parseInt(b.shipping) || 0))
      );
    } else if (activeAllListingFilter['Item Price Only']) {
      return [...product.listings].sort(
        (a, b) => (parseInt(a.price) || 0) - (parseInt(b.price) || 0)
      );
    }
    return product.listings;
  }, [product.listings, activeAllListingFilter]);

  const activeSortByKey =
    Object.entries(activeAllListingFilter).find(
      ([key, value]) => value === true
    )?.[0] || 'undefined';

  // Pagination Logic
  const activePaginationValue = parseInt(getActivePaginationValue());
  const totalPages = Math.ceil(product.listingsCount / activePaginationValue);
  const startIndex = (currentPage - 1) * activePaginationValue;
  const endIndex = startIndex + activePaginationValue;
  const currentListings = getSortedListings.slice(startIndex, endIndex);
  const activePaginationKey =
    Object.entries(activeAllListingPagination).find(
      ([key, value]) => value === true
    )?.[0] || 'undefined';

  // Chart Logic
  const generateRandomDate = (startDate, dayOffset) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayOffset);

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${month}/${day}`;
  };

  const generatePastListings = () => {
    const pastListings = [];
    const today = new Date();

    // Iterate for the last three months
    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      const monthStartDate = new Date(
        today.getFullYear(),
        today.getMonth() - monthOffset,
        1
      );
      const daysInMonth = new Date(
        today.getFullYear(),
        today.getMonth() - monthOffset + 1,
        0
      ).getDate();

      // Generate listings for every 2 days
      for (let day = 0; day < daysInMonth; day += 2) {
        const dateSold = generateRandomDate(monthStartDate, day);

        const quantitySold = Math.floor(Math.random() * 10) + 1;

        const priceSoldFor = generateRandomPrice();

        pastListings.push({
          condition: generateRandomCondition(),
          priceSoldFor: priceSoldFor,
          quantitySold: quantitySold,
          dateSold: dateSold,
        });
      }
    }

    return pastListings;
  };

  useEffect(() => {
    // Generate random listings and sales data for the last 3 months
    const { listings, lowestPrice, lowestPriceSeller, lowestPriceQuantity } =
      generateRandomListings();
    const totalQuantity = listings.reduce(
      (acc, listing) => acc + listing.availableQuantity,
      0
    );

    const pastListings = generatePastListings();

    const salesData = {
      amountSold: pastListings.map((listing) =>
        parseFloat(listing.quantitySold)
      ),
      soldForValue: pastListings.map((listing) =>
        parseFloat(listing.priceSoldFor)
      ),
    };

    // Set the product state with the generated data
    setProduct((prevProduct) => ({
      ...prevProduct,
      listings,
      lowestPrice,
      lowestPriceSeller,
      lowestPriceQuantity,
      totalQuantity,
      listingsCount: listings.length,
      pastListings,
    }));

    // Chart configuration
    const ctx = chartRef.current.getContext('2d');
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: pastListings.map((listing) => listing.dateSold),
        datasets: [
          {
            label: 'Amount Sold',
            data: salesData.amountSold,
            backgroundColor: 'rgba(212, 240, 250, 1)',
            borderWidth: 0,
            pointRadius: 0,
            tension: 0.4,
            type: 'bar',
            yAxisID: 'y2',
            order: 2,
          },
          {
            label: 'Sold-for Value',
            data: salesData.soldForValue,
            borderColor: 'rgba(0, 0, 139, 1)',
            backgroundColor: 'transparent',
            borderWidth: 1.125,
            pointRadius: 0,
            tension: 0.4,
            yAxisID: 'y1',
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: {},
          y1: {
            position: 'left',
            beginAtZero: true,
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: function (value) {
                return '$' + value.toFixed(2); // Format as dollar (e.g., "$10.00")
              },
            },
          },
          y2: {
            position: 'right',
            beginAtZero: true,
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });

    // Handle click outside logic for dropdowns
    const handleClickOutside = (e) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target) &&
        paginationDropdown
      ) {
        setPaginationDropdown(false);
      }
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target) &&
        sortByDropdown
      ) {
        setSortByDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <section className='relative w-full'>
      {/* Filters */}
      <div className='sticky top-0 z-50 flex flex-row flex-nowrap items-center justify-between py-4 px-6 gap-2 shadow-[0_1px_2px_#0003] bg-white'>
        {/* Left Filters */}
        <div className='flex items-center content-center flex-wrap gap-2'>
          <div>
            <button className='items-center rounded-lg border border-zinc-300 pointer inline-flex relative justify-center font-semibold py-2 px-4 text-base bg-zinc-100 hover:bg-white'>
              <span className='flex'>
                <span>All Filters</span>
                <span className='center rounded-full inline-flex text-sm justify-center py-0.5 px-1.5 ml-2 static bg-blue-700 text-white'>
                  1
                </span>
              </span>
            </button>
          </div>
          <div>
            <div className='z-auto inline-flex relative font-normal text-base'>
              <button className='items-center rounded-lg border border-zinc-300 pointer inline-flex relative justify-center font-semibold py-2 px-4 hover:bg-zinc-100'>
                <span className='flex'>
                  <div className='overflow-hidden whitespace-nowrap text-ellipsis'>
                    Condition
                  </div>
                  <div className='ml-1'></div>
                  <div className='ml-2'>
                    <ChevronDown />
                  </div>
                </span>
              </button>
            </div>
          </div>
          <div>
            <button className='items-center rounded-lg hover:border hover:border-zinc-300 pointer inline-flex relative justify-center font-semibold py-2 px-4'>
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
        {/* Right Filters */}
        <div className='flex self-baseline justify-end flex-initial gap-2'>
          <div className='flex-1'>
            <div>
              <section className='block'>
                <div>
                  <div className='text-sm font-semibold underline pointer text-right'>{`${product.listingsCount} Listings`}</div>
                  <section className='block '>
                    <div className='text-base'>{`As low as $${product.lowestPrice}`}</div>
                  </section>
                </div>
              </section>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      {/* Product Details */}
      <div className='bg-white'>
        {/* Breadcrumbs */}
        <div className='pt-4 px-6 mx-auto max-w-[1400px]'>
          <div>
            <nav className='text-xs font-normal leading-6 max-w-full whitespace-nowrap'>
              <ol className='flex-wrap m-0 p-0 items-center flex'>
                <li className='items-center inline-flex flex-[0_0_auto]'>
                  <Link className='text-[#5e616c] underline'>
                    All Categories
                  </Link>
                  <span className='mx-1'>
                    <span>
                      <ChevronRight />
                    </span>
                  </span>
                </li>
                <li className='items-center inline-flex flex-[0_0_auto]'>
                  <Link className='text-[#5e616c] underline'>
                    {product.brand}
                  </Link>
                  <span className='mx-1'>
                    <span>
                      <ChevronRight />
                    </span>
                  </span>
                </li>
                <li className='items-center inline-flex flex-[0_0_auto]'>
                  <Link className='text-[#5e616c] underline'>
                    {product.model}
                  </Link>
                  <span className='mx-1'>
                    <span>
                      <ChevronRight />
                    </span>
                  </span>
                </li>
                <li className='items-center inline-flex flex-[0_0_auto]'>
                  <Link className='text-black font-bold'>{product.part}</Link>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        {/* Product */}
        <div className='p-6 mx-auto grid grid-cols-[37.5%_1fr] grid-rows-[auto_auto]  gap-4'>
          {/* Product Image */}
          <section className='block col-span-1 row-span-2'>
            <section className='block relative bg-[#f7f7f8] rounded-lg'>
              <div className='relative w-full max-w-[493px] aspect-w-5 aspect-h-7 bg-[#f7f7f8] overflow-hidden rounded-lg mx-auto'>
                <img
                  className='block w-full h-full object-cover'
                  src='https://loremflickr.com/412/577/'
                  alt='Example'
                />
              </div>
            </section>
          </section>
          {/* Product Header */}
          <div className='pl-0 col-span-1'>
            <h1 className='text-3xl font-bold leading-none'>{`${product.part} - ${product.model}`}</h1>
            <div className='mb-0 mt-2 block'>
              <div className='inline-block mb-0'>
                <div className='inline-block text-[15px] text-[#767676]'>
                  <Link>
                    <span className='whitespace-nowrap'>Motherboard</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Product Detail Breakdown */}
          <section className='grid grid-cols-2 grid-rows-3 gap-y-4 gap-x-6'>
            {/* Product Details Tabs*/}
            <section className='col-span-1 row-span-3 block m-0'>
              <div className='font-sans text-base font-normal leading-6'>
                <div className='border-b-[1px] border-[#d4d7e2] flex'>
                  <div className='items-center flex flex-auto mb-[-4px] overflow-hidden py-1 justify-start'>
                    <div className='flex flex-[0_0_auto] relative'>
                      <ul className='flex flex-[0_0_auto] gap-4 list-none m-0 p-0 relative'>
                        <li className='m-0 p-0 flex-[0_0_auto]'>
                          <button className='items-center bg-transparent border-none rounded-none cursor-pointer flex justify-center m-0 min-w-full whitespace-nowrap text-black text-xs py-3 px-2 font-bold leading-normal'>
                            Product Details
                          </button>
                        </li>
                      </ul>
                      <div
                        className='bg-[#0835db] bottom-[-1px] h-[2px] left-0 absolute w-[1px]'
                        style={{
                          transform: 'translateX(0px) scaleX(112)',
                          transformOrigin: 'center left',
                        }}></div>
                    </div>
                  </div>
                </div>
                <div className='font-sans text-base font-normal leading-6'>
                  <div className='pt-6'>
                    <div>
                      <div
                        className='relative overflow-hidden'
                        style={{
                          height:
                            'min(var(--wrapperHeight, var(--previewHeight)), max(var(--previewHeight), var(--containerHeight, 0px)))',
                          '--containerHeight': '376px',
                          '--wrapperHeight': '376px',
                          '--seeMoreHeight': '36px',
                          '--previewHeight': '388px',
                        }}>
                        <div className='absolute top-0 left-0 w-full'>
                          <div className='text-base'>
                            <div className='mb-1'>{product.description}</div>
                            <ul>
                              <li className='mb-1'>
                                <div>
                                  <strong className='mr-2 font-bold'>
                                    Model:{' '}
                                  </strong>
                                  <span>{product.model}</span>
                                </div>
                              </li>
                              <li className='mb-1'>
                                <div>
                                  <strong className='mr-2 font-bold'>
                                    Serial #:{' '}
                                  </strong>
                                  <span>{product.serialNumber}</span>
                                </div>
                              </li>
                              <li className='mb-1'>
                                <div>
                                  <strong className='mr-2 font-bold'>
                                    Specs:{' '}
                                  </strong>
                                  <span>{product.specs}</span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Product Details Spotlight */}
            <section className='col-span-1 row-span-1'>
              <div className='text-base rounded-lg border border-[#D4D7E2] overflow-hidden'>
                {/* Condition */}
                <section className='block text-base p-4'>
                  {product.condition}
                </section>
                {/* Listing */}
                <section className='block relative px-4 pb-2'>
                  <span className='text-black leading-normal text-3xl font-bold'>{`$${product.lowestPrice}`}</span>
                  <div className='inline text-sm text-black lowercase ml-2'>
                    Shipping: <Link className='text-blue-600'>Included</Link>
                  </div>
                </section>
                {/* Seller */}
                <section className='block text-sm text-[#5e616c] px-4 pb-2'>
                  Sold by:{' '}
                  <Link className='underline'>{product.lowestPriceSeller}</Link>
                </section>
                {/* Add to Cart */}
                <section className='block px-4 pb-4'>
                  <section className='block'>
                    <div className='flex max-w-none mx-auto'>
                      <div className='flex flex-row flex-nowrap w-full items-center'>
                        {/* Quantity */}
                        <div className='basis-1/2'>
                          <div className='max-w-none mx-auto flex flex-row flex-nowrap h-11'>
                            <div className='flex flex-row flex-nowrap border border-[#D4D7E2] rounded-lg overflow-hidden w-full h-full'>
                              <div className='relative basis-1/2 text-sm font-normal h-full'>
                                <div
                                  className='relative overflow-hidden h-full'
                                  title='Update Product Quantity'>
                                  <select className='truncate bg-white relative inline-block appearance-none cursor-pointer w-full pl-3 pr-7 border border-[#f7f7f8] font-normal h-full'>
                                    {Array.from(
                                      {
                                        length: product.lowestPriceQuantity,
                                      },
                                      (_, i) => (
                                        <option
                                          key={i + 1}
                                          className='px-1 py-0.5'>
                                          {i + 1}
                                        </option>
                                      )
                                    )}
                                  </select>
                                  <div className='absolute inset-y-0 right-3 flex items-center pointer-events-none'>
                                    <ChevronDown />
                                  </div>
                                </div>
                              </div>
                              <span className='flex whitespace-nowrap basis-1/2 items-center justify-center bg-[#f9f9f9] border-l-2 border-[#D4D7E2] font-normal px-2'>
                                {`of ${product.lowestPriceQuantity}`}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Submit */}
                        <div className='basis-1/2 ml-2'>
                          <button className='items-center rounded-lg border cursor-pointer inline-flex relative justify-center py-2 px-4 bg-blue-700 border-blue-600 text-white w-full h-11'>
                            <span className='flex'>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                </section>
              </div>
            </section>
            <section className='col-span-1 row-span-2 space-y-3'>
              {/* View All Listings */}
              <section className='col-span-1 row-span-1 text-center p-4 border rounded-lg border-[#D4D7E2] max-h-[72px] flex items-center justify-center'>
                <Link>
                  <span className='font-bold underline text-base'>
                    {`View ${product.listingsCount} Other Listings`}
                  </span>
                  <section>
                    <div>{`As low as $${product.lowestPrice}`}</div>
                  </section>
                </Link>
              </section>
              {/* Product User Actions */}
              <div className=' col-span-1 row-span-1 flex flex-row justify-center items-start gap-10 mb-0'>
                <Link
                  className='px-4 text-black text-center flex items-center'
                  onClick={() => {
                    handleSellWithUsModal();
                    setSellWIthUsStage('Confirm');
                  }}>
                  Sell This
                  <BoxArrowUpRight className='ml-1' />
                </Link>
                {/* Sell with Us Modal: Confirm Details*/}
                {sellWithUsModal && sellWithUsStage == 'Confirm' && (
                  <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#111820b3]'>
                    <div className='bg-white rounded-2xl flex flex-col w-full max-w-[33%] max-h-[90%] p-6 shadow-lg'>
                      {/* Header */}
                      <div className='flex items-center justify-between mb-4'>
                        <h2 className='font-bold text-lg'>Confirm Details</h2>
                        <button
                          className='bg-[#f7f7f7] rounded-full border-none w-8 h-8 flex items-center justify-center text-black'
                          onClick={() => handleSellWithUsModal()}>
                          x
                        </button>
                      </div>
                      {/* Body */}
                      <div className='flex-auto overflow-auto'>
                        <div className='mb-6'>
                          <div className='text-[#707070] mb-6'>
                            The item details below will pre-fill your listing.
                          </div>
                          <div className='flex justify-between'>
                            {/* Left Content */}
                            <div className='max-w-60'>
                              <div className='items-center rounded-lg flex justify-center overflow-hidden relative h-60 w-60'>
                                <img
                                  src='https://loremflickr.com/246/246/'
                                  alt='Example'
                                  className='max-h-full max-w-full object-contain'
                                />
                              </div>
                            </div>
                            {/* Right Content */}
                            <div className='ml-4 flex-grow'>
                              <div className='text-base font-bold leading-6 text-[#191919] mb-5'>
                                {product.part}
                              </div>
                              <div className='text-[#707070] text-sm leading-5 mb-1'>
                                {`Model: ${product.model}`}
                              </div>
                              <div className='text-[#707070] text-sm leading-5 mb-1'>
                                {`Serial Number: ${product.serialNumber}`}
                              </div>
                              <div className='text-[#707070] text-sm leading-5 mb-1'>
                                {`Specs: ${product.specs}`}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Continue */}
                        <div className='flex justify-center mt-5'>
                          <button
                            className='bg-[#3665f3] text-white font-bold py-2 px-6 rounded-3xl w-80 h-12'
                            onClick={() => setSellWIthUsStage('Condition')}>
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Sell with Us Modal: Condition*/}
                {sellWithUsModal && sellWithUsStage == 'Condition' && (
                  <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#111820b3]'>
                    <div className='bg-white rounded-2xl flex flex-col w-full max-w-[33%] max-h-[90%] p-6 shadow-lg'>
                      {/* Header */}
                      <div className='flex items-center justify-between mb-4'>
                        <h2 className='font-bold text-lg'>Select condition</h2>
                        <button
                          className='bg-[#f7f7f7] rounded-full border-none w-8 h-8 flex items-center justify-center text-black'
                          onClick={() => handleSellWithUsModal()}>
                          x
                        </button>
                      </div>
                      {/* Body */}
                      <div className='flex-auto overflow-auto'>
                        <div className='mb-6'>
                          <ul className='list-none m-0 p-0'>
                            <li className='mb-4'>
                              <button
                                onClick={() => setSelectedCondition('New')}
                                className={`inline-block text-sm m-0 min-w-20 align-bottom w-full border border-[#8f8f8f] rounded-lg text-black min-h-16 py-3 px-4 ${
                                  selectedCondition == 'New'
                                    ? 'border-2 bg-[#f5f5f5]'
                                    : 'hover:bg-[#f5f5f5]'
                                }`}>
                                <span className='text-black text-base leading-6 font-bold'>
                                  New
                                </span>
                                <span className='text-[#707070] block text-xs font-normal leading-4 mt-1'>
                                  Perfect condition, never used or opened.
                                </span>
                              </button>
                            </li>
                            <li className='mb-4'>
                              <button
                                onClick={() => setSelectedCondition('Used')}
                                className={`inline-block text-sm m-0 min-w-20 align-bottom w-full border border-[#8f8f8f] rounded-lg text-black min-h-16 py-3 px-4 ${
                                  selectedCondition == 'Used'
                                    ? 'border-2 bg-[#f5f5f5]'
                                    : 'hover:bg-[#f5f5f5]'
                                }`}>
                                <span className='text-black text-base leading-6 font-bold'>
                                  Used
                                </span>
                                <span className='text-[#707070] block text-xs font-normal leading-4 mt-1'>
                                  Previously owned and shows signs of use.
                                </span>
                              </button>
                            </li>
                            <li className='mb-4'>
                              <button
                                onClick={() =>
                                  setSelectedCondition('Refurbished')
                                }
                                className={`inline-block text-sm m-0 min-w-20 align-bottom w-full border border-[#8f8f8f] rounded-lg text-black min-h-16 py-3 px-4 ${
                                  selectedCondition == 'Refurbished'
                                    ? 'border-2 bg-[#f5f5f5]'
                                    : 'hover:bg-[#f5f5f5]'
                                }`}>
                                <span className='text-black text-base leading-6 font-bold'>
                                  Refurbished
                                </span>
                                <span className='text-[#707070] block text-xs font-normal leading-4 mt-1'>
                                  {' '}
                                  Restored to full working order by a
                                  professional.
                                </span>
                              </button>
                            </li>
                          </ul>
                        </div>
                        {/* Continue */}
                        <div className='flex justify-center mt-5'>
                          <button
                            className={`${
                              selectedCondition == ''
                                ? 'bg-[#c7c7c7]'
                                : 'bg-[#3665f3]'
                            } text-white font-bold py-2 px-6 rounded-3xl w-80 h-12`}
                            onClick={() => {
                              setAddListing({ condition: selectedCondition });
                              setSellWIthUsStage('Price');
                            }}>
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Sell with Us Modal: Price*/}
                {sellWithUsModal && sellWithUsStage == 'Price' && (
                  <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#111820b3]'>
                    <div className='bg-white rounded-2xl flex flex-col w-full max-w-[33%] max-h-[90%] p-6 shadow-lg'>
                      {/* Header */}
                      <div className='flex items-center justify-between mb-4'>
                        <h2 className='font-bold text-lg'>Enter Price</h2>
                        <button
                          className='bg-[#f7f7f7] rounded-full border-none w-8 h-8 flex items-center justify-center text-black'
                          onClick={() => handleSellWithUsModal()}>
                          x
                        </button>
                      </div>
                      {/* Body */}
                      <div className='flex-auto overflow-auto'>
                        <div className='mb-6'>
                          <label
                            htmlFor='price'
                            className='block text-sm font-medium text-[#707070] mb-2'>
                            Enter the selling price for your item:
                          </label>
                          <input
                            type='number'
                            id='price'
                            className='w-full border border-[#8f8f8f] rounded-lg px-4 py-3 text-black text-base focus:outline-none focus:ring-2 focus:ring-[#3665f3]'
                            placeholder='Enter price in USD'
                            value={selectedPrice}
                            onChange={(e) => setSelectedPrice(e.target.value)}
                          />
                        </div>
                        {/* Continue */}
                        <div className='flex justify-center mt-5'>
                          <button
                            className={`${
                              selectedPrice === ''
                                ? 'bg-[#c7c7c7]'
                                : 'bg-[#3665f3]'
                            } text-white font-bold py-2 px-6 rounded-3xl w-80 h-12`}
                            disabled={selectedPrice === ''}
                            onClick={() => {
                              setAddListing((prev) => ({
                                ...prev,
                                price: selectedPrice,
                              }));
                              setSellWIthUsStage('Finalize');
                            }}>
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Sell with Us Modal: Finalize*/}
                {sellWithUsModal && sellWithUsStage == 'Finalize' && (
                  <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#111820b3]'>
                    <div className='bg-white rounded-2xl flex flex-col w-full max-w-[33%] max-h-[90%] p-6 shadow-lg'>
                      {/* Header */}
                      <div className='flex items-center justify-between mb-4'>
                        <h2 className='font-bold text-lg'>
                          Review Your Listing
                        </h2>
                        <button
                          className='bg-[#f7f7f7] rounded-full border-none w-8 h-8 flex items-center justify-center text-black'
                          onClick={() => handleSellWithUsModal()}>
                          x
                        </button>
                      </div>
                      {/* Body */}
                      <div className='flex-auto overflow-auto'>
                        <div className='mb-6'>
                          <h3 className='text-base font-bold text-[#191919] mb-3'>
                            Confirm the details below:
                          </h3>
                          <div className='text-sm text-[#707070] mb-3'>
                            Ensure everything is accurate before submitting your
                            listing.
                          </div>
                          {/* Display Selected Condition */}
                          <div className='mb-4'>
                            <div className='text-sm font-medium text-[#191919] mb-1'>
                              Condition:
                            </div>
                            <div className='text-base text-[#707070]'>
                              {addListing.condition || selectedCondition}
                            </div>
                          </div>
                          {/* Display Selected Price */}
                          <div className='mb-4'>
                            <div className='text-sm font-medium text-[#191919] mb-1'>
                              Price:
                            </div>
                            <div className='text-base text-[#707070]'>
                              ${addListing.price || selectedPrice}
                            </div>
                          </div>
                        </div>
                        {/* Continue */}
                        <div className='flex justify-center mt-5'>
                          <button
                            className='bg-[#3665f3] text-white font-bold py-2 px-6 rounded-3xl w-80 h-12'
                            onClick={() => {
                              // Submit the listing or move to the next step
                              console.log('Finalizing listing:', addListing);
                              handleSellWithUsModal(); // Close the modal
                            }}>
                            Submit Listing
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div>
                    <span
                      className='text-sm text-center text-[#5e616c] cursor-pointer flex items-center'
                      onClick={() => handleReportProblemModal()}>
                      Report a Problem
                      <InfoCircle />
                    </span>

                    {/*Report of Problem Modal */}
                    {reportProblemModal && (
                      <div className='fixed w-full h-full top-0 left-0 z-50 p-0 bg-[#0009]'>
                        <div className='overflow-y-auto overflow-x-hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto max-w-2xl h-auto rounded-lg'>
                          <div className='flex flex-col h-full'>
                            <section className='relative bg-white font-bold text-black flex justify-between items-center border-b-2 border-[#DEE3EA] text-center p-6'>
                              <h1 className='m-0 p-0 font-bold'>
                                Report A Problem
                              </h1>
                              <span
                                className='cursor-pointer py-3 px-4 text-black font-normal text-[1rem]'
                                onClick={() => handleReportProblemModal()}>
                                <XIcon />
                              </span>
                            </section>

                            <section
                              className='block bg-white overflow-hidden overflow-y-auto h-full w-auto'
                              style={{
                                maxHeight: 'calc(100vh - 130px)',
                              }}>
                              <section className='block p-6'>
                                <div>
                                  <span>Please tell us about the problem:</span>
                                  <span
                                    className='mt-4 flex flex-row-reverse justify-end items-center'
                                    onClick={() =>
                                      handleActiveFeedback('Incorrect Image')
                                    }
                                    onMouseEnter={() =>
                                      setHover((prev) => ({
                                        ...prev,
                                        'Incorrect Image': true,
                                      }))
                                    }
                                    onMouseLeave={() =>
                                      setHover((prev) => ({
                                        ...prev,
                                        'Incorrect Image': false,
                                      }))
                                    }>
                                    <label className='ml-4 cursor-pointer'>
                                      Incorrect Image
                                    </label>
                                    <section className='block relative text-2xl leading-4 cursor-pointer'>
                                      {activeFeedback !== 'Incorrect Image' && (
                                        <CircleIcon
                                          hover={hover['Incorrect Image']}
                                        />
                                      )}
                                      {activeFeedback === 'Incorrect Image' && (
                                        <SelectedCircle />
                                      )}
                                    </section>
                                  </span>
                                  <span
                                    className='mt-4 flex flex-row-reverse justify-end items-center'
                                    onClick={() =>
                                      handleActiveFeedback(
                                        'Incorrect Product Details'
                                      )
                                    }
                                    onMouseEnter={() =>
                                      setHover((prev) => ({
                                        ...prev,
                                        'Incorrect Product Details': true,
                                      }))
                                    }
                                    onMouseLeave={() =>
                                      setHover((prev) => ({
                                        ...prev,
                                        'Incorrect Product Details': false,
                                      }))
                                    }>
                                    <label className='ml-4 cursor-pointer'>
                                      Incorrect Product Details
                                    </label>
                                    <section className='block relative text-2xl leading-4 cursor-pointer'>
                                      {activeFeedback !==
                                        'Incorrect Product Details' && (
                                        <CircleIcon
                                          hover={
                                            hover['Incorrect Product Details']
                                          }
                                        />
                                      )}
                                      {activeFeedback ===
                                        'Incorrect Product Details' && (
                                        <SelectedCircle />
                                      )}
                                    </section>
                                  </span>
                                  <span
                                    className='mt-4 flex flex-row-reverse justify-end items-center'
                                    onClick={() =>
                                      handleActiveFeedback(
                                        'Inappropriate Content'
                                      )
                                    }
                                    onMouseEnter={() =>
                                      setHover((prev) => ({
                                        ...prev,
                                        'Inappropriate Content': true,
                                      }))
                                    }
                                    onMouseLeave={() =>
                                      setHover((prev) => ({
                                        ...prev,
                                        'Inappropriate Content': false,
                                      }))
                                    }>
                                    <label className='ml-4 cursor-pointer'>
                                      Inappropriate Content
                                    </label>
                                    <section className='block relative text-2xl leading-4 cursor-pointer'>
                                      {activeFeedback !==
                                        'Inappropriate Content' && (
                                        <CircleIcon
                                          hover={hover['Inappropriate Content']}
                                        />
                                      )}
                                      {activeFeedback ===
                                        'Inappropriate Content' && (
                                        <SelectedCircle />
                                      )}
                                    </section>
                                  </span>
                                  <span
                                    className='mt-4 flex flex-row-reverse justify-end items-center'
                                    onClick={() =>
                                      handleActiveFeedback('Other Feedback')
                                    }
                                    onMouseEnter={() =>
                                      setHover((prev) => ({
                                        ...prev,
                                        'Other Feedback': true,
                                      }))
                                    }
                                    onMouseLeave={() =>
                                      setHover((prev) => ({
                                        ...prev,
                                        'Other Feedback': false,
                                      }))
                                    }>
                                    <label className='ml-4 cursor-pointer'>
                                      Other Feedback
                                    </label>
                                    <section className='block relative text-2xl leading-4 cursor-pointer'>
                                      {activeFeedback !== 'Other Feedback' && (
                                        <CircleIcon
                                          hover={hover['Other Feedback']}
                                        />
                                      )}
                                      {activeFeedback === 'Other Feedback' && (
                                        <SelectedCircle />
                                      )}
                                    </section>
                                  </span>
                                  <textarea
                                    className='my-4 border border-[#B6B6B6] rounded w-[616px] p-4'
                                    placeholder='Comments'></textarea>
                                </div>
                                {/* Feedback buttons */}
                                <section className='grid grid-cols-2'>
                                  <div
                                    className='border border-black rounded flex justify-center items-center h-[48px] cursor-pointer font-semibold'
                                    onClick={() => handleReportProblemModal()}>
                                    Cancel
                                  </div>
                                  <div className='rounded flex justify-center items-center h-[48px] cursor-pointer font-semibold border border-[#0835db] bg-[#0835db] text-white hover:bg-[#164bea]'>
                                    Submit
                                  </div>
                                </section>
                              </section>
                            </section>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </section>
          {/* Product Price Guide */}
          <section className='block my-0'>
            <div>
              <h2 className='text-lg font-bold leading-none text-left'>
                Market Price History
              </h2>
              <span className='block p-0 m-0 overflow-hidden'>
                <canvas
                  className='block h-[395px] w-[357px]'
                  ref={chartRef}></canvas>
              </span>
            </div>
          </section>
        </div>
      </div>
      {/* All Listings */}
      <section className='m-auto bg-[#f7f7f8] p-6 max-w-[1448px]'>
        <section className='block'>
          {/* Listing Toolbar */}
          <div className='w-full flex justify-between'>
            {/* Listing Total */}
            <section>
              <div className='text-base font-normal'>
                <div className='text-4xl font-bold mb-1'>
                  {product.listingsCount} Listings
                </div>
                {/* Top Listing Price */}
                <section>
                  <div className='text-base text-left'>{`As low as $${product.lowestPrice}`}</div>
                </section>
              </div>
            </section>
            {/* Toolbar Options */}
            <div className='flex justify-between items-end mt-auto mb-0'>
              <span className='flex justify-between items-end mt-auto mb-0'>
                {/* Sort By */}
                <span className='w-full pl-3'>
                  <div>
                    <div>
                      <label className='items-center text-black flex text-sm font-semibold'>
                        <span>Sort By</span>
                      </label>
                      <div onClick={() => handleSortByDropdown()}>
                        <div
                          className='inline-flex max-w-full relative w-full'
                          ref={dropDownRef}>
                          <div className='inline-flex max-w-full relative text-base font-normal text-[#5e616c] w-[192px]'>
                            <div className='border border-[#d4d7e2] rounded-lg overflow-hidden text-left text-ellipsis whitespace-nowrap w-full bg-white py-2 px-4 pr-[calc(1rem+1rem+0.5rem)]'>
                              <span>{activeSortByKey}</span>
                            </div>
                            <button className='bg-transparent border-none rounded-none m-0 p-0 right-4 absolute top-1/2 translate-y-[-50%]'>
                              <span className='inline-flex'>
                                <DownCaret fillColor={'#5e616c'} />
                              </span>
                            </button>
                          </div>
                          <div className='static'>
                            {sortByDropdown && (
                              <ul className='text-base font-normal m-0 bg-white rounded-lg shadow-lg text-black max-w-[100vw] min-w-60 overflow-auto p-2 absolute z-10 left-0 right-0 outline-none focus:outline-dashed focus:outline-1 focus:outline-[#1f2cdd] top-[100%] mt-2'>
                                {Object.keys(activeAllListingFilter).map(
                                  (key) => (
                                    <li
                                      key={key}
                                      className={`items-center rounded-lg flex mb-2 py-2 px-4 relative ${
                                        activeAllListingFilter[key]
                                          ? 'bg-[#f8fbff]'
                                          : 'bg-white hover:bg-[#f7f7f8]'
                                      } text-[#121212] cursor-pointer`}>
                                      <span
                                        className='grow'
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveAllListingFilter((prev) =>
                                            Object.keys(prev).reduce(
                                              (newState, currKey) => {
                                                newState[currKey] =
                                                  currKey == key;
                                                return newState;
                                              },
                                              {}
                                            )
                                          );
                                          handleSortByDropdown();
                                        }}>
                                        {key}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </span>
                {/* Pagination */}
                <span className='w-full pl-3'>
                  <div>
                    <div>
                      <label className='items-center text-black flex text-sm font-semibold'>
                        <span>Listings / Page</span>
                      </label>
                      <div onClick={() => handlePaginationDropdown()}>
                        <div
                          className='inline-flex max-w-full relative w-full'
                          ref={dropDownRef}>
                          <div className='inline-flex max-w-full relative text-base font-normal text-[#5e616c] w-[192px]'>
                            <div className='border border-[#d4d7e2] rounded-lg overflow-hidden text-left text-ellipsis whitespace-nowrap w-full bg-white py-2 px-4 pr-[calc(1rem+1rem+0.5rem)]'>
                              <span>{activePaginationKey}</span>
                            </div>
                            <button className='bg-transparent border-none rounded-none m-0 p-0 right-4 absolute top-1/2 translate-y-[-50%]'>
                              <span className='inline-flex'>
                                <DownCaret fillColor={'#5e616c'} />
                              </span>
                            </button>
                          </div>
                          <div className='static'>
                            {paginationDropdown && (
                              <ul className='text-base font-normal m-0 bg-white rounded-lg shadow-lg text-black max-w-[100vw] min-w-60 overflow-auto p-2 absolute z-10 left-0 right-0 outline-none focus:outline-dashed focus:outline-1 focus:outline-[#1f2cdd] top-[100%] mt-2'>
                                {Object.keys(activeAllListingPagination).map(
                                  (key) => (
                                    <li
                                      key={key}
                                      className={`items-center rounded-lg flex mb-2 py-2 px-4 relative ${
                                        activeAllListingPagination[key]
                                          ? 'bg-[#f8fbff]'
                                          : 'bg-white hover:bg-[#f7f7f8]'
                                      } text-[#121212] cursor-pointer`}>
                                      <span
                                        className='grow'
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveAllListingPagination(
                                            (prev) =>
                                              Object.keys(prev).reduce(
                                                (newState, currKey) => {
                                                  newState[currKey] =
                                                    currKey == key;
                                                  return newState;
                                                },
                                                {}
                                              )
                                          );
                                          handlePaginationDropdown();
                                        }}>
                                        {key}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </span>
              </span>
            </div>
          </div>
          {/* Listing List */}
          <section className='px-6 pt-6'>
            <section>
              {/* Listings */}
              <div className='flex flex-col gap-2'>
                {currentListings.map((listing, index) => (
                  <section
                    key={index}
                    className='bg-white rounded-lg border-b-0 shadow-[0_1px_2px_#0003]'>
                    <div className='grid grid-cols-3 items-center p-4 gap-4'>
                      {/* Seller Info */}
                      <div className='flex flex-col'>
                        <div className='ml-0'>
                          <Link
                            to={`/seller/${listing.storeName}`}
                            className='text-sm font-semibold leading-5 text-left text-black'>
                            {listing.storeName}
                          </Link>
                          <div className='flex my-1 text-[#5f6d7a] text-xs font-medium tracking-wide'>
                            <div className='text-xs font-medium tracking-wide text-[#767676]'>
                              {`${listing.reputation.rating}%`}
                            </div>
                            <div className='ml-1'>{`(${listing.reputation.totalSales} Sales)`}</div>
                          </div>
                        </div>
                      </div>
                      {/* Listing Info */}
                      <div className='self-start text-xs tracking-wide px-2 flex flex-col items-start justify-center border-none'>
                        <h3 className='m-0 p-0 text-sm font-bold'>
                          <Link>{listing.condition}</Link>
                        </h3>
                        <div className='text-lg font-bold text-[#05772d] tracking-wide'>{`$${listing.price}`}</div>
                        <div className='text-xs tracking-wide'>
                          <span>{`+ $${listing.shipping} Shipping`}</span>
                        </div>
                      </div>
                      {/* Add to Cart */}
                      <div className='p-0 flex justify-end border-none my-auto mx-0'>
                        <section className='block'>
                          <div className='flex max-w-[436px] w-full justify-end'>
                            <div className='flex flex-wrap justify-end gap-2'>
                              {/* Quantity Input */}
                              <div className='basis-auto min-w-[124px]'>
                                <div className='flex max-w-[436px] w-full'>
                                  <div className='flex flex-row flex-nowrap border border-[#d4d7e2] rounded-lg overflow-hidden w-full h-auto'>
                                    <div className='relative basis-2/4 text-xs font-normal'>
                                      <div className='relative overflow-hidden'>
                                        <select className='overflow-hidden whitespace-nowrap text-ellipsis bg-white relative inline-block cursor-pointer rounded border h-11 w-full pl-3 pr-7 font-normal text-base leading-none'>
                                          {Array.from(
                                            {
                                              length: listing.availableQuantity,
                                            },
                                            (_, i) => i + 1
                                          ).map((value) => (
                                            <option
                                              key={value}
                                              className='whitespace-nowrap cursor-pointer text-[#121212] font-normal text-base leading-none'>
                                              {value}
                                            </option>
                                          ))}
                                        </select>

                                        {/* <ChevronDown /> */}
                                      </div>
                                    </div>
                                    <span className='flex whitespace-nowrap basis-1/2 items-center justify-center bg-[#f9f9f9] border-l-[1px] border-[#d4d7e2] text-base font-normal px-2'>{`of ${listing.availableQuantity}`}</span>
                                  </div>
                                </div>
                              </div>
                              {/* Submit */}
                              <div className='text-base font-normal text-[#0f0f0f] min-w-32 basis-auto'>
                                <button className='m-0 font-semibold items-center rounded-lg border cursor-pointer inline-flex relative justify-center py-2 px-4 bg-[#0835db] border-[#0835db] text-white h-11 w-full'>
                                  <span className='flex'>Add to Cart</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </section>
                ))}
              </div>
              {/* Pages */}
              <div className='items-center flex gap-1 max-w-full whitespace-nowrap pt-2 justify-center'>
                {/* Left Chevron */}
                <Link
                  onClick={() => handlePageClick(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className='text-base min-w-10 p-2'>
                  <span>
                    <span>
                      <ChevronLeft />
                    </span>
                  </span>
                </Link>
                {/* Pages */}
                <div className='whitespace-nowrap flex overflow-hidden py-1'>
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`font-semibold items-center rounded-lg cursor-pointer inline-flex relative justify-center px-4 py-2 ${
                          currentPage === page
                            ? 'bg-[#0835db] text-white hover:bg-[#1944e8]'
                            : 'hover:bg-white hover:border-[#d4d7e2]'
                        }`}>
                        {page}
                      </button>
                    );
                  })}
                </div>
                {/* Right Chevron */}
                <Link
                  onClick={() => handlePageClick(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className='text-base min-w-10 p-2'>
                  <span>
                    <span>
                      <ChevronRight />
                    </span>
                  </span>
                </Link>
              </div>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
};

export default IndividualItem;
