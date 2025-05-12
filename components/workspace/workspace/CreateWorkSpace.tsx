'use client'
import { CenterModal, CustomModal, TopModal } from '@/components/shared/CenterModal';
import { ArrowLeft, Check, ChevronDown, Loader2, Plus, PlusCircle, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Toggler } from '../ui/SwitchToggler';
import CustomInput from '../ui/CustomInput';
import { Organization, OrganizationInput } from '@/types';
import useUserStore from '@/store/globalUserStore';
import { FileUploader, handleFileUpload } from '@/components/shared/Fileuploader';
import { CustomSelect } from '@/components/shared/CustomSelect';
import { Button } from '@/components/ui/button';
import { PostRequest } from '@/utils/api';
import { toast } from 'react-toastify';
import { generateSlugg } from '@/lib/generateSlug';
import { useRouter } from 'next/navigation';
import CurrencySelector from './CurrencySelector';
import { subscriptionPlans, typeOptions, discountRate, GoodCheck, PayLockIcon, BackArrow, YEARLY_DISCOUNT_RATE } from '@/constants';
import { calculateSubscriptionCost, calculateSubscriptionEndDate, cn } from '@/lib';
import DiscountButton from './DiscountButton';
import { fetchCurrencies } from '@/lib/server/workspace';
import { getPermissionsFromSubscription } from '@/lib/server/subscriptions';
import { usePaymentWkSpace } from './usePaymentWkSpace';
import { useAppointmentContext } from '@/context/AppointmentContext';


const initialFormData: OrganizationInput = {
  organizationName: '',
  organizationOwner: '',
  subscriptionPlan: 'Free',
  subscriptionEndDate: null,
  organizationLogo: '',
  organizationAlias:'',
  organizationOwnerId:'',
  organizationType:'',
  country:'',
  actualPrice:0,
  // currency : '',
};

const CreateWorkSpace = () => {
  const {user, setUser, setWorkSpaces, setCurrentWorkSpace,  setSubscritionPlan, workspaces} = useUserStore();
  const {setIsOpen} = useAppointmentContext()
  const {push} = useRouter()

  const [currencies, setCurrencies] = useState<{label:string,value:string}[]>([])
  const [discounts, setDiscounts] = useState<{ rate: number; amount: number; code: string, msg:string }>({rate:0,amount:0,code:'',msg:''})
  
  const [type, setType] = useState<string>(typeOptions[0]);
  const [selectedCurrency, setSelectedCurrency] = useState<{label:string, value:number}>({label:'NGN', value:1000});
  const [selectedPlan, setSelectedPlan] = useState<{label:string, value:number, features:string[]}>(subscriptionPlans[0]);

  const [formData, setFormData] = useState<OrganizationInput>({
    ...initialFormData,
    organizationOwnerId: user?.id!,
    organizationOwner: user?.userEmail!,
    planPrice:0,amountPaid:0,discountValue:0,
    currency: selectedCurrency.label
  });
  

  const [files, setFiles] = useState<File[]>([]);  
  const [step, setStep] = useState(1)
  
  const [previewUrls, setPreviewUrls] = useState<{ type: string; url: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string>('');

  const plans = subscriptionPlans.map((item)=>({label: item.label, value:item.label}))
  
  /** Initialize Form Data */
  useEffect(() => {
    const fetching = async() => {
        const {data} = await fetchCurrencies()
        const options = data.map((item)=>({
          label:item.currency, value:String(item.amount)
        }))
        setCurrencies(options)
        // console.log({data, options})
      }
      fetching()
  }, []);

  /** Handle Input Change */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);
   
  /** Validation Logic */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.organizationName) newErrors.organizationName = 'Workspace Name is required';

    if (!formData.subscriptionPlan) newErrors.subscriptionPlan = 'Subscription Plan is required';
    // if (!formData.organizationType) newErrors.workspaceDescription = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 /** Handle Form Submission */
