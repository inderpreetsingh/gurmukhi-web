import React from 'react'
import InputWithIcon from '../input/InputWithIcon'

export default function SignUp() {
  return (
    <div className='appear-from-below'>
      <InputWithIcon id="name" placeholder="Name" type="text" icon="name" />
      <InputWithIcon id="email" placeholder="Email" type="email" icon="email" />
      <InputWithIcon id="pwd" placeholder="Password" type="password" />
      <InputWithIcon id="confirm-pwd" placeholder="Confirm Password" type="password" />
      <button type='submit' className="w-full p-4 rounded-lg bg-gradient-to-r from-[#4285F4] to-[#61A9D1] text-white font-bold text-lg">Sign Up</button>
    </div>
  )
}