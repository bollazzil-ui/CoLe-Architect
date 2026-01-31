
import React from 'react';
import { Button } from './Button';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
              Your Next Job Starts with an <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Impeccable Letter</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10">
              Stop sending generic cover letters. Our AI analyzes the specific job link and matches it perfectly with your professional DNA in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={onGetStarted} className="px-8 py-4 text-lg shadow-xl shadow-blue-200">
                Architect My First Letter
              </Button>
              <a href="#features" className="text-slate-600 font-semibold hover:text-blue-600 transition-colors">
                See how it works →
              </a>
            </div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Architects Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="fas fa-link"
              title="Deep Link Analysis"
              description="Simply paste a URL. Our AI extracts requirements, company culture, and hidden keywords that human readers miss."
            />
            <FeatureCard 
              icon="fas fa-dna"
              title="Profile Sync"
              description="Upload your CV and bio once. We identify the exact 'Touchpoints' where your experience meets their needs."
            />
            <FeatureCard 
              icon="fas fa-magic"
              title="Impeccable Tone"
              description="Whether it's a creative startup or a corporate giant, we match the language perfectly to ensure cultural fit."
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
          <span className="text-2xl font-bold">LinkedIn</span>
          <span className="text-2xl font-bold">Indeed</span>
          <span className="text-2xl font-bold">Glassdoor</span>
          <span className="text-2xl font-bold">Otta</span>
          <span className="text-2xl font-bold">Greenhouse</span>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl mb-6">
      <i className={icon}></i>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);
