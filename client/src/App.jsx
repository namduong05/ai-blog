import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { lazy, Suspense } from "react";

// --- CÁC COMPONENT LAYOUT / ROUTE CORES (Nên giữ nguyên import tĩnh nếu dùng thường xuyên) ---
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import MainLayout from "./layouts/MainLayout";
import NotFound from "./pages/NotFound";

// --- CẤU HÌNH LAZY LOAD CHO CÁC PAGES TRANH CHỦ, PROFILE, PUBLIC ---
const HomePage = lazy(() => import("./pages/HomePage"));
const Profile = lazy(() => import("./pages/Profile"));
const Setting = lazy(() => import("./pages/Setting"));
const VerifyUser = lazy(() => import("./pages/VerifyUser"));

const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

// --- LAZY LOAD CHO CATEGORIES ---
const CategoryList = lazy(() => import("./pages/category/CategoryList"));
const AddCategory = lazy(() => import("./pages/category/AddCategory"));
const UpdateCategory = lazy(() => import("./pages/category/UpdateCategory"));

// --- LAZY LOAD CHO POSTS ---
const PostList = lazy(() => import("./pages/post/PostList"));
const AddPost = lazy(() => import("./pages/post/AddPost"));
const DetailPost = lazy(() => import("./pages/post/DetailPost"));
const UpdatePost = lazy(() => import("./pages/post/UpdatePost"));

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Suspense
        fallback={<div className="text-center p-5">Loading page...</div>}
      >
        <Routes>
          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Setting />} />
              <Route path="verify-user" element={<VerifyUser />} />

              {/* Categories */}
              <Route path="categories" element={<CategoryList />} />
              <Route path="categories/new-category" element={<AddCategory />} />
              <Route
                path="categories/update-category/:id"
                element={<UpdateCategory />}
              />

              {/* Posts */}
              <Route path="my-posts" element={<PostList />} />
              <Route path="my-posts/new-post" element={<AddPost />} />
              <Route path="my-posts/:id" element={<DetailPost />} />
              <Route path="posts/:id" element={<DetailPost />} />
              <Route path="my-posts/update-post/:id" element={<UpdatePost />} />
            </Route>
          </Route>

          {/* Public Routes */}
          <Route element={<PublicRoutes />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* NotFound Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
