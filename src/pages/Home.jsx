import React from 'react';
import heroImage from '../assets/heroImage.webp';

const Home = () => {
  return (
    <section className='relative w-full'>
      <div className='relative'>
        <img
          src={heroImage}
          className='w-full h-[50vh] object-cover object-center brightness-50'
          alt='Hero'
        />
        <div className='absolute inset-0 flex items-start justify-start p-16 z-10'>
          <div className='text-base text-white font-normal'>
            <div className='font-extrabold leading-loose m-0 uppercase indent-0.5 text-[#d88a59]'>
              Featured Article
            </div>
            <div className='text-5xl leading-[3rem] font-extrabold'>
              Electronic Repair Tips
            </div>
            <div className='mb-6 font-normal'>Industry leaders share secrets</div>
            <span className='py-2 px-4 my-1 rounded bg-[#d88a59]'>Read</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