const handleSubmit = async ( ) => {
  if (!validate()) return;

  try {
    let uploadedFiles;
    if (files.length) {
      setLoading("Uploading files...");
        uploadedFiles = await handleFileUpload({
        files,
        setFiles,
        setErrors,
      });
    }

    if (errors?.attachments && errors?.attachments?.length > 0) {
      return;
    }

    const {currency, planPrice, discountValue, amountPaid, actualPrice,  ...newFormdata} = formData
      setLoading("Creating workspace...");
      const { data: workspaceData, error: workspaceError } = await PostRequest({
        url: "/api/workspaces/create",
        body: {
          workspaceData:{
            ...newFormdata,
            organizationLogo: uploadedFiles ? uploadedFiles?.[0].url! : '',
            organizationAlias: generateSlugg(formData?.organizationName!),
            subscritionStartDate:new Date().toDateString(),
            subscriptionEndDate: calculateSubscriptionEndDate(new Date().toDateString(), type),
            subscriptionExpiryDate: calculateSubscriptionEndDate(new Date().toDateString(), type),
            organizationOwner:user?.userEmail,
            organizationOwnerId:user?.id,
          },
          userData: {
            userId:user?.id,
            userEmail: user?.userEmail,
          }
        },
      });

      if (workspaceError || !workspaceData?.organizationAlias) {
        setErrors({
          gen: workspaceError || "Error occurred while submitting values",
        });
        return;
      } else {
        setLoading("Activating subscription...");
        const  { data: subData, error: subError }  = await PostRequest({
          // url: "/api/subscriptions/create",
          url: "/api/subsrciptions/create",
          body: {
              userId:user?.id,
              subscriptionType: selectedPlan.label,
              amountPaid: amountPaid,
              startDate: new Date().toISOString(), // ISO timestamp format
              expirationDate: calculateSubscriptionEndDate(new Date().toDateString(), type),
              discountCode: discounts.code,
              discountValue: discountValue,
              currency: selectedCurrency.label,
              monthYear: type,
              planPrice: planPrice,
              workspaceAlias: workspaceData?.organizationAlias!
          },
        });
        if (subError) {
          setErrors({
            gen: subError || "Error occurred while submitting values",
          });
          return;
        } else {
        toast.success("Workspace created successfully");

        // Add new workspace to the list directly
        setWorkSpaces([...workspaces, workspaceData]);

        // Set the new workspace as current  
        const {plan,updatedWorkspace} = await getPermissionsFromSubscription(workspaceData,true,true)
        setCurrentWorkSpace(updatedWorkspace);
        setSubscritionPlan(plan)
        setUser({...user!, workspaceRole:'owner'})

        setFormData(initialFormData);
        setPreviewUrls([]);
        clear();
        
        setIsOpen(false);
        push(`/ws/${workspaceData?.organizationAlias}/schedule`)  
      }}
  } catch (error) {
    console.error('Submission failed:', error);
    setErrors({
      gen: "Submission failed",
    });
  } finally {
    setLoading('');
  }
};

