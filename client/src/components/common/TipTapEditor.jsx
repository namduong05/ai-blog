import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { useEffect } from "react";
import { MenuBar } from "../MenuBar";

const TipTapEditor = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyleKit, FontFamily],
    content: value || "", // Dữ liệu HTML ban đầu (khi Sửa bài viết)
    onUpdate: ({ editor }) => {
      // LẤY THẲNG HTML DẠNG THƯỜNG và đẩy vào React Hook Form
      if (!editor.isDestroyed) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        // Class của Tailwind để bọc vùng gõ chữ cho đẹp
        class:
          "prose max-w-none border border-gray-300 rounded-b-xl p-4 min-h-[250px] focus:outline-none focus:border-blue-500 bg-white",
      },
    },
  });

  // Lắng nghe nếu dữ liệu ban đầu thay đổi (Phục vụ cho trang Sửa khi API trả về chậm)
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    if (value !== undefined && value !== editor.getHTML()) {
      queueMicrotask(() => {
        if (!editor.isDestroyed) {
          editor.commands.setContent(value || "");
        }
      });
    }
  }, [value, editor]);

  if (!editor)
    return (
      <div className="border p-4 rounded-xl text-gray-400">
        Đang khởi tạo bộ soạn thảo...
      </div>
    );

  return (
    <div className="w-full">
      {/* THANH CÔNG CỤ (TOOLBAR) */}
      <MenuBar editor={editor} />

      {/* VÙNG NHẬP NỘI DUNG */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
