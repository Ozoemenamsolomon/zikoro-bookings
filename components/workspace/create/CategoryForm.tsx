import React, { useEffect, useState } from 'react';
import { AppointmentFormData,  } from "@/types/appointments";
import { SelectInput } from '../ui/CustomSelect';
import { PlusCircle, X } from 'lucide-react';
import { useAppointmentContext } from '@/context/AppointmentContext';
import CustomInput from '../ui/CustomInput';
import { ReactSelect } from '@/components/shared/ReactSelect';

export interface Category {
  name?: string;
  note?: string;
  isPaidAppointment?: boolean;
  curency?: string;
  amount?: number;
}

interface CategoryFormProps {
  formData: AppointmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  errors: any;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ setFormData, setErrors, formData, errors }) => {
  const [categories, setCategories] = useState<Category[]|any>([{
    name: '', note: '',}]);
  const {selectedType} = useAppointmentContext()

  useEffect(() => {
    if(selectedType==='multiple') {
        setCategories([...formData?.category, ...categories])
    }
  }, [selectedType])

  const handleCategoryChange = (name: string, value: any, index?: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index!] = { ...updatedCategories[index!], [name]: value };
    setCategories(updatedCategories);
    setFormData((prev: AppointmentFormData) => ({ ...prev, category: updatedCategories }));
    setErrors((prev: AppointmentFormData) => ({ ...prev, category: '' }));
  };

  const addNewCategory = () => {
    if (categories.length > 0 && !categories[categories.length - 1]?.name) {
      setErrors((prev: AppointmentFormData) => ({ ...prev, category: 'Please fill out the current category before adding a new one.' }));
      return;
    }
    setCategories([...categories, {}]);
    setErrors((prev: AppointmentFormData) => ({ ...prev, category: '' }));
  };

  const removeCategory = (index:number) => {
    const filtered = categories.filter((_:Category,idx:number)=> idx!==index)
    setCategories(filtered)
    setFormData((prev: AppointmentFormData) => ({ ...prev, category: filtered }));
    setErrors((prev: AppointmentFormData) => ({ ...prev, category: '' }));
  }

// console.log({categories})
  return (
    <>
      {Array.isArray(categories) && categories.length ? 
      categories?.map((category:Category, index:number) => (
        <div key={index} className="rounded-md space-y-4 bg-slate-50 border relative p-4 pt-6">
          <h5 className="label px-1 bg-slate-50 absolute -top-3 left-3">Appointment Type {index + 1}</h5>
          <X size={18} className='absolute right-4 top-0 text-slate-500 hover:text-slate-700 ' onClick={()=>removeCategory(index)} />

          <CustomInput
            label="Create appointment category (optional)"
            type="text"
            error={errors?.category}
            name={`category-${index}`}
            value={category.name || ''}
            placeholder="Enter category name"
            className="py-2"
            onChange={(e) => handleCategoryChange('name', e.target.value, index, )}
          />

            <CustomInput
              type="text"
              label="Appointment Description (optional)"
              error={errors?.note}
              name={`note-${index}`}
              value={category.note || ''}
              placeholder="Add notes for appointment here"
              className="py-2 w-full"
              onChange={(e) => handleCategoryChange('note', e.target.value, index, )}
            />

          <div className="flex   gap-4 justify-between items-center">
            <div className="flex-1">
              <h5 className="text-lg font-medium">Make this a paid appointment</h5>
              <p className="text-sm text-gray-600">Guests will be charged to book this appointment</p>
              <small className='italic'>Coming soon</small>

            </div>
            <div
              className={`flex-shrink-0 ${category.isPaidAppointment ? 'bg-blue-600 ring-blue-600 ring-2' : 'bg-gray-300 ring-2 ring-gray-300'} w-14 h-6 p-1.5 relative flex items-center rounded-full cursor-pointe`}
              // onClick={() => handleCategoryChange('isPaidAppointment', !category.isPaidAppointment, index, )}
            >
              <div className="flex w-full justify-between font-semibold text-[9px] text-gray-50">
                <p>ON</p>
                <p>OFF</p>
              </div>
              <div className={`bg-white absolute inset-0 w-7 h-6 flex-shrink-0 rounded-full transition-transform duration-200 transform ${category.isPaidAppointment ? 'translate-x-7' : ''}`}></div>
            </div>
          </div>

          {category.isPaidAppointment && (
            <div className="max-h-screen visible transform relative z-10 transition-all duration-300 pb-">
              <p className="pb-2">Set currency and pricing</p>
              <div className="flex gap-8 items-center">
                <ReactSelect
                  name="curency"
                  options={[
                    { label: 'USD', value: 'USD' },
                    { label: 'CAD', value: 'CAD' },
                    { label: 'EUR', value: 'EUR' },
                    { label: 'NGN', value: 'NGN' },
                    { label: 'AUD', value: 'AUD' },
                  ]}
                  value={category.curency || ''}
                  onChange={handleCategoryChange}
                  isClearable
                  placeholder="Select"
                  className="w-40"
                  index={index}
                />
                {/* <SelectInput
                  name="curency"
                  value={category.curency || ''}
                  options={[
                    { label: 'USD', value: 'USD' },
                    { label: 'CAD', value: 'CAD' },
                    { label: 'EUR', value: 'EUR' },
                    { label: 'NGN', value: 'NGN' },
                    { label: 'AUD', value: 'AUD' },
                  ]}
                  setFormData={(data: any) => handleCategoryChange('curency', data,index, )}
                  placeholder="Select currency"
                  className="w-40 z-50"
                  setError={() => {}}
                  error={errors?.curency}                  
                  onChange={(name, value) => handleCategoryChange( name, value, index,)}
                /> */}
                <CustomInput
                  type="number"
                  error={errors?.amount}
                  name="amount"
                  value={category.amount || ''}
                  placeholder='Enter price'
                  className=" w-40 py-2 "
                  onChange={(e) => handleCategoryChange('amount', e.target.value, index, )}
                />
                {/* <SelectInput
                  name="amount"
                  value={category.amount || ''}
                  options={[
                    { label: '20', value:  '20' },
                    { label: '40', value:  '40' },
                    // { label: '60', value: 60 },
                    // { label: '80', value: 80 },
                    // { label: '100', value: 100 },
                  ]}
                  setFormData={(data: any) => handleCategoryChange(index, 'amount', data)}
                  setError={() => {}}
                  className="w-40 z-50"
                  error={errors?.amount}
                  onChange={(name, value) => handleCategoryChange(index, name, value)}
                  placeholder='Enter price'
                  // pattern="\d+"
                  /> */}
              </div>
            </div>
          )}
        </div>
      ))
      : null
    }

      <div onClick={addNewCategory} className="text-zikoroBlue cursor-pointer flex gap-2 pt- items-center">
        <PlusCircle size={14} />
        <p>Create Appointment Category</p>
      </div>
    </>
  );
};

export default CategoryForm;
