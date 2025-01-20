import { CenterModal } from '@/components/shared/CenterModal'
import { BookingTeamsTable } from '@/types'
import { PenBox, Send, X } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import CustomInput from '../ui/CustomInput'
import { CustomSelect } from '@/components/shared/CustomSelect'
import useUserStore from '@/store/globalUserStore'
import { PostRequest } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'

const UpdateMemberRole = ({member, setTeams}:{
    member:BookingTeamsTable, 
    setTeams: React.Dispatch<React.SetStateAction<BookingTeamsTable[]>>
}) => {
    // console.log({member})
    const [formData, setFormData] = useState({
        email: member.email || '',
        role: member.role || '',
    });
    const [loading, setLoading] = useState('')
    const [errors, setErrors] = useState<Record<string, string>|null>(null);
    const [open, setOpen] = useState(false)

    const handleSelectChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
    setErrors((prev) => ({ ...prev, role: '' }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null)
        if (!formData.role) {
            setErrors({ role: 'Role is required' });
            return;
        }
      if(member.role===formData.role){
        return 
      }
        try {
            setLoading('Updating role ...')
            const {error,data,} = await PostRequest({
                    url:`/api/workspaces/team/updateMember?workspaceAlias=${member?.workspaceId?.workspaceAlias}&email=${member?.email}`,
                    body: {
                      role: formData.role
                    },
                  })
            //   console.log({error,data,})
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
                name='email'
                value={formData.email}
                onChange={(e)=>setFormData(prev => {
                    return { ...prev,
                        email: e.target.value}
                })}
            />

            <div className="">
                <label htmlFor="role" className='font-medium '>Assign role</label>
                <CustomSelect
                    name='role'
                    error={errors?.role}
                    placeholder="Select"
                    value={formData.role}
                    onChange={handleSelectChange}
                    options={[
                    { label: 'Admin', value: 'ADMIN' },
                    { label: 'Member', value: 'MEMBER' },
                    ]}
                />
            </div>

            <div className="flex flex-col items-center">
              {errors?.general && <small className='text-red-600 w-full block text-center'>{errors?.general}</small>}
              <Button type="submit" className="bg-basePrimary h-12 px-6 text-white w-full">
                {loading ? loading : 'Chande Member Role'}
              </Button>
          </div>

        </form>
        </div>
    </CenterModal>
  )
}

export default UpdateMemberRole