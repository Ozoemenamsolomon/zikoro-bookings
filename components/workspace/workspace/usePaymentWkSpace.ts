'use client'

import useUserStore from '@/store/globalUserStore';
import { OrganizationInput } from '@/types';
import React, { Dispatch, SetStateAction } from 'react'
import { usePaystackPayment } from 'react-paystack';

export const usePaymentWkSpace = ({submitWkSpace, formData, setStatus,  }:{
    submitWkSpace:()=>void,
    formData:OrganizationInput,
    setStatus:Dispatch<SetStateAction<string>>
    // setLoading:Dispatch<SetStateAction<string>>
}) => {
    // if (typeof window === "undefined") return null;
    const {user} = useUserStore()

    const config:any = {
		email: user?.userEmail,
		amount: Number(formData?.amountPaid) * 100,
		publicKey: process.env.NEXT_PUBLIC_PAYMENT_PUBLIC_KEY,
        firstName: user?.firstName,
        lastName: user?.lastName,
        phone: user?.phoneNumber,
        metadata:{
            formData
        }
	};

    const initializePayment = usePaystackPayment(config);
    const handlePayment = async () => {
		try {
			initializePayment({onSuccess, onClose});
		} catch (error) {
			console.error('catch error==', error);
		}
	};

    const onClose = () => {
        console.log('You cancelled your payment')
    };

    const onSuccess = (reference:{[key:string]:string}) => {
        console.log(reference?.reference!)
        // setPaymentRefId(reference?.reference!)
        handleSuccessfulPayment(reference?.reference)
    };

    const handleSuccessfulPayment = async (reference: string) => {
        try {
            // setLoading('Verifying payment');
            
            // const verifyResponse = await fetch(`/api/payments/paystack/verify?ref=${reference}`, {
            // method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json',
            // },
            // body: JSON.stringify({ reference }),
            // });
        
            // const res = await verifyResponse.json();
        
            // if (res && res.success) {
                // TODO: Send email to user and admin, submitWkspace
                submitWkSpace()

                // setStatus("sending_emails");
                console.log('VERIFIED, SUBMITTED WORKSPACE')
            // } else {
                // console.log('UNVERIFIED PAYMENT')
                // setStatus('Unverified payment. Refer to the Zikoro Support Team.');
            // }
        } catch (error) {
            console.error('Unhandled Error from server:', error);
            setStatus('Unhandled occured. Try again');
        } finally {
        }
    };
    
    
    return {handlePayment}
}

 