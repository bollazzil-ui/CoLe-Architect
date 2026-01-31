import React, { useState } from 'react';
import { ApplicationRecord, ApplicationStatus } from '../types';
import { ApplicationTable } from '../components/ApplicationTable';
import { Button } from '../components/Button';

interface TrackerProps {
  applications: ApplicationRecord[];
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}

export const Tracker: React.FC<TrackerProps> = ({
  applications,
  onUpdateStatus,
  onDelete
}) => {
  const [viewingApp, setViewingApp] = useState<ApplicationRecord | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
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
        <ApplicationTable
          applications={applications}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          onViewDetails={setViewingApp}
        />
      )}
    </div>
  );
};