const handleSelectCurrency = useCallback((value: string) => {
  const currencyType = currencies.find((item) => item.value === value);
  if (currencyType) {
    setSelectedCurrency({ label: currencyType.label, value: Number(value) });
    console.log('CHECKING', {type, currency:{ label: currencyType.label, value: Number(value)}, selectedPlan})
    const {total,base,currency,discount,discountValue, actualPrice} = calculateSubscriptionCost(discounts.rate, type, { label: currencyType.label, value: Number(value)}, selectedPlan, discounts.amount,)
    setFormData((prev)=>{
      return {
        ...prev, currency, planPrice:base, discountValue, amountPaid:total, actualPrice
      }
    })
  }
}, [currencies,selectedCurrency,selectedPlan,type,discounts ]);


  const handleSelectPlan = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, subscriptionPlan: value }));
    const selectedPlan = subscriptionPlans.find((item=>item.label===value))
    if (selectedPlan) {
      setSelectedPlan(selectedPlan)
      const {total,base,currency,discount,discountValue, actualPrice} = calculateSubscriptionCost(discounts.rate, type,selectedCurrency,selectedPlan, discounts.amount)
      setFormData((prev)=>{
        return {
          ...prev, currency, planPrice:base, discountValue, amountPaid:total, actualPrice
        }
      })
  }
  setErrors((prev)=>({...prev, subscriptionPlan:''}))

  }, [plans,selectedCurrency,selectedPlan,type,discounts]);

  const handleTypeChange = useCallback((value:string)=>{
    setType(value)
    const {total,base,currency,discountValue, actualPrice} = calculateSubscriptionCost(discounts.rate,value,selectedCurrency,selectedPlan,discounts.amount)
    setFormData((prev)=>{
      return {
        ...prev, currency, planPrice:base, discountValue, amountPaid:total, actualPrice
      }
    })
  }, [type, typeOptions, selectedCurrency,selectedPlan,type,discounts])

  const handleDiscount = useCallback((discount:{rate:number,amount:number})=>{
    const {total,base,currency, discountValue, actualPrice} = calculateSubscriptionCost(discount.rate, type, selectedCurrency,selectedPlan, discount.amount)
    setFormData((prev)=>{
      return {
        ...prev, currency, planPrice:base, discountValue, amountPaid:total, actualPrice
      }
    })
  }, [type, typeOptions, selectedCurrency,selectedPlan,type,discounts])


const chamferedEdge = {
  width: "120px",
  height: "30px",
  // background: "blue",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)"
};

const [status, setStatus] = useState('')
const clear = () => {
  setDiscounts({rate:0,amount:0,code:'',msg:''})
  setFormData(initialFormData)
  setType('Monthly')
  setSelectedPlan(subscriptionPlans[0])
  setSelectedCurrency({label:'NGN', value:1000})
  setStatus('')
}

const {handlePayment} = usePaymentWkSpace({formData, submitWkSpace:handleSubmit, setStatus,  })
 
const handleSubmission = () => {
  if(selectedPlan.label==='Free') {
    handleSubmit()
  } else {
    // continue to payment
    if(!validate()) return
    setStep(2)
  }
}

