import React from 'react';
import { UserProfile, JobDetails, CoverLetterResponse } from '../types';
import { Button } from '../components/Button';
import { ProfileEditor } from '../components/ProfileEditor';
import { ProfileSidebar } from '../components/ProfileSidebar';

interface GeneratorProps {
  // Sidebar props
  profiles: UserProfile[];
  activeProfile?: UserProfile;
  selectedProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onDeleteProfile: (id: string, e: React.MouseEvent) => void;
  onEditProfile: (profile?: UserProfile) => void;

  // Editor props
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editingProfile: UserProfile | undefined;
  onSaveProfile: (profile: UserProfile) => void;

  // Generator Logic props
  jobLink: string;
  setJobLink: (link: string) => void;
  handleAnalyzeJob: () => void;
  isAnalyzing: boolean;
  error: string | null;
  jobDetails: JobDetails | null;
  isGenerating: boolean;
  handleGenerate: () => void;
  result: CoverLetterResponse | null;
  onSaveToTracker: () => void;
}

export const Generator: React.FC<GeneratorProps> = ({
  profiles,
  activeProfile,
  selectedProfileId,
  onSelectProfile,
  onDeleteProfile,
  onEditProfile,
  isEditing,
  setIsEditing,
  editingProfile,
  onSaveProfile,
  jobLink,
  setJobLink,
  handleAnalyzeJob,
  isAnalyzing,
  error,
  jobDetails,
  isGenerating,
  handleGenerate,
  result,
  onSaveToTracker
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar: Profile Management */}
      <ProfileSidebar
        profiles={profiles}
        activeProfile={activeProfile}
        selectedProfileId={selectedProfileId}
        onSelectProfile={onSelectProfile}
        onEditProfile={onEditProfile}
        onDeleteProfile={onDeleteProfile}
      />

      {/* Main Content: Generator */}
      <section className="lg:col-span-8 space-y-6">
        {isEditing ? (
          <ProfileEditor
            initialProfile={editingProfile}
            onSave={onSaveProfile}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-bolt text-amber-500"></i> Generator
              </h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
                  placeholder="Paste job application link..."
                  value={jobLink}
                  onChange={e => setJobLink(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalyzeJob()}
                />
                <Button variant="primary" className="px-6" isLoading={isAnalyzing} onClick={handleAnalyzeJob} disabled={!jobLink}>
                  Analyze Link
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2 font-medium"><i className="fas fa-exclamation-circle mr-1"></i> {error}</p>}
            </div>

            {jobDetails && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{jobDetails.title}</h3>
                    <p className="text-gray-500 font-medium">{jobDetails.company}</p>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-200">
                    Job Analyzed
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">
                       <i className="fas fa-user"></i>
                    </div>
                    <p className="text-sm text-gray-600">Using: <strong>{activeProfile?.name || 'No Persona Selected'}</strong></p>
                  </div>
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-100 font-bold"
                    isLoading={isGenerating}
                    disabled={!activeProfile}
                    onClick={handleGenerate}
                    icon="fas fa-wand-sparkles"
                  >
                    Generate Impeccable Letter
                  </Button>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg relative font-serif">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button variant="ghost" className="h-8 py-0 px-3 border border-gray-100" onClick={() => copyToClipboard(result.content)} icon="fas fa-copy">Copy</Button>
                    <Button variant="primary" className="h-8 py-0 bg-green-600 hover:bg-green-700 border-none shadow-md shadow-green-100" onClick={onSaveToTracker} icon="fas fa-save">Save & Track</Button>
                  </div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-8 flex items-center gap-2 tracking-widest">
                    <i className="fas fa-file-signature text-blue-500"></i> Cover Letter Architect Output
                  </h3>
                  <div className="whitespace-pre-wrap text-slate-900 leading-relaxed text-lg selection:bg-blue-100">
                    {result.content}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-blue-700 text-sm mb-4 border-b pb-2">Touchpoint Analysis</h4>
                    <ul className="space-y-3">
                      {result.touchpoints.map((tp, i) => (
                        <li key={i} className="text-xs text-gray-700 flex gap-3 leading-relaxed">
                          <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0 font-bold">{i+1}</span>
                          <span>{tp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-amber-700 text-sm mb-4 border-b pb-2">AI Expert Suggestions</h4>
                    <ul className="space-y-3">
                      {result.suggestions.map((sg, i) => (
                        <li key={i} className="text-xs text-gray-700 flex gap-3 leading-relaxed">
                          <i className="fas fa-lightbulb mt-0.5 text-amber-500 flex-shrink-0"></i>
                          <span>{sg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {!jobDetails && !isEditing && (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-slate-100 border border-slate-50 text-blue-600 rotate-3 transition-transform hover:rotate-0">
                  <i className="fas fa-link"></i>
                </div>
                <div className="max-w-xs">
                  <h3 className="text-slate-900 font-extrabold text-lg">Analyze a Link</h3>
                  <p className="text-sm text-slate-500 mt-2">Paste a job posting URL above and we'll cross-reference it with your career identity.</p>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
