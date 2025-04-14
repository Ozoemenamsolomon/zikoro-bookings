import React, { useEffect } from 'react';
import { AppointmentFormData,  FormProps } from '@/types/appointments'; 
import ColorPicker from '../ui/ColorPicker';
import UploadImage from './uploadImage';
import CustomInput from '../ui/CustomInput';
import useUserStore from '@/store/globalUserStore';
import Image from 'next/image';
import { ImageUp, PenLine } from 'lucide-react';
import CreateWorkSpace from '../workspace/CreateWorkSpace';

const Branding: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  handleChange,
}) => {

  const {user,currentWorkSpace,setCurrentWorkSpace} = useUserStore()

  const handleToggleZikoroBranding = () => {
    if (setFormData) { 
      setFormData((prevFormData:AppointmentFormData) => ({
        ...prevFormData,
        zikoroBranding: prevFormData?.zikoroBranding ? false : true
      }));
    }
  };

  useEffect(() => {
    setFormData&&setFormData((prev)=>{
      return {
        ...prev,
        businessName: currentWorkSpace?.organizationName! || '',
        logo: currentWorkSpace?.organizationLogo! || '',
      }
    })
  }, [currentWorkSpace])
  
  return (
    <div className="space-y-4">

      <CustomInput
          label='Business Name'
          type='text'
          error={errors?.businessName}
          name='businessName'
          value={formData?.businessName || ''}
          placeholder='Enter Business Name'
          className=''
          // disabled
          onChange={handleChange}
        />

      <div className="flex">
        <div className="flex gap-2 pb-2 border-b">
        {
          currentWorkSpace?.organizationLogo  ?
          <Image src={currentWorkSpace?.organizationLogo || ''} alt='logo' width={300} height={300} className='object-cover w-14 rounded-md'/>
          :
          <ImageUp size={36} className='text-gray-500'/>
        }

        <CreateWorkSpace 
          currencies={[]}
          workSpaceData = {currentWorkSpace!}
          button={<button> Edit workspace logo  </button>}
          isRefresh={true}
        />
        
        {/* <UploadImage formData={formData!} setFormData={setFormData!} multiple={false}/> */}
      </div>
      </div>

      <div className="">
        {/* <p className="pb-2">Brand Color</p> */}
        <div className="   flex items-center justify-between w-full rounded-md">
          <p>Choose Brand Color</p>

          <div className="flex pt-1 items-center gap-2 px-2 rounded-md bg-gray-100 border border-gray-200 text-gray-00 ">
            <p>{formData?.brandColour || '#00FFF'}</p>
            <ColorPicker position='right' 
              initialColor={formData?.brandColour!}
              onChange={(color)=>{
                if(setFormData){
                  setFormData((prev:AppointmentFormData)=>({
                      ...prev,
                      brandColour: color
                    }
                  ))
                }}}
            />
          </div>

        </div>
      </div>
      

      <div className="flex justify-between items-center gap-6">
        <div className="space-y-2">
          <p className='label'>Powered by Zikoro</p>
          <p className="text-wrap">Turning this off will hide powered by zikoro</p>
        </div>

        <div
          className={`flex-shrink-0 ${formData?.zikoroBranding ? 'bg-blue-600 ring-blue-600 ring-2 ' : 'bg-gray-300 ring-2 ring-gray-300'} w-14 h-6 p-1.5  relative flex items-center  rounded-full  cursor-pointer`}
          onClick={handleToggleZikoroBranding}
        >
          <div className="flex w-full justify-between font-semibold text-[9px]">
            <p className='text-white'>ON</p>
            <p className='text-gray-50'>OFF</p>
          </div>
          <div className={`bg-white absolute inset-0 w-7 h-6 flex-shrink-0 rounded-full transition-transform duration-200 transform ${formData?.zikoroBranding ? 'translate-x-7' : ''}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Branding;
