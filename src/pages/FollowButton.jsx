import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from '../features/user/followSlice';

export default function FollowButton({ user }) {
  const dispatch = useDispatch();
  const { loading, followingStatus } = useSelector((state) => state.follow);
  const status = followingStatus[user.id] || user.relation || 'none';

  const handleFollow = () => {
    dispatch(followUser(user.id));
  };

  const handleUnfollow = () => {
    dispatch(unfollowUser(user.id));
  };

  if (status === 'accepted') {
    return (
      <button
        disabled={loading}
        onClick={handleUnfollow}
        className="px-3 py-1 rounded border text-sm hover:bg-gray-50"
        title="Unfollow"
      >
        Following
      </button>
    );
  }

  if (status === 'pending') {
    return (
      <button
        disabled
        className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm"
        title="Awaiting approval"
      >
        Requested
      </button>
    );
  }

  return (
    <button
      disabled={loading}
      onClick={handleFollow}
      className="px-3 py-1 rounded bg-pink-600 text-white text-sm hover:bg-pink-700"
    >
      Follow
    </button>
  );
}
