import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function Files() {
  const [files, setFiles] = useState([
    { id: 1, name: 'Project Roadmap.pdf', type: 'pdf', size: '2.4 MB', uploaded: '2 days ago', owner: 'John Doe', shared: 5 },
    { id: 2, name: 'Design Mockups.figma', type: 'figma', size: '15.8 MB', uploaded: '1 week ago', owner: 'Jane Smith', shared: 8 },
    { id: 3, name: 'API Documentation.md', type: 'doc', size: '456 KB', uploaded: '3 days ago', owner: 'Mike Johnson', shared: 12 },
    { id: 4, name: 'Sprint Planning Notes.docx', type: 'doc', size: '1.2 MB', uploaded: '5 hours ago', owner: 'Sarah Wilson', shared: 3 },
    { id: 5, name: 'Team Meeting Recording.mp4', type: 'video', size: '487 MB', uploaded: 'Today', owner: 'John Doe', shared: 10 },
    { id: 6, name: 'Database Schema.sql', type: 'code', size: '234 KB', uploaded: '1 week ago', owner: 'Mike Johnson', shared: 4 },
  ]);

  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const folders = [
    { id: 'all', name: 'All Files', emoji: '📂', count: files.length },
    { id: 'recent', name: 'Recent', emoji: '⏱️', count: 3 },
    { id: 'shared', name: 'Shared with Me', emoji: '👥', count: 12 },
    { id: 'documents', name: 'Documents', emoji: '📄', count: 8 },
    { id: 'media', name: 'Media', emoji: '🎬', count: 2 },
    { id: 'code', name: 'Code', emoji: '💻', count: 5 },
  ];

  const getFileIcon = (type) => {
    const icons = {
      pdf: '📕',
      doc: '📄',
      figma: '🎨',
      video: '🎬',
      code: '💻',
      image: '🖼️',
    };
    return icons[type] || '📎';
  };

  const handleUpload = (e) => {
    // TODO: Implement file upload
    console.log('Upload file:', e.target.files);
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📂 Files & Documents</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Folder Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="font-semibold text-gray-800 mb-4">Folders</h2>
            <div className="space-y-2">
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full text-left px-4 py-3 rounded transition flex items-center justify-between ${
                    selectedFolder === folder.id
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{folder.emoji}</span>
                    {folder.name}
                  </span>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">{folder.count}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center cursor-pointer font-semibold">
                + Upload File
                <input type="file" onChange={handleUpload} className="hidden" multiple />
              </label>
            </div>
          </div>

          {/* Files Area */}
          <div className="lg:col-span-3">
            {/* Header and Search */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {folders.find(f => f.id === selectedFolder)?.emoji} {folders.find(f => f.id === selectedFolder)?.name}
                </h2>
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFiles.map(file => (
                <div key={file.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getFileIcon(file.type)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 break-words">{file.name}</h3>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">⋯</button>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Uploaded by:</span>
                      <span className="font-semibold text-gray-800">{file.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span className="font-semibold text-gray-800">{file.uploaded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shared with:</span>
                      <span className="font-semibold text-gray-800">{file.shared} people</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-semibold">
                      View
                    </button>
                    <button className="flex-1 px-3 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition text-sm font-semibold">
                      Share
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition text-sm">
                      ⋮
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📜 Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'John Doe uploaded', file: 'Architecture Diagram.png', time: '2 hours ago' },
                  { action: 'Jane Smith shared', file: 'API Documentation.md', time: '5 hours ago' },
                  { action: 'Mike Johnson commented on', file: 'Design System.figma', time: '1 day ago' },
                  { action: 'Sarah Wilson edited', file: 'Sprint Planning Notes.docx', time: '2 days ago' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                    <div>
                      <p className="text-gray-800"><span className="font-semibold">{activity.action}</span> <span className="text-blue-600">{activity.file}</span></p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">→</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
