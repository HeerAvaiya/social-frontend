import React, { useState } from "react";
import { followUser, unfollowUser } from "../api/users";

export default function FollowButton({ user, onChange }) {
  const [busy, setBusy] = useState(false);

  const doFollow = async () => {
    try {
      setBusy(true);
      const res = await followUser(user.id);
      const status = res?.status || (user.isPrivate ? "pending" : "accepted");
      onChange?.(status);
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to follow");
    } finally {
      setBusy(false);
    }
  };

  const doUnfollow = async () => {
    try {
      setBusy(true);
      await unfollowUser(user.id);
      onChange?.("none");
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to unfollow");
    } finally {
      setBusy(false);
    }
  };

  if (user.relation === "accepted") {
    return (
      <button
        disabled={busy}
        onClick={doUnfollow}
        className="px-3 py-1 rounded border text-sm hover:bg-gray-50"
        title="Unfollow"
      >
        Following
      </button>
    );
  }

  if (user.relation === "pending") {
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
      disabled={busy}
      onClick={doFollow}
      className="px-3 py-1 rounded bg-pink-600 text-white text-sm hover:bg-pink-700"
    >
      Follow
    </button>
  );
}
