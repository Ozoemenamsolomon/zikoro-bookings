import React, { useEffect, useState } from 'react';
import { FormProps } from '@/types/appointments';
import { FlutterWaveIcon, Paystack, Stripe } from '@/constants';
import { MinusCircle, PlusCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { Description } from '@radix-ui/react-dialog';

const Payment: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
}) => {
  const [drop, setDrop] = useState(false);

  const paymentGateways = [
    { name: 'Paystack', component: <Paystack /> },
    {
      name: 'Zikoro manage',
      component: <Image src={'/zikoro-manage.png'} alt='zikoro' width={70} height={45} />,
    },
    { name: 'Stripe', component: <Stripe /> },
    { name: 'Flutterwave', component: <FlutterWaveIcon /> },
  ];

  const [gateway, setGateway] = useState<React.ReactNode>(null);

  const handleSetFormData = (gatewayName: string) => {
    if (setFormData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        paymentGateway: gatewayName,
      }));
    }
    delete errors.paymentGateway
    const selectedGateway = paymentGateways.find((gw) => gw.name === gatewayName);
    setGateway(selectedGateway?.component || null);
  };

  useEffect(() => {
    const selectedGateway = paymentGateways.find((gw) => gw.name === formData?.paymentGateway);
    setGateway(selectedGateway?.component || null);
  }, [formData?.paymentGateway]);

  return (
    <div className="space-y-6 relative">
      <div className="">
        <p className="pb-2">Connect your preferred payment gateway</p>
        <div className="w-full py-3">
          <div className="">
            {formData?.paymentGateway && gateway ? 
            <div className="flex">
            <div className=" border-2 cursor-pointer  py-3 px-8 rounded-md hover:shadow-md duration-300">
              {gateway}
            </div></div> : null}
            <small>Requires 5% charges</small>
          </div>

          <div className="py-4 ">
              <p>Choose who should pay the 5% session value </p>
              <div className="flex gap-6 pt-2 justify-between">
                {
                  [
                    {label:'Attendee',desc:'Attendee will be charged 5% of meeting value.'},
                    {label:'Host',desc:'Host will be charged 5% of meeting value.'},
                  ].map(({label,desc},i)=>{
                    return (
                      <div className="w-full cursor-pointer  " key={i}>
                        <div className="flex text-center">
                          <p className='border border-purple-300 hover:border-purple-500 rounded-md py-2 px-4'>{label}</p>
                        </div>
                        <small>{desc}</small>
                      </div>
                    )
                  })
                }
                </div>
            </div>
          {errors?.paymentGateway ? <p className="text-red-600 text-[12px] pt-1">{errors?.paymentGateway}</p> : null}

        </div>
        <p className="flex gap-4 items-center pb-4 cursor-pointer text-zikoroBlue" onClick={() => setDrop((curr) => !curr)}>
          {!drop ? 
          <PlusCircle className='text-zikoroBlue' size={20} /> :
          <MinusCircle className='text-zikoroBlue' size={20} /> }
          <span>Add payment method</span>
        </p>
        <div className={`${drop ? 'max-h-screen' : 'max-h-0'} opacity-40 transform transition-all overflow-hidden duration-500 ease-in-out`}>
          <div className="py-8 relative rounded-md shadow bg-white border px-20">
            <div className="grid grid-cols-2 w-full justify-center gap-4">
              <XCircle
                size={20}
                className="absolute right-6 text-gray-400 top-6 cursor-pointer"
                onClick={() => setDrop(false)}
              />
              {paymentGateways.map((gateway) => (
                <div
                  key={gateway.name}
                  // onClick={() => handleSetFormData(gateway.name)}
                  className={`${formData?.paymentGateway === gateway.name ? 'border-gray-400 border-2' : 'border-2'} cursor-not-allowed flex items-center justify-center w-full p-4 rounded-md hover:shadow-md duration-300 `}
                >
                  {gateway.component}
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center pt-6">
              <div className="cursor-pointer py-3 px-6 rounded-md bg-basePrimary text-white">Connect</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
