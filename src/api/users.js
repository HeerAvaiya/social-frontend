import api from "../api/axios";

export async function getDiscoverUsers() {
    const { data } = await api.get("/users/discover");
    return data.users || [];
}

export async function followUser(userId) {
    const { data } = await api.post(`/users/${userId}/follow`);
    return data;
}

export async function unfollowUser(userId) {
    await api.delete(`/users/${userId}/unfollow`);
    return true;
}
