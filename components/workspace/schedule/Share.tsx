import { EmailIcon, FacebookIcon, ShareIcon, TwitterIcon, WhatsappIcon } from '@/constants';
import { AppointmentLink } from '@/types/appointments';
import { Code, Copy, XCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import EmbedLink from './EmbedLink';
import CopyLinkButton from '../ui/CopyLinkButton';
import { CenterModal } from '@/components/shared/CenterModal';

interface ShareProps {
   
   
  data: AppointmentLink;
}

const Share: React.FC<ShareProps> = ({data,     }) => {
  const [embed, setEmbed] = useState(false)
  const list = [
    {
      icon: <WhatsappIcon />,
      label: 'Whatsapp',
      link: `https://api.whatsapp.com/send?text=https://zikoro.com/booking/${data?.appointmentAlias}`,
    },
    {
      icon: <TwitterIcon />,
      label: 'X',
      link: `https://x.com/intent/tweet?url=https://zikoro.com/booking/${data?.appointmentAlias}`,
    },
    {
      icon: <FacebookIcon />,
      label: 'Facebook',
      link: `https://www.facebook.com/sharer/sharer.php?u=https://zikoro.com/booking/${data?.appointmentAlias}`,
    },
    {
      icon: <EmailIcon />,
      label: 'Email',
      link: `mailto:?subject=Check%20this%20out&body=https://zikoro.com/booking/${data?.appointmentAlias}`,
    },
    {
      icon: <Code />,
      label: 'Embed',
    },
    {
      icon: <Copy />,
      label: 'Copy Link',
    },
  ];

  return (
    <CenterModal
      trigerBtn={<button type='button' disabled={!data?.statusOn}   className="flex  gap-1 items-center">
                      <p className="">Share</p>
                      <div className={'disabled:opacity-20'}><ShareIcon/> </div>
                  </button>}
    >
      <div onClick={e=>e.stopPropagation()} className="py-12  w-full max-w-4xl max-h-[90vh] overflow-auto px-6  rounded-lg bg-white relative shadow-lg ">
           <div className="pb-8 text-center text-xl font-semibold w-full ">
            Share your schedule across various platforms
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 w-full gap-4 pb-6 px-6"
            >
            {list.map(({ icon, label, link }, idx) => {
              if(label==='Embed') {
                return (
                  <div key={idx}
                  onClick={()=>setEmbed(curr=>!curr)}
                  className={` bg-[#F2F2F2] w-full py-6 px-4 flex justify-center rounded-md items-center flex-col gap-4 shadow hover:shadow-md cursor-pointer  ${embed ? 'ring-2 ring-zikoroBlue' : ''}`}
                  >
                    {icon} 
                    <p>{label}</p>
                  </div>
              )}
              if(label==='Copy Link') {
                return (
                  <CopyLinkButton key={idx} link={`https://zikoro.com/booking/${data?.appointmentAlias}`}>
                    <div key={idx}
                    className="bg-[#F2F2F2] w-full py-6 px-4 flex justify-center items-center flex-col gap-4 shadow-md hover:shadow-xl cursor-pointer rounded-md  "
                    >
                      {icon}
                      <p>{label}</p>
                    </div>
                  </CopyLinkButton>
              )}
              return (
              <Link target='_blank' href={link!}
                className="bg-[#F2F2F2] w-full py-6 px-4 flex justify-center items-center flex-col gap-4 shadow-md hover:shadow-xl cursor-pointer rounded-md "
                key={idx}
              >
                {icon}
                <p>{label}</p>
              </Link >
            )}
            )}
       
          </div>

          <EmbedLink embed={embed}/>
      </div>
    </CenterModal>
  );
};

export default Share;
