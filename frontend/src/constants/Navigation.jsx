import { Home, Search, Settings, SquarePlus } from 'lucide-react'
import { UseAuthStore } from "../store/UseAuthStore";
import Avatar from '../../public/avatar.png'


export const mobileNavigation = () => {
 const { authUser } = UseAuthStore();
  return [
    {
      id: '1',
      link: "/",
      icon: <Home className='size-5' />,
      title: 'Home'
    },
    {
      id: '2',
      link: "/createPost",
      icon: <SquarePlus className='size-5'/>,
      title: 'Create Post'
    },
    {
      id: '3',
      link: "/settings",
      icon: <Settings className='size-5' />,
      title: 'Settings'
    },
        {
    id: '4',
      link: "/search",
      icon: <Search className='size-5' />,
      title: 'Settings'
    },
    {
      id: '5',
      link: "/profile",
      icon: (
        <div className='size-6 rounded-full overflow-hidden'>
          <img 
            src={authUser?.profilePicture || Avatar}
            alt="profile" 
            className='w-full h-full object-cover '
          />
        </div>
      ),
      title: 'Profile'
    }
  ]
}
