"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { navLinks } from '@/constant'
import { Show,  UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <header className="header">
      <Link href="/" className="flex items-center gap-2 md:py-2">
         <div className='px-10 py-2 flex items-center content-center justify-center text-gray-200 font-bold rounded-2xl text-xl   '>
                  <Image src="assets/images/logo-icon.svg" alt="logo" width={40} height={20} className='' />
                    <h2 className='text-blue-400 uppercase text-2xl '>
                        ClickPic
                        </h2>
                        </div> 
      </Link>

      <nav className="flex gap-2">
        <Show when="signed-in">
          <UserButton afterSignOutUrl="/" />

          <Sheet>
            <SheetTrigger>
              <Image 
                src="/assets/icons/menu.svg"
                alt="menu"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </SheetTrigger>
            <SheetContent className="sheet-content bg-white sm:w-72">
              <>
                 <div className='px-4 py-2 flex items-center content-center font-bold text-xl   '>
                          <Image src="assets/images/logo-icon.svg" alt="logo" width={40} height={20} className='' />
                            <h2 className='text-blue-400 uppercase text-2xl '>
                                ClickPic
                                </h2>
                      </div> 

              <ul className="header-nav_elements">
              {navLinks.map((link) => {
                const isActive = link.route === pathname

                return (
                  <li 
                    className={`${isActive && 'gradient-text'} p-18 flex whitespace-nowrap text-dark-700`}
                    key={link.route}
                    >
                    <Link className="sidebar-link cursor-pointer" href={link.route}>
                      <Image 
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                      />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
              </ul>
              </>
            </SheetContent>
          </Sheet>
        </Show>

        <Show when="signed-out">
            <Button asChild  className="button bg-purple-gradient bg-cover">
              <Link href="/sign-in">Login</Link>
            </Button>
          </Show>
      </nav>
    </header>
  )
}

export default MobileNav