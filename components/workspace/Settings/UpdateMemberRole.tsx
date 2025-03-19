import { CenterModal } from '@/components/shared/CenterModal'
import { BookingTeamsTable } from '@/types'
import { Loader2, PenBox, X } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import CustomInput from '../ui/CustomInput'
import { CustomSelect } from '@/components/shared/CustomSelect'

import { PostRequest } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'

const UpdateMemberRole = ({member, setTeams}:{
    member:BookingTeamsTable, 
    setTeams: React.Dispatch<React.SetStateAction<BookingTeamsTable[]>>
}) => {
    console.log({member})
    const [formData, setFormData] = useState({
      userEmail: member?.userEmail || '',
      userRole: member?.userRole || '',
    });
    const [loading, setLoading] = useState('')
    const [errors, setErrors] = useState<Record<string, string>|null>(null);
    const [open, setOpen] = useState(false)

    const handleSelectChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, userRole: value }));
    setErrors((prev) => ({ ...prev, userRole: '' }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null)
        if (!formData.userRole) {
            setErrors({ userRole: 'Role is required' });
            return;
        }
      if(member.userRole===formData.userRole){
        return 
      }
        try {
            setLoading('Updating role ...')
            const {error,data,} = await PostRequest({
                    url:`/api/workspaces/team/updateMember?workspaceAlias=${member?.workspaceAlias?.organizationAlias}&userEmail=${member?.userEmail}`,
                    body: {
                      userRole: formData.userRole
                    },
                  })
              console.log({error,data,})
            if(error){
                setErrors({general:error})
                return
            } else {
              setLoading('Notifying member ...')
              console.log('Sending notification ...')
              // const {data:EmailRminder,error:EmailError} = await PostRequest({
              //   url:`/api/email/roleChangeNotification`,
              //   body:{
              //     workspaceAlias: member?.workspaceId?.workspaceName,
              //     role: data?.role
              //   }})
              setTeams((prev:BookingTeamsTable[])=>{
                  return prev.map((team) => team.id===member.id ? data : team)
              })
              toast.success('Role was updated.')
              setOpen(false)
            }
        } catch (error) {
            setErrors({ general: 'Failed to send invites' });
          } finally {
            setLoading('')
          }
    }
  return (
    <CenterModal
    isOpen={open}
    onOpenChange={setOpen}
      className="overflow-hidden max-w-2xl"
        trigerBtn={
           <button className='text-blue-400 bg-gray-100 h-6 w-6 flex justify-center items-center rounded-full  hover:text-blue-600 duration-300'><PenBox size={14} /></button> 
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
              Change Member's Role
            </h4>
            
            <CustomInput
                label='Email'
                name='userEmail'
                value={formData.userEmail}
                onChange={(e)=>setFormData(prev => {
                    return { ...prev,
                      userEmail: e.target.value}
                })}
            />

            <div className="">
                <label htmlFor="userRole" className='font-medium '>Assign role</label>
                <CustomSelect
                    name='userRole'
                    error={errors?.userRole}
                    placeholder="Select"
                    value={formData.userRole}
                    onChange={handleSelectChange}
                    options={[
                    { label: 'Owner', value: 'OWNER' },
                    { label: 'Member', value: 'MEMBER' },
                    ]}
                />
            </div>

            <div className="flex flex-col items-center">
              {errors?.general && <small className='text-red-600 w-full block text-center'>{errors?.general}</small>}
              <Button type="submit" className="bg-basePrimary h-12 px-6 text-white w-full">
                {loading ? <span className='flex items-center gap-2'><Loader2 size={20} className='animate-spin' />{loading}</span> : 'Chande Member Role'}
              </Button>
          </div>

        </form>
        </div>
    </CenterModal>
  )
}

export default UpdateMemberRole