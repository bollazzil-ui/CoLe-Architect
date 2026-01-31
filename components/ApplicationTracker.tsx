
import React from 'react';
import { ApplicationRecord, ApplicationStatus } from '../types';
import { Button } from './Button';

interface ApplicationTrackerProps {
  applications: ApplicationRecord[];
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
  onViewDetails: (app: ApplicationRecord) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ 
  applications, 
  onUpdateStatus, 
  onDelete,
  onViewDetails
}) => {
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-700';
      case 'Interviewing': return 'bg-purple-100 text-purple-700';
      case 'Offer': return 'bg-green-100 text-green-700 font-bold';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-folder-open text-gray-300 text-2xl"></i>
        </div>
        <h3 className="text-gray-900 font-semibold">No applications tracked yet</h3>
        <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
          Generated cover letters will appear here once you save them to your tracker.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company & Role</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">{app.company}</div>
                <div className="text-xs text-gray-500">{app.jobTitle}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select 
                  value={app.status}
                  onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                  className={`text-xs px-2.5 py-1 rounded-full border-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${getStatusColor(app.status)}`}
                >
                  <option value="Draft">Draft</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                {new Date(app.dateCreated).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onViewDetails(app)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="View Letter"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button 
                    onClick={() => onDelete(app.id)}
                    className="p-1 text-red-400 hover:text-red-600 rounded"
                    title="Delete"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