return (
    <TopModal
      className={`sm:max-h-full`}
      callback={()=>{
        clear()
        setStep(1)
      }}  
    >
      {
          step===1 ?
          <form onSubmit={(e)=>e.preventDefault()} className=" md:flex gap-0 text-base w-full h-full">

            {/* Sidebar Section */}
            <div className=" md:w-[45%] bg-slate-200 gap-6 py-14 px-6 md:px-10 justify-between flex flex-col">
              <div className="">
                  <div className="flex w-full gap-4 items-center pb-4">
                    <p className='shrink-0'>Select currency</p>
                    {
                    // isFetching ? <Skeleton /> : 
                    <CurrencySelector selected={selectedCurrency.value} handleSelectCurrency={handleSelectCurrency} currencies={currencies} />}
                  </div>

                  <div className="flex gap-2 pb-4 items-center">
                    <Toggler options={typeOptions} onChange={handleTypeChange}/>
                    {/* Pointed Shape */}
                    <div style={chamferedEdge} className='text-xs text-nowrap text-clip bg-zikoroBlue pl-3'>
                        Save up to {YEARLY_DISCOUNT_RATE*100}%
                    </div>
                  </div>


                  {/* Plan Details */}
                  <div className="space-y-2">
                      <h4 className="font-semibold text-xl ">{
                      // isFetching ? <Skeleton className='w-40 h-6'/> : 
                      selectedPlan.label}</h4>
                      <p>{
                        // isFetching ? <Skeleton className='w-44 h-6'/> : 
                        `${selectedCurrency.label}${formData.planPrice} per month`
                        }
                      </p>
                      <div className={` overflow-hidden transform transition-all duration-500 ease-in-out space-y-1 `}>
                          
                          <h6 className="text-lg font-medium">Plan Features</h6>
                          {
                            // isFetching ? 
                            // Array(5).map((i,k) => <Skeleton key={k} className='w-60 h-6'/>) 
                            // : 
                            selectedPlan.features.map((item, i) => (
                              <div key={i} className="flex gap-2 items-center">
                                <Check size={16} className="text-purple-500" />
                                <small>{item}</small>
                              </div>
                            ))
                          }
                          <div className="flex gap-2 items-center">
                            <Plus size={16} className="text-purple-500" />
                            <small>Show more features</small>
                          </div>
                      </div>
                  </div>
              </div>
              
              <div className="">
                <p className="">Summary</p>
                <div className="flex justify-between gap-12 items-center text-xl font-medium">
                  <h4 className="">{
                  // isFetching ? <Skeleton className='w-36 h-6'/> : 
                  selectedPlan.label}</h4>
                  <h4 className="">{
                  // isFetching ? <Skeleton className='w-24 h-6'/> : 
                  formData.amountPaid}</h4>
                </div>
                {/* <small>{`${formData.planPrice} per month x 12`}</small> */}
                <small className='leading-tight'>{
                  selectedPlan.label==='Free' ? null :
                  type==='Yearly' ?
                   `${formData.currency}${formData.planPrice}/month, billed annually at ${formData.currency}${Number(formData.actualPrice)} (Save ${formData.currency}${formData.discountValue})` 
                    : `${formData.currency}${formData.planPrice}/month, save ${YEARLY_DISCOUNT_RATE*100}% when you pay yearly`}</small>
                {/* ₦110,000 per month, billed annually at ₦1,149,600 (13% savings) */}
                {/* ₦110,000/month, save 13% when you pay yearly */}
              </div>

              <div className="  bg-baseLight px-2 py-2 rounded-md flex justify-between gap-12 items-center text-xl font-medium">
                <h5>Total Cost</h5>
                {
                // isFetching ? <Skeleton className='w-14 h-6 bg-white/50'/> : 
                <h5>{formData.currency}{formData.amountPaid}</h5>}
              </div>
            </div>  

            {/* Form Section */}
            <div className={` bg-gray-100  h-full flex flex-col justify-between md:w-[55%] px-6 md:px-16 py-14 gap-6 `}>
              
              <div className="space-y-3">
                <h5 className="font-semibold text-xl pb-2">Workspace Information</h5>
                <CustomInput
                  type="text"
                  name="organizationName"
                  label="Workspace Name"
                  isRequired
                  value={formData.organizationName!}
                  placeholder="Workspace name"
                  onChange={handleChange}
                />
                {errors.organizationName && <small className="text-red-500">{errors.organizationName}</small>}

                  <CustomSelect
                      name="subscriptionPlan"
                      label='Select subscription plan'
                      isRequired
                      error={errors.subscriptionPlan}
                      setError={setErrors}
                      options={plans}
                      value={formData?.subscriptionPlan || ''}  
                      onChange={handleSelectPlan}  
                      placeholder="Select a plan"
                  />
                 
                <CustomSelect
                  name="organizationType"
                  label="Workspace type"
                  isRequired
                  value={formData.organizationType || ''}
                  onChange={(newValue) => setFormData((prev)=>({
                    ...prev,
                    organizationType:newValue
                  }))} 
                  options={[
                    { label: 'Private', value: 'Private' },
                    { label: 'Business', value: 'Business' },
                  ]} 
                  error={errors.organizationType}
                  setError={setErrors}
                /> 

              <div className="pb-4 w-80 sm:w-full">
                <label htmlFor="attachments" className="text-gray-600 font-semibold text-sm">
                  Upload Workspace Logo
                </label>
                <FileUploader
                  files={files}
                  setFiles={setFiles}
                  previewUrls={previewUrls}
                  setPreviewUrls={setPreviewUrls}
                  isDisabled={false}
                  multiple={false}
                />
                {errors?.attachments && <small className="text-red-500">{errors.attachments}</small>}
              </div>
              </div>


              <div className="space-y-2">
                <DiscountButton handleDiscount={handleDiscount} setDiscounts={setDiscounts} discounts={discounts}/>

                <div className="flex flex-col gap-1 items-center justify-center">
                  {errors?.gen && <small className="text-red-500">{errors.gen}</small>}
                  <Button onClick={handleSubmission} type='button' 
                    className="bg-basePrimary h-10 w-full" disabled={loading.length>0}>
                    {
                      selectedPlan.label !=='Free' ? "Continue" :
                      loading.length > 0 ? 
                      <span className='flex items-center gap-2'><Loader2 size={20} className='animate-spin'/> {loading}</span> : 'Create'}
                  </Button>
                </div>
              </div>
            
            </div>
          </form>

           : step === 2 ? (
            <section className='h-screen md:h-full md:py-14 bg-gray-50  flex flex-col justify-center items-center p-6 overflow-auto no-scrollbar'>
                <div className="flex"><button className='' onClick={()=>setStep(1)}><BackArrow/></button ></div>
                
                <div className="space-y-6 py-16 px-6 bg-white rounded-2xl shadow min-h-60 w-full md:w-96 ">
                    <div className="mx-auto">
                      <h4 className="text-xl font-medium text-center">Order Summary</h4>
                      {status ? <small className='  text-zikoroBlue text-xs text-center'>{status}</small> : null}
                    </div>
                    <div className="rounded-md border border-purple-300 p-4 space-y-3">
                        <h6 className="font-medium pb- mb-6 border-b w-full">Orders</h6>
                        <div className="flex w-full justify-between items center gap-12">
                            <p className="">1x Subtotal</p>
                            <p className="">{`${formData.currency}${Number(formData.actualPrice||0)}`}</p>
                        </div>
                        <div className="flex w-full justify-between items center gap-12">
                            <p className="">1x Discount</p>
                            <p className="">{`${formData.currency}${Number(formData.discountValue||0)}`}</p>
                        </div>
                        <div className="flex w-full justify-between items center gap-12">
                            <p className="">Total</p>
                            <p className="">{`${formData.currency}${Number(formData.amountPaid||0)}`}</p>
                        </div>
                    </div>

                    {
                      !formData.amountPaid ? 
                      <Button type='button' onClick={async()=>{
                        await handleSubmit()
                        }} 
                        className='text-white flex items-center justify-center gap-4 bg-basePrimary h-10 w-full'
                      > 
                          Continue
                      </Button>
                      : 
                      <Button disabled={loading.length>0} type='button' onClick={ handlePayment } 
                      className='text-white flex items-center justify-center gap-4 bg-basePrimary h-10 w-full '
                    > 
                        { loading.length>0 ? loading : 
                            <>
                              <PayLockIcon/> 
                              <p>{`${formData.currency}${Number(formData.amountPaid)}`}</p>
                            </>
                          }
                    </Button>}

                </div>
            </section>
            ) 

            : (
              <section className='h-screen md:h-[80vh] bg-gray-50 flex flex-col gap-2 justify-center items-center p-6 overflow-auto no-scrollbar'>
                <div className="space-y-4 py-16 px-6 bg-white rounded-2xl shadow min-h-60 w-full md:w-96  flex flex-col justify-center items-center ">
                    <GoodCheck />
                    <div className="text-center">
                      <h6 className="text-  font-medium ">Success! Your Plan is Active</h6>
                      <small className='text-gray-600'>Your new plan is now active, and you're all set to streamline your bookings like never before.</small>
                    </div>
                    <Button onClick={async ()=>{
                      setStep(1)
                      setIsOpen(false)
                      window.location.reload()    
                      // push(pathname)                   
                      }} type='button' className='text-white flex items-center justify-center gap-4 bg-basePrimary h-10'> 
                      Go to your dashboard
                    </Button>
                </div>
            </section>
            )
      }
    </TopModal>
  );
};

export default CreateWorkSpace;

