import { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder = "Write your content here..." }: RichTextEditorProps) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-background rounded-lg"
      />
      <style>{`
        .rich-text-editor .ql-container {
          min-height: 200px;
          font-size: 16px;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          background: hsl(var(--background));
          border-color: hsl(var(--border));
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: hsl(var(--muted));
          border-color: hsl(var(--border));
        }
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: hsl(var(--foreground));
        }
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: hsl(var(--foreground));
        }
        .rich-text-editor .ql-toolbar .ql-picker {
          color: hsl(var(--foreground));
        }
        .rich-text-editor .ql-toolbar .ql-picker-options {
          background: hsl(var(--popover));
          border-color: hsl(var(--border));
        }
        .rich-text-editor .ql-editor {
          color: hsl(var(--foreground));
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
        }
        .rich-text-editor .ql-snow .ql-picker.ql-expanded .ql-picker-label {
          border-color: hsl(var(--border));
        }
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar .ql-picker-label:hover .ql-stroke {
          stroke: hsl(var(--primary));
        }
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: hsl(var(--primary));
        }
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: hsl(var(--primary));
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
