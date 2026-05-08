import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Strikethrough, Underline,
  Code, List, ListOrdered, Image as ImageIcon,
} from 'lucide-react';
import { Tooltip, Button } from 'antd';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: string | number;
}

export function RichTextEditor({ value, onChange, placeholder, minHeight = 200 }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      ImageExtension,
      Placeholder.configure({
        placeholder: placeholder ?? 'Nhập mô tả chi tiết...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3 text-slate-700',
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Nhập URL hình ảnh:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const ToolbarButton = ({
    onClick,
    isActive = false,
    icon: Icon,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    title: string;
  }) => (
    <Tooltip title={title} mouseEnterDelay={0.5}>
      <Button
        type="text"
        size="small"
        onClick={onClick}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-blue-100 text-blue-600 shadow-sm'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
        }`}
      >
        <Icon className="w-4 h-4" />
      </Button>
    </Tooltip>
  );

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all bg-white shadow-sm">
      {/* ── Toolbar ── */}
      <div className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200 p-1.5 flex flex-wrap gap-1 items-center">
        <ToolbarButton
          title="In đậm (Ctrl+B)"
          icon={Bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        />
        <ToolbarButton
          title="In nghiêng (Ctrl+I)"
          icon={Italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        />
        <ToolbarButton
          title="Gạch ngang"
          icon={Strikethrough}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
        />
        <ToolbarButton
          title="Gạch chân (Ctrl+U)"
          icon={Underline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
        />
        
        <div className="w-px h-5 bg-slate-300 mx-1" />

        <ToolbarButton
          title="Mã nguồn"
          icon={Code}
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
        />
        <ToolbarButton
          title="Danh sách dấu chấm"
          icon={List}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        />
        <ToolbarButton
          title="Danh sách số"
          icon={ListOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        />

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <ToolbarButton
          title="Chèn ảnh"
          icon={ImageIcon}
          onClick={addImage}
        />
      </div>

      {/* ── Content Area ── */}
      <div 
        className="overflow-y-auto" 
        style={{ minHeight }}
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .tiptap ul { list-style-type: disc; padding-left: 1.5rem; margin: 1rem 0; }
        .tiptap ol { list-style-type: decimal; padding-left: 1.5rem; margin: 1rem 0; }
        .tiptap blockquote { border-left: 3px solid #e2e8f0; padding-left: 1rem; color: #64748b; font-style: italic; }
        .tiptap code { background: #f1f5f9; color: #475569; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
        .tiptap img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }
      `}} />
    </div>
  );
}
