import { Link, useNavigate } from "react-router";
import postStore from "../../store/postStore";
import categoryStore from "../../store/categoryStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDebounce } from "../../hooks/useDebounce";
import { NotebookPen, Search } from "lucide-react";
import Skeleton from "../../components/Skeleton";

const PostList = () => {
  const posts = postStore((state) => state.posts);
  const getMyPosts = postStore((state) => state.getMyPosts);
  const loading = postStore((state) => state.loading);
  const error = postStore((state) => state.error);

  const categories = categoryStore((state) => state.categories);
  const getAllCategories = categoryStore((state) => state.getAllCategories);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [searchByCategory, setSearchByCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState([]);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyPosts(
          page,
          debouncedSearch,
          searchByCategory,
        );
        console.log(response, response?.data?.totalPages);
        setTotalPages(response?.data?.totalPages || 0);
      } catch (err) {
        toast.error(error || "Fetch posts failed!!");
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
    <div className="w-3/4 mx-auto pt-2">
      <button
        onClick={() => navigate("new-post")}
        className="bg-[#884413] text-white rounded-xl px-3 py-2 flex gap-1"
      >
        <NotebookPen />
        Thêm bài viết mới
      </button>

      <h1 className="text-2xl font-bold my-4 text-center">Bài viết của tôi</h1>
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
            placeholder="Enter post title"
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
            <div>
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-6 w-3/4 mt-3" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
            <div>
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-6 w-3/4 mt-3" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
            <div>
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-6 w-3/4 mt-3" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
          </>
        ) : posts.length === 0 ? (
          "You have no posts yet.!"
        ) : (
          posts.map((post) => (
            <Link
              key={post?._id}
              to={`/my-posts/${post?._id}`}
              className="border border-gray-400 rounded-xl p-3 hover:scale-105 ease-in transition-all"
            >
              <img
                src={post?.file?.url || "/OIP.webp"}
                alt={post?.title}
                className="w-full h-50 object-cover"
              />
              <h2 className="text-lg font-bold line-clamp-2">{post?.title}</h2>
              <p className="line-clamp-2">{post?.desc}</p>
            </Link>
          ))
        )}
      </div>

      {pageCount.length > 0 && (
        <div className="mt-4">
          <button
            className="bg-gray-500 p-2 rounded-xl text-white mr-2"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || loading}
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
            disabled={page === totalPages || loading}
            className="bg-gray-500 p-2 rounded-xl text-white ml-2"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;
