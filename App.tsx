
import React, { useState, useEffect } from 'react';
import { UserProfile, JobDetails, CoverLetterResponse, ApplicationRecord, ApplicationStatus } from './types';
import { analyzeJobLink, generateCoverLetter } from './services/geminiService';
import { ProfileEditor } from './components/ProfileEditor';
import { Button } from './components/Button';
import { LandingPage } from './components/LandingPage';
import { ApplicationTracker } from './components/ApplicationTracker';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'applications'>('generate');
  
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | undefined>(undefined);
  
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [viewingApp, setViewingApp] = useState<ApplicationRecord | null>(null);
  
  const [jobLink, setJobLink] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CoverLetterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedProfiles = localStorage.getItem('cla_profiles');
    const savedApps = localStorage.getItem('cla_applications');
    const savedLogin = localStorage.getItem('cla_isLoggedIn');

    if (savedProfiles) setProfiles(JSON.parse(savedProfiles));
    if (savedApps) setApplications(JSON.parse(savedApps));
    if (savedLogin) setIsLoggedIn(JSON.parse(savedLogin));
    
    const parsedProfiles = savedProfiles ? JSON.parse(savedProfiles) : [];
    if (parsedProfiles.length > 0 && !selectedProfileId) setSelectedProfileId(parsedProfiles[0].id);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cla_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('cla_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('cla_isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const activeProfile = profiles.find(p => p.id === selectedProfileId);

  const handleSaveProfile = (profile: UserProfile) => {
    setProfiles(prev => {
      const exists = prev.find(p => p.id === profile.id);
      if (exists) return prev.map(p => p.id === profile.id ? profile : p);
      return [...prev, profile];
    });
    setSelectedProfileId(profile.id);
    setIsEditing(false);
    setEditingProfile(undefined);
  };

  const deleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this profile?')) {
      setProfiles(prev => prev.filter(p => p.id !== id));
      if (selectedProfileId === id) setSelectedProfileId(null);
    }
  };

  const handleAnalyzeJob = async () => {
    if (!jobLink) return;
    setIsAnalyzing(true);
    setError(null);
    setJobDetails(null);
    setResult(null);

    try {
      const details = await analyzeJobLink(jobLink);
      setJobDetails(details);
    } catch (err: any) {
      setError("We couldn't extract details from that link. Try a direct job posting URL.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!activeProfile || !jobDetails) return;
    setIsGenerating(true);
    setError(null);

    try {
      const coverLetter = await generateCoverLetter(jobDetails, activeProfile);
      setResult(coverLetter);
    } catch (err: any) {
      setError("Failed to generate cover letter. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToTracker = () => {
    if (!result || !jobDetails) return;
    const newApp: ApplicationRecord = {
      id: Math.random().toString(36).substr(2, 9),
      company: jobDetails.company,
      jobTitle: jobDetails.title,
      dateCreated: new Date().toISOString(),
      status: 'Applied',
      coverLetter: result.content,
      touchpoints: result.touchpoints,
      jobLink: jobLink
    };
    setApplications(prev => [newApp, ...prev]);
    alert("Application saved to your tracker!");
    setActiveTab('applications');
  };

  const updateAppStatus = (id: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteApp = (id: string) => {
    if (confirm('Delete this application record?')) {
      setApplications(prev => prev.filter(a => a.id !== id));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (!isLoggedIn) {
    return <LandingPage onGetStarted={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* App Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsLoggedIn(false)}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <i className="fas fa-file-signature text-sm"></i>
            </div>
            <h1 className="text-lg font-bold text-slate-900 hidden sm:block">
              Cover Letter Architect
            </h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => { setActiveTab('generate'); setViewingApp(null); }}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'generate' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <i className="fas fa-magic mr-2"></i>Generator
            </button>
            <button 
              onClick={() => { setActiveTab('applications'); setViewingApp(null); }}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'applications' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <i className="fas fa-list-check mr-2"></i>Tracking
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-xs" onClick={() => setIsLoggedIn(false)}>Log Out</Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 border-2 border-white shadow-sm ring-2 ring-blue-50"></div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        
        {activeTab === 'applications' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Application Status View</h2>
                <p className="text-sm text-gray-500">Track your progress across all job opportunities</p>
              </div>
              <div className="flex items-center gap-4 text-sm bg-white px-4 py-2 rounded-lg border border-gray-200">
                <span className="text-gray-500 font-medium"><strong>{applications.length}</strong> Total Records</span>
              </div>
            </div>

            {viewingApp ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-4 mb-2">
                  <Button variant="ghost" onClick={() => setViewingApp(null)} icon="fas fa-arrow-left">Back to Tracker</Button>
                  <h3 className="font-bold text-xl">{viewingApp.company} - {viewingApp.jobTitle}</h3>
                </div>
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg relative font-serif">
                   <div className="absolute top-4 right-4">
                     <Button variant="secondary" onClick={() => copyToClipboard(viewingApp.coverLetter)} icon="fas fa-copy">Copy Text</Button>
                   </div>
                   <div className="whitespace-pre-wrap text-lg leading-relaxed">{viewingApp.coverLetter}</div>
                </div>
              </div>
            ) : (
              <ApplicationTracker 
                applications={applications} 
                onUpdateStatus={updateAppStatus} 
                onDelete={deleteApp}
                onViewDetails={setViewingApp}
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar: Profile Management */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* Identity Section - Write Info & Upload Docs */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <i className="fas fa-id-card text-blue-500"></i> Career Identity
                  </h2>
                  {activeProfile && (
                    <button 
                      onClick={() => { setEditingProfile(activeProfile); setIsEditing(true); }}
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
                          onClick={() => { setEditingProfile(activeProfile); setIsEditing(true); }}
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
                      onClick={() => { setEditingProfile(undefined); setIsEditing(true); }}
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
                    onClick={() => { setEditingProfile(undefined); setIsEditing(true); }}
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
                        onClick={() => setSelectedProfileId(p.id)}
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
                            <button onClick={(e) => deleteProfile(p.id, e)} className="p-1 text-gray-400 hover:text-red-600"><i className="fas fa-trash text-[10px]"></i></button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>

            {/* Main Content: Generator */}
            <section className="lg:col-span-8 space-y-6">
              {isEditing ? (
                <ProfileEditor 
                  initialProfile={editingProfile}
                  onSave={handleSaveProfile}
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
                          <Button variant="primary" className="h-8 py-0 bg-green-600 hover:bg-green-700 border-none shadow-md shadow-green-100" onClick={handleSaveToTracker} icon="fas fa-save">Save & Track</Button>
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
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-[10px] font-bold text-gray-400 tracking-widest uppercase flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2024 Cover Letter Architect • Professional Identity Managed</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600 transition-colors">Safety</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Cloud Sync</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
