'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getDiscountByCode } from '@/lib/server/subscriptions'
import { X } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'

interface DiscountButtonProps {
  handleDiscount: (discount: { rate: number; amount: number }) => void
  setDiscounts: Dispatch<SetStateAction<{ rate: number; amount: number; code: string, msg:string  }>>
  discounts: { rate: number; amount: number; code: string, msg:string }
}

const DiscountButton = ({ handleDiscount, setDiscounts, discounts }: DiscountButtonProps) => {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateDiscount = async (discount: string) => {
    try {
      setLoading(true)
      setError('')
  
      const data = await getDiscountByCode(discount.trim())
  
      if (data?.discountPercentage || data?.discountAmount) {
        const rate = data.discountPercentage || 0
        const amount = data.discountAmount || 0
        const msg = getAppliedDiscountSentence({
          discountCode: discount,
          discountAmount: amount || null,
          discountPercentage: rate || null,
        })
  
        setDiscounts({
          rate,
          amount,
          code: discount,
          msg,
        })
  
        handleDiscount({ rate, amount })
      } else {
        setError('Discount code could not be verified')
      }
    } catch (error) {
      setError('An error occurred while verifying the discount code')
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <>
      {show ? (
        <div className="w-full">
          <div className="flex items-center h-10 w-full overflow-hidden border rounded">
            <Input
              placeholder="Enter a valid discount code"
              className="flex-1 py-2 border-none"
              value={discounts.code}
              onChange={(e) => setDiscounts((prev) => ({ ...prev, code: e.target.value }))}
            />
            <Button
              type="button"
              disabled={loading || !discounts.code.trim()}
              onClick={() => updateDiscount(discounts.code)}
              className="shrink-0 px-3 py-2 rounded-l-none"
            >
              {loading ? 'Verifying...' : 'Redeem'}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
              <small>{error}</small>
              <button
                onClick={() => setError('')}
                className="text-red-600 hover:text-red-800"
                aria-label="Dismiss error"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {(discounts.rate || discounts.amount) && !error ? (
            <small className="mt-1 text-xs leading-tight text-zikoroBlue">
              {discounts.msg}
            </small>
          ) : null}
        </div>
      ) : (
        <p
          onClick={() => setShow(true)}
          className="text-xs text-zikoroBlue cursor-pointer hover:underline"
        >
          Have a discount code? Click here to enter the code
        </p>
      )}
    </>
  )
}

export default DiscountButton

function getAppliedDiscountSentence(discount: {
  discountCode: string
  discountAmount: number | null
  discountPercentage: number | null
}): string {
  const { discountCode, discountAmount, discountPercentage } = discount

  if (discountPercentage) {
    return `A ${discountPercentage}% discount has been applied with ${discountCode}`
  }

  if (discountAmount) {
    return `A ${discountAmount} discount has been applied with ${discountCode}`
  }

  return `A discount has been applied using the code ${discountCode}`
}
