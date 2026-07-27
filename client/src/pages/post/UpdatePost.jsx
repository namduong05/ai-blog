import { useNavigate } from "react-router";
import PostForm from "../../components/PostForm";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import postStore from "../../store/postStore";

const UpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getPostById = postStore((state) => state.getPostById);
  const error = postStore((state) => state.error);

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPostById(id);
        setPost(response?.post);
      } catch (err) {
        toast.error(error || "Fetch post failed!!");
      }
    };
    fetchData();
  }, [id]);

  console.log(post);

  return (
    <div className="w-full">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-300  rounded-xl p-2 m-2 hover:bg-gray-400 cursor-pointer"
      >
        Trở lại
      </button>
      <div className="m-10">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Cập nhật bài viết
        </h1>
        <PostForm formData={post} />
      </div>
    </div>
  );
};

export default UpdatePost;
