import { AppointmentLink } from '@/types/appointments';
import React from 'react';

interface EmbedProps {
  embed: boolean; 
  data?: AppointmentLink;
  link?: string
}

const EmbedLink: React.FC<EmbedProps> = ({data, embed, link }) => {
  return (
    <div
      className={`${
        embed ? 'max-h-screen' : 'max-h-0 overflow-hidden'
      } transform transition-all duration-300 ease-in `}
    >
    <div
      className={`rounded-md bg-[#F9FAFF] p-6 sm:p-10`}
    >
      {
        `<iframe width="560" height="315" src="${data?.appointmentAlias}" title="appointment schedule" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
      }
    </div>
    </div>
  );
};

export default EmbedLink;

