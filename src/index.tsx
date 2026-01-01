import { useState, useCallback } from 'react';

interface AppStoreProps {
  onClose: () => void;
}

interface App {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  version: string;
  author: string;
  repo: string;
  size: string;
  rating: number;
  downloads: number;
  installed: boolean;
  updateAvailable?: boolean;
  screenshots?: string[];
  tags?: string[];
}

// Registry of all zOS apps - fetched from GitHub or local registry
const APP_REGISTRY: App[] = [
  // Games
  { id: 'doom', name: 'Doom', icon: '👹', category: 'Games', description: 'Classic FPS with raycasting 3D engine. Rip and tear!', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-doom', size: '14KB', rating: 4.9, downloads: 15000, installed: true, tags: ['fps', 'retro', 'action'] },
  { id: 'chess', name: 'Chess', icon: '♟️', category: 'Games', description: 'Play chess against AI with adjustable difficulty', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-chess', size: '13KB', rating: 4.8, downloads: 12000, installed: true, tags: ['strategy', 'ai', 'classic'] },
  { id: 'arcade', name: 'Arcade', icon: '🕹️', category: 'Games', description: 'Multi-console emulator: NES, SNES, N64, GB, GBA, Genesis, PSX', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-arcade', size: '8KB', rating: 4.9, downloads: 25000, installed: false, tags: ['emulator', 'retro', 'nintendo'] },
  { id: 'snes', name: 'SNES', icon: '🎮', category: 'Games', description: 'Super Nintendo Entertainment System emulator', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-snes', size: '6KB', rating: 4.7, downloads: 18000, installed: false, tags: ['emulator', 'retro', 'nintendo'] },
  { id: 'solitaire', name: 'Solitaire', icon: '🃏', category: 'Games', description: 'Classic Klondike solitaire with drag and drop', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-solitaire', size: '12KB', rating: 4.6, downloads: 8000, installed: false, tags: ['cards', 'classic', 'casual'] },
  { id: 'minesweeper', name: 'Minesweeper', icon: '💣', category: 'Games', description: 'Classic puzzle game - clear the minefield!', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-minesweeper', size: '7KB', rating: 4.5, downloads: 6000, installed: false, tags: ['puzzle', 'classic', 'logic'] },
  { id: 'snake', name: 'Snake', icon: '🐍', category: 'Games', description: 'Classic snake game with increasing speed', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-snake', size: '7KB', rating: 4.4, downloads: 5000, installed: false, tags: ['arcade', 'classic', 'casual'] },
  { id: 'tetris', name: 'Tetris', icon: '🧱', category: 'Games', description: 'Classic falling blocks puzzle game', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-tetris', size: '11KB', rating: 4.8, downloads: 20000, installed: false, tags: ['puzzle', 'classic', 'arcade'] },
  { id: '2048', name: '2048', icon: '🔢', category: 'Games', description: 'Slide tiles to merge and reach 2048', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-2048', size: '8KB', rating: 4.5, downloads: 7000, installed: false, tags: ['puzzle', 'numbers', 'casual'] },
  { id: 'sudoku', name: 'Sudoku', icon: '🔲', category: 'Games', description: 'Number puzzle with multiple difficulties', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-sudoku', size: '4KB', rating: 4.6, downloads: 4000, installed: false, tags: ['puzzle', 'numbers', 'logic'] },
  { id: 'myst', name: 'Myst', icon: '🌫️', category: 'Games', description: 'A mysterious island appears in the fog...', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-myst', size: '9KB', rating: 4.9, downloads: 3000, installed: false, tags: ['adventure', 'mystery', 'hidden'] },

  // Creative
  { id: 'excalidraw', name: 'Excalidraw', icon: '🎨', category: 'Creative', description: 'Virtual whiteboard for sketching hand-drawn diagrams', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-excalidraw', size: '2KB', rating: 4.9, downloads: 50000, installed: true, tags: ['drawing', 'diagrams', 'whiteboard'] },
  { id: 'codepen', name: 'CodePen', icon: '✏️', category: 'Creative', description: 'Live HTML/CSS/JS playground', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-codepen', size: '2KB', rating: 4.7, downloads: 25000, installed: false, tags: ['code', 'playground', 'web'] },
  { id: 'tldraw', name: 'tldraw', icon: '📐', category: 'Creative', description: 'A tiny little drawing app', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-tldraw', size: '2KB', rating: 4.6, downloads: 15000, installed: false, tags: ['drawing', 'canvas', 'design'] },
  { id: 'figma', name: 'Figma', icon: '🎨', category: 'Creative', description: 'Collaborative design tool', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-figma', size: '2KB', rating: 4.9, downloads: 100000, installed: false, tags: ['design', 'ui', 'collaboration'] },
  { id: 'blender', name: 'Blender', icon: '🎬', category: 'Creative', description: '3D creation suite', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-blender', size: '3KB', rating: 4.8, downloads: 80000, installed: false, tags: ['3d', 'animation', 'modeling'] },
  { id: 'final-cut-pro', name: 'Final Cut Pro', icon: '🎥', category: 'Creative', description: 'Professional video editing', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-final-cut-pro', size: '3KB', rating: 4.8, downloads: 50000, installed: false, tags: ['video', 'editing', 'pro'] },

  // Developer
  { id: 'vscode', name: 'VS Code', icon: '💻', category: 'Developer', description: 'Code editor with IntelliSense', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-vscode', size: '3KB', rating: 4.9, downloads: 200000, installed: false, tags: ['code', 'editor', 'ide'] },
  { id: 'terminal', name: 'Terminal', icon: '💻', category: 'Developer', description: 'Command line interface with zsh', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-terminal', size: '7KB', rating: 4.7, downloads: 45000, installed: true, tags: ['cli', 'shell', 'command'] },
  { id: 'console', name: 'Console', icon: '🖥️', category: 'Developer', description: 'System console viewer', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-console', size: '4KB', rating: 4.4, downloads: 8000, installed: false, tags: ['debug', 'logs', 'system'] },
  { id: 'observable', name: 'Observable', icon: '📊', category: 'Developer', description: 'Interactive notebooks for data viz', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-observable', size: '2KB', rating: 4.6, downloads: 12000, installed: false, tags: ['data', 'viz', 'notebooks'] },

  // Music
  { id: 'spotify', name: 'Spotify', icon: '🎵', category: 'Music', description: 'Stream millions of songs', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-spotify', size: '2KB', rating: 4.8, downloads: 500000, installed: true, tags: ['streaming', 'music', 'playlists'] },
  { id: 'music', name: 'Music', icon: '🎶', category: 'Music', description: 'Local music player', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-music', size: '5KB', rating: 4.5, downloads: 25000, installed: false, tags: ['player', 'local', 'library'] },
  { id: 'podcasts', name: 'Podcasts', icon: '🎙️', category: 'Music', description: 'Discover and play podcasts', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-podcasts', size: '4KB', rating: 4.4, downloads: 15000, installed: false, tags: ['audio', 'shows', 'streaming'] },
  { id: 'ableton-live', name: 'Ableton Live', icon: '🎹', category: 'Music', description: 'Digital audio workstation', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-ableton-live', size: '6KB', rating: 4.9, downloads: 75000, installed: false, tags: ['daw', 'production', 'midi'] },
  { id: 'rekordbox', name: 'Rekordbox', icon: '💿', category: 'Music', description: 'DJ software', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-rekordbox', size: '5KB', rating: 4.7, downloads: 40000, installed: false, tags: ['dj', 'mixing', 'beats'] },

  // Productivity
  { id: 'notes', name: 'Notes', icon: '📝', category: 'Productivity', description: 'Quick notes and markdown', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-notes', size: '4KB', rating: 4.6, downloads: 80000, installed: true, tags: ['notes', 'markdown', 'writing'] },
  { id: 'calculator', name: 'Calculator', icon: '🧮', category: 'Productivity', description: 'Scientific calculator', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-calculator', size: '4KB', rating: 4.5, downloads: 50000, installed: true, tags: ['math', 'calc', 'utility'] },
  { id: 'calendar', name: 'Calendar', icon: '📅', category: 'Productivity', description: 'Schedule and events', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-calendar', size: '5KB', rating: 4.6, downloads: 60000, installed: false, tags: ['schedule', 'events', 'planning'] },
  { id: 'reminders', name: 'Reminders', icon: '⏰', category: 'Productivity', description: 'Task reminders and lists', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-reminders', size: '4KB', rating: 4.5, downloads: 35000, installed: false, tags: ['tasks', 'lists', 'alerts'] },
  { id: 'contacts', name: 'Contacts', icon: '👥', category: 'Productivity', description: 'Contact management', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-contacts', size: '4KB', rating: 4.4, downloads: 25000, installed: false, tags: ['people', 'address', 'book'] },
  { id: 'books', name: 'Books', icon: '📚', category: 'Productivity', description: 'eBook reader', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-books', size: '4KB', rating: 4.6, downloads: 30000, installed: false, tags: ['reader', 'epub', 'library'] },
  { id: 'gmail', name: 'Gmail', icon: '📧', category: 'Productivity', description: 'Email client', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-gmail', size: '2KB', rating: 4.7, downloads: 200000, installed: false, tags: ['email', 'google', 'mail'] },
  { id: 'files', name: 'Files', icon: '📂', category: 'Productivity', description: 'File manager', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-files', size: '5KB', rating: 4.5, downloads: 45000, installed: false, tags: ['files', 'folders', 'manager'] },
  { id: 'todo', name: 'Todo', icon: '✅', category: 'Productivity', description: 'Task management', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-todo', size: '4KB', rating: 4.6, downloads: 55000, installed: true, tags: ['tasks', 'lists', 'gtd'] },

  // Social
  { id: 'discord', name: 'Discord', icon: '💬', category: 'Social', description: 'Voice, video & text chat', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-discord', size: '3KB', rating: 4.8, downloads: 300000, installed: false, tags: ['chat', 'voice', 'gaming'] },
  { id: 'slack', name: 'Slack', icon: '💼', category: 'Social', description: 'Team communication', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-slack', size: '3KB', rating: 4.7, downloads: 250000, installed: false, tags: ['work', 'chat', 'teams'] },
  { id: 'twitter', name: 'Twitter', icon: '🐦', category: 'Social', description: 'Social network', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-twitter', size: '3KB', rating: 4.5, downloads: 400000, installed: false, tags: ['social', 'tweets', 'news'] },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', category: 'Social', description: 'Professional network', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-linkedin', size: '3KB', rating: 4.4, downloads: 150000, installed: false, tags: ['jobs', 'career', 'network'] },
  { id: 'whatsapp', name: 'WhatsApp', icon: '📱', category: 'Social', description: 'Messaging app', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-whatsapp', size: '3KB', rating: 4.6, downloads: 500000, installed: false, tags: ['messaging', 'chat', 'calls'] },

  // Media
  { id: 'youtube', name: 'YouTube', icon: '📺', category: 'Media', description: 'Watch videos', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-youtube', size: '2KB', rating: 4.8, downloads: 800000, installed: false, tags: ['video', 'streaming', 'entertainment'] },
  { id: 'netflix', name: 'Netflix', icon: '🎬', category: 'Media', description: 'Stream movies and TV', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-netflix', size: '2KB', rating: 4.7, downloads: 600000, installed: false, tags: ['movies', 'tv', 'streaming'] },
  { id: 'photos', name: 'Photos', icon: '📷', category: 'Media', description: 'Photo library', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-photos', size: '4KB', rating: 4.6, downloads: 100000, installed: false, tags: ['gallery', 'images', 'albums'] },

  // System
  { id: 'clock', name: 'Clock', icon: '🕐', category: 'System', description: 'World clock and timer', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-clock', size: '5KB', rating: 4.5, downloads: 40000, installed: true, tags: ['time', 'timer', 'alarm'] },
  { id: 'weather', name: 'Weather', icon: '☀️', category: 'System', description: 'Weather forecast', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-weather', size: '4KB', rating: 4.6, downloads: 80000, installed: true, tags: ['forecast', 'temperature', 'climate'] },
  { id: 'maps', name: 'Maps', icon: '🗺️', category: 'System', description: 'Navigation and maps', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-maps', size: '2KB', rating: 4.7, downloads: 150000, installed: false, tags: ['navigation', 'gps', 'directions'] },
  { id: 'disk-utility', name: 'Disk Utility', icon: '💾', category: 'System', description: 'Storage management', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-disk-utility', size: '4KB', rating: 4.3, downloads: 15000, installed: false, tags: ['storage', 'disk', 'utility'] },
  { id: 'keychain-access', name: 'Keychain Access', icon: '🔐', category: 'System', description: 'Password management', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-keychain-access', size: '4KB', rating: 4.4, downloads: 20000, installed: false, tags: ['passwords', 'security', 'keys'] },
  { id: 'screen-time', name: 'Screen Time', icon: '📊', category: 'System', description: 'Usage analytics', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-screen-time', size: '3KB', rating: 4.2, downloads: 10000, installed: false, tags: ['analytics', 'time', 'health'] },
  { id: 'screenshot', name: 'Screenshot', icon: '📸', category: 'System', description: 'Screen capture', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-screenshot', size: '4KB', rating: 4.5, downloads: 25000, installed: false, tags: ['capture', 'screen', 'utility'] },
  { id: 'grapher', name: 'Grapher', icon: '📈', category: 'System', description: '2D/3D equation grapher', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-grapher', size: '4KB', rating: 4.4, downloads: 8000, installed: false, tags: ['math', 'graphs', '3d'] },
  { id: 'audio-midi-setup', name: 'Audio MIDI Setup', icon: '🎛️', category: 'System', description: 'Audio device config', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-audio-midi-setup', size: '3KB', rating: 4.3, downloads: 5000, installed: false, tags: ['audio', 'midi', 'settings'] },
  { id: 'digital-color-meter', name: 'Color Meter', icon: '🎨', category: 'System', description: 'Color picker tool', version: '1.0.0', author: 'Hanzo', repo: 'zeekay/zos-digital-color-meter', size: '3KB', rating: 4.4, downloads: 6000, installed: false, tags: ['color', 'picker', 'design'] },
];

const CATEGORIES = ['All', 'Games', 'Creative', 'Developer', 'Music', 'Productivity', 'Social', 'Media', 'System'];

const AppStore: React.FC<AppStoreProps> = ({ onClose: _onClose }) => {
  const [apps, setApps] = useState<App[]>(APP_REGISTRY);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [installing, setInstalling] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'downloads' | 'rating'>('downloads');

  // Filter and sort apps
  const filteredApps = apps
    .filter(app => {
      const matchesSearch = search === '' || 
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.description.toLowerCase().includes(search.toLowerCase()) ||
        app.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === 'All' || app.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

  const installApp = useCallback(async (app: App) => {
    setInstalling(app.id);
    // Simulate installation (in real OS, this would fetch from npm/GitHub)
    await new Promise(resolve => setTimeout(resolve, 1500));
    setApps(prev => prev.map(a => 
      a.id === app.id ? { ...a, installed: true } : a
    ));
    setInstalling(null);
    // In real OS: emit event for hot-loading
    // window.dispatchEvent(new CustomEvent('zos:app-installed', { detail: app }));
  }, []);

  const uninstallApp = useCallback(async (app: App) => {
    setInstalling(app.id);
    await new Promise(resolve => setTimeout(resolve, 800));
    setApps(prev => prev.map(a => 
      a.id === app.id ? { ...a, installed: false } : a
    ));
    setInstalling(null);
  }, []);

  const openApp = useCallback((app: App) => {
    // In real OS: emit event to open app
    // window.dispatchEvent(new CustomEvent('zos:open-app', { detail: app.id }));
    console.log('Opening app:', app.id);
  }, []);

  // App detail view
  if (selectedApp) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-4">
          <button onClick={() => setSelectedApp(null)} className="text-blue-500 hover:text-blue-600">
            ← Back
          </button>
        </div>

        {/* App details */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="text-7xl">{selectedApp.icon}</div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">{selectedApp.name}</h1>
                <p className="text-gray-500 mb-2">{selectedApp.author}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>⭐ {selectedApp.rating}</span>
                  <span>📥 {selectedApp.downloads.toLocaleString()}</span>
                  <span>📦 {selectedApp.size}</span>
                  <span>v{selectedApp.version}</span>
                </div>
              </div>
              <button
                onClick={() => selectedApp.installed ? uninstallApp(selectedApp) : installApp(selectedApp)}
                disabled={installing === selectedApp.id}
                className={`px-8 py-3 rounded-lg font-bold text-lg ${
                  installing === selectedApp.id
                    ? 'bg-gray-300 cursor-wait'
                    : selectedApp.installed
                    ? 'bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {installing === selectedApp.id 
                  ? '⏳ ...' 
                  : selectedApp.installed 
                  ? 'Uninstall' 
                  : 'Get'}
              </button>
              {selectedApp.installed && (
                <button
                  onClick={() => openApp(selectedApp)}
                  className="px-8 py-3 rounded-lg font-bold text-lg bg-green-500 text-white hover:bg-green-600"
                >
                  Open
                </button>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{selectedApp.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {selectedApp.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2">{selectedApp.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Version:</span>
                  <span className="ml-2">{selectedApp.version}</span>
                </div>
                <div>
                  <span className="text-gray-500">Size:</span>
                  <span className="ml-2">{selectedApp.size}</span>
                </div>
                <div>
                  <span className="text-gray-500">Source:</span>
                  <a 
                    href={`https://github.com/${selectedApp.repo}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">🏪 App Store</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {apps.filter(a => a.installed).length} installed
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {apps.length} apps
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search apps, categories, or tags..."
            className="flex-1 px-4 py-3 rounded-xl text-black bg-white shadow-lg"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-3 rounded-xl text-black bg-white shadow-lg"
          >
            <option value="downloads">Popular</option>
            <option value="rating">Top Rated</option>
            <option value="name">A-Z</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 p-4 border-b bg-white overflow-x-auto">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              category === c
                ? 'bg-blue-500 text-white shadow'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {c}
            {c !== 'All' && (
              <span className="ml-1 text-xs opacity-70">
                ({apps.filter(a => a.category === c).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* App grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map(app => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
            >
              <div className="text-5xl">{app.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{app.name}</div>
                <div className="text-gray-500 text-sm truncate">{app.description}</div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span>⭐ {app.rating}</span>
                  <span>•</span>
                  <span>{app.category}</span>
                </div>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  if (app.installed) {
                    openApp(app);
                  } else {
                    installApp(app);
                  }
                }}
                disabled={installing === app.id}
                className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap ${
                  installing === app.id
                    ? 'bg-gray-200 text-gray-500'
                    : app.installed
                    ? 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {installing === app.id ? '⏳' : app.installed ? 'Open' : 'Get'}
              </button>
            </div>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">🔍</div>
            <p>No apps found matching "{search}"</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-white border-t text-center text-xs text-gray-400">
        zOS App Store • {apps.length} apps available • Hot-swappable architecture
      </div>
    </div>
  );
};

export default AppStore;
