 
import React, { Dispatch, SetStateAction, useEffect } from 'react'
 
import { CustomSelect } from '@/components/shared/CustomSelect'
import useUserStore from '@/store/globalUserStore'
import { OrganizationInput } from '@/types'

const CurrencySelection = ({formData,setFormData, currencies} : {
    formData: OrganizationInput,currencies:{label:string,value:string}[], setFormData: Dispatch<SetStateAction<OrganizationInput>>
}) => {
 
  return (
    <CustomSelect
        options={currencies}
        value={formData.selectedCurrency}
        onChange={setFormData}
        name='selectedCurrency'
        className='w-16 px-1'
        contentStyle='w-16'
        placeholder=''
    >

    </CustomSelect>
  )
}

export default CurrencySelection