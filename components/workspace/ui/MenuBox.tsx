'use client'

import Image from 'next/image';
import React  from 'react';
import Link from 'next/link'
import { PopoverMenu } from '@/components/shared/PopoverMenu';
import { Grip } from 'lucide-react';


const MenuBox: React.FC = () => {
  return (
    <PopoverMenu
    className={`rounded-lg ml-6 w-60 p-2 bg-baseLight`} 
    trigerBtn={
      <button
       className={`flex gap-4 items-center p-2 rounded-md group`}>
          <div className="group-hover:text-purple-800 duration-300">
            <Grip size={18}/>
          </div>
          <p className="group-hover:text-blue-700 font-medium duration-300">More Tools</p>
      </button>
    }>
      <div>
        <div
          className="h-full bg-white/50 pb-12 rounded-md w-full grid grid-cols-2 gap-3 p-4 "
        >
            <Link href='https://www.zikoro.com/events' target='_blank'
              className="w-full"
            >
                <Image src={'/zikoro-events.png'} alt='zikoro-events' height={150} width={250} className='w-full object-contain shrink-0'/>
            </Link>
        </div>
      </div> 
    </PopoverMenu>
  );
};

export default MenuBox;
