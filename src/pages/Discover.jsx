import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { discoverUsers, followUser } from "../features/discover/discoverSlice";

const Discover = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.discover);

  useEffect(() => {
    dispatch(discoverUsers(""))
  }, [dispatch]);

  const handleFollow = (userId, isFollowing) => {
    if (isFollowing) {
      dispatch(unfollowUser(userId));
    } else {
      dispatch(followUser(userId));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Discover People</h2>
      {users.length === 0 && <p>No users found.</p>}
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between mb-4 border p-2 rounded-md">
          <div>
            <p className="font-medium">{user.username}</p>
            <p className="text-sm text-gray-500">{user.bio || 'No bio'}</p>
          </div>
          <button
            className={`px-4 py-1 rounded-md ${user.isFollowing ? 'bg-red-500' : 'bg-blue-500'
              } text-white`}
            onClick={() => handleFollow(user.id, user.isFollowing)}
          >
            {user.isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Discover;
