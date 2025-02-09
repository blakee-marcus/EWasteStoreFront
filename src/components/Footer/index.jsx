import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const brandList = [
    'HP',
    'Lenovo',
    'Microsoft',
    'DELL',
    'Apple',
    'All Brands'
  ];

  const articleNames = [
    'E-Waste Solutions',
    'Electronic Repair Tips',
    'E-Recycling Best Practices',
    'Fixing vs. Replacing',
    'E-Waste Disposal Guide',
  ];

  return (
    <footer className='flex flex-row flex-wrap justify-between p-6 border-t border-zinc-200 bg-[#F0F1F2]'>
      <div className='w-1/5'>
        <nav>
          <h2 className='text-base font-semibold leading-normal'>Need Help?</h2>
          <ul className='text-sm leading-normal font-light'>
            <li><Link>Contact Customer Service</Link></li>
            <li><Link>Help Center</Link></li>
            <li><Link>Accessibility</Link></li>
            <li><Link>Leave Us Feedback</Link></li>
            <li><Link>Refund and Return Policy</Link></li>
          </ul>
        </nav>
      </div>

      <div className='w-1/5'>
        <nav>
          <h2 className='text-base font-semibold leading-normal'>Shop</h2>
          <ul className='text-sm leading-normal font-light'>
            {brandList.map((brand) => (
              <li key={brand}>
                <Link to={brand.toLowerCase()}>{brand}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className='w-1/5'>
        <nav>
          <h2 className='text-base font-semibold leading-normal'>Articles</h2>
          <ul className='text-sm leading-normal font-light'>
            {articleNames.map((article) => (
              <li key={article}>
                <Link>{article}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className='w-1/5'>
        <nav>
          <h2 className='text-base font-semibold leading-normal'>Sell With Us</h2>
          <ul className='text-sm leading-normal font-light'>
            <li><Link>Become a Seller</Link></li>
            <li><Link>Advertise With Us</Link></li>
            <li><Link>Join Our Affiliate Program</Link></li>
          </ul>
        </nav>
      </div>

      <div className='w-1/5'>
        <nav>
          <h2 className='text-base font-semibold leading-normal'>About</h2>
          <ul className='text-sm leading-normal font-light'>
            <li><Link to='about'>About Us</Link></li>
            <li><Link to='values'>Our Core Values</Link></li>
            <li><Link to='culture'>Working at ECycle</Link></li>
            <li><Link to='careers'>Careers</Link></li>
            <li><Link to='press'>Press Center</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
