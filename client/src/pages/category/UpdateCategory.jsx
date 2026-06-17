import { useNavigate } from "react-router";
import CategoryForm from "../../components/CategoryForm";
import categoryStore from "../../store/categoryStore";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getCategoryById = categoryStore((state) => state.getCategoryById);
  const error = categoryStore((state) => state.error);

  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCategoryById(id);
        setCategory(response?.category);
      } catch (err) {
        toast.error(error || "Fetch failed!!!");
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="w-full">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-300  rounded-xl p-2 m-2 hover:bg-gray-400 cursor-pointer"
      >
        Trở lại
      </button>
      <div className="w-1/2 mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Cập nhật thể loại
        </h1>
        <CategoryForm formData={category} />
      </div>
    </div>
  );
};

export default UpdateCategory;
