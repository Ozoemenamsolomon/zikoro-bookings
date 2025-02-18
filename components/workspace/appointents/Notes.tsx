import { DotsIcon } from '@/constants'
import { EllipsisVertical } from 'lucide-react'
import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'

const sample = [
    {
        title:'Meeting with John Doe for Design consultation',
        media: ['/url','/urls','/imgurl'],
        createdBy: {name:'Emma Udeji', email:'ecudeji@gmail.com'},
        creaedAT: '',
        updatedAt:'',
        note: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus fugiat, ratione id corporis non quisquam nulla nam? Explicabo, cupiditate magni!',
    },
    {
        title:'Meeting with John Doe for Design consultation',
        media: ['/url','/urls','/imgurl'],
        createdBy: {name:'Emma Udeji', email:'ecudeji@gmail.com'},
        creaedAT: '',
        updatedAt:'',
        note: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus fugiat, ratione id corporis non quisquam nulla nam? Explicabo, cupiditate magni!',
    },
]

const Notes = ({setIsAddNote}:{
    setIsAddNote:Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <div className='w-full max-w-lg mx-auto space-y-4 text-start text-[12px]'>
        <div className="p-4 text-[13px] border rounded-md">
            <h6 className="font-semibold text-center  pb-2">Notes from guest</h6>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus fugiat, ratione id corporis non quisquam nulla nam? Explicabo, cupiditate magni!
        </div>
        
        <div className="grid sm:grid-cols-2 gap-2 ">
            {
                sample.map((item,idx)=>{
                    return (
                        <div key={idx} className="border rounded-md p-2 space-y-2 ">
                            <div className="flex gap-4">
                                <h6 className="font-medium flex-1">{item.title}</h6>
                                <button className="flex items-center justify-center h-8 w-8 border rounded-full bg-white"><EllipsisVertical size={14} /></button>
                            </div>
                            <p className="text-gray-500">{item.note}</p>

                            <div className="w-full border py-1.5 rounded-sm overflow-auto no-scrollbar">
                                <h6 className="font-medium pb-1 pl-1 ">Media</h6>
                                <div className="w-full flex gap-1 items-center ">
                                    {
                                        item.media.map((url,i)=>{
                                            return (
                                                <Image src={url} alt='imgurl' height={300} width={300} className='object-cover border h-16 w-24 rounded overflow-clip shrink-0' />

                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <div className="border   rounded-sm">
                                <div className="flex p-1 border-b bg-zinc-50 w-full gap-2 items-center">
                                    <div className="h-10 w-10 shrink-0 bg-baseLight rounded-full flex justify-center items-center font-semibold">
                                        MP
                                    </div>
                                    <div className="flex-1">
                                        <p className=' capitalize'>{item.createdBy.name}</p>
                                        <small className="text-gray-500">{item.createdBy.email}</small>
                                    </div>
                                </div>

                                <div className="p-1  ">
                                    <div className="flex gap-2 items-center">
                                        <small className="text-zinc-700">Added on:</small>
                                        <small className="text-zinc-500">{item.creaedAT}</small>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <small className="text-zinc-700">Last Edited:</small>
                                        <small className="text-zinc-500">{item.updatedAt}</small>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )
                })
            }
            
        </div>

        <div className="flex justify-center pt-4">
            <button onClick={()=>setIsAddNote(true)} className="bg-basePrimary text-white py-2 px-6 text-sm rounded-md font-medium">Add Note</button>
        </div>
    </div>
  )
}

export default Notes