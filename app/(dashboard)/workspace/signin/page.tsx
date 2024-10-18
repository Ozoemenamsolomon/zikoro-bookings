'use client'
import { useLogin } from '@/hooks'
import { createClient } from '@/utils/supabase/client'
import React, { useState } from 'react'

const SigninPage: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
//   const [loading, setLoading] = useState<boolean>(false)
  const {loading, logIn} = useLogin()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    const supabase = createClient()
    e.preventDefault()
    // setLoading(true)
    setError('')

    try {
        await logIn({email,password}, "/workspace/schedules");
        
//       const { data,error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       })
// console.log({ data,error })
//       if (error) {
//         setError(error.message)
//       } else {
//         // Sign-in successful, redirect or do something here
//         console.log('Signed in successfully')
//       }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
    //   setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex justify-center items-center'>
      <form onSubmit={handleSignIn} className='w-80 space-y-4'>
        <div>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
            Email
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            required
          />
        </div>

        <div>
          <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
            Password
          </label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            required
          />
        </div>

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <button
          type='submit'
          className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

export default SigninPage
