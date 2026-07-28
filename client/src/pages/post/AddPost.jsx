import { useNavigate } from "react-router";
import PostForm from "../../components/forms/PostForm";

const AddPost = () => {
  const navigate = useNavigate();
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
          Viết bài đăng mới
        </h1>
        <PostForm formData={null} />
      </div>
    </div>
  );
};

export default AddPost;
