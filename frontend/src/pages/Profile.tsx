import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();

  return (
    <div className='flex w-full items-center justify-center flex-col'>
        <h1>Mon Profile !</h1>
        <div>
          <div>
            <span>
              <label>Email:</label>
              <p>{user?.email}</p>
            </span>
            <span>
              <label>Nom:</label>
              <p>{user?.last_name}</p>{" "}
            </span>
            <span>
              <label>Prénom:</label>
              <p>{user?.first_name}</p>{" "}
            </span>
          </div>
        </div>
      </div>
  );
};

export default Profile;
