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
        `<iframe
            src=${link}
            width="100%"
            height="600"
            style={{ border: 'none' }}
            allowFullScreen
          ></iframe>
        `
      }
    </div>
    </div>
  );
};

export default EmbedLink;

