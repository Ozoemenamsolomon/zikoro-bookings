import { CenterModal } from '@/components/shared/CenterModal';
import { ArrowLeft, Check, ChevronDown, Loader2, Plus, PlusCircle } from 'lucide-react';
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
import { fetchCurrencies } from '@/lib/server/workspace';
import CurrencySelector from './CurrencySelector';
import PlanSelector from './PlanSelector';
import { subscriptionPlans } from '@/constants';

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
};

const CreateWorkSpace = ({ workSpaceData, button, onClose, isRefresh, currencies }: { workSpaceData?: Organization, button?: React.ReactNode, redirectTo?:string, onClose?:(k:boolean)=>void, isRefresh?:boolean, currencies:{label:string,value:string}[],}) => {
  const {user, setUser, setWorkSpaces, setCurrentWorkSpace, currentWorkSpace, workspaces } = useUserStore();
  const {push} = useRouter()


  
  const [formData, setFormData] = useState<OrganizationInput>({
    ...initialFormData,
    organizationOwnerId: user?.id!,
    organizationOwner: user?.firstName! + ' ' + user?.lastName,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ type: string; url: string }[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string>('');

  const [type, setType] = useState<string>('Monthly');
  const [selectedCurrency, setSelectedCurrency] = useState<{label:string, value:number}>({label:'NGN', value:1000});
  const [selectedPlan, setSelectedPlan] = useState<{label:string, value:number, features:string[]}>(subscriptionPlans[0]);

  const typeOptions:[string, string] = ['Monthly', 'Yearly']

  const plans = subscriptionPlans.map((item)=>({label: item.label, value:item.label}))

  const calculatedPlan = (amount: number) => {
    // Applies the 15% Discount Properly: amount * 0.85 (which is amount - (amount * 0.15)).
    return type === "Yearly" ? amount * 0.85 : amount;
  };
  
  /** Initialize Form Data */
  useEffect(() => {
    if (workSpaceData) {

      setFormData((prev) => { 
        return { 
          ...prev,
          organizationName: workSpaceData?.organizationName!,
          organizationOwner: workSpaceData?.organizationOwner!,
          organizationLogo: workSpaceData.organizationLogo,
          organizationAlias: workSpaceData?.organizationAlias!,
          organizationOwnerId: workSpaceData?.organizationOwnerId!,
          organizationType: workSpaceData?.organizationType,
          country: workSpaceData?.country,
          subscriptionPlan:workSpaceData?.subscriptionPlan,
          subscriptionEndDate: workSpaceData?.subscriptionEndDate,
          subscritionStartDate:workSpaceData?.subscritionStartDate, 
        }
       });
      if (workSpaceData?.organizationLogo) {
        setPreviewUrls([{ url: workSpaceData?.organizationLogo, type: 'image' }]);
      }
      setIsDisabled(true);
    }
  }, [workSpaceData]);

  /** Handle Input Change */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);
   
  /** Validation Logic */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.organizationName) newErrors.workspaceName = 'Workspace Name is required';
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
      setLoading("Uploading logo...");
      uploadedFiles = await handleFileUpload({
        files,
        setFiles,
        setErrors,
      });
    }

    if (errors?.attachments && errors?.attachments?.length > 0) {
      return;
    }

    setLoading("Submitting values");

    if (workSpaceData) {
      // edit workspace
      const { data, error } = await PostRequest({
        url: "/api/workspaces/edit",
        body: {
          ...formData,
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
      const { data, error } = await PostRequest({
        url: "/api/workspaces/create",
        body: {
          workspaceData:{
            ...formData,
            organizationLogo: uploadedFiles ? uploadedFiles?.[0].url! : '',
            organizationAlias: generateSlugg(formData?.organizationName!),
            subscritionStartDate:new Date().toDateString(),
            // subscriptionEndDate:'',
            // subscriptionExpiryDate:'',
            organizationOwner:user?.userEmail,
            organizationOwnerId:user?.id,
          },
          subscriptionPlan: {
            userId:user?.id,
            subscriptionType: selectedPlan.label,
            amountPaid: type==='Yearly' ? calculatedPlan(selectedPlan?.value*12) : calculatedPlan(selectedPlan?.value),
            startDate: new Date().toISOString(), // ISO timestamp format
            expirationDate: new Date().toISOString()  , // ISO timestamp format
            discountCode: '',
            // discountValue: 0,
            currency: selectedCurrency.label,
            monthYear: type,
            planPrice: selectedPlan.value,
            workspaceAlias: currentWorkSpace?.organizationAlias
          }

        },
      });

      if (error) {
        setErrors({
          gen: error || "Error occurred while submitting values",
        });
        return;
      } else {
        toast.success("Workspace created successfully");

        // Add new workspace to the list directly
        setWorkSpaces([...workspaces, data]);

        // Set the new workspace as current  
        
        setCurrentWorkSpace(data);
        setUser({...user!, workspaceRole:'ADMIN'})

        setFormData(initialFormData);
        setPreviewUrls([]);
        setIsOpen(false);
        !isRefresh ? push(`/ws/${data?.organizationAlias}/schedule`) : null
      }
    }
  } catch (error) {
    // console.error('Submission failed:', error);
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
  }
}, [currencies]);


  const handleSelectPlan = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, subscriptionPlan: value }));
    const selectedPlan = subscriptionPlans.find((item=>item.label===value))
    if (selectedPlan) {
      setSelectedPlan(selectedPlan)
    }
  }, [plans]);

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

  const [drop, setDrop] = useState(false)
  return (
    <CenterModal
      className="overflow-hidden"
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
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-5 overflow-auto hide-scrollbar sm:max-h-[90vh] sm:max-w-7xl w-full h-screen sm:h-full ">
        {/* Sidebar Section */}
        <div className="h-full w-full sm:col-span-2 bg-slate-200">
          <div className=" sm:max-h-[90vh] sm:gap-8  px-6 py-10 justify-between flex flex-col h-full">
            <div className="space-y-4">
            <button onClick={()=>setDrop(curr=>!curr)} type='button' className='sm:hidden'><ChevronDown size={20} className={`${drop?'rotate-180':'rotate-0'} duration-300 transition-all transform`}/></button>

            <div className="flex w-full gap-4 items-center">
              <p className='shrink-0'>Select currency</p>
              <CurrencySelector selected={selectedCurrency.value} handleSelectCurrency={handleSelectCurrency} currencies={currencies} />
            </div>

            <div className="flex gap-2 items-center">
            <p className="font-semibold">Monthly</p>

            <Toggler options={typeOptions} onChange={setType}/>

            <div className="flex items-center gap-1">
              <p className="font-semibold">Yearly</p>

              {/* Pointed Shape */}
                <div style={chamferedEdge} className='text-xs bg-zikoroBlue pl-3'>
                  Save up to 15%
                </div>
            </div>
          </div>


              {/* Plan Details */}
              <div className="space-y-3 ">
                <h4 className="font-semibold text-xl">{selectedPlan.label}</h4>
                <div className={`${drop?'max-h-screen':'max-h-0 sm:max-h-screen'} overflow-hidden transform transition-all duration-500 ease-in-out space-y-3 `}>
                    <p>{
                      `${selectedCurrency.label}${calculatedPlan(selectedPlan.value) * selectedCurrency.value} per month`
                      }
                    </p>
                    <h6 className="text-lg font-medium">Plan Features</h6>
                    {selectedPlan.features.map((item, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Check size={16} className="text-purple-500" />
                        <small>{item}</small>
                      </div>
                    ))}
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
                <h4 className="">{selectedPlan.label}</h4>
                <h4 className="">{selectedCurrency.label}{selectedPlan.value * 12}</h4>
              </div>
              <small>{`${selectedCurrency.label}${calculatedPlan(selectedPlan.value)} per month x 12`}</small>
              
            </div>

            <div className="  bg-baseLight px-2 py-2 rounded-md flex justify-between gap-12 items-center text-xl font-medium">
              <h5>Total Cost</h5>
              <h5>NGN 0</h5>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-gray-100  h-full sm:col-span-3 px-6 py-10 space-y-3">
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

        <div className="pb-4">
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

        <div className="flex flex-col gap-1 items-center justify-center">
          {errors?.gen && <small className="text-red-500">{errors.gen}</small>}
          {/* <small>{loading}</small> */}
          <Button type='submit' className="bg-basePrimary w-full" disabled={loading.length>0}>
            {loading.length>0 ? 
            <span><Loader2 size={20} className='animate-spin'/> {loading}</span> : 'Create'}
          </Button>
        </div>
         
        </div>
      </form>
    </CenterModal>
  );
};

export default CreateWorkSpace;
