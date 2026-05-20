import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { filesAPI } from '../services/api';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Files() {
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const canUpload = user && (user.role === 'Admin' || ['Project Lead', 'Project QL'].includes(user.designation));

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) loadFiles();
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedProjectId(res.data[0]._id || res.data[0].id);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Could not load projects.');
    }
  };

  const loadFiles = async () => {
    setLoading(true);
    try {
      const params = selectedProjectId ? { projectId: selectedProjectId } : {};
      const res = await filesAPI.getFiles(params);
      setFiles(res.data || []);
      setError('');
    } catch (err) {
      console.error('Error loading files:', err);
      setError('Could not load files.');
    } finally {
      setLoading(false);
    }
  };

  const getSharedCount = (file) => {
    if (Array.isArray(file.shared)) return file.shared.length;
    if (typeof file.shared === 'number') return file.shared;
    return 0;
  };

  const getUploadedLabel = (uploadedAt, uploaded) => {
    if (uploadedAt) {
      return new Date(uploadedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return uploaded || 'Unknown';
  };

  const folderCounts = useMemo(() => {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return {
      all: files.length,
      recent: files.filter((file) => {
        if (file.uploadedAt) {
          return Date.now() - new Date(file.uploadedAt).getTime() <= oneWeek;
        }
        const uploaded = file.uploaded?.toLowerCase();
        return uploaded && (uploaded.includes('day') || uploaded.includes('hour') || uploaded.includes('today'));
      }).length,
      shared: files.filter((file) => getSharedCount(file) > 0).length,
      documents: files.filter((file) => ['doc', 'docx', 'pdf', 'md', 'txt'].includes(file.type)).length,
      media: files.filter((file) => ['video', 'image', 'png', 'jpg', 'jpeg', 'gif', 'svg'].includes(file.type)).length,
      code: files.filter((file) => ['code', 'sql', 'js', 'jsx', 'ts', 'tsx', 'json'].includes(file.type)).length,
    };
  }, [files]);

  const folders = [
    { id: 'all', name: 'All Files', emoji: '📂', count: folderCounts.all },
    { id: 'recent', name: 'Recent', emoji: '⏱️', count: folderCounts.recent },
    { id: 'shared', name: 'Shared with Me', emoji: '👥', count: folderCounts.shared },
    { id: 'documents', name: 'Documents', emoji: '📄', count: folderCounts.documents },
    { id: 'media', name: 'Media', emoji: '🎬', count: folderCounts.media },
    { id: 'code', name: 'Code', emoji: '💻', count: folderCounts.code },
  ];

  const getFileIcon = (type, name) => {
    const ext = name?.split('.').pop()?.toLowerCase();
    const icons = {
      pdf: '📕',
      doc: '📄',
      docx: '📄',
      md: '📄',
      figma: '🎨',
      video: '🎬',
      mp4: '🎬',
      code: '💻',
      sql: '💻',
      js: '💻',
      jsx: '💻',
      ts: '💻',
      tsx: '💻',
      png: '🖼️',
      jpg: '🖼️',
      jpeg: '🖼️',
      image: '🖼️',
    };
    return icons[type] || icons[ext] || '📎';
  };

  const handleUpload = async (e) => {
    if (!canUpload) {
      setError('Upload restricted to Admin / Project Lead / Project QL.');
      e.target.value = '';
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;
    if (!selectedProjectId) {
      setError('Select a project before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', selectedProjectId);

    setUploading(true);
    try {
      const { data } = await filesAPI.uploadFile(formData);
      setFiles((prev) => [data, ...prev]);
      setError('');
    } catch (err) {
      console.error('File upload error:', err);
      setError(err.response?.data?.error || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!canUpload) {
      setError('You do not have permission to delete files.');
      return;
    }

    try {
      await filesAPI.deleteFile(fileId);
      setFiles((prev) => prev.filter((file) => (file._id || file.id) !== fileId));
      setError('');
    } catch (err) {
      console.error('File delete error:', err);
      setError(err.response?.data?.error || 'Delete failed.');
    }
  };

  const getFileUrl = (file) => {
    if (!file) return null;
    if (file.path) {
      const backendUrl = import.meta.env.VITE_API_URL || window.location.origin;
      return new URL(file.path.startsWith('/') ? file.path : `/${file.path}`, backendUrl).toString();
    }
    const backendUrl = import.meta.env.VITE_API_URL || window.location.origin;
    return new URL(`/uploads/${encodeURIComponent(file.name)}`, backendUrl).toString();
  };

  const handleViewFile = (file) => {
    const url = getFileUrl(file);
    if (!url) {
      setError('File URL unavailable.');
      return;
    }

    window.open(url, '_blank');
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedFolder === 'documents') {
      return ['doc', 'docx', 'pdf', 'md'].includes(file.type);
    }
    if (selectedFolder === 'media') {
      return ['video', 'image'].includes(file.type);
    }
    if (selectedFolder === 'code') {
      return ['code', 'sql', 'js', 'jsx', 'ts', 'tsx'].includes(file.type);
    }
    if (selectedFolder === 'shared') {
      return file.shared && file.shared > 0;
    }
    if (selectedFolder === 'recent') {
      return file.uploaded && (file.uploaded.toLowerCase().includes('day') || file.uploaded.toLowerCase().includes('hour') || file.uploaded.toLowerCase().includes('today'));
    }

    return true;
  });

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
              {canUpload ? (
                <label className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center cursor-pointer font-semibold">
                  + Upload File
                  <input type="file" onChange={handleUpload} className="hidden" multiple />
                </label>
              ) : (
                <div className="text-sm text-gray-500 px-4 py-3 rounded bg-gray-100">
                  Upload is restricted to Admin, Project Lead, or Project QL users.
                </div>
              )}
            </div>
          </div>

          {/* Files Area */}
          <div className="lg:col-span-3">
            {/* Header and Search */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {folders.find(f => f.id === selectedFolder)?.emoji} {folders.find(f => f.id === selectedFolder)?.name}
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <span>Project:</span>
                      <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {projects.map((project) => (
                          <option key={project._id || project.id} value={project._id || project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    {uploading && <span className="text-sm text-gray-500">Uploading file...</span>}
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm w-full xl:w-64"
                />
              </div>
            </div>

            {/* Files Grid */}
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded p-3">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFiles.length === 0 ? (
                <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                  {loading ? 'Loading files...' : 'No files available for this project yet.'}
                </div>
              ) : filteredFiles.map(file => (
                <div key={file._id || file.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getFileIcon(file.type)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 break-words">{file.name}</h3>
                          <p className="text-xs text-gray-500">{typeof file.size === 'number' ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : file.size}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">⋯</button>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Uploaded by:</span>
                        <span className="font-semibold text-gray-800">{file.uploadedByName || file.owner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uploaded:</span>
                        <span className="font-semibold text-gray-800">{getUploadedLabel(file.uploadedAt, file.uploaded)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shared with:</span>
                        <span className="font-semibold text-gray-800">{getSharedCount(file)} people</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewFile(file)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        View
                      </button>
                      {canUpload && (
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file._id || file.id)}
                          className="px-3 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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
