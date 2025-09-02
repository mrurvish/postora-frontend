import React, { useState, useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function RichTextEditor({ value, onChange, placeholder, error }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertText = (text: string) => {
    document.execCommand('insertText', false, text);
    editorRef.current?.focus();
    handleInput();
  };

  const ToolbarButton = ({ 
    onClick, 
    icon, 
    title, 
    active = false 
  }: { 
    onClick: () => void; 
    icon: string; 
    title: string; 
    active?: boolean; 
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-muted transition-colors ${
        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border border-border rounded-t-md bg-muted/50">
        <ToolbarButton
          onClick={() => execCommand('bold')}
          icon="B"
          title="Bold"
        />
        <ToolbarButton
          onClick={() => execCommand('italic')}
          icon="I"
          title="Italic"
        />
        <ToolbarButton
          onClick={() => execCommand('underline')}
          icon="U"
          title="Underline"
        />
        
        <div className="w-px h-6 bg-border mx-2"></div>
        
        <ToolbarButton
          onClick={() => execCommand('formatBlock', '<h2>')}
          icon="H2"
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() => execCommand('formatBlock', '<h3>')}
          icon="H3"
          title="Heading 3"
        />
        <ToolbarButton
          onClick={() => execCommand('formatBlock', '<p>')}
          icon="P"
          title="Paragraph"
        />
        
        <div className="w-px h-6 bg-border mx-2"></div>
        
        <ToolbarButton
          onClick={() => execCommand('insertUnorderedList')}
          icon="•"
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => execCommand('insertOrderedList')}
          icon="1."
          title="Numbered List"
        />
        
        <div className="w-px h-6 bg-border mx-2"></div>
        
        <ToolbarButton
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) {
              execCommand('createLink', url);
            }
          }}
          icon="🔗"
          title="Insert Link"
        />
        <ToolbarButton
          onClick={() => insertText('\n---\n')}
          icon="—"
          title="Insert Divider"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[200px] p-4 border border-border rounded-b-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          error ? 'border-red-500' : ''
        } ${isFocused ? 'ring-2 ring-primary/20' : ''}`}
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      
      {/* Character Count */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Rich text editor</span>
        <span>{value.replace(/<[^>]*>/g, '').length} characters</span>
      </div>
    </div>
  );
}
