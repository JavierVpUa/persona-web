/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsdoc/require-returns */
'use client'

import React, {useEffect} from 'react'

import {MENUS} from '@/lib/constants'
import useScroll from '@/lib/hooks/use-scroll'
import {useZustand} from '@/lib/store/use-zustand'
import classnames from 'classnames'
import {signIn} from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import {BlueButton} from '../shared/button'
import {useSignInModal} from './sign-in-modal'
import UserDropdown from './user-dropdown'

/**
 *
 */
export default function NavBar({session}: {session: any}) {
  // eslint-disable-next-line no-unused-vars
  const {SignInModal, setShowSignInModal} = useSignInModal()
  const scrolled = useScroll(50)
  const {selMenu, setSelMenu, isUser} = useZustand()

  useEffect(() => {
    console.log('NavBar#useEffect: session: ', session)
  }, [session])

  return (
    <>
      <SignInModal/>
      <div
        className={`fixed top-0 w-full flex justify-center ${scrolled ?
          'border-b border-gray-200 bg-white/50 backdrop-blur-xl' :
          'bg-white/0'
        } z-30 transition-all`}
      >
        <div className="flex items-center justify-between w-full h-16 mx-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center text-2xl font-display">
              <Image
                src="/persona-logo-rounded-large.png"
                alt="Persona logo"
                width="30"
                height="30"
                className="mr-2 rounded-sm"
              />
              <p>Persona</p>
            </Link>
            {session && isUser && Object.keys(MENUS).map((menuKey) =>
              <div
                key={menuKey}
                className={classnames({
                  'text-xl cursor-pointer hover:text-black': true,
                  'text-text-dark': selMenu === menuKey,
                  'text-text-gray': selMenu !== menuKey,
                })}
                onClick={() => {
                  setSelMenu(menuKey)
                }}
              >
                {MENUS[menuKey]}
              </div>,
            )}
          </div>
          <div>
            {session && isUser ? (
              <UserDropdown session={session}/>
            ) : (
              <BlueButton
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                Sign In
              </BlueButton>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
