import { CenterModal } from '@/components/shared/CenterModal'
import { ArrowLeft, Check, Plus, PlusCircle } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { Toggler } from '../ui/SwitchToggler'
import CustomInput from '../ui/CustomInput'
import { BookingWorkSpace } from '@/types'
import useUserStore from '@/store/globalUserStore'

const initialFormData: BookingWorkSpace = {
    workspaceName: '',  
    workspaceOwner: null,  
    subscriptionPlan: '',  
    subscriptionEndDate: null,  
    workspaceLogo: '',  
    workspaceDescription: '',  
  };
  
const CreateWorkSpace = () => {
    const {user} = useUserStore()
    const [formData, setFormData] = useState({...initialFormData, workspaceOwner:user?.id})

      const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: '' }))
      }, [])

      const validate = () => {

      }

      const handleSubmit = () => {

      }
    
  return (
    <CenterModal
      className="overflow-hidden"
      trigerBtn={
        <button
          type="button"
          className="px-4 py-1.5 border border-zikoroBlue w-full flex gap-2 items-center rounded-md hover:bg-gray-100"
        >
          <PlusCircle size={16}/>
          <p className="text-sm">Workspace</p>
        </button>
      }
    >
      <form className="flex flex-col sm:flex-row overflow-auto scrollbar-none sm:max-h-[80vh] sm:max-w-7xl w-full h-full">
        <div className="bg-gray-200 space-y-8 sm:w-1/2 lg:w-2/5 p-6 py-10">
            <div className="">
                <button><ArrowLeft size={20}/></button>
            </div>
            <div className="flex gap-2 items-center">
                <p className="font-semibold">Monthly</p>
                <Toggler options={['Monthly', 'Yearly']}  />
                <div className="flex items-center gap-1">
                    <p className="font-semibold">Yearly</p>

                    <small className="bg-zikoroBlue px-3 h-8 flex items-center text-white">
                        save up to 15%
                    </small>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="font-semibold text-xl">FREE</h4>
                <p className="">NGN0 per month</p>
                <h6 className="text-lg font-medium">Plan Features</h6>
                <div className="">
                    {
                        ['Unlimited events','Attendee check-in', '3 discount coupons', 'No engagement Feature',].map((item,i)=>{
                            return (
                                <div key={i} className="flex gap-2 items-center">
                                    <Check size={16} className='text-purple-500' />
                                    <small className="">{item}</small>
                                </div>
                            )
                        })
                    }
                    <div className="flex gap-2 items-center">
                        <Plus size={16} className='text-purple-500' />
                        <small className="">Show more features</small>
                    </div>
                </div>
            </div>

            <div className="pt-10 space-y-3">
                <p className="text-gray-500">Summary</p>
                <div className="flex w-full justify-between gap-6">
                    <div className="">
                        <h5 className="text-xl font-medium">FREE</h5>
                        <small>NGN 0 per month</small>
                        
                    </div>
                    <h5 className="text-xl font-medium">NGN 0</h5>
                </div>
            </div>

            <div className="mt-8 bg-baseLight px-2 py-2 rounded-md flex justify-between gap-12 items-center text-xl font-medium">
                    <h5 className="">Total Cost</h5>
                    <h5 className="">   NGN 0</h5>
            </div>
        </div>

        <div className="bg-gray-100 sm:w-1/2 lg:w-3/5 p-6 py-10 space-y-3 ">
            <h5 className="font-semibold text-xl pb-4">Personal Information</h5>
            <CustomInput
                type="text"
                name="workspaceName"
                label='Workspace Name'
                isRequired
                value={formData.workspaceName!}
                placeholder="Workspace name"
                className="focus:ring-0 border focus:bg-transparent py-2"
                onChange={handleChange}
            />
            <CustomInput
                type="text"
                name="workspaceDescription"
                label='Workspace Description'
                isRequired
                isTextarea
                value={formData.workspaceDescription!}
                placeholder="Workspace description"
                className="focus:ring-0 border focus:bg-transparent py-2 h-24"
                onChange={handleChange}
            />
        </div>
      </form>
    </CenterModal>
  )
}

export default CreateWorkSpace
