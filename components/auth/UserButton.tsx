"use client"
import { UserButton as ClerkUserButton } from '@clerk/nextjs'

export function UserButton() {
  return (
    <ClerkUserButton
      appearance={{
        elements: {
          avatarBox: 'w-10 h-10',
          userButtonTrigger: 'focus:shadow-none'
        }
      }}
      userProfileProps={{
        appearance: {
          elements: {
            card: 'shadow-lg',
            navbar: 'hidden',
            navbarMobileMenuButton: 'hidden'
          }
        }
      }}
    />
  )
}