import { useNavigate } from "react-router";
import categoryStore from "../../store/categoryStore";
import { formatDateVN } from "../../utils/formatDateVN";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDebounce } from "../../hooks/useDebounce";
import { Search, SquarePen, Trash } from "lucide-react";

const CategoryList = () => {
  const categories = categoryStore((state) => state.categories);
  const loading = categoryStore((state) => state.loading);
  const error = categoryStore((state) => state.error);
  const getCategories = categoryStore((state) => state.getCategories);
  const deleteCategory = categoryStore((state) => state.deleteCategory);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState([]);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCategories(page, debouncedSearch);
        console.log(response);
        setTotalPages(response?.data?.totalPages || 0);
      } catch (err) {
        toast.error(error);
      }
    };
    fetchData();
  }, [page, debouncedSearch]);

  useEffect(() => {
    if (totalPages > 0) {
      if (totalPages <= 5) {
        setPageCount([1, 2, 3, 4, 5].filter((p) => p <= totalPages));
      } else {
        if (page <= 3) {
          setPageCount([1, 2, 3, "...", totalPages]);
        } else if (page >= totalPages - 2) {
          setPageCount([1, "...", totalPages - 2, totalPages - 1, totalPages]);
        } else {
          setPageCount([1, "...", page - 1, page, page + 1, "...", totalPages]);
        }
      }
    }
  }, [page, totalPages]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete it?")) {
      try {
        const response = await deleteCategory(id);
        toast.success(response?.message || "Delete success!");
      } catch (err) {
        toast.error(error || "Delete failed!!!");
      }
    }
  };

  return (
    <div className="mx-2 md:w-3/4 md:mx-auto">
      <button
        onClick={() => navigate("new-category")}
        className="bg-[#884413] text-white rounded-xl p-2 mt-2"
      >
        Thêm thể loại mới
      </button>

      <h1 className="text-2xl font-bold my-4 text-center">
        Danh sách thể loại
      </h1>
      <br />
      <div className="relative border border-gray-400 shadow-gray-300 mb-3 rounded-xl">
        <Search
          color="#ccc"
          className="absolute top-1/2 left-2 transform -translate-y-1/2"
        />
        <input
          type="text"
          className="w-full pl-9 py-2 outline-[#884413] rounded-xl"
          placeholder="Enter category"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Mô tả</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center">
                Đang tải...
              </td>
            </tr>
          ) : categories.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                Không có dữ liệu để hiển thị!
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.title}</td>
                <td>{category.desc}</td>
                <td>{formatDateVN(category.createdAt)}</td>
                <td>{formatDateVN(category.updatedAt)}</td>
                <td>
                  <button
                    onClick={() => navigate(`update-category/${category._id}`)}
                    className="flex bg-yellow-500 hover:bg-yellow-400 text-white rounded-xl p-1 mr-2 cursor-pointer"
                  >
                    <SquarePen /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="flex bg-red-600 hover:bg-red-500 text-white rounded-xl p-1 cursor-pointer"
                  >
                    <Trash /> Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pageCount.length > 0 && !loading && (
        <div className="mt-4">
          <button
            className="bg-gray-500 p-2 rounded-xl text-white mr-2"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Trước
          </button>
          {pageCount.map((p, index) => (
            <button
              key={index}
              onClick={() => setPage(p)}
              disabled={p === "..."}
              className={`mx-1 px-3 py-1 rounded-xl ${page === p ? "bg-[#884413] text-white" : "bg-gray-200 text-gray-700"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="bg-gray-500 p-2 rounded-xl text-white ml-2"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
