'use client';
import { CenterModal } from '@/components/shared/CenterModal';
import { CustomSelect } from '@/components/shared/CustomSelect';
import MultipleEmailInput from '@/components/shared/MultipleEmailsInput';
import { Button } from '@/components/ui/button';
import useUserStore from '@/store/globalUserStore';
import { BookingTeamMember, BookingTeamsTable } from '@/types';
import { PostRequest } from '@/utils/api';
import { Loader2, X } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import EmptyList from '../ui/EmptyList';
import { NoTeamsIcon, userRoles, userRolesOptions } from '@/constants';
import Link from 'next/link';
import { getPermissionsFromSubscription } from '@/lib/server/subscriptions';

const InviteTeams = ({teams, setTeams, text, }:{teams:BookingTeamsTable[], setTeams: React.Dispatch<React.SetStateAction<BookingTeamsTable[]>>, text?:string, remaininTeams?:number, reactivateLink?:string,}) => {
  const { currentWorkSpace,setCurrentWorkSpace,setWorkSpaces,workspaces, subscriptionPlan, setSubscritionPlan} = useUserStore()
  const { remaininTeams, reactivateLink} = subscriptionPlan!

  const [teamLimitUpdate, setteamLimitupdate] = useState(subscriptionPlan?.teamLimit ?? 0)
  
  const updateTeamlimits = async () => {
      const {plan,updatedWorkspace} = await getPermissionsFromSubscription(currentWorkSpace!, true, true)
      // console.log({plan})
      setSubscritionPlan(plan)
      if(updatedWorkspace){
        setCurrentWorkSpace(updatedWorkspace)
        const updatedWorkspaces = workspaces.map((item) =>
          item.id === updatedWorkspace.id ? updatedWorkspace : item
        );
        setWorkSpaces(updatedWorkspaces);
      }
  }

  const [formData, setFormData] = useState({
    emails: [] as string[],
    role: '',
    // status: 'PENDING',
  });
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>|null>(null);
  const [loading, setLoading] = useState<string>('');

  /** Handle Select Change */
  const handleSelectChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
    setErrors((prev) => ({ ...prev, role: '' }));
  }, []);

  /** Handle Submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null)
    if (!formData.role) {
      setErrors({ role: 'Role is required' });
      return;
    }
    if (formData.emails.length === 0) {
      setErrors({ emails: 'At least one email is required' });
      return;
    }
    // make sure an existying email was not added ...
    const uniqueEmails = formData?.emails?.filter(email => {
      return teams?.some((team:BookingTeamMember) => team.userEmail === email);
    });
    
    if(uniqueEmails.length>0) {
      setErrors({emails:'Existing email cannot be reassigned'})
      return
    }

    try {
      setLoading('Sending...');
      const {error,data, } = await PostRequest({
        url:'/api/email/inviteTeam',
        body: {
          ...formData, 
          emails:formData?.emails, 
          workspaceName:currentWorkSpace?.organizationName, 
          workspaceAlias:currentWorkSpace?.organizationAlias
        },
      })
      console.log({error,data, })
      if(error){
        setErrors({general:error})
        return
      } else {
        setTeams(prev=>[ ...data, ...prev,])
      }
  
      toast.success('Team invite was successful')
      setFormData({emails:[],role:''})
      // update team limits
      setSubscritionPlan({...subscriptionPlan!, teamLimit: subscriptionPlan?.teamLimit! - 1 })
      // TODO: Refetch team count  set - teamLimitupdate(subscriptionPlan?.teamLimit! - 1)
      await updateTeamlimits()
      setOpen(false)
    } catch (error) {
      setErrors({ general: 'Failed to send invites' });
    } finally {
      setLoading('')
    }
  };

  if(!remaininTeams ||  remaininTeams! < 1) {
    return <ExpiredTeamUpgrade text={text} reactivateLink={reactivateLink}/>
  }

  return (
    <CenterModal
    isOpen={open}
    onOpenChange={setOpen}
      className="overflow-hidden max-w-2xl"
      trigerBtn={
        <Button className="bg-basePrimary text-white">{text||'Invite'}</Button>
      }
    >
      <div className="">
        <button
            onClick={()=>setOpen(false)}
          type="button"
          className="absolute top-3 right-3 rounded-full h-10 w-10 bg-black text-white flex justify-center items-center"
        >
          <X />
        </button>

        <form onSubmit={handleSubmit} className="space-y-8 p-4 sm:p-8">
            <h4 className="text-2xl font-semibold w-full border-b pb-4">
              Invite team member
            </h4>

            <div className="w-full space-y-2">
              <div>
                <label className="block leading-tight font-medium ">Enter Email(s)</label>
                <small className=" text-gray-800 text-[12px]">Press "Enter", "Spacebar" or "," after each email</small>
              </div>

              <div>
              <MultipleEmailInput
                teamLimitUpdate={teamLimitUpdate} setteamLimitupdate={setteamLimitupdate}
                emails={formData.emails}
                setEmails={(emails) => setFormData((prev) => ({ ...prev, emails }))}
                setErrors={(err:string)=>setErrors((prev)=>({...prev, emails: err}))}
              />
              {errors?.emails && (
                <p className="text-red-500 text-sm mt-1">{errors.emails}</p>
              )}
              </div>

            </div>

            <div className="">
              <label htmlFor="role" className='font-medium '>Assign a role</label>
              <CustomSelect
                  name='role'
                  error={errors?.role}
                  placeholder="Select"
                  value={formData.role}
                  onChange={handleSelectChange}
                  options={userRolesOptions}
              />
            </div>

            <div className="flex flex-col items-center">
              {errors?.general && <small className='text-red-600 w-full block text-center'>{errors?.general}</small>}
              <Button type="submit" className="bg-basePrimary h-12 px-6 text-white w-full">
                {loading ? <span className='flex items-center gap-2'><Loader2 size={20} className='animate-spin' /> Sending...</span> : 'Send Invite'}
              </Button>
          </div>
        </form>
      </div>
    </CenterModal>
  );
};

export default InviteTeams;


const ExpiredTeamUpgrade = ({text, reactivateLink}:{text?:string, reactivateLink?:string}) => {
  const [open, setOpen] = useState(false)
  return (
    <CenterModal
      isOpen={open}
      onOpenChange={setOpen}
      trigerBtn={
        <Button className="bg-baseLight text-zikoroBlue">{text||'Upgrade'}</Button>
      }
      className="max-w-2xl"
    >
      <EmptyList
        icon={<NoTeamsIcon/>}
        text= {'You have exhausted your team membership limit for this month, purchase more access'}
        heading={'Oops! Team Limit is Exhausted'}
        CTA={<Link href={reactivateLink!} className="bg-basePrimary px-4 py-2 rounded-md text-white">{text||'Upgrade plan'}</Link>}
        className=' '
      />
    </CenterModal>
  )
}

