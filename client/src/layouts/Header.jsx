import { NavLink } from "react-router";
import authStore from "../store/authStore";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const user = authStore((state) => state.user);
  const signOut = authStore((state) => state.signOut);

  const handleSignOut = () => {
    signOut();
    toast.info("Bạn đã đăng xuất.");
  };
  return (
    <>
      <header className="bg-[#884413] text-white flex justify-between fixed w-full top-0 left-0 right-0 z-10 font-primary">
        <div className="py-3 px-4 flex items-center justify-between gap-4 w-full">
          <h1 className="text-2xl font-bold text-[#f8c869]">Blog</h1>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink className="px-4 py-1 rounded-xl" to="/">
              Trang chủ
            </NavLink>
            <NavLink className="px-4 py-1 rounded-xl" to="/my-posts">
              Bài viết của tôi
            </NavLink>
            {user.role === 1 && (
              <NavLink className="px-4 py-1 rounded-xl" to="/categories">
                Thể loại
              </NavLink>
            )}
            <NavLink className="px-4 py-1 rounded-xl" to="/profile">
              Trang cá nhân
            </NavLink>
          </nav>
          <div
            onClick={handleSignOut}
            className="hidden md:block cursor-pointer border border-[#c88a5e] px-4 py-1 rounded-xl"
          >
            Đăng xuất
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 fixed top-12 left-0 right-0 bg-[#884413] text-white z-60 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col">
          <NavLink
            onClick={() => setIsOpen(false)}
            className="p-2 w-full text-center"
            to="/"
          >
            Trang chủ
          </NavLink>
          <NavLink
            onClick={() => setIsOpen(false)}
            className="p-2 w-full text-center"
            to="/posts"
          >
            Bài viết của tôi
          </NavLink>
          {user.role === 1 && (
            <NavLink
              onClick={() => setIsOpen(false)}
              className="p-2 w-full text-center"
              to="/categories"
            >
              Thể loại
            </NavLink>
          )}
          <NavLink
            onClick={() => setIsOpen(false)}
            className="p-2 w-full text-center"
            to="/profile"
          >
            Trang cá nhân
          </NavLink>
        </nav>
        <div
          onClick={handleSignOut}
          className=" text-center cursor-pointer border-t border-[#c88a5e] p-2"
        >
          Đăng xuất
        </div>
      </div>
    </>
  );
};

export default Header;
