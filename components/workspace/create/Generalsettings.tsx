import React, { useEffect, useState } from 'react';
import { AppointmentFormData, FormProps } from '@/types/appointments';
 
import { CustomSelect } from '@/components/shared/CustomSelect';
import { fetchActiveTeamMembers,   } from '@/lib/server/workspace';
import useUserStore from '@/store/globalUserStore';
import { BookingTeamMember } from '@/types';
import { getPermissionsFromSubscription } from '@/lib/server/subscriptions';
import Link from 'next/link';
import { Toggler } from '../ui/SwitchToggler';

const Generalsettings: React.FC<FormProps> = ({
  formData,
  setFormData,
  setErrors,
  errors,
}) => {
  const {user, currentWorkSpace} = useUserStore()
  const [teamMembers,setTeamMembers] = useState<{label:string,value:string}[]>([])
  const [permissions, setPermissions] = useState({smsEnabled:false, isOnFreePlan:true, reactivateLink:''})

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!currentWorkSpace?.organizationAlias) return; // Avoid unnecessary calls
      const {plan:{teamLimit,smsEnabled,isOnFreePlan, reactivateLink}} = await getPermissionsFromSubscription(currentWorkSpace)
      setPermissions({smsEnabled,isOnFreePlan,reactivateLink})
      console.log({teamLimit,smsEnabled,isOnFreePlan, reactivateLink})

      if (isOnFreePlan) return;
  
      const { data, error } = await fetchActiveTeamMembers(currentWorkSpace.organizationAlias);
      if (error) {
        console.error("Error fetching team members:", error);
        return;
      }
  
      const teams = data
        ?.filter((team: BookingTeamMember) => user?.id !== team.userId?.id) // Ensure user is not included
        .map((team: BookingTeamMember) => ({
          label: `${team.userId?.firstName} ${team.userId?.lastName}`,
          value: team.userEmail || "",
        }));
  
      setTeamMembers(teams || []); // Ensure fallback empty array to avoid crashes
    };
  
    fetchTeamMembers();
  }, [currentWorkSpace?.organizationAlias,])
  
  const addTeamMember = (value: string) => {
  
    // Ensure formData.teamMembers is an array
    const existingMembers = formData?.teamMembers ? formData.teamMembers.split(", ") : [];
  
    // Prevent duplicate selections
    if (existingMembers.includes(value)) return;
  
    const newTeamMembers = [...existingMembers, value].join(", ");
  
    setFormData &&
      setFormData((prev: AppointmentFormData) => ({
        ...prev,
        teamMembers: newTeamMembers,
      }));
  };
  

  const removeEmail = (selected: string) => {
    const newTeamList = formData?.teamMembers
      ?.split(', ')
      .filter((item) => item !== selected)
      .join(', ');

      setFormData && setFormData((prev:AppointmentFormData)=>{
        return {...prev,
          teamMembers: newTeamList || '',}
        });
  };

  const handleSelect = (value: any, name?: string) => {
    setFormData &&
      setFormData((prev) => ({
        ...prev,
        [name!]: isNaN(Number(value)) ? value : Number(value),
      }));
  };

  const toggleSmsNotification = async (value:string) => {
    if (!setFormData) return null; 
  
    setFormData((prev) => ({
      ...prev,
      smsNotification: value,
    }));
  };

  // console.log({formData })
  return (
    <div className="space-y-4">
      <div className="">
        <p className="pb-2">Add Team members</p>
        <div className={`${errors?.teamMembers ? 'ring-1 ring-red-600' : ''} flex rounded-md gap-2 items-center `}>
        
        {
          permissions.isOnFreePlan ?
          <div className='border border-purple-300 rounded-md p-3 w-full'>
            <small className="text-center pb-2">You are flying solo on Freemium. Upgrade to bring your team onboard!
            </small>
            <Link href={permissions.reactivateLink} className='bg-baseLight px-6 py-2 rounded text-center flex justify-center text-'>Upgrade Plan</Link>
          </div>
          :
          <CustomSelect
            name='teamMembers'
            options={ teamMembers}
            // value={''}
            error={errors?.teamMembers}
            onChange={addTeamMember}
            placeholder="Select team member"
            noOptionsLabel='No team members have been added to this workspace'
            className="w-full h-12"
            setError={setErrors}
          />
        }
 
        </div>
        {formData?.teamMembers ? (
          <div className="space-y-1 pt-2">
            {formData.teamMembers.split(', ').map((item, idx) => (
              <div key={idx} className="flex max-w-lg  justify-between gap-6 items-center   px-2     ">
                <p className='italic'>{item}</p>
                <p onClick={() => removeEmail(item)} className="text-red-600 text-sm cursor-pointer">X Remove</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="">
        <p className="pb-2">Maximum bookings per session</p>
        <CustomSelect
          name='maxBooking'
          options={[
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '5', value: '5' },
            { label: '10', value: '10' },
          ]}
          value={String(formData?.maxBooking || '')}
          error={errors?.maxBooking!}
          onChange={handleSelect}
          isRequired
          placeholder="Select"
          className="w-48 h-12"
          setError={setErrors}
        />
      </div>

      <div className="">
        <label htmlFor="sessionBreak" className="pb-2">Break between sessions in minutes</label>
        <CustomSelect
          name='sessionBreak'
          options={[
            { label: '0', value: '0' },
            { label: '5', value: '5' },
            { label: '10', value: '10' },
            { label: '15', value: '15' },
            { label: '20', value: '20' },
          ]}
          value={formData?.sessionBreak || formData?.sessionBreak === 0 ? String(formData?.sessionBreak || '0') : ''}
          error={errors?.sessionBreak!}
          onChange={handleSelect}
          isRequired
          placeholder="Select"
          className="w-48 h-12"
          setError={setErrors}
        />
      </div>

      <div className="">
          <div className="flex justify-between gap-6 items-center">
            <p className="pb-2">Send sms reminder to attendees </p>
            <Toggler options={['OFF', 'ON']} disabled={permissions.isOnFreePlan} value={formData?.smsNotification} onChange={toggleSmsNotification}/>
          </div>
          {permissions.isOnFreePlan ? 
          <div className='border  border-purple-300 rounded-md p-3 w-full'>
            <small className="text-center pb-2">Reminders matter. Upgrade to send SMS alerts and cut down on no-shows.
            </small>
            <Link href={permissions.reactivateLink} className='bg-baseLight px-6 py-2 rounded text-center flex justify-center text-'>Upgrade Plan</Link>
          </div> : null}
        </div>
        {/* // <div className="space-y-2 flex flex-col items-center w-full" onClick={sendSmsApi}>
        // <button type="button" className='py-2 w-full text-center border border-basePrimary rounded-lg'>
        //   Send SMS reminder to attendee {"  "} <span>{formData?.smsNotification ? "✅" : null}</span>
        // </button>
        // <small>This attracts extra charges</small>
      // </div>  */}

    </div>
  );
};

export default Generalsettings;
