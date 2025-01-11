import Image from 'next/image';
import React from 'react'

const RenderOnerProfile = ({owner}:{owner:any}) => {
    //   const owner = item?.goalOwner?.userId;
      const initials = `${owner?.firstName?.[0] || 'N'}${owner?.lastName?.[0] || 'A'}`;
  
      const renderOwnerProfile = () => {
        return owner?.profilePicture ? (
          <Image
            src={owner.profilePicture}
            alt="profile"
            width={40}
            height={40}
            className="object-cover w-full h-full rounded-full"
          />
        ) : (
          <div className="rounded-full h-10 w-10 flex justify-center items-center font-bold bg-baseLight uppercase">
            {initials}
          </div>
        );
      }

   return (
     <div className="flex-1 min-w-0 truncate flex gap-2 items-center">
          {renderOwnerProfile()}
          <small className="truncate text-[12px]">
            {owner?.firstName} {owner?.lastName}
          </small>
        </div>
   )
}

export default RenderOnerProfile