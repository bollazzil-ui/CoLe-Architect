import React, { useState, useEffect } from 'react';
import { UserProfile, JobDetails, CoverLetterResponse, ApplicationRecord, ApplicationStatus } from './types';
import { analyzeJobLink, generateCoverLetter } from './services/geminiService';
import { Button } from './components/Button';
import { LandingPage } from './views/LandingPage';
import { Generator } from './views/Generator';
import { Tracker } from './views/Tracker';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'applications'>('generate');
  
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | undefined>(undefined);
  
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  
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

  const handleEditProfile = (profile?: UserProfile) => {
    setEditingProfile(profile);
    setIsEditing(true);
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
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'generate' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <i className="fas fa-magic mr-2"></i>Generator
            </button>
            <button 
              onClick={() => setActiveTab('applications')}
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
          <Tracker
            applications={applications}
            onUpdateStatus={updateAppStatus}
            onDelete={deleteApp}
          />
        ) : (
          <Generator
            profiles={profiles}
            activeProfile={activeProfile}
            selectedProfileId={selectedProfileId}
            onSelectProfile={setSelectedProfileId}
            onDeleteProfile={deleteProfile}
            onEditProfile={handleEditProfile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            editingProfile={editingProfile}
            onSaveProfile={handleSaveProfile}
            jobLink={jobLink}
            setJobLink={setJobLink}
            handleAnalyzeJob={handleAnalyzeJob}
            isAnalyzing={isAnalyzing}
            error={error}
            jobDetails={jobDetails}
            isGenerating={isGenerating}
            handleGenerate={handleGenerate}
            result={result}
            onSaveToTracker={handleSaveToTracker}
          />
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
