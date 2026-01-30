import Link from 'next/link';
import { UserDropdown } from '../dropdowns/UserDropdown';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { MdMenu } from 'react-icons/md';

export const MainHeader = ({ setIsOpen }: { setIsOpen: () => void }) => {

    const { isAuthenticated } = useSelector((state: RootState) => state.auth)
    const user = useSelector((state: RootState) => state.auth.user)

   

    return (
        <header className="flex justify-between px-4 lg:px-12 shadow-blue-400  
         border border-blue-900 shadow-sm ">

            <div className='flex items-center gap-2'>
                <MdMenu className='size-8 lg:hidden text-blue-900 cursor-pointer ' onClick={setIsOpen} />
                <Link href="/"

                    className="flex items-center h-1/2 cursor-pointer ">
                    <h1 className='py-6 text-2xl font-bold text-blue-900 drop-shadow-2xl     shadow-blue-400 hidden lg:block'>Project Management System</h1>
                    <h1 className='py-6 text-2xl font-bold text-blue-900 drop-shadow-lg shadow-blue-400 lg:hidden'>PMS</h1>
                </Link>
            </div>
            <div className="flex items-center gap-2">
                <ul className="flex gap-7 text-blue-900 font-medium items-center ">
              
                 
                    {isAuthenticated && <UserDropdown />}

                </ul>
            </div>
        </header>
    );
};
