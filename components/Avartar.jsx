import Blockies from 'react-blockies';
 
const Avartar = ({user}) => (
    <div className='profile-wrapper'>
        <p className='user-name' >{user}</p>
        <Blockies
            seed={user}
            className="avartar-img"
        />
    </div>
)

export default Avartar