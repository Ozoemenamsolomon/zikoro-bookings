import { CenterModal } from '@/components/shared/CenterModal';
import { ArrowLeft, Check, ChevronDown, Loader2, Plus, PlusCircle, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Toggler } from '../ui/SwitchToggler';
import CustomInput from '../ui/CustomInput';
import { BookingsCurrencyConverter, Organization, OrganizationInput } from '@/types';
import useUserStore from '@/store/globalUserStore';
import { FileUploader, handleFileUpload } from '@/components/shared/Fileuploader';
import { CustomSelect } from '@/components/shared/CustomSelect';
import { Button } from '@/components/ui/button';
import { PostRequest } from '@/utils/api';
import { toast } from 'react-toastify';
import { generateSlugg } from '@/lib/generateSlug';
import { useRouter } from 'next/navigation';
import CurrencySelector from './CurrencySelector';
import PlanSelector from './PlanSelector';
import { subscriptionPlans } from '@/constants';
import { calculateSubscriptionCost, calculateSubscriptionEndDate, cn } from '@/lib';
import { fetchSubscriptionPlan } from '@/lib/server/subscriptions';

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
  // currency : '',
};

const CreateWorkSpace = ({ workSpaceData, button, onClose, isRefresh, currencies }: { workSpaceData?: Organization, button?: React.ReactNode, redirectTo?:string, onClose?:(k:boolean)=>void, isRefresh?:boolean, currencies:{label:string,value:string}[],}) => {
  const {user, setUser, setWorkSpaces, setCurrentWorkSpace, currentWorkSpace, workspaces, subscriptionPlan } = useUserStore();
  const {push} = useRouter()
  const discountRate =15
  
  const [type, setType] = useState<string>('Monthly');
  const [selectedCurrency, setSelectedCurrency] = useState<{label:string, value:number}>({label:'NGN', value:1000});
  const [selectedPlan, setSelectedPlan] = useState<{label:string, value:number, features:string[]}>(subscriptionPlans[0]);

  const { total, base, currency, discountValue } = calculateSubscriptionCost(discountRate,type,selectedCurrency,selectedPlan);
 
  const [formData, setFormData] = useState<OrganizationInput>({
    ...initialFormData,
    organizationOwnerId: user?.id!,
    organizationOwner: user?.firstName! + ' ' + user?.lastName,
    planPrice:  base,
    amountPaid:  total,
    discountValue: discountValue,
    // planPrice:0,amountPaid:0,discountValue:0
    currency: selectedCurrency.label
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ type: string; url: string }[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string>('');
  // const [isFetching, setFetching] = useState<boolean>(false);

  const typeOptions:[string, string] = ['Monthly', 'Yearly']

  const plans = subscriptionPlans.map((item)=>({label: item.label, value:item.label}))
  
  /** Initialize Form Data */
  // useEffect(() => {
  //   const fetchSub = async () => {
  //     setFetching(true)
  //     const {data,error} = await fetchSubscriptionPlan(workSpaceData?.organizationAlias!)
  //     if(data){
  //       setType(data.monthYear!)
  //       const currencyTypeB = currencies.find((item) => item.label === data.currency);
  //       const selectedPlanB = subscriptionPlans.find((item=>item.label===data.subscriptionType))
        
  //       if (currencyTypeB && selectedPlanB) {
  //         setSelectedCurrency({ label: currencyTypeB.label, value: Number(currencyTypeB.value) });

  //         const {total,base,currency,discount,discountValue} = calculateSubscriptionCost(discountRate, data.monthYear!, { label: currencyTypeB.label, value: Number(currencyTypeB.value)}, selectedPlanB)
  //         setFormData((prev)=>{
  //           return {
  //             ...prev, currency, planPrice:base, discountValue, amountPaid:total 
  //           }
  //         })
  //       }
  //     }
  //     setFetching(false)
  //   }

  //   if (workSpaceData) {
  //     setFormData((prev) => { 
  //       return { 
  //         ...prev,
  //         organizationName: workSpaceData?.organizationName!,
  //         organizationOwner: workSpaceData?.organizationOwner!,
  //         organizationLogo: workSpaceData.organizationLogo,
  //         organizationAlias: workSpaceData?.organizationAlias!,
  //         organizationOwnerId: workSpaceData?.organizationOwnerId!,
  //         organizationType: workSpaceData?.organizationType,
  //         country: workSpaceData?.country,
  //         subscriptionPlan:workSpaceData?.subscriptionPlan,
  //         subscriptionEndDate: workSpaceData?.subscriptionEndDate,
  //         subscritionStartDate:workSpaceData?.subscritionStartDate, 
  //         // currency: 'NGN'
  //       }
  //      });
  //     if (workSpaceData?.organizationLogo) {
  //       setPreviewUrls([{ url: workSpaceData?.organizationLogo, type: 'image' }]);
  //     }
  //     fetchSub()
  //   }
  // }, [workSpaceData]);

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
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
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

    const {currency, planPrice, discountValue, amountPaid, ...newFormdata} = formData
    
    if (workSpaceData) {
      // edit workspace
      setLoading("Updating workspace...");
      const { data, error } = await PostRequest({
        url: "/api/workspaces/edit",
        body: {
          ...newFormdata,
          id:workSpaceData.id,
          organizationLogo: uploadedFiles ? uploadedFiles?.[0].url! : formData?.organizationLogo,
        },
      });

      if (error) {
        setErrors({
          gen: error || "Error occurred while submitting values",
        });
        return;
      } else {
        toast.success("Workspace updated successfully");

        // Update the workspaces state directly
        setWorkSpaces(
          workspaces.map((ws) => (ws.id === data.id ? { ...ws, ...data } : ws))
        );

        // Update currentWorkSpace if it's the same workspace
        if (data.id === currentWorkSpace?.id) {
          setCurrentWorkSpace(data);
        }

        setFormData(initialFormData);
        setPreviewUrls([]);
        setIsOpen(false);
        onClose&&onClose(false);
        // if(redirectTo) push(`/ws/${data?.workspaceAlias}/${redirectTo}`)
      }
    } else {
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
              discountCode: '',
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
        setCurrentWorkSpace(workspaceData);
        setUser({...user!, workspaceRole:'owner'})

        // set subscription plan (optional), beacuse it was set to update when current workspace changes

        setFormData(initialFormData);
        setPreviewUrls([]);
        // setIsOpen(false);
        !isRefresh ? push(`/ws/${workspaceData?.organizationAlias}/schedule`) : null
      }}
    }
  } catch (error) {
    console.error('Submission failed:', error);
    setErrors({
      gen: "Submission failed",
    });
  } finally {
    setLoading('');
  }
};

console.log({currencies, subscriptionPlans})

const handleSelectCurrency = useCallback((value: string) => {
  const currencyType = currencies.find((item) => item.value === value);
  if (currencyType) {
    setSelectedCurrency({ label: currencyType.label, value: Number(value) });
    console.log('CHECKING', {type, currency:{ label: currencyType.label, value: Number(value)}, selectedPlan})
    const {total,base,currency,discount,discountValue} = calculateSubscriptionCost(discountRate, type, { label: currencyType.label, value: Number(value)}, selectedPlan)
    setFormData((prev)=>{
      return {
        ...prev, currency, planPrice:base, discountValue, amountPaid:total 
      }
    })
  }
}, [currencies,selectedCurrency,selectedPlan,type ]);


  const handleSelectPlan = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, subscriptionPlan: value }));
    const selectedPlan = subscriptionPlans.find((item=>item.label===value))
    if (selectedPlan) {
      setSelectedPlan(selectedPlan)
      const {total,base,currency,discount,discountValue} = calculateSubscriptionCost(discountRate, type,selectedCurrency,selectedPlan)
      setFormData((prev)=>{
        return {
          ...prev, currency, planPrice:base, discountValue, amountPaid:total 
        }
      })
  }
  }, [plans,selectedCurrency,selectedPlan,type]);

  const handleTypeChange = useCallback((value:string)=>{
    setType(value)
    const {total,base,currency,discount,discountValue} = calculateSubscriptionCost(discountRate,value,selectedCurrency,selectedPlan)
    setFormData((prev)=>{
      return {
        ...prev, currency, planPrice:base, discountValue, amountPaid:total 
      }
    })
  }, [type, typeOptions, selectedCurrency,selectedPlan,type,discountRate])

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

