'use client'

import { Bell, Calendar, Grip,  Link2, Menu, Plus, Settings, BriefcaseIcon, Users, BarChartBig, Store, CircleArrowRight, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import MenuBox from './ui/MenuBox';
import useUserStore from '@/store/globalUserStore';
import { useLogOut } from '@/hooks';
import { urls } from '@/constants';
import { useAppointmentContext } from '@/context/AppointmentContext';
import SelectWorkspace from './workspace/SelectWorkspace';
import Image from 'next/image';

type NavLink = {
  icon: React.ElementType;
  label: string;
  link: string;
  newTab?: boolean;
};
const navlinks:NavLink[] = [
  {
    icon: Link2,
    label: 'Schedules',
    link:  urls.schedule,
  },
  {
    icon: Calendar,
    label: 'Calendar',
    link: urls.calendar,
  },
  {
    icon: Briefcase,
    label: 'Appointments',
    link: urls.appointments,
  },

  {
    icon: Users,
    label: 'Contacts',
    link: urls.contacts,
  },
  {
    icon: BarChartBig,
    label: 'Analytics',
    link: urls.analytics,
  },
  // {
  //   icon: Store,
  //   label: 'Store Front',
  //   link: urls.shopFrontBooking,
  //   newTab: true,
  // },
  // {
  //   icon: Bell,
  //   label: 'Notification',
  //   link: `/appointments/notification`,
  // },
  {
    icon: Settings,
    label: 'Settings',
    link: urls.settingsProfile,
  },
];

const Sidebar = () => {
  const pathanme = usePathname()
  const  {user} = useUserStore()
  const {logOut} = useLogOut(urls.root)
  const {setActivePath, getWsUrl} = useAppointmentContext()

  // control the activePath for contacts
  const handleClick = () => {
    if (pathanme.includes(urls.contacts)) setActivePath('')
  }

  return (
    <nav className=" text-[12px] px-4 py-6  h-full w-full flex flex-col justify-between ">
      <div className="w-full space-y-2">

        <div className="flex gap-4 items-center w-full pb-2">
          <div className=" h-14 w-14 flex-shrink-0 rounded-full flex justify-center items-center bg-baseLight" 
          >
            <div className="h-12 w-12 flex-shrink-0 " 
            >
              {
                user?.profilePicture ?
                <Image src={user?.profilePicture } alt='profile-image' width={300} height={300} className='h-full w-full rounded-full object-cover'/>
                :
                <div className="h-full w-full  bg-basePrimary rounded-full"></div>
              }
            </div>
          </div>
          <div>
            <p className="text-ash leading-tight">Hello,</p>
            <p className="text-base font-medium">{user?.firstName}</p>
            <small>{user?.workspaceRole}</small>
          </div>
        </div>

        <div className="border rounded-xl p-2 text-center w-full space-y-1">
          <h5 className="text-base font-medium">Get Started</h5>
          <p className="text-ash pb-1 text-[12px]">Creating and managing your schedules couldn’t be easier.</p>

          <Link href={getWsUrl(urls.create)} className='flex justify-between gap-6 items-center py-2 px-5 text-white rounded-md'
          style={{background: `linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)`
          }}
          >
            <p className="text- font-medium">Create</p>
            <Plus size={16} />
          </Link>
        </div>

        <div className="space-y-1 py-6">
          {navlinks.map(({ icon, label, link, newTab }, idx) => {
            const Icon = icon;
            return (
              <Link key={idx} href={getWsUrl(link)} onClick={handleClick} target={newTab ? '_blank' : ''}  className={`${pathanme.includes(link)?'bg-gradient-to-r from-slate-200 to-purple-200':''} flex gap-4 items-center px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-slate-200  hover:to-purple-200 duration-300 group `}>
                <div>
                  <Icon size={18} className={`${pathanme.includes(link)?'text-purple-800':''} group-hover:text-purple-800 duration-300 `}
                  />
                </div>
                <p className={`${pathanme.includes(link)?'text-blue-700':''} group-hover:text-blue-700 font-medium duration-300 `}>{label}</p>

                {label === 'Notification' ? (
                  <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-gradient-to-l from-purple-700 to-blue-700">
                    {2}
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>

        <div  className="space-y-2 py-4 border-y">
          <SelectWorkspace/>
          <MenuBox />
          
          {/* <Link href={'/appointments/help'} className={`flex gap-4 items-center p-2 rounded-md  hover:bg-gradient-to-r hover:from-slate-200  hover:to-purple-200 duration-300 group`}>
            <div className="group-hover:text-purple-800 duration-300">
              <HelpCircle size={18} />
            </div>
            <p className="group-hover:text-blue-700 font-medium duration-300">User Help</p>
          </Link> */}
        </div>

      </div>

      <button onClick={()=>logOut()} type="button" className="flex w-full gap-4 items-center p-2 rounded-md hover:bg-gradient-to-r hover:from-slate-200  hover:to-purple-200 duration-300 group">
      <div className="group-hover:text-purple-700 duration-300">
        <CircleArrowRight />
      </div>
        <p className='group-hover:text-blue-700 font-medium duration-300"'>Log Out</p>
      </button>
    </nav>
  );
};

export default Sidebar;
