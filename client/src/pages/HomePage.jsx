import { Link, useNavigate } from "react-router";
import postStore from "../store/postStore";
import categoryStore from "../store/categoryStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDebounce } from "../hooks/useDebounce";
import { Heart, Search } from "lucide-react";
import Skeleton from "../components/common/Skeleton";

const HomePage = () => {
  const posts = postStore((state) => state.posts);
  const getPosts = postStore((state) => state.getPosts);
  const loading = postStore((state) => state.loading);
  const error = postStore((state) => state.error);

  const categories = categoryStore((state) => state.categories);
  const getAllCategories = categoryStore((state) => state.getAllCategories);

  const [search, setSearch] = useState("");
  const [searchByCategory, setSearchByCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState([]);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPosts(
          page,
          debouncedSearch,
          searchByCategory,
        );
        console.log(response);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        toast.error(error || "Fetch posts failed!!!");
      }
    };
    fetchData();
  }, [page, debouncedSearch, searchByCategory]);

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
    } else {
      setPageCount([]);
    }
  }, [page, totalPages]);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold my-4">
        Blog chia sẻ thông tin công nghệ, du lịch, ẩm thực, đời sống...
      </h1>
      <p className="italic">"Chia sẻ thông tin, kiến thức cho mọi người"</p>
      <br />
      <div className="flex gap-2">
        <div className="relative border border-gray-400 shadow-gray-300 mb-3 rounded-xl">
          <Search
            color="#ccc"
            className="absolute top-1/2 left-2 transform -translate-y-1/2"
          />
          <input
            type="text"
            className="w-full pl-9 py-2 outline-[#884413] rounded-xl bg-white"
            placeholder="Tìm kiếm bài viết"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <select
            className="border border-gray-300 rounded-xl px-3 py-2 w-full bg-white outline-[#884413]"
            value={searchByCategory}
            onChange={(e) => setSearchByCategory(e.target.value)}
          >
            <option value="">Tất cả</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : posts.length === 0 ? (
          "Không có dữ liệu hiển thị!"
        ) : (
          posts.map((post) => (
            <Link
              key={post._id}
              to={`/posts/${post._id}`}
              className="border border-gray-400 rounded-xl p-3 hover:scale-101 ease-in transition-all flex flex-col justify-between"
            >
              <div>
                <img
                  src={post.file?.url || "/OIP.webp"}
                  alt={post.title}
                  className="w-full h-50 object-cover rounded-xl"
                />
                <h2 className="text-lg font-bold line-clamp-2 mt-2">
                  {post?.title}
                </h2>
              </div>
              <div className="flex justify-between items-center pt-3">
                <div className="flex justify-between items-center gap-2">
                  <img
                    className="w-8 h-8 object-cover rounded-full"
                    src={post.updatedBy?.file?.url || "/avt.webp"}
                    alt={post.updatedBy.name}
                  />
                  <span className="italic">{post.updatedBy.name}</span>
                </div>
                <div className="flex gap-1">
                  <Heart />
                  <span>99</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

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

export default HomePage;
