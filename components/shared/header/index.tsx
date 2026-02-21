import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
const Header = () => {
    return (
        <header className = 'w-full border-b'>
            <div className = "wrapper flex justify-between">
                <div className = "flex items-start">
                    <Link href="/" className="flex items-start">
                        <Image src="/images/logo.jpg" 
                        alt= {`${APP_NAME} logo`} 
                        width={48} height={48} 
                        priority = {true}/>
                    
        
                    </Link>
                    <span className = "hidden lg:block font-bold text-2xl ml-3">{APP_NAME}</span>
                    

                </div>
                <Menu/>
              </div>
        </header>
    );
}
 
export default Header;