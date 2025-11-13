import { UserCog } from 'lucide-react';
import { MapPinPen } from 'lucide-react';
import Link from 'next/link';




export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center gap-5">
      <Link href={`/users`}>
        <button className='flex gap-1 items-center justify-center flex-col w-[200px] h-[200px] border transition-all duration-200 hover:bg-orange-500/80 hover:border-orange-600 bg-orange-500 text-white cursor-pointer rounded-xl'>
          <UserCog className='w-8 h-8'/>
          <p className='text-[18px]'>Users</p>
        </button>
      </Link>
      <Link href={`/map`}>
        <button className='flex gap-1 items-center justify-center flex-col w-[200px] h-[200px] border transition-all duration-200 hover:bg-orange-500/80 hover:border-orange-600 bg-orange-500 text-white cursor-pointer rounded-xl'>
          <MapPinPen className='w-8 h-8'/>
          <p className='text-[18px]'>Maps</p>
        </button>
      </Link>
    </div>
  )
}
