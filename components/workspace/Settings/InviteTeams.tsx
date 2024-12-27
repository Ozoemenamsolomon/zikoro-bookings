'use client';
import { CenterModal } from '@/components/shared/CenterModal';
import { CustomSelect } from '@/components/shared/CustomSelect';
import MultipleEmailInput from '@/components/shared/MultipleEmailsInput';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import React, { useCallback, useState } from 'react';

const InviteTeams = () => {
  const [formData, setFormData] = useState({
    emails: [] as string[],
    role: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string>('');

  /** Handle Select Change */
  const handleSelectChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
    setErrors((prev) => ({ ...prev, role: '' }));
  }, []);

  /** Handle Submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role) {
      setErrors({ role: 'Role is required' });
      return;
    }
    if (formData.emails.length === 0) {
      setErrors({ emails: 'At least one email is required' });
      return;
    }

    try {
      setLoading('Sending...');
      console.log('Form Data:', formData);
      setTimeout(() => {
        setLoading('');
        alert('Invites sent successfully!');
      }, 1000);
    } catch (error) {
      setErrors({ gen: 'Failed to send invites' });
      setLoading('');
    }
  };

  const [open, setOpen] = useState(false)

  return (
    <CenterModal
    isOpen={open}
    onOpenChange={setOpen}
      className="overflow-hidden max-w-2xl"
      trigerBtn={
        <Button className="bg-basePrimary text-white">Invite</Button>
      }
    >
      <div className="">
        <button
            onClick={()=>setOpen(false)}
          type="button"
          className="absolute top-3 right-3 rounded-full h-12 w-12 bg-black text-white flex justify-center items-center"
        >
          <X />
        </button>

        <form onSubmit={handleSubmit} className="space-y-8 p-4 sm:p-8">
          <h4 className="text-2xl font-semibold w-full border-b pb-4">
            Invite team member
          </h4>

          <div className="w-full">
            <label className="block font-medium mb-2">Enter Email(s)</label>
            <MultipleEmailInput
              emails={formData.emails}
              setEmails={(emails) => setFormData((prev) => ({ ...prev, emails }))}
            />
            {errors?.emails && (
              <p className="text-red-500 text-sm mt-1">{errors.emails}</p>
            )}
          </div>

          <div className="">
            <label htmlFor="role" className='font-medium '>Assign role</label>
            <CustomSelect
                error={errors?.role}
                placeholder="Select"
                value={formData.role}
                onChange={handleSelectChange}
                options={[
                { label: 'Admin Role', value: 'ADMIN' },
                { label: 'Member', value: 'MEMBER' },
                ]}
            />
            </div>
          <Button type="submit" className="bg-basePrimary h-12 px-6 text-white w-full">
            {loading ? 'Sending...' : 'Send Invite'}
          </Button>
        </form>
      </div>
    </CenterModal>
  );
};

export default InviteTeams;
