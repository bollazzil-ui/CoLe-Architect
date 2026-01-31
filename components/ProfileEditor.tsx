
import React, { useState } from 'react';
import { UserProfile, ProfileDocument } from '../types';
import { Button } from './Button';

interface ProfileEditorProps {
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
  initialProfile?: UserProfile;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onSave, onCancel, initialProfile }) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [bio, setBio] = useState(initialProfile?.bio || '');
  const [skills, setSkills] = useState(initialProfile?.skills.join(', ') || '');
  const [documents, setDocuments] = useState<ProfileDocument[]>(initialProfile?.documents || []);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newDocs: ProfileDocument[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const text = await readFileAsText(file);
      newDocs.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        content: text,
        uploadDate: new Date().toISOString()
      });
    }

    setDocuments(prev => [...prev, ...newDocs]);
    setIsUploading(false);
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    });
  };

  const handleSave = () => {
    if (!name.trim()) return alert('Profile name is required');
    onSave({
      id: initialProfile?.id || Math.random().toString(36).substr(2, 9),
      name,
      bio,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      documents
    });
  };

  const removeDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg space-y-6">
      <h2 className="text-xl font-bold text-gray-800">
        {initialProfile ? 'Edit Profile' : 'Create New Profile'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Name (e.g. Senior Frontend Engineer)</label>
          <input 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Work persona name..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Bio / Pitch</label>
          <textarea 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32"
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Brief summary of your professional background..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills (comma separated)</label>
          <input 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={skills}
            onChange={e => setSkills(e.target.value)}
            placeholder="React, TypeScript, UI Design, Project Management..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Documents (Resume/CV - .txt supported)</label>
          <div className="mt-1 flex flex-col gap-2">
            <input 
              type="file" 
              multiple 
              accept=".txt,.md"
              onChange={handleFileUpload}
              className="hidden" 
              id="file-upload" 
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <i className="fas fa-upload mr-2"></i> {isUploading ? 'Reading files...' : 'Click to upload .txt files'}
            </label>
            
            <div className="flex flex-wrap gap-2">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs border border-blue-100">
                  <span className="truncate max-w-[120px]">{doc.name}</span>
                  <button onClick={() => removeDoc(doc.id)} className="ml-2 hover:text-red-600">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Profile</Button>
      </div>
    </div>
  );
};
