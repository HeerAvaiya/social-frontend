import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeedPosts,
  createPost,
} from "../features/post/postSlice";

const PostFeed = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.post);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(fetchFeedPosts());
  }, [dispatch]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    if (image) formData.append("image", image);
    dispatch(createPost(formData)).then(() => {
      setCaption("");
      setImage(null);
    });
  };

  return (
    <div>
      <h2>Post Feed</h2>
      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit" disabled={loading}>
          Post
        </button>
      </form>

      <div>
        {posts?.map((post) => (
          <div key={post.id}>
            <p>{post.caption}</p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="Post" width="200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostFeed;