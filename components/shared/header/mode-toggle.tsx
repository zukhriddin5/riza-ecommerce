'use client';
import { DropdownMenu, 
         DropdownMenuTrigger,
         DropdownMenuContent,
         DropdownMenuLabel,
         DropdownMenuSeparator,
        DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SunIcon,MoonIcon,SunMoon } from "lucide-react";
import {useEffect, useState} from "react"; /* to handele window object problem */
/* we use some hooks  */
import { useTheme } from "next-themes";

const ModeToggle = () => {
    
const { theme, setTheme} = useTheme();

const [mounted, setMounted] = useState(false);

useEffect(() => {
    setMounted(true)
}, [])

if (!mounted) {
  return null;
}


    return ( 
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="focus-visible:ring-0 focus-visible:ring-offset-0">
                    {theme === 'system' ? (<SunIcon/>)
                    : theme === 'dark'? (<MoonIcon/>)
                    :(<SunMoon/>)}

                </Button>

            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Mode</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuCheckboxItem checked={theme === 'system'} onClick={() => setTheme('system')}>
                    system
                </DropdownMenuCheckboxItem>
                     <DropdownMenuCheckboxItem checked={theme === 'light'} onClick={() => setTheme('light')}>
                    light
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={theme === 'dark'} onClick={() => setTheme('dark')}>
                    dark
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
 
export default ModeToggle;