import { Link, useNavigate, useParams } from "react-router";
import postStore from "../../store/postStore";
import authStore from "../../store/authStore";
import { useState, useEffect } from "react";
import { formatDateVN } from "../../utils/formatDateVN";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import Skeleton from "../../components/common/Skeleton";
import DOMPurify from "isomorphic-dompurify";

const DetailPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = authStore((state) => state.user);

  const getPostById = postStore((state) => state.getPostById);
  const deletePost = postStore((state) => state.deletePost);
  const loading = postStore((state) => state.loading);
  const error = postStore((state) => state.error);

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPostById(id);
        console.log(response);
        setPost(response.post);
      } catch (err) {
        toast.error(error || "Get post failed!");
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete it?")) {
      try {
        const response = await deletePost(id);
        toast.success(response?.message || "Delete success!");
        navigate("/my-posts");
      } catch (err) {
        toast.error(error || "Delete failed!!!");
      }
    }
  };

  if (loading || !post) return <Skeleton />;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-300  rounded-xl p-2 m-2 hover:bg-gray-400 cursor-pointer"
      >
        Trở lại
      </button>
      {user._id === post.updatedBy?._id && (
        <>
          <button
            onClick={() => navigate(`/my-posts/update-post/${post._id}`)}
            className="bg-gray-300 hover:bg-gray-400 rounded-xl p-2 mt-2 mr-2"
          >
            Cập nhật bài viết
          </button>
          <button
            onClick={() => handleDelete(post._id)}
            className="bg-gray-300 hover:bg-gray-400 rounded-xl p-2 mt-2"
          >
            Xóa bài viết
          </button>
        </>
      )}

      <div className="w-3/4 mx-auto">
        <h2 className="text-3xl text-center font-bold">{post.title}</h2>
        <p>
          <strong>Mục: </strong> {post.category?.title}
        </p>
        <p>
          <strong>Thời gian: </strong> {formatDateVN(post.createdAt)}
        </p>
        {user._id !== post.updatedBy?._id && (
          <p>
            <strong>Tác giả:</strong> {post.updatedBy?.name}
          </p>
        )}

        {post.file?.url && (
          <img
            className="w-full h-136 object-cover rounded-lg my-4"
            src={post.file?.url}
            alt={post.title}
          />
        )}
        <div
          className="prose max-w-none text-gray-800"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post?.desc),
          }}
        />

        <button className="flex gap-1 bg-white p-2 rounded-xl border border-gray-300 cursor-pointer mx-auto">
          <Heart />
          <span>125 yêu thích</span>
        </button>
      </div>
    </div>
  );
};

export default DetailPost;
