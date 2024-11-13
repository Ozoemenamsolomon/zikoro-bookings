import { PopoverMenu } from '@/components/shared/PopoverMenu'
import { useAppointmentContext } from '@/context/AppointmentContext'
import useUserStore from '@/store/globalUserStore'
import { createClient } from '@/utils/supabase/client'
import { X } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import EmptyList from '../ui/EmptyList'
import { toast } from 'react-toastify'
import { PostRequest } from '@/utils/api'

const ContactTags = () => {
    const {contact, setContact,contacts, setContacts} = useAppointmentContext()
    const {user} = useUserStore()
    const supabase = createClient()

    const [tags, setTags] = useState<{tag:string}[]>([])
 
    const [tag, setTag] = useState('');
    const [contactTags, setContactTags] = useState(contact?.tags ? [...contact.tags] : []);
    const [loading, setLoading] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isDisabled, setIsDisabled] = useState(true);

    const addNewTag = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tag) {
            setError('Tag is required');
            return;
        }
        try {
            setLoading('inserting');
        // new tag
            const { error } = await PostRequest({url:'/api/bookingsContact/addNewTag',body:{ tag, createdBy: user?.id}})
            if (error) {
            throw error;
            }
        // updating contact
        const {data:newData, error:er} = await PostRequest({
            url:'/api/bookingsContact/updateContact',
            body:{tags: contact?.tags ? [...contact?.tags, {tag}] : [{tag}], id:contact?.id}})
            if(!er) {
                setContact(newData)
                let list = contacts?.map((item)=>{
                    return item?.id===contact?.id ? newData : item
                })
                setContacts(list!)
            } else {
            toast.error('Failed to add tag. Please try again.')
            }
            toast.success('New tag was added')
            setTag('');  
        } catch (error) {
            toast.error('Failed to add tag. Please try again.')
        } finally {
            setLoading('');
        }
    };

    const fetchTags = async () => {
        try {
          const response = await fetch(`/api/bookingsContact/fetchTags?createdBy=${user?.id}`)
          const { data, error } = await response.json()
          if (error) throw error;
          setTags(data || []);
          setContactTags(contact?.tags ? [...contact.tags] : []);
        } catch (err) {
          console.error("Error fetching tags: ", err);
        }
      };

    useMemo(()=>{
    setContactTags(contact?.tags ? [...contact.tags] : [])
    },[contact])

    useEffect(()=>{
        fetchTags()
    },[contact])

    const updateTags = (tag: string) => {
        if (!contactTags.some(item => item.tag === tag)) {
          setContactTags(prev => [...prev, { tag }]);
        } else {
            const filteredTags = contactTags.filter(item => item.tag !== tag);
            setContactTags(filteredTags);
        }
        setIsDisabled(false);
      };

    const insertContactTags = async () => {
        try {
            setLoading('updating')
        // inserting/updating contact tags
        const {data, error} = await PostRequest({
            url:'/api/bookingsContact/updateContact',
            body:{tags:contactTags, id:contact?.id}})
            
            if(!error) {
                setContact(data)
                let list = contacts?.map((item)=>{
                    return item?.id===contact?.id ? data : item
                })
                setContacts(list!)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading('')
        }
    }

    const deleteTag = useCallback(async (tagToDelete: string) => {
        if (!contact?.tags) return; // Early exit if no tags
    
        const filteredTags = contact.tags.filter(item => item.tag !== tagToDelete);
        const previousContactState = contacts?.find(item => item?.id === contact?.id);
    
        setContact({ ...contact, tags: filteredTags });
        try {
        // deleting contact tags
        const { error} = await PostRequest({
            url:'/api/bookingsContact/updateContact',
            body:{tags:filteredTags, id:contact?.id}})
            if (error) {
                if (previousContactState) {
                    setContact(previousContactState); // Revert state on error
                }
                throw new Error(error.message);
            }
            toast.success(`Tag - ${tagToDelete} was deleted`);
        } catch (error) {
            toast.error(`Error occurred! Tag - ${tagToDelete} not deleted`);
            if (previousContactState) {
                setContact(previousContactState); // Revert state on error
            }
        }
    }, [contact, contacts]);

  return (
    <div className=" border rounded-md space-y-3">
                <div className="text-center w-full p-4 bg-baseBg border-b font-semibold   rounded-md">Tags</div>

                <div className="flex px-3 pt-3 gap-3 flex-wrap w-full">
                {
                   Array.isArray(contact?.tags) && contact?.tags.length ? contact?.tags?.map((item,idx:number)=>{
                        return (
                            <button key={idx} 
                            className={`px-2 py-0.5 text-[12px]  text-center bg-pink-500/20 ring-1 ring-pink-400 text-pink-500 relative rounded-md
                                `}>
                                    {item?.tag}
                                    <div onClick={()=>deleteTag(item?.tag)} className='border cursor-pointer bg-white/50 p-1  rounded-full text-gray-500 absolute -top-2 right-0'>
                                        <X size={12} className='shrink-0'/>
                                    </div>
                            </button>
                            )
                        })
                        :
                        <p className="pb-2 w-full flex justify-center text-center text-slate-500">No tags added</p>
                    }
                </div>

                <div className="grid sm:flex p-3 gap-3 w-full text-sm">
                    <PopoverMenu
                        trigerBtn={
                        <button 
                        className={`p-3 py-2 w-full text-center bg-white ring-1 rounded-md ring-blue-600 relative
                            `}>
                                Crete new tag
                        </button>
                        }
                    >
                        <div className="w-full p-4 rounded-lg">
                            <form onSubmit={addNewTag} className="w-full">
                            <div className="mb-4">
                                <label htmlFor="tag" className="block text-sm font-medium text-gray-500 mb-2">
                                    Add Tag
                                </label>
                                <input
                                    type="text"
                                    id="tag"
                                    name="tag"
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border bg-transparent rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                                    placeholder="Enter tag"
                                />
                            </div>
                        
                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                            {/* {success && <p className="text-blue-500 text-sm mb-4">Tag added successfully!</p>} */}
                        
                            <button
                                type="submit"
                                disabled={loading==='inserting'}
                                className={`w-full bg-basePrimary text-white py-2 px-4 rounded-md disabled:opacity-30 disabled:cursor-not-allowed
                                }`}
                            >
                                {loading==='inserting' ? 'Adding...' : 'Add Tag'}
                            </button>
                            </form>
                        </div>
                    </PopoverMenu>

                    <PopoverMenu
                        trigerBtn={
                            <button 
                            className={`p-3 w-full bg-basePrimary text-center text-white   rounded-md text-nowrap relative
                                `}>
                                    Add existing tag
                            </button>
                        }
                    >
                        <div className="w-full  p-6 rounded-lg">
                            <h4 className="font-semibold text-sm ">Select to add or remove existing tag</h4>

                            <div className="flex gap-2 py-3 px-1 flex-wrap max-h-40 overflow-auto no-scrollbar">
                                {
                                    !tags.length ?
                                    <div className="py-4"><EmptyList size='28'/></div> 
                                    :
                                    tags?.map(({tag},idx)=>{
                                        const isInContactTag = contactTags.some(item => item.tag === tag);
                                        return (
                                            <div key={idx} className="flex">
                                                <button  
                                                    onClick={()=>updateTags(tag)}
                                                    className={`
                                                     ${ isInContactTag ? 'ring-1 ring-purple-700' : '' }
                                                     flex gap-1 items-center text-[12px] rounded-full border border-slate-400 py-0.5 px-2 hover:border-blue-700  text-nowrap overflow-clip`}
                                                    >
                                                        <p>{tag}</p>
                                                        { isInContactTag ? <X size={12} className='bg-red-300 shrink-0 rounded-full'/> : null}
                                                </button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <button
                                type="button"
                                disabled={isDisabled }
                                onClick={insertContactTags}
                                className={`no outline-none bg-baseLight w-full rounded disabled:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-20 text-sm text-center py-2 px-6`}
                            >
                                {loading==='updating' ? 'Updating...' : 'Update tags'}
                            </button>
                        </div>
                    </PopoverMenu>
                </div>

            </div>
  )
}

export default ContactTags