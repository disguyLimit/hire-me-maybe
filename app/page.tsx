"use client";

import React, { useState, useMemo, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { User, MapPin, Search, UploadCloud, FileText, X, EyeOff, Globe, Code, Compass, Handshake, Settings, Building2 } from 'lucide-react';

// --- MOCK DATA ---
const initialUserProfile = {
  name: "Alex Reyes",
  bio: "Passionate front-end developer looking for opportunities to build responsive, accessible web applications.",
  education: "BS Computer Science",
  certs: ["AWS Cloud Practitioner", "React Native Certification"],
  skills: ["React", "JavaScript", "Tailwind CSS", "Figma", "Git"],
  resumeUploaded: false,
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
  }
];

const mockApplicants = [
  { id: 101, name: "Maria Santos", education: "BS Computer Science", skills: ["React", "JavaScript", "Tailwind CSS", "Node.js"], score: 92 },
  { id: 102, name: "David Chen", education: "BS Information Technology", skills: ["React", "JavaScript"], score: 78 },
];

const calculateMatch = (user: typeof initialUserProfile, job: typeof jobListings[0]) => {
  let score = 0;
  const missingSkills: string[] = [];
  
  if (job.reqEducation.includes(user.education)) score += 30;
  const certMatch = job.reqCerts.filter(c => user.certs.includes(c)).length;
  if (job.reqCerts.length > 0) score += (certMatch / job.reqCerts.length) * 30;
  else score += 30;

  const skillMatch = job.reqSkills.filter(s => {
    const hasSkill = user.skills.includes(s);
    if (!hasSkill) missingSkills.push(s);
    return hasSkill;
  }).length;

  if (job.reqSkills.length > 0) score += (skillMatch / job.reqSkills.length) * 40;
  else score += 40;

  const finalScore = Math.round(score);
  let tier = 'red';
  if (finalScore >= 75) tier = 'green';
  else if (finalScore >= 60) tier = 'orange';

  return { score: finalScore, tier, missingSkills };
};

// --- MAIN APPLICATION SHELL ---
export default function KairosApp() {
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'seeker' | 'employer'>('landing');
  const [targetRole, setTargetRole] = useState<'seeker' | 'employer'>('seeker');

  const handleProceedToAuth = (role: 'seeker' | 'employer') => {
    setTargetRole(role);
    setCurrentView('auth');
  };

  const handleAuthSuccess = () => {
    setCurrentView(targetRole); 
  };

  if (currentView === 'landing') return <LandingPage onProceed={handleProceedToAuth} />;
  if (currentView === 'auth') return <AuthView targetRole={targetRole} onAuthSuccess={handleAuthSuccess} onBack={() => setCurrentView('landing')} />;
  if (currentView === 'employer') return <EmployerView onBack={() => setCurrentView('landing')} />;
  return <JobSeekerView onBack={() => setCurrentView('landing')} />;
}

// --- SHARED LOGO COMPONENT ---
const LOGO_SIZES = {
  sm: 'h-10',
  md: 'h-28 sm:h-36',
  lg: 'h-40 sm:h-56',
} as const;

function KairosLogo({ size = 'lg' }: { size?: keyof typeof LOGO_SIZES; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.jpg"
      alt="KAIROS"
      draggable={false}
      className={`${LOGO_SIZES[size]} w-auto object-contain mix-blend-multiply select-none`}
    />
  );
}

// --- WHITE BACKGROUND COMPONENT ---
function WhiteBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-white via-slate-50 to-purple-50/40 pointer-events-none z-0">
      {/* Subtle background abstract shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-100/50 blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-50/60 blur-[120px]"></div>
    </div>
  );
}

// --- WELCOME LANDING PAGE (Role Selection) ---
function LandingPage({ onProceed }: { onProceed: (role: 'seeker' | 'employer') => void }) {
  const [selectedRole, setSelectedRole] = useState<'seeker' | 'employer' | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative text-slate-800">
      <WhiteBackground />
      
      <div className="z-10 flex flex-col items-center w-full max-w-4xl pt-6">
        
        {/* LOGO */}
        <div className="flex justify-center items-center mb-4">
          <KairosLogo size="lg" priority />
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome to KAIROS.</h1>
        <p className="text-slate-500 text-lg mb-10 font-medium">Please select your account type:</p>

        {/* Selection Cards */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center mb-8">
          
          {/* Job Seeker Card */}
          <div 
            className={`flex-1 relative p-8 rounded-3xl backdrop-blur-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center shadow-xl ${
              selectedRole === 'seeker' 
                ? 'bg-white border-[#353457] ring-4 ring-purple-100 scale-105' 
                : 'bg-white/80 border-slate-200 hover:border-slate-300'
            }`} 
            onClick={() => setSelectedRole('seeker')}
          >
            <div className="relative mb-4 text-[#353457]">
              <Compass size={36} className="text-purple-400 absolute -top-3 -left-5 opacity-50" />
              <Handshake size={52} className="relative z-10" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-wider mb-6">I'M A JOB SEEKER</h3>
            
            <div className="h-10 w-full flex items-center justify-center">
              {selectedRole === 'seeker' ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedRole(null); }} 
                  className="w-36 py-2 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
                >
                  CLEAR
                </button>
              ) : (
                <div className="h-9"></div>
              )}
            </div>
          </div>

          {/* Employer Card */}
          <div 
            className={`flex-1 relative p-8 rounded-3xl backdrop-blur-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center shadow-xl ${
              selectedRole === 'employer' 
                ? 'bg-white border-[#353457] ring-4 ring-purple-100 scale-105' 
                : 'bg-white/80 border-slate-200 hover:border-slate-300'
            }`} 
            onClick={() => setSelectedRole('employer')}
          >
            <div className="relative mb-4 text-[#353457]">
              <Building2 size={52} className="relative z-10" />
              <Settings size={24} className="text-purple-400 absolute -bottom-1 -right-3 opacity-70" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-wider mb-6">I'M AN EMPLOYER</h3>
            
            <div className="h-10 w-full flex items-center justify-center">
              {selectedRole === 'employer' ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedRole(null); }} 
                  className="w-36 py-2 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
                >
                  CLEAR
                </button>
              ) : (
                <div className="h-9"></div>
              )}
            </div>
          </div>

        </div>

        {/* Proceed Button */}
        <button
          disabled={!selectedRole}
          onClick={() => selectedRole && onProceed(selectedRole)}
          className={`px-12 py-4 rounded-full font-bold shadow-lg transition-all text-sm tracking-wide ${
            selectedRole 
              ? 'bg-[#03012d] text-white hover:bg-[#353457] shadow-xl' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Proceed to Access
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 flex gap-8 text-sm text-slate-400 z-10 font-medium">
        <button className="hover:text-slate-700 transition-colors">Contact Us</button>
        <button className="hover:text-slate-700 transition-colors">FAQ</button>
      </div>
    </div>
  );
}

// --- AUTHENTICATION VIEW ---
function AuthView({ targetRole, onAuthSuccess, onBack }: { targetRole: 'seeker' | 'employer', onAuthSuccess: () => void, onBack: () => void }) {
  const [isLogin, setIsLogin] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSeeker = targetRole === 'seeker';
  const MAX_RESUME_MB = 5;
  const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];

  const handleResumeFile = (file: File | undefined) => {
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setResumeFile(null);
      setResumeError('Please upload a PDF, DOC, or DOCX file.');
      return;
    }
    if (file.size > MAX_RESUME_MB * 1024 * 1024) {
      setResumeFile(null);
      setResumeError(`File is too large. The limit is ${MAX_RESUME_MB} MB.`);
      return;
    }
    setResumeError('');
    setResumeFile(file);
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumeError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) =>
    bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const canCreateAccount = !isSeeker || resumeFile !== null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative text-slate-800">
      <WhiteBackground />

      <button onClick={onBack} className="absolute top-6 left-6 text-[#686781] hover:text-[#03012d] font-medium text-sm z-10 transition-colors flex items-center gap-2">
        ← Back to Role Selection
      </button>

      <div className="w-full max-w-md z-10 pt-4">
        
        {/* LOGO */}
        <div className="flex justify-center items-center mb-6">
          <KairosLogo size="lg" priority />
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-[#cdccd5]/60">
          
          <div className="mb-6 text-center">
             <span className="inline-block px-4 py-1.5 bg-[#353457]/10 text-[#353457] font-bold text-xs rounded-full uppercase tracking-widest mb-2">
               {targetRole === 'seeker' ? 'Job Seeker Portal' : 'Employer Portal'}
             </span>
          </div>

          <div className="flex bg-[#cdccd5]/20 rounded-full p-1 mb-6 shadow-inner relative z-10">
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ${!isLogin ? 'bg-[#353457] text-white shadow-md' : 'text-[#686781] hover:text-[#353457]'}`}
            >
              SIGN UP
            </button>
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ${isLogin ? 'bg-[#353457] text-white shadow-md' : 'text-[#686781] hover:text-[#353457]'}`}
            >
              LOG IN
            </button>
          </div>

          <div className="relative min-h-[260px]">
            <AnimatePresence mode="wait">
              {!isLogin ? (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full justify-between"
                >
                  <div>
                    <p className="text-center text-sm text-[#686781] font-medium mb-4">Step 1 of 3: Professional Info</p>
                    <div className="space-y-3">
                      <input type="text" placeholder="Legal Full Name" className="w-full px-4 py-3 bg-gray-50 border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />
                      <input type="email" placeholder="Work Email Address" className="w-full px-4 py-3 bg-gray-50 border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />
                      <div className="relative">
                        <input type="password" placeholder="Preferred Password" className="w-full px-4 py-3 bg-gray-50 border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />
                        <EyeOff className="absolute right-3 top-3.5 text-[#9a99ab]" size={16} />
                      </div>
                      <input type="url" placeholder="LinkedIn Profile URL (Optional)" className="w-full px-4 py-3 bg-gray-50 border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />

                      {/* RESUME UPLOAD (Job Seekers only) */}
                      {isSeeker && (
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleResumeFile(e.target.files?.[0])}
                          />

                          {resumeFile ? (
                            <div className="flex items-center gap-3 p-3 rounded-xl border border-[#353457] bg-[#353457]/5">
                              <div className="w-10 h-10 rounded-lg bg-[#353457]/10 flex items-center justify-center text-[#353457] shrink-0">
                                <FileText size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[#03012d] truncate">{resumeFile.name}</p>
                                <p className="text-xs text-[#686781]">{formatFileSize(resumeFile.size)} • Ready to upload</p>
                              </div>
                              <button
                                type="button"
                                onClick={removeResume}
                                aria-label="Remove resume"
                                className="text-[#9a99ab] hover:text-[#03012d] transition-colors"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ) : (
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => fileInputRef.current?.click()}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                              onDragLeave={() => setIsDragging(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                handleResumeFile(e.dataTransfer.files?.[0]);
                              }}
                              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center ${
                                isDragging ? 'border-[#353457] bg-[#353457]/5' : 'border-[#cdccd5] hover:bg-gray-50'
                              }`}
                            >
                              <UploadCloud size={24} className="text-[#353457] mb-2" />
                              <p className="text-xs font-bold text-[#686781] mb-1">UPLOAD YOUR RESUME (REQUIRED)</p>
                              <p className="text-xs text-[#9a99ab]">Drag and drop, or click to browse. PDF, DOC, or DOCX, up to {MAX_RESUME_MB} MB.</p>
                            </div>
                          )}

                          {resumeError && <p className="text-xs text-red-600 font-medium mt-2">{resumeError}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={onAuthSuccess}
                      disabled={!canCreateAccount}
                      className={`w-full font-bold py-3 rounded-full transition-colors shadow-lg ${
                        canCreateAccount
                          ? 'bg-[#03012d] text-white hover:bg-[#353457]'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      CREATE ACCOUNT
                    </button>
                    {isSeeker && !resumeFile && (
                      <p className="text-center text-xs text-[#9a99ab] mt-2">Upload your resume to create your account.</p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full justify-between"
                >
                  <div className="space-y-4 pt-2">
                    <input type="text" placeholder="Username or Email" className="w-full px-4 py-3 bg-gray-50 border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />
                    <div className="relative">
                      <input type="password" placeholder="Password" className="w-full px-4 py-3 bg-gray-50 border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />
                      <EyeOff className="absolute right-3 top-3.5 text-[#9a99ab]" size={16} />
                    </div>
                    <div className="text-right">
                      <button className="text-xs text-[#686781] hover:text-[#03012d] font-semibold">Forgot Password?</button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button onClick={onAuthSuccess} className="w-full bg-[#03012d] text-white font-bold py-3 rounded-full hover:bg-[#353457] transition-colors shadow-lg mb-6">
                      LOG IN
                    </button>
                    
                    <div className="relative flex items-center justify-center mb-6">
                      <div className="border-t border-[#cdccd5] w-full absolute"></div>
                      <span className="bg-white px-3 text-xs text-[#9a99ab] relative z-10 font-bold tracking-widest">OR</span>
                    </div>

                    <div className="flex justify-center gap-4 mb-4">
                      <button onClick={onAuthSuccess} className="w-12 h-12 rounded-full border border-[#cdccd5] flex items-center justify-center text-[#686781] hover:bg-gray-50 hover:border-[#9a99ab] transition-all">
                        <span className="font-extrabold text-xl font-serif">G</span>
                      </button>
                      <button onClick={onAuthSuccess} className="w-12 h-12 rounded-full border border-[#cdccd5] flex items-center justify-center text-[#0077b5] hover:bg-gray-50 hover:border-[#9a99ab] transition-all">
                        <Globe size={20} />
                      </button>
                      <button onClick={onAuthSuccess} className="w-12 h-12 rounded-full border border-[#cdccd5] flex items-center justify-center text-[#03012d] hover:bg-gray-50 hover:border-[#9a99ab] transition-all">
                        <Code size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- EMPLOYER VIEW ---
function EmployerView({ onBack }: { onBack: () => void }) {
  const sortedApplicants = [...mockApplicants].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8 text-[#03012d]">
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="text-[#686781] hover:text-[#03012d] font-medium mb-8">← Log Out</button>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Applicant Pipeline</h2>
            <p className="text-[#686781] mt-1">TechNova Solutions • Junior Frontend Engineer</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-[#cdccd5] flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="font-medium text-sm text-[#353457]">Threshold Active (75%+)</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#cdccd5] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#cdccd5]/20 border-b border-[#cdccd5] text-sm text-[#686781]">
                <th className="p-4 font-semibold">Candidate Match</th>
                <th className="p-4 font-semibold">Education</th>
                <th className="p-4 font-semibold">Core Skills</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedApplicants.map(app => (
                <tr key={app.id} className="border-b border-[#cdccd5]/50 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#353457]/10 flex items-center justify-center text-[#353457] font-bold">{app.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-[#03012d]">{app.name}</p>
                        <p className={`text-xs font-bold ${app.score >= 75 ? 'text-green-600' : 'text-orange-500'}`}>{app.score}% Match</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[#686781]">{app.education}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {app.skills.map(s => <span key={s} className="text-xs px-2 py-1 bg-[#cdccd5]/30 text-[#353457] rounded">{s}</span>)}
                    </div>
                  </td>
                  <td className="p-4">
                    <button className="px-4 py-2 bg-[#03012d] text-white text-sm font-medium rounded-lg hover:bg-[#353457]">View Profile</button>
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

// --- JOB SEEKER VIEW ---
function JobSeekerView({ onBack }: { onBack: () => void }) {
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [jobs, setJobs] = useState(jobListings);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [warningData, setWarningData] = useState<{show: boolean, missing: string[], job: any}>({ show: false, missing: [], job: null });

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => job.company.toLowerCase().includes(searchQuery.toLowerCase()) || job.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [jobs, searchQuery]);

  const removeJobFromDeck = (id: number) => setJobs(prev => prev.filter(j => j.id !== id));

  const handleSwipeAttempt = (job: any, direction: 'left' | 'right') => {
    if (direction === 'left') return removeJobFromDeck(job.id);
    const { tier, missingSkills } = calculateMatch(userProfile, job);
    if (tier === 'green') removeJobFromDeck(job.id); 
    else if (tier === 'orange') setWarningData({ show: true, missing: missingSkills, job });
  };

  return (
    <div className="min-h-screen bg-[#cdccd5]/20 flex flex-col text-[#03012d]">
      <header className="bg-white border-b border-[#cdccd5] p-4 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-sm font-medium text-[#686781] hover:text-[#03012d]">← Log Out</button>
          <h1 className="font-extrabold text-xl tracking-tight hidden sm:block text-[#03012d]">KAIROS</h1>
        </div>
        <div className="relative w-full max-w-md mx-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9a99ab]" size={18} />
          <input type="text" placeholder="Search companies or roles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#f8f9fa] border border-[#cdccd5] rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#353457]" />
        </div>
        <button onClick={() => setShowProfileModal(true)} className="w-10 h-10 bg-[#03012d] rounded-full flex items-center justify-center text-white hover:bg-[#353457] transition-colors">
          <User size={20} />
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="relative w-full max-w-sm h-[600px] flex items-center justify-center">
          {filteredJobs.length === 0 ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#686781] mb-2">No roles found</h3>
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

      {/* PROFILE MODAL WITH RESUME UPLOAD */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-[#03012d]/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 text-[#9a99ab] hover:text-[#03012d]"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-6 text-[#03012d]">Edit Profile & Resume</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#353457] mb-1">Bio</label>
                <textarea 
                  className="w-full border border-[#cdccd5] rounded-lg p-3 text-sm focus:outline-none focus:border-[#353457]"
                  rows={3}
                  value={userProfile.bio}
                  onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                />
              </div>

              <div className="border-2 border-dashed border-[#cdccd5] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <UploadCloud size={24} className="text-[#353457] mb-2" />
                <p className="text-xs font-bold text-[#686781] mb-1">UPLOAD RESUME (PDF, DOCX)</p>
                <span className="bg-[#03012d] text-white text-xs px-4 py-1.5 rounded-full font-semibold">Browse Files</span>
              </div>
            </div>

            <button onClick={() => setShowProfileModal(false)} className="w-full mt-6 bg-[#03012d] text-white py-3 rounded-xl font-bold hover:bg-[#353457] transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {warningData.show && (
        <div className="fixed inset-0 bg-[#03012d]/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl text-center relative border-t-8 border-orange-500">
            <h2 className="text-2xl font-bold mb-2 text-[#03012d]">Partial Match</h2>
            <div className="flex gap-4 mt-6">
              <button onClick={() => setWarningData({ show: false, missing: [], job: null })} className="flex-1 py-3 bg-gray-100 text-[#353457] rounded-xl font-bold">Cancel</button>
              <button onClick={() => { removeJobFromDeck(warningData.job.id); setWarningData({ show: false, missing: [], job: null }); }} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold">Submit Anyway</button>
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
  const canSwipeRight = tier === 'green' || tier === 'orange';

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -100) onSwipeAttempt('left'); 
    else if (info.offset.x > 100 && canSwipeRight) onSwipeAttempt('right'); 
  };

  return (
    <motion.div
      className="absolute w-full h-full bg-white rounded-2xl shadow-xl border border-[#cdccd5] overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: -300, right: canSwipeRight ? 300 : 0 }}
      dragElastic={canSwipeRight ? 0.6 : { left: 0.6, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      <div className="h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${job.image})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#03012d]/90 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold leading-tight">{job.title}</h2>
          <p className="flex items-center gap-1 text-sm text-[#cdccd5] mt-1"><MapPin size={14} /> {job.location}</p>
        </div>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto text-[#03012d]">
        <h3 className="font-bold text-lg mb-4">{job.company}</h3>
        <p className="text-3xl font-extrabold">{score}% Match</p>
      </div>
    </motion.div>
  );
}
