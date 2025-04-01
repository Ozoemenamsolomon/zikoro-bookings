import { CustomSelect } from '@/components/shared/CustomSelect'
import React from 'react'

const CurrencySelector = ({currencies,selected, handleSelectCurrency}:{
    currencies:{label:string,value:string}[],
    selected:number, 
    handleSelectCurrency: (value: any, field?: string) => void;
}) => {
  return (
    <CustomSelect
        options={currencies}
        value={String(selected)}  
        name="selected"
        onChange={handleSelectCurrency}  
        placeholder=""
        className="w-20 px-2 h-9 border-slate-300"
        contentStyle="min-w-0 w-full"
    />

  )
}

export default CurrencySelector