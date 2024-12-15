'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Navbar2 from './Navbar2'

const NavRenderer = () => {

    const pathname = usePathname()
    return ( 
        <div>
            {pathname === '/' ? <Navbar /> : <Navbar2 />}
        </div>
     );
}
 
export default NavRenderer;