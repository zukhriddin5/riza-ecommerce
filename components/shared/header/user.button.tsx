import Link from 'next/link';
import { auth } from '@/auth';
import {signOutUser} from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent,DropdownMenuLabel,DropdownMenuItem,DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';
const UserButton = async() => {
    const session = await auth();
    if(!session){
        return(
            <Button asChild>
                <Link href='/sign-in'>
                  <UserIcon/> Sign In
                </Link>
            </Button>
        )
    }
    const firstInitial =session.user?.name?.charAt(0).toUpperCase() ?? 'U';
    return (<div className='flex items-center gap-2'>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div>
                    <Button variant='ghost' className='relative h-8 w-8 justify-cenetr ml-2 rounded-full justify-items-center bg-gray-300'>
                        {firstInitial}
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <div className='text-sm font-medium leading-none'>
                            {session.user?.name}
                        </div>
                        <div className='text-sm text-muted-foreground leading-none'>
                            {session.user?.email}
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuItem className='p-0 mb-1'>
                    <form action={signOutUser} className='w-full'>
                        <Button className='w-full py-2 px-4 h-4 justify-start' variant='ghost'>
                            Sign Out
                        </Button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div> );
}
 export default UserButton;
