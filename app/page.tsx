"use client";

import React, { useState, useMemo } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Briefcase, Award, FileText, CheckCircle, Lock, User, MapPin, Search, AlertTriangle, Upload, X, Building } from 'lucide-react';

// --- MOCK DATA ---
const initialUserProfile = {
  name: "Alex Reyes",
  bio: "Passionate front-end developer looking for opportunities to build responsive, accessible web applications.",
  education: "BS Computer Science",
  certs: ["AWS Cloud Practitioner", "React Native Certification"],
  skills: ["React", "JavaScript", "Tailwind CSS", "Figma", "Git"],
  resumeUploaded: true,
};

const jobListings = [
  {
    id: 1,
    title: "Junior Frontend Engineer",
    company: "TechNova Solutions",
    location: "Makati City (Hybrid)",
    reqEducation: ["BS Computer Science", "BS Information Technology"],
    reqCerts: ["React Native Certification"],
    reqSkills: ["React", "JavaScript", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Senior Full Stack Developer",
    company: "Innovate Financial",
    location: "BGC, Taguig",
    reqEducation: ["BS Computer Science"],
    reqCerts: ["AWS Solutions Architect", "Certified Kubernetes Administrator"],
    reqSkills: ["React", "Node.js", "Python", "Docker", "AWS"],
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "UI/UX Developer",
    company: "Creative Studio PH",
    location: "Remote",
    reqEducation: ["BS Computer Science", "BA Design"],
    reqCerts: [],
    reqSkills: ["Figma", "React", "CSS", "UI/UX"],
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "React Developer",
    company: "TechNova Solutions",
    location: "Makati City",
    reqEducation: ["BS Computer Science"],
    reqCerts: [],
    reqSkills: ["React", "JavaScript", "API Integration"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"
  }
];

const mockApplicants = [
  { id: 101, name: "Maria Santos", education: "BS Computer Science", skills: ["React", "JavaScript", "Tailwind CSS", "Node.js"], score: 92 },
  { id: 102, name: "David Chen", education: "BS Information Technology", skills: ["React", "JavaScript"], score: 78 },
  { id: 103, name: "Sarah Lim", education: "BS Computer Science", skills: ["Figma", "HTML", "CSS"], score: 65 },
];

const calculateMatch = (user: typeof initialUserProfile, job: typeof jobListings[0]) => {
  let score = 0;
  const missingSkills: string[] = [];
  
  if (job.reqEducation.includes(user.education)) score += 30;
  
  const certMatch = job.reqCerts.filter(c => user.certs.includes(c)).length;
  if (job.reqCerts.length > 0) {
    score += (certMatch / job.reqCerts.length) * 30;
  } else {
    score += 30;
  }

  const skillMatch = job.reqSkills.filter(s => {
    const hasSkill = user.skills.includes(s);
    if (!hasSkill) missingSkills.push(s);
    return hasSkill;
  }).length;

  if (job.reqSkills.length > 0) {
    score += (skillMatch / job.reqSkills.length) * 40;
  } else {
    score += 40;
  }

  const finalScore = Math.round(score);
  
  let tier = 'red';
  if (finalScore >= 75) tier = 'green';
  else if (finalScore >= 60) tier = 'orange';

  return { score: finalScore, tier, missingSkills };
};

export default function HireMeMaybeApp() {
  const [currentView, setCurrentView] = useState<'landing' | 'seeker' | 'employer'>('landing');

  if (currentView === 'landing') return <LandingPage onSelect={setCurrentView} />;
  if (currentView === 'employer') return <EmployerView onBack={() => setCurrentView('landing')} />;
  return <JobSeekerView onBack={() => setCurrentView('landing')} />;
}

function LandingPage({ onSelect }: { onSelect: (v: 'seeker' | 'employer') => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
          KAIROS
        </h1>
        <p className="text-xl text-slate-500 mb-12 max-w-2xl">
          The competency-based hiring platform that eliminates application black holes and guarantees mutual fit.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
          <button 
            onClick={() => onSelect('seeker')}
            className="flex-1 bg-slate-800 text-white p-8 rounded-2xl shadow-lg hover:bg-slate-700 transition-all text-left flex flex-col justify-between h-48"
          >
            <User size={32} className="text-teal-500 mb-4" />
            <div>
              <h3 className="text-2xl font-bold">I am a Job Seeker</h3>
              <p className="text-sm opacity-80 mt-2">Find roles that match your exact skills and swipe to apply.</p>
            </div>
          </button>

          <button 
            onClick={() => onSelect('employer')}
            className="flex-1 bg-white text-slate-800 border border-gray-200 p-8 rounded-2xl shadow-lg hover:border-teal-500 transition-all text-left flex flex-col justify-between h-48"
          >
            <Building size={32} className="text-teal-500 mb-4" />
            <div>
              <h3 className="text-2xl font-bold">I am an Employer</h3>
              <p className="text-sm text-gray-500 mt-2">View pre-qualified candidates who meet your strict criteria.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function EmployerView({ onBack }: { onBack: () => void }) {
  const sortedApplicants = [...mockApplicants].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800">
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium mb-8">
          ← Back to Home
        </button>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Applicant Pipeline</h2>
            <p className="text-slate-500 mt-1">TechNova Solutions • Junior Frontend Engineer</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="font-medium text-sm text-gray-600">Threshold Active (75%+)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                <th className="p-4 font-semibold">Candidate Match</th>
                <th className="p-4 font-semibold">Education</th>
                <th className="p-4 font-semibold">Core Skills</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedApplicants.map(app => (
                <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{app.name}</p>
                        <p className={`text-xs font-bold ${app.score >= 75 ? 'text-green-600' : 'text-orange-500'}`}>
                          {app.score}% Match
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{app.education}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {app.skills.map(s => (
                        <span key={s} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <button className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function JobSeekerView({ onBack }: { onBack: () => void }) {
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [jobs, setJobs] = useState(jobListings);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [warningData, setWarningData] = useState<{show: boolean, missing: string[], job: any}>({ show: false, missing: [], job: null });

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);

  const removeJobFromDeck = (id: number) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const handleSwipeAttempt = (job: any, direction: 'left' | 'right') => {
    if (direction === 'left') {
      removeJobFromDeck(job.id);
      return;
    }
    const { tier, missingSkills } = calculateMatch(userProfile, job);
    if (tier === 'green') {
      removeJobFromDeck(job.id); 
    } else if (tier === 'orange') {
      setWarningData({ show: true, missing: missingSkills, job });
    }
  };

  const confirmOrangeApplication = () => {
    if (warningData.job) removeJobFromDeck(warningData.job.id);
    setWarningData({ show: false, missing: [], job: null });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-sm font-medium text-gray-500 hover:text-slate-800">← Exit</button>
          <h1 className="font-extrabold text-xl tracking-tight hidden sm:block">KAIROS</h1>
        </div>
        
        <div className="relative w-full max-w-md mx-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search companies or roles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        <button 
          onClick={() => setShowProfileModal(true)}
          className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
        >
          <User size={20} />
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="relative w-full max-w-sm h-[600px] flex items-center justify-center">
          {filteredJobs.length === 0 ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-500 mb-2">No roles found</h3>
              <p className="text-gray-500">Try adjusting your search query.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredJobs.map((job, index) => {
                const isTop = index === filteredJobs.length - 1;
                return isTop && <JobCard key={job.id} job={job} user={userProfile} onSwipeAttempt={(dir) => handleSwipeAttempt(job, dir)} />;
              })}
            </AnimatePresence>
          )}
        </div>
      </main>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-teal-500"
                  rows={4}
                  value={userProfile.bio}
                  onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                />
              </div>
              
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                <Upload size={24} className="text-teal-500 mb-2" />
                <p className="font-semibold text-sm">Upload New Resume</p>
                <p className="text-xs text-gray-500">PDF or DOCX (Max 5MB)</p>
              </div>
            </div>

            <button onClick={() => setShowProfileModal(false)} className="w-full mt-6 bg-slate-800 text-white py-3 rounded-xl font-bold">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {warningData.show && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl text-center relative border-t-8 border-orange-500">
            <AlertTriangle size={48} className="text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Partial Match</h2>
            <p className="text-gray-600 mb-4">
              Your profile is a fair fit, but you are missing some core requirements for this role:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {warningData.missing.map(skill => (
                <span key={skill} className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full border border-red-200">
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mb-6 font-medium">Are you sure you want to submit this application?</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setWarningData({ show: false, missing: [], job: null })}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={confirmOrangeApplication}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/30"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, user, onSwipeAttempt }: { job: any, user: any, onSwipeAttempt: (dir: 'left'|'right') => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const { score, tier } = calculateMatch(user, job);

  const getTierColors = () => {
    if (tier === 'green') return { text: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200', label: 'Perfect Match' };
    if (tier === 'orange') return { text: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-200', label: 'Fair Match' };
    return { text: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200', label: 'Locked' };
  };
  const colors = getTierColors();
  const canSwipeRight = tier === 'green' || tier === 'orange';

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -100) onSwipeAttempt('left'); 
    else if (info.offset.x > 100 && canSwipeRight) onSwipeAttempt('right'); 
  };

  return (
    <motion.div
      className="absolute w-full h-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: -300, right: canSwipeRight ? 300 : 0 }}
      dragElastic={canSwipeRight ? 0.6 : { left: 0.6, right: 0 }}
      onDragEnd={handleDragEnd}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${job.image})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold leading-tight">{job.title}</h2>
          <p className="flex items-center gap-1 text-sm text-gray-200 mt-1"><MapPin size={14} /> {job.location}</p>
        </div>
      </div>

      <div className={`p-4 border-b flex justify-between items-center ${colors.bg}`}>
        <div>
          <p className="text-xs font-bold tracking-wider text-gray-600 uppercase mb-1">Match Score</p>
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-extrabold ${colors.text}`}>{score}%</span>
            <span className={`flex items-center gap-1 text-sm font-bold ${colors.text} bg-white px-2 py-1 rounded-md shadow-sm border ${colors.border}`}>
              {tier === 'green' && <CheckCircle size={14} />}
              {tier === 'orange' && <AlertTriangle size={14} />}
              {tier === 'red' && <Lock size={14} />}
              {colors.label}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto text-slate-800">
        <h3 className="font-bold text-lg mb-4">{job.company}</h3>
        <div className="mb-4">
          <h4 className="text-sm font-bold text-gray-500 mb-2">Education / Certifications</h4>
          <ul className="space-y-1 text-sm">
            {job.reqEducation.map((edu: string) => (
              <li key={edu} className={`flex items-center gap-2 ${user.education === edu ? 'text-green-600' : 'text-gray-400'}`}>
                {user.education === edu ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />} {edu}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-500 mb-2">Core Competencies</h4>
          <div className="flex flex-wrap gap-2">
            {job.reqSkills.map((skill: string) => {
              const hasSkill = user.skills.includes(skill);
              return (
                <span key={skill} className={`px-3 py-1 text-xs rounded-full border font-medium ${
                  hasSkill ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'
                }`}>
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 text-center text-xs text-gray-500 font-bold tracking-wide border-t border-gray-100">
        {tier === 'green' && "SWIPE RIGHT TO APPLY  •  SWIPE LEFT TO PASS"}
        {tier === 'orange' && "SWIPE RIGHT TO APPLY (WARNING)  •  SWIPE LEFT TO PASS"}
        {tier === 'red' && "SWIPE LEFT TO PASS  •  RIGHT SWIPE LOCKED"}
      </div>
    </motion.div>
  );
}