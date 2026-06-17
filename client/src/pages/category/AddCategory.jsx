import { useNavigate } from "react-router";
import CategoryForm from "../../components/CategoryForm";

const AddCategory = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-300 hover:bg-gray-400 rounded-xl p-2 m-2 cursor-pointer"
      >
        Trở lại
      </button>
      <div className="w-1/2 mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Thêm thể loại</h1>
        <CategoryForm formData={null} />
      </div>
    </div>
  );
};

export default AddCategory;
