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
  organizationLogo: '',
  organizationAlias:'',
  organizationOwnerId:'',
  organizationType:'',
  country:'',
  // currency : '',
};

const EditWorkspace = ({workspace, trigger, }:{workspace:Organization, trigger?:React.ReactNode}) => {
  const {user,  setWorkSpaces, setCurrentWorkSpace,  workspaces} = useUserStore();
  const [isOpen, setIsOpen] = useState(false)
  // const {push} = useRouter()

  const [formData, setFormData] = useState<OrganizationInput>(initialFormData);
  
  const [files, setFiles] = useState<File[]>([]);  
  
  const [previewUrls, setPreviewUrls] = useState<{ type: string; url: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string>('');

  
  /** Initialize Form Data */
  useEffect(() => {
   setFormData({
      organizationName: workspace.organizationName,
      organizationOwner: workspace.organizationOwner!,
      organizationLogo: workspace.organizationLogo,
      organizationAlias:workspace.organizationAlias!,
      organizationOwnerId:workspace.organizationOwnerId!,
      organizationType:workspace.organizationType,
   })
   if(workspace.organizationLogo) setPreviewUrls([{type:'image', url:workspace.organizationLogo}])
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

    const { ...newFormdata} = formData
      setLoading("Updating workspace...");
      const { data: workspaceData, error: workspaceError } = await PostRequest({
        url: "/api/workspaces/edit",
        body: {
            ...newFormdata,
            organizationLogo: uploadedFiles ? uploadedFiles?.[0].url! : workspace.organizationLogo,
        },
      });

      if (workspaceError || !workspaceData?.organizationAlias) {
        setErrors({
          gen: workspaceError || "Error occurred while submitting values",
        });
        return;
      } else {
        toast.success("Workspace updated successfully");
        // update new workspace to the list directly
        setWorkSpaces( 
            workspaces.map((ws) =>
              ws.organizationAlias === workspaceData.organizationAlias ? workspaceData : ws
            )
          );

        // Set the new workspace as current  
        setCurrentWorkSpace(workspaceData);

        setFormData(initialFormData);
        setPreviewUrls([]);
 
        setIsOpen(false)
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

// const [status, setStatus] = useState('')

return (
    <CenterModal
      className={`sm:max-h-full max-w-lg`}
      trigerBtn={
        trigger ? trigger :
        <Button >Update</Button>
      } 
      onOpenChange={setIsOpen}
      isOpen={isOpen}
    >
      <form onSubmit={(e)=>e.preventDefault()} className="space-y-3 py-8 px-6 gap-0 text-base w-full h-full">
            <h5 className="font-semibold text-xl pb-2">Workspace Information</h5>
            {/* <CustomInput
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
            />  */}

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

          <div className="space-y-2">
            <div className="flex flex-col gap-1 items-center justify-center">
              {errors?.gen && <small className="text-red-500">{errors.gen}</small>}
              <Button onClick={handleSubmit} type='button' 
                className="bg-basePrimary h-10 w-full" disabled={loading.length>0}>
                {
                  loading.length > 0 ? 
                  <span className='flex items-center gap-2'><Loader2 size={20} className='animate-spin'/> {loading}</span> : 'Submit'}
              </Button>
            </div>
          </div>
      </form>
    </CenterModal>
  );
};

export default EditWorkspace;