const Skeleton = ({className}:{className?:string}) => <span className={cn("w-20 h-9 rounded bg-gray-500 animate-pulse",className)}></span>

  const [drop, setDrop] = useState(false)
  return (
    <CenterModal
      className="sm:max-h-screen md:max-h-[90vh] max-w-5xl"
      isOpen={isOpen}
      onOpenChange={setIsOpen} // Add this line
      trigerBtn={
        button ? button :
        <button
          type="button"
          className="px-4 py-1.5 border border-zikoroBlue w-full flex gap-2 items-center rounded-md hover:bg-gray-100"
        >
          <PlusCircle size={16} />
          <p className="text-sm">Workspace</p>
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="grid md:grid-cols-5 text-base w-full h-full">
       <button onClick={()=>setIsOpen(false)} type="button" className='absolute right-2 top-2 bg-black text-white rounded-full h-10 w-10 flex  justify-center items-center z-10'><X/></button>

        {/* Sidebar Section */}
        <div className=" md:col-span-2 bg-slate-200 gap-6 py-10 px-6 md:px-10 justify-between flex flex-col">
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
                  Save up to {discountRate}%
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
              `${formData.currency}${formData.planPrice}/month, billed annually at ${formData.currency}${Number(formData.amountPaid)+Number(formData.discountValue)} (Save ${formData.currency}${formData.discountValue})` 
              : `${formData.currency}${formData.planPrice}/month, save ${discountRate}% when you pay yearly`}</small>
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
        <div className="bg-gray-100  h-full flex flex-col justify-between md:col-span-3 px-6 md:px-16 py-10 gap-6 ">
          
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

            {!isRefresh && 
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
            }

            {!isRefresh && 
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
            />}

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

          <div className="flex flex-col gap-1 items-center justify-center">
            {errors?.gen && <small className="text-red-500">{errors.gen}</small>}
            {/* <small>{loading}</small> */}
            <Button type='submit' className="bg-basePrimary h-12 w-full" disabled={loading.length>0}>
              {loading.length>0 ? 
              <span className='flex items-center gap-2'><Loader2 size={20} className='animate-spin'/> {loading}</span> : 'Create'}
            </Button>
          </div>
         
        </div>
      </form>
    </CenterModal>
  );
};

export default CreateWorkSpace;


// Setup
// Import components, hooks, utils, and constants.

// Define initial state values: formData, typeOptions, plans.

// 2️⃣ State Management
// Manage form inputs, file uploads, currency/plan selections, loading states, and errors.

// 3️⃣ If Editing Workspace
// Prefill form with existing workspace data.

// Fetch its subscription plan.

// Calculate costs based on current plan, type, and currency.

// 4️⃣ User Input Handling
// handleChange → update text/textarea inputs.

// handleSelectCurrency → update currency and recalculate cost.

// handleFileUpload → upload organization logo and preview it.

// 5️⃣ Form Submission
// Validate required fields.

// Upload files (if any).

// If editing:

// Call /api/workspaces/edit.

// If creating:

// Call /api/workspaces/create.

// Then call /api/subsrciptions/create.

// Update app state and redirect on success.

// 6️⃣ Subscription Cost Calculation
// Use calculateSubscriptionCost() on:

// Currency change.

// Plan type change.

// Plan selection.

// 7️⃣ Error Handling
// Handle API and file upload errors.

// Prevent submission if validation fails.

// ✅ Flow Overview
// pgsql
// Copy
// Edit
// [Open Modal] → [Prefill if Editing] → [User Input] → [Validate] 
// → [Upload Files] → [Create/Edit Workspace] → [Create Subscription (if new)]
// → [Update State] → [Close Modal/Redirec