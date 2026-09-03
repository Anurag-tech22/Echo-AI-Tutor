import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, FileText, Bookmark, Plus, Save, MoreVertical, Trash2 } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { cn } from '../../lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  bookmarked: boolean;
  isDraft?: boolean;
}

const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: "Newton's Second Law - Misconceptions",
    bookmarked: false,
    content: "Today I realized a fundamental flaw in my understanding of F = ma. I used to think that applying a force always causes an object to move.\n\nFlawed Model:\nForce = Movement. If you push something, it moves. If it's moving, there must be a force pushing it.\n\nCorrected Model:\nForce = Change in movement (Acceleration). An object can move perfectly fine without any force. Force is only required to change its direction or speed."
  },
  {
    id: '2',
    title: "Kinematic Equations Summary",
    bookmarked: true,
    content: "The 4 main equations of constant acceleration kinematics:\n1. v = v0 + at\n2. x = x0 + v0t + 1/2at^2\n3. v^2 = v0^2 + 2a(x - x0)\n4. x - x0 = 1/2(v0 + v)t\n\nAlways remember to check if acceleration is constant before applying these!"
  }
];

export function NotebookView() {
  const { showToast } = useUI();
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [activeNoteId, setActiveNoteId] = useState<string>(INITIAL_NOTES[0].id);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const activeNote = notes.find(n => n.id === activeNoteId);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (activeNoteId === id) {
      setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : '');
      setIsEditing(false);
    }
    setOpenMenuId(null);
    showToast("Note deleted");
  };

  const handleNewEntry = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Entry',
      content: '',
      bookmarked: false,
      isDraft: true
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setIsEditing(true);
  };

  const handleSave = () => {
    setNotes(notes.map(n => 
      n.id === activeNoteId 
        ? { ...n, title: editTitle, content: editContent, isDraft: false } 
        : n
    ));
    setIsEditing(false);
    showToast("Note saved successfully.");
  };

  const toggleBookmark = () => {
    setNotes(notes.map(n => 
      n.id === activeNoteId ? { ...n, bookmarked: !n.bookmarked } : n
    ));
    showToast(activeNote?.bookmarked ? "Removed bookmark" : "Entry bookmarked");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 fade-in h-full flex flex-col">
      <div className="mb-8 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Personal Notebook</h1>
          <p className="text-slate-400">Your documented insights, theorems, and resolved misconceptions.</p>
        </div>
        <button 
          onClick={handleNewEntry}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-xl text-white transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Entry</span>
        </button>
      </div>

      <div className="flex flex-1 gap-6 min-h-[500px]">
        {/* Sidebar */}
        <div className="w-64 shrink-0 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 backdrop-blur-md max-h-full overflow-y-auto">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Notebooks</h3>
            <div className="space-y-1">
              {notes.map(note => (
                <div key={note.id} className="relative group flex items-center">
                  <button 
                    onClick={() => {
                      setActiveNoteId(note.id);
                      setIsEditing(false);
                    }}
                    className={cn(
                      "flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left truncate pr-8",
                      activeNoteId === note.id 
                        ? "bg-slate-800 text-indigo-400" 
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    )}
                  >
                    <BookOpen className="w-4 h-4 shrink-0" /> 
                    <span className="truncate">{note.title || 'Untitled'}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === note.id ? null : note.id);
                    }}
                    className="absolute right-1 p-1.5 text-slate-500 hover:text-slate-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {openMenuId === note.id && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-10">
                      <button
                        onClick={(e) => handleDelete(note.id, e)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors text-left"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700 cursor-pointer hover:bg-slate-700">#kinematics</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700 cursor-pointer hover:bg-slate-700">#resolved</span>
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded border border-indigo-500/30 cursor-pointer hover:bg-indigo-500/30">#review</span>
            </div>
          </div>
        </div>
        
        {/* Editor Area */}
        {activeNote && (
          <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col overflow-hidden backdrop-blur-md">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                {isEditing ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="bg-slate-800 border-none rounded px-2 py-1 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full max-w-sm"
                    placeholder="Note Title"
                  />
                ) : (
                  <span className="text-sm font-medium text-slate-200 truncate">{activeNote.title}</span>
                )}
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                {isEditing ? (
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setEditTitle(activeNote.title);
                      setEditContent(activeNote.content);
                      setIsEditing(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                )}
                <button 
                  onClick={toggleBookmark}
                  className={cn(
                    "p-2 rounded-lg transition-colors border",
                    activeNote.bookmarked 
                      ? "text-amber-400 bg-amber-400/10 border-amber-400/20" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800 border-transparent"
                  )}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full min-h-[400px] bg-transparent text-slate-300 leading-relaxed text-lg resize-none focus:outline-none"
                  placeholder="Start typing your insights..."
                />
              ) : (
                <div className="prose prose-invert prose-slate max-w-none whitespace-pre-wrap">
                  <h2 className="text-3xl font-bold text-white mb-6">{activeNote.title}</h2>
                  <p className="text-slate-300 leading-relaxed text-lg mb-4">
                    {activeNote.content || <span className="text-slate-500 italic">No content...</span>}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
