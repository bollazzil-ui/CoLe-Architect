import React from 'react';
import { UserProfile } from '../types';
import { Button } from './Button';

interface ProfileSidebarProps {
  profiles: UserProfile[];
  activeProfile?: UserProfile;
  selectedProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onEditProfile: (profile?: UserProfile) => void;
  onDeleteProfile: (id: string, e: React.MouseEvent) => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profiles,
  activeProfile,
  selectedProfileId,
  onSelectProfile,
  onEditProfile,
  onDeleteProfile
}) => {
  return (
    <aside className="lg:col-span-4 space-y-6">

      {/* Identity Section - Write Info & Upload Docs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-id-card text-blue-500"></i> Career Identity
          </h2>
          {activeProfile && (
            <button
              onClick={() => onEditProfile(activeProfile)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <i className="fas fa-pen-to-square mr-1"></i> Update
            </button>
          )}
        </div>

        {activeProfile ? (
          <div className="p-5 space-y-5">
            {/* Bio/Info Section */}
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Personal Information</h3>
              <p className="text-sm text-gray-700 line-clamp-3 italic leading-relaxed">
                "{activeProfile.bio}"
              </p>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {activeProfile.skills.map(s => (
                <span key={s} className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-md font-bold border border-blue-100 uppercase">
                  {s}
                </span>
              ))}
            </div>

            {/* Documents List */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Relevant Documents</h3>
                <button
                  onClick={() => onEditProfile(activeProfile)}
                  className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 hover:bg-gray-200 font-bold"
                >
                  + UPLOAD
                </button>
              </div>
              <div className="space-y-2">
                {activeProfile.documents.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No documents uploaded</p>
                ) : (
                  activeProfile.documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 bg-slate-50 group">
                      <i className="fas fa-file-lines text-slate-400"></i>
                      <span className="text-xs font-medium text-slate-700 truncate flex-1">{doc.name}</span>
                      <i className="fas fa-check text-green-500 text-[10px] opacity-0 group-hover:opacity-100"></i>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <p className="text-sm text-gray-500">Create your first career persona to start adding documents and info.</p>
            <Button
              variant="primary"
              className="w-full text-xs"
              onClick={() => onEditProfile(undefined)}
            >
              Initialize Identity
            </Button>
          </div>
        )}
      </div>

      {/* Already Created Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 text-sm">
            Already Created
          </h2>
          <button
            onClick={() => onEditProfile(undefined)}
            className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
          >
            <i className="fas fa-plus text-[10px]"></i>
          </button>
        </div>

        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {profiles.length === 0 ? (
            <p className="text-[10px] text-gray-400 text-center italic">List will appear here</p>
          ) : (
            profiles.map(p => (
              <div
                key={p.id}
                onClick={() => onSelectProfile(p.id)}
                className={`group p-2.5 rounded-lg border cursor-pointer transition-all ${
                  selectedProfileId === p.id
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-xs ${selectedProfileId === p.id ? 'text-blue-700' : 'text-gray-700'}`}>
                    {p.name}
                  </span>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => onDeleteProfile(p.id, e)} className="p-1 text-gray-400 hover:text-red-600"><i className="fas fa-trash text-[10px]"></i></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
