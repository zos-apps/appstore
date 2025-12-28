import React, { useState } from 'react';

interface AppStoreProps { onClose: () => void; }

const FEATURED = [
  { name: 'Doom', icon: '👹', category: 'Games', desc: 'Rip and tear', installed: true },
  { name: 'Chess', icon: '♟️', category: 'Games', desc: 'Play chess with AI', installed: true },
  { name: 'Arcade', icon: '🕹️', category: 'Games', desc: 'Retro gaming', installed: false },
  { name: 'Excalidraw', icon: '🎨', category: 'Creative', desc: 'Virtual whiteboard', installed: true },
  { name: 'VS Code', icon: '💻', category: 'Developer', desc: 'Code editor', installed: false },
  { name: 'Spotify', icon: '🎵', category: 'Music', desc: 'Stream music', installed: true },
];

const AppStore: React.FC<AppStoreProps> = ({ onClose }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', 'Games', 'Creative', 'Developer', 'Music', 'Productivity'];
  const filtered = FEATURED.filter(a => (category === 'All' || a.category === category) && a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">🏪 App Store</h1>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search apps..." className="w-full max-w-md px-4 py-2 rounded-lg text-black" />
      </div>
      <div className="flex gap-2 p-4 border-b overflow-x-auto">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-full whitespace-nowrap ${category === c ? 'bg-blue-500 text-white' : 'bg-white'}`}>{c}</button>
        ))}
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(a => (
            <div key={a.name} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
              <div className="text-4xl">{a.icon}</div>
              <div className="flex-1">
                <div className="font-bold">{a.name}</div>
                <div className="text-gray-500 text-sm">{a.desc}</div>
                <div className="text-xs text-gray-400">{a.category}</div>
              </div>
              <button className={`px-4 py-2 rounded-lg font-bold ${a.installed ? 'bg-gray-200 text-gray-600' : 'bg-blue-500 text-white'}`}>
                {a.installed ? 'Open' : 'Get'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppStore;
