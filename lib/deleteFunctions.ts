import { PostRequest } from "@/utils/api"

export const handleDeleteTeamMember = async ( id:number) => {
    // console.log(`Delete team member with ID: ${id}`)
    // Add delete logic here or update status as ARCHIVED
    // const {status,statusText} = await deleteRow('', 'id', id, )
    return await PostRequest({url:'/api/workspaces/team/deleteMember', body:{id,status:'ARCHIVED'}})
  }