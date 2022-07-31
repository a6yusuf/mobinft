import Blockies from 'react-blockies';
import { useRouter } from 'next/router';
 
    
const Avartar = ({user}) => { 

    const router = useRouter()
    
    return ( 
        <div className='profile-wrapper' onClick={() => router.push('/settings')}>
            <p className='user-name' >{user}</p>
            <Blockies
                seed={user}
                className="avartar-img"
            />
        </div>
    )
}
export default Avartar