"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Info, Bookmark, Sparkles, Lock, Ban, Trash2, Cookie, Monitor, Mail, Smartphone, Moon, Clock, Shield, SlidersHorizontal, CreditCard, Link2, Camera, Pencil, BadgeCheck, Eye, Download, Plus, ChevronDown, Star, Send, Home, Users, MessageCircle, Briefcase, CalendarDays, Bell, Heart, ChevronLeft, ChevronRight, Crown, Lightbulb, User, MapPin, Search, UploadCloud, FileText, X, EyeOff, Globe, Code, Compass, Handshake, Settings, Building2 } from 'lucide-react';

// --- MOCK DATA ---
const initialUserProfile = {
  name: "Juan Dela Cruz",
  bio: "Business graduate with a strong interest in data, marketing and customer experience. Looking for an entry-level role where I can grow.",
  education: "BS Business Administration",
  certs: ["Google Data Analytics"],
  skills: ["Data Analysis", "SQL", "Communication", "Excel", "Marketing", "Reporting"],
  resumeUploaded: false,
  resumeName: "",
};

const jobListings = [
  { id: 1, title: "Business Analyst", company: "Accenture", location: "Taguig, Metro Manila", jobType: "Full-time", workSetup: "Hybrid", level: "Mid", reqEducation: ["BS Business Administration", "BS Information Technology"], reqCerts: ["Google Data Analytics"], reqSkills: ["Data Analysis", "SQL", "Communication", "Process Improvement"], description: "Support business teams in analyzing data, identifying opportunities, and driving process improvements.", color: "from-[#353457] to-purple-400" },
  { id: 2, title: "Marketing Specialist", company: "SM Investments", location: "Pasig, Metro Manila", jobType: "Full-time", workSetup: "On-site", level: "Entry", reqEducation: ["BS Business Administration", "BS Marketing"], reqCerts: [] as string[], reqSkills: ["Marketing", "Communication", "Adobe Creative Suite", "SEO"], description: "Plan and run campaigns that grow brand awareness across digital and in-store channels.", color: "from-[#686781] to-sky-300" },
  { id: 3, title: "Customer Support Specialist", company: "Globe Telecom", location: "Makati City, Metro Manila", jobType: "Full-time", workSetup: "Hybrid", level: "Entry", reqEducation: ["BS Business Administration", "BS Information Technology"], reqCerts: [] as string[], reqSkills: ["Communication", "Customer Service", "Problem Solving"], description: "Help customers through chat and phone, resolve issues quickly and keep satisfaction high.", color: "from-[#03012d] to-[#686781]" },
  { id: 4, title: "Data Entry Associate", company: "BrightPath Outsourcing", location: "Remote (Philippines)", jobType: "Full-time", workSetup: "Remote", level: "Entry", reqEducation: ["BS Business Administration", "BS Information Technology"], reqCerts: [] as string[], reqSkills: ["Excel", "Attention to Detail", "Typing"], description: "Enter and verify records accurately, keep spreadsheets organized and meet daily targets.", color: "from-purple-300 to-[#353457]" },
  { id: 5, title: "Administrative Assistant", company: "Creative Studio PH", location: "Quezon City, Metro Manila", jobType: "Full-time", workSetup: "On-site", level: "Entry", reqEducation: ["BS Business Administration"], reqCerts: [] as string[], reqSkills: ["Communication", "Excel", "Scheduling"], description: "Keep our studio running smoothly with scheduling, documentation and team coordination.", color: "from-[#353457] to-[#686781]" },
  { id: 6, title: "Senior Full Stack Developer", company: "Innovate Financial", location: "BGC, Taguig", jobType: "Full-time", workSetup: "Hybrid", level: "Senior", reqEducation: ["BS Computer Science"], reqCerts: ["AWS Solutions Architect", "Certified Kubernetes Administrator"], reqSkills: ["React", "Node.js", "Python", "Docker", "AWS"], description: "Lead the design and delivery of secure financial web applications.", color: "from-[#03012d] to-purple-400" },
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
  const [calEvents, setCalEvents] = useState<CalEvent[]>(() => makeSeedEvents());

  const handleProceedToAuth = (role: 'seeker' | 'employer') => {
    setTargetRole(role);
    setCurrentView('auth');
  };

  const handleAuthSuccess = () => {
    setCurrentView(targetRole); 
  };

  if (currentView === 'landing') return <LandingPage onProceed={handleProceedToAuth} />;
  if (currentView === 'auth') return <AuthView targetRole={targetRole} onAuthSuccess={handleAuthSuccess} onBack={() => setCurrentView('landing')} />;
  if (currentView === 'employer') return <EmployerView onBack={() => setCurrentView('landing')} events={calEvents} setEvents={setCalEvents} />;
  return <JobSeekerView onBack={() => setCurrentView('landing')} events={calEvents} setEvents={setCalEvents} />;
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


// --- EMPLOYER VIEW (Home Dashboard) ---
const employerCandidates = [
  { id: 1, name: "Samantha Reyes", age: 23, location: "Calamba, Laguna", role: "UI/UX Designer", experience: "3 years experience", availability: "Available immediately", online: true, match: 94, ago: "2 hours ago", isNew: true, skills: ["Figma", "UI Design", "UX Research", "Adobe XD", "Prototyping"], bio: "Passionate UI/UX Designer with experience in creating user-centered digital products. Skilled in designing intuitive and visually appealing interfaces." },
  { id: 2, name: "Miguel Santos", age: 25, location: "Quezon City", role: "Data Analyst", experience: "2 years experience", availability: "Available in 2 weeks", online: true, match: 88, ago: "5 hours ago", isNew: true, skills: ["SQL", "Python", "Power BI", "Excel", "Tableau"], bio: "Detail-oriented analyst who turns messy data into clear dashboards and decisions for growing teams." },
  { id: 3, name: "Erika Dela Cruz", age: 24, location: "Makati City", role: "Marketing Specialist", experience: "3 years experience", availability: "Available in 1 month", online: false, match: 81, ago: "1 day ago", isNew: false, skills: ["SEO", "Content Strategy", "Canva", "Analytics"], bio: "Creative marketer focused on campaigns that build community and measurable growth." },
  { id: 4, name: "James Lim", age: 26, location: "Taguig City", role: "Frontend Developer", experience: "4 years experience", availability: "Available immediately", online: true, match: 90, ago: "1 day ago", isNew: false, skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Git"], bio: "Frontend developer who builds fast, accessible interfaces and enjoys working closely with designers." },
  { id: 5, name: "Nicole Tan", age: 23, location: "Pasig, Metro Manila", role: "Graphic Designer", experience: "2 years experience", availability: "Available immediately", online: false, match: 87, ago: "2 days ago", isNew: false, skills: ["Adobe Photoshop", "Illustrator", "Canva", "Branding", "Motion Graphics"], bio: "Graphic designer who builds consistent brand visuals across print and social." },
  { id: 6, name: "Daniel Cruz", age: 26, location: "Taguig, Metro Manila", role: "Project Manager", experience: "4 years experience", availability: "Available in 2 weeks", online: false, match: 85, ago: "3 days ago", isNew: false, skills: ["Agile", "Team Management", "JIRA", "Stakeholder Reporting", "Budgeting"], bio: "Project manager who keeps cross-functional teams on schedule and aligned on goals." },
];

const matchSeed: Record<number, string> = { 1: "New", 2: "New", 3: "In Review", 4: "New", 5: "Shortlisted", 6: "In Review" };
const statusStyle: Record<string, string> = { "New": "bg-emerald-100 text-emerald-700", "In Review": "bg-purple-100 text-purple-700", "Shortlisted": "bg-teal-100 text-teal-700" };

const NAV_ITEMS = [
  { label: "Home", icon: Home },
  { label: "Matches", icon: Users },
  { label: "Messages", icon: MessageCircle, badge: 3 },
  { label: "Job Postings", icon: Briefcase },
  { label: "Candidates", icon: Users },
  { label: "Calendar", icon: CalendarDays },
  { label: "Company Profile", icon: Building2 },
  { label: "Settings", icon: Settings },
];

type Cand = typeof employerCandidates[number];
const candStatusSeed: Record<number, string> = { 1: "Matched", 2: "Interested", 3: "In Review", 4: "Shortlisted", 5: "Interested", 6: "In Review" };
const candStatusStyle: Record<string, string> = { Matched: "bg-indigo-100 text-indigo-700", Interested: "bg-sky-100 text-sky-700", "In Review": "bg-amber-100 text-amber-700", Shortlisted: "bg-purple-100 text-purple-700", Hired: "bg-emerald-100 text-emerald-700" };
const candExtra: Record<number, { job: string; relocate: boolean; exp: { title: string; company: string; dates: string; points: string[] } }> = {
  1: { job: "UI/UX Designer", relocate: true, exp: { title: "UI/UX Designer", company: "Pixel Creative Agency", dates: "Jan 2022 – Present", points: ["Designed web and mobile applications for local and international clients", "Conducted user research and usability testing"] } },
  2: { job: "Data Analyst", relocate: false, exp: { title: "Data Analyst", company: "BrightMetrics Inc.", dates: "Mar 2023 – Present", points: ["Built Power BI dashboards used by leadership", "Automated weekly reporting with SQL and Python"] } },
  3: { job: "Marketing Specialist", relocate: true, exp: { title: "Marketing Associate", company: "Bloom Studio", dates: "Aug 2023 – Present", points: ["Planned and ran social media campaigns", "Grew newsletter subscribers through content and SEO"] } },
  4: { job: "Frontend Developer", relocate: true, exp: { title: "Frontend Developer", company: "Nexa Labs", dates: "Jun 2022 – Present", points: ["Built responsive React interfaces with TypeScript", "Improved page performance and accessibility scores"] } },
  5: { job: "Graphic Designer", relocate: false, exp: { title: "Junior Designer", company: "Print & Pixel", dates: "Feb 2023 – Present", points: ["Created brand assets for print and social media", "Prepared production-ready files for printers"] } },
  6: { job: "Project Manager", relocate: true, exp: { title: "Project Manager", company: "Orbit Digital", dates: "Jan 2022 – Present", points: ["Led cross-functional teams on web projects", "Managed budgets, timelines and stakeholder updates"] } },
};

type CalEvent = { id: number; kind: "interview" | "meeting" | "deadline" | "offer"; title: string; candidateId?: number; date: string; time: string; duration: number; platform: string; notes: string; status: "Invited" | "Accepted" | "Confirmed" | "Declined" | "Cancelled"; invite: boolean };
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmtTime = (t: string) => { const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; };
const addMinutes = (t: string, mins: number) => { const [h, m] = t.split(":").map(Number); const total = (h * 60 + m + mins) % 1440; return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`; };
const fmtDate = (key: string, opts: Intl.DateTimeFormatOptions) => new Date(`${key}T00:00:00`).toLocaleDateString("en-US", opts);
const kindStyle: Record<string, string> = { interview: "bg-indigo-100 text-indigo-800 border-indigo-400", meeting: "bg-rose-100 text-rose-800 border-rose-400", deadline: "bg-amber-100 text-amber-800 border-amber-400", offer: "bg-sky-100 text-sky-800 border-sky-400" };
const evShort = (e: CalEvent) => {
  const c = employerCandidates.find(x => x.id === e.candidateId);
  return c && e.kind === "interview" ? `Interview ${c.name.split(" ")[0]} ${c.name.split(" ").slice(-1)[0][0]}.` : e.title;
};
const makeSeedEvents = (): CalEvent[] => {
  const now = new Date();
  const d = (day: number) => dateKey(new Date(now.getFullYear(), now.getMonth(), day));
  const iv = (id: number, day: number, time: string, cid: number): CalEvent => ({ id, kind: "interview", title: `Interview with ${employerCandidates[cid - 1].name}`, candidateId: cid, date: d(day), time, duration: 45, platform: "Google Meet", notes: `Initial interview for ${employerCandidates[cid - 1].role} position.`, status: "Confirmed", invite: false });
  const ot = (id: number, day: number, time: string, kind: CalEvent["kind"], title: string, platform: string): CalEvent => ({ id, kind, title, date: d(day), time, duration: kind === "deadline" ? 30 : 60, platform, notes: "", status: "Confirmed", invite: false });
  return [
    iv(1, 2, "10:00", 1), iv(2, 3, "14:00", 2), ot(3, 6, "11:00", "meeting", "Team Meeting", "Zoom"), iv(4, 7, "15:00", 3),
    ot(5, 9, "13:00", "meeting", "Client Meeting", "Zoom"), iv(6, 12, "10:00", 4), iv(7, 14, "14:00", 5),
    ot(8, 16, "09:00", "deadline", "Deadline: Shortlist UI/UX Designer", "Internal"), ot(9, 20, "11:00", "meeting", "Internal Review", "On-site"),
    iv(10, 22, "09:00", 6), ot(11, 27, "14:00", "offer", "Offer Discussion", "Microsoft Teams"),
  ];
};
const emptyEventForm = { type: "Interview invite", candidateId: 1, title: "", date: "", time: "10:00", duration: 45, platform: "Google Meet", notes: "" };

const helpTopics = [
  { name: "Account & Login", desc: "Manage your account, login issues, and security settings", icon: User },
  { name: "Job Postings", desc: "Learn how to create, manage, and promote job postings", icon: Briefcase },
  { name: "Candidates", desc: "Find, filter, and manage candidates", icon: Users },
  { name: "Messages", desc: "Troubleshoot messaging and communication issues", icon: MessageCircle },
  { name: "Calendar", desc: "Scheduling interviews and managing events", icon: CalendarDays },
  { name: "Subscription & Billing", desc: "Plan details, payment methods, and invoices", icon: CreditCard },
  { name: "Privacy & Security", desc: "Control your data and keep your account secure", icon: Shield },
  { name: "Settings", desc: "Manage your preferences and account settings", icon: Settings },
];
const helpArticles = [
  { id: 1, topic: "Account & Login", title: "How to update your account details", body: ["Open Settings, then Account Settings. You can change your company name, industry, email, contact number, website, company size and address.", "Click Save Changes when you're done. The new details also appear on your Company Profile and in the top bar."] },
  { id: 2, topic: "Account & Login", title: "Changing your password and turning on two-factor sign-in", body: ["In Settings, open Privacy & Security. Choose Change Password, enter your current password, then a new one with at least 8 characters.", "Switch on Two-Factor Authentication in the same section to add an extra layer of protection."] },
  { id: 3, topic: "Job Postings", title: "How to create a job posting", body: ["Go to Job Postings and use the Post a New Job form. Fill in the job title, type, industry, work setup and location, then add a description and the skills you need.", "Choose Publish Job to go live, or Save as Draft to finish later."] },
  { id: 4, topic: "Job Postings", title: "Pausing, closing and reopening a posting", body: ["Each posting in your list has a status menu. Switch it between Active, Paused, Closed or Draft at any time.", "Only Active postings count toward your plan's job posting limit."] },
  { id: 5, topic: "Candidates", title: "How to manage candidates", body: ["The Candidates page lets you filter by job posting, status, skills, experience, location and availability. Select a person to preview their profile on the right.", "Use Shortlist to save someone, tick several rows to shortlist in bulk, and Export List to download your current results as a CSV file."] },
  { id: 6, topic: "Candidates", title: "How the matching system works", body: ["Each candidate gets a match score based on how well their education, certifications and skills fit what a role asks for.", "In Settings, Hiring Preferences lets you set a minimum match score. Candidates below it are hidden from your Home feed when the matching filters are on."] },
  { id: 7, topic: "Messages", title: "Messaging a matched candidate", body: ["Open Messages to see your conversations. Pick a candidate, type your message and press Enter or the send button.", "You can star or archive conversations, and shortlisted candidates have a quick Message button on the Matches and Candidates pages."] },
  { id: 8, topic: "Calendar", title: "Sending an interview invite and scheduling it", body: ["In Calendar, choose Schedule Event, pick Interview invite and select a candidate. The candidate has to accept before you can set a time.", "Once they accept, the invite shows a Schedule button. Pick the date, time and where it will happen. The confirmed interview then appears on both calendars."] },
  { id: 9, topic: "Subscription & Billing", title: "Subscription plans and features", body: ["Free includes 3 active job postings and 50 candidate views a month. Pro and Business add unlimited postings and views, advanced filters and matching, calendar scheduling and priority support.", "Open Settings, then Subscription & Billing to compare plans and switch between monthly and yearly billing."] },
  { id: 10, topic: "Subscription & Billing", title: "Adding a payment method and downloading invoices", body: ["Choose Add Payment Method on the Subscription & Billing page and enter your card details. You can remove a card at any time.", "Every payment creates an invoice in Billing History, with a Download link next to it."] },
  { id: 11, topic: "Privacy & Security", title: "Controlling who can see your company profile", body: ["Under Settings, Privacy & Security, Profile Visibility lets you be visible to all job seekers, show limited information, or hide your profile from search.", "You can also decide whether candidates can message you and whether your team members are shown."] },
  { id: 12, topic: "Privacy & Security", title: "Security and data privacy", body: ["Turn on two-factor authentication and login alerts, and review your signed-in devices under Login Sessions. Sign out of any device you don't recognize.", "You can request a copy of your company data or delete your account from the Data & Privacy panel."] },
  { id: 13, topic: "Settings", title: "Setting your hiring preferences", body: ["Hiring Preferences in Settings lets you choose the roles you hire for, your priority, work setups, locations and salary range.", "Quick Preferences and Auto-Screening turn on filters that decide which candidates appear on your Home feed."] },
];
const popularArticleIds = [3, 6, 5, 9, 12];
const faqs = [
  { q: "How do matches work?", a: "A match happens when a candidate and your company show interest in each other. Candidates are scored on education, certifications and skills for each role." },
  { q: "Do candidates have to accept an interview invite?", a: "Yes. After you send an invite the candidate accepts or declines. You can only pick a date and time once they accept." },
  { q: "Can I post more than 3 jobs on the Free plan?", a: "The Free plan includes 3 active job postings. Upgrade to Pro or Business for unlimited postings." },
  { q: "How do I change my company logo or cover photo?", a: "Open Company Profile and use Change Logo or Change Cover. You can also change the logo from Settings, Account Settings." },
  { q: "How do I export my candidate list?", a: "On the Candidates page, apply any filters you want, then click Export List to download a CSV file." },
  { q: "How do I delete my account?", a: "Go to Settings, Privacy & Security, then Delete Account. You'll be asked to type DELETE to confirm." },
];
const planData = {
  Free: { price: 0, tagline: "For small teams or occasional hiring", features: ["3 active job postings", "Up to 50 candidate views/month", "Basic filtering", "Email support"], jobLimit: 3, viewLimit: 50 },
  Pro: { price: 899, tagline: "For growing businesses", features: ["Unlimited job postings", "Unlimited candidate views", "Advanced filters & matching", "Calendar scheduling", "Priority support"], jobLimit: Infinity, viewLimit: Infinity },
  Business: { price: 1999, tagline: "For established companies", features: ["Everything in Pro", "Team accounts (up to 5 users)", "Advanced analytics & insights", "Custom branding", "Dedicated account manager"], jobLimit: Infinity, viewLimit: Infinity },
};
type PlanName = keyof typeof planData;
const planOrder: PlanName[] = ["Free", "Pro", "Business"];
const peso = (n: number) => `\u20B1${n.toLocaleString("en-PH")}`;
const planCost = (name: PlanName, cycle: string) => cycle === "Yearly" ? Math.round(planData[name].price * 12 * 0.8) : planData[name].price;
const planMonthly = (name: PlanName, cycle: string) => cycle === "Yearly" ? Math.round(planData[name].price * 0.8) : planData[name].price;
const luhnOk = (digits: string) => {
  let sum = 0;
  digits.split("").reverse().forEach((ch, i) => { let n = Number(ch); if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9; } sum += n; });
  return digits.length >= 13 && digits.length <= 19 && sum % 10 === 0;
};
const cardBrand = (digits: string) => digits.startsWith("4") ? "Visa" : /^(5|2)/.test(digits) ? "Mastercard" : digits.startsWith("3") ? "Amex" : "Card";
type SavedCard = { id: number; brand: string; last4: string; name: string; exp: string };
type Invoice = { id: string; date: string; desc: string; amount: number; card: string; status: string };

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${on ? "bg-[#353457]" : "bg-[#cdccd5]"}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}></span>
    </button>
  );
}
const industryOptions = ["IT & Creative Services", "Technology", "Design", "Marketing", "Finance", "Healthcare", "Education"];
const sizeOptions = ["1 - 10 employees", "11 - 50 employees", "51 - 200 employees", "201 - 500 employees", "500+ employees"];
const notifItems = [
  { k: "matches", title: "New Matches", desc: "When candidates swipe right and match with your job postings", icon: Heart },
  { k: "messages", title: "New Messages", desc: "When you receive a message from a candidate", icon: MessageCircle },
  { k: "applications", title: "Job Applications", desc: "When someone applies to your job posting", icon: Briefcase },
  { k: "shortlists", title: "Candidate Shortlists", desc: "When a candidate is shortlisted or saved", icon: Star },
  { k: "interviews", title: "Interview Reminders", desc: "Reminders for scheduled interviews and meetings", icon: CalendarDays },
  { k: "jobUpdates", title: "Job Posting Updates", desc: "Updates on job posting status (approved, expired, etc.)", icon: Bell },
  { k: "product", title: "Product Updates", desc: "Latest features, announcements, and tips", icon: Lightbulb },
];
const settingsSections = ["Account Settings", "Notifications", "Privacy & Security", "Hiring Preferences", "Subscription & Billing", "Integrations", "Help & Support"];

function EventChip({ e, selected, onClick }: { e: CalEvent; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full text-left truncate border-l-4 rounded-md px-1.5 py-1 text-[11px] leading-tight ${kindStyle[e.kind]} ${selected ? "ring-2 ring-[#353457]" : ""}`}>
      <span className="font-bold">{fmtTime(e.time)}</span> {evShort(e)}
    </button>
  );
}

const companySeed = {
  name: "Creative Studio PH", tagline: "Designing Ideas. Building Futures.", verified: true,
  about: "Creative Studio PH is a dynamic digital agency based in Quezon City, specializing in UI/UX design, web development, and creative solutions. We are passionate about building meaningful digital experiences and empowering young talents to grow with us.",
  industry: "IT & Creative Services", size: "11 - 50 employees", city: "Quezon City, Metro Manila", founded: "2018",
  address: "123 Innovation Street, Quezon City, Metro Manila, Philippines 1100",
  contactPerson: "Maria Santos", email: "hr@creativestudioph.com", phone: "+63 912 345 6789", website: "www.creativestudioph.com",
  linkedin: "https://www.linkedin.com/company/creativestudioph", facebook: "https://www.facebook.com/creativestudioph",
  instagram: "https://www.instagram.com/creativestudioph", web: "https://www.creativestudioph.com",
};
const teamSeed = [{ id: 1, name: "Maria Santos", role: "HR Manager" }, { id: 2, name: "Paolo Lim", role: "Technical Recruiter" }, { id: 3, name: "Ana Cruz", role: "Creative Director" }];
const photoSeed = [{ id: 1, url: "", label: "Our Studio" }, { id: 2, url: "", label: "Team Meeting" }, { id: 3, url: "", label: "Culture Wall" }, { id: 4, url: "", label: "Creative Space" }];
const prefsSeed = {
  setups: ["On-site", "Remote", "Hybrid"], minMatch: 70, freshGrads: true, platform: "Google Meet",
  roles: ["UI/UX Designer", "Frontend Developer", "Graphic Designer"], priority: "Skills Match", dailyCount: 20,
  locationMode: "Quezon City", otherLocation: "", salaryMin: 30000, salaryMax: 60000,
  skills: ["Figma", "React"], experience: "Any", education: "Any", certs: [] as string[],
  quick: { minMatchOnly: true, highlightTop: true, relocation: false, immediate: true, notifyTop: true },
  screening: { belowThreshold: true, requireSkills: true, minExperience: false, requireEducation: false, filterSetup: true },
  diversity: { inclusiveLanguage: true, blindScreening: false, underrepresented: true },
  autoMatch: { on: true, autoShortlist: false, autoInvite: false },
};
const hireTabs = ["General Preferences", "Candidate Criteria", "Skills & Experience", "Education & Certifications", "Work Setup & Location", "Salary Range", "Diversity & Inclusion", "Auto-Match Settings"];
const salaryOptions = Array.from({ length: 35 }, (_, i) => 15000 + i * 5000);
const tileGradients = ["from-[#353457] to-[#686781]", "from-purple-300 to-[#353457]", "from-[#686781] to-purple-200", "from-[#03012d] to-[#353457]"];

type Msg = { from: "them" | "me"; text: string; time: string };
const msgSeed: Record<number, Msg[]> = {
  1: [
    { from: "them", text: "Hi! I'm Samantha. Thank you for matching with me! 👋", time: "10:24 AM" },
    { from: "me", text: "Hi Samantha! 👋 Thank you for showing interest in our company. We'd like to know more about your experience with UI/UX design. Are you available for a short interview this week?", time: "10:26 AM" },
    { from: "them", text: "Yes, I'm available this week. Any day and time works for me. Looking forward to it!", time: "10:28 AM" },
    { from: "me", text: "Great! We'll send the details via calendar invite. Thank you!", time: "10:29 AM" },
  ],
  2: [{ from: "them", text: "Thank you for considering my application!", time: "9:15 AM" }],
  3: [{ from: "them", text: "Great! Looking forward to the next steps.", time: "Yesterday" }],
  4: [{ from: "them", text: "I'm available for an interview anytime.", time: "Yesterday" }],
  5: [{ from: "them", text: "Thank you for the opportunity!", time: "Sep 28" }],
  6: [{ from: "them", text: "I have additional questions regarding the role.", time: "Sep 27" }],
};
const unreadSeed: Record<number, number> = { 1: 2, 2: 1 };

type Job = { id: number; title: string; location: string; type: string; status: string; matches: number; views: number };
const jobSeed: Job[] = [
  { id: 1, title: "UI/UX Designer", location: "Manila (Hybrid)", type: "Full-time", status: "Active", matches: 24, views: 56 },
  { id: 2, title: "Frontend Developer", location: "Remote", type: "Full-time", status: "Active", matches: 18, views: 42 },
  { id: 3, title: "Marketing Specialist", location: "Quezon City (On-site)", type: "Full-time", status: "Active", matches: 12, views: 37 },
  { id: 4, title: "Data Analyst", location: "Remote", type: "Part-time", status: "Paused", matches: 6, views: 21 },
  { id: 5, title: "Graphic Designer", location: "Manila (Hybrid)", type: "Contract", status: "Closed", matches: 10, views: 30 },
  { id: 6, title: "Project Manager", location: "Taguig (On-site)", type: "Full-time", status: "Active", matches: 8, views: 25 },
];
const jobStatusStyle: Record<string, string> = { Active: "bg-emerald-100 text-emerald-700", Paused: "bg-amber-100 text-amber-700", Closed: "bg-gray-200 text-gray-600", Draft: "bg-slate-100 text-slate-600" };
type JobForm = { title: string; type: string; industry: string; setup: string; city: string; relocate: boolean; description: string; skills: string[]; salaryMin: string; salaryMax: string; experience: string; deadline: string };
const emptyJobForm: JobForm = { title: "", type: "", industry: "", setup: "", city: "", relocate: false, description: "", skills: [], salaryMin: "", salaryMax: "", experience: "", deadline: "" };

function Field({ label, required, children, className = "" }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold text-[#353457] mb-1">{label}{required && <span className="text-red-500"> *</span>}</span>
      {children}
    </label>
  );
}

function Avatar({ name, className = "" }: { name: string; className?: string }) {
  return (
    <div className={`rounded-full bg-gradient-to-br from-[#353457] to-purple-400 flex items-center justify-center font-bold text-white shrink-0 ${className}`}>
      {name.split(" ").map(n => n[0]).slice(0, 2).join("")}
    </div>
  );
}

function EmployerView({ onBack, events, setEvents }: { onBack: () => void; events: CalEvent[]; setEvents: React.Dispatch<React.SetStateAction<CalEvent[]>> }) {
  const [company, setCompany] = useState(companySeed);
  const companyName = company.name;
  const [activeNav, setActiveNav] = useState("Home");
  const [deck, setDeck] = useState(employerCandidates);
  const [deckPos, setDeckPos] = useState(0);
  const [shortlisted, setShortlisted] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<Record<number, string>>(matchSeed);
  const [profile, setProfile] = useState<typeof employerCandidates[number] | null>(null);
  const [tab, setTab] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [threads, setThreads] = useState<Record<number, Msg[]>>(msgSeed);
  const [unread, setUnread] = useState<Record<number, number>>(unreadSeed);
  const [archived, setArchived] = useState<Record<number, boolean>>({});
  const [starred, setStarred] = useState<Record<number, boolean>>({});
  const [activeChat, setActiveChat] = useState(1);
  const [showChat, setShowChat] = useState(false);
  const [convTab, setConvTab] = useState("All");
  const [convQuery, setConvQuery] = useState("");
  const [draft, setDraft] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<Job[]>(jobSeed);
  const [jobTab, setJobTab] = useState("All");
  const [jobQuery, setJobQuery] = useState("");
  const [form, setForm] = useState<JobForm>(emptyJobForm);
  const [skillInput, setSkillInput] = useState("");
  const [jobErrors, setJobErrors] = useState<Record<string, boolean>>({});
  const [showMore, setShowMore] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const [candStatus, setCandStatus] = useState<Record<number, string>>(candStatusSeed);
  const [candSel, setCandSel] = useState<string[]>([]);
  const [candQuery, setCandQuery] = useState("");
  const [candSort, setCandSort] = useState("match");
  const [fJob, setFJob] = useState("");
  const [fSkills, setFSkills] = useState<string[]>([]);
  const [fSkillQuery, setFSkillQuery] = useState("");
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [fLocation, setFLocation] = useState("");
  const [fAvail, setFAvail] = useState("");
  const [fExp, setFExp] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const [selCand, setSelCand] = useState<number | null>(1);
  const [candDetailTab, setCandDetailTab] = useState("Profile");
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [calView, setCalView] = useState("Month");
  const [cursor, setCursor] = useState(() => new Date());
  const [selEvent, setSelEvent] = useState<number | null>(1);
  const [modal, setModal] = useState<null | { mode: "new" } | { mode: "schedule"; id: number }>(null);
  const [mf, setMf] = useState(emptyEventForm);
  const [mfErr, setMfErr] = useState("");
  const [editing, setEditing] = useState(false);
  const [companyDraft, setCompanyDraft] = useState(companySeed);
  const [profTab, setProfTab] = useState("Overview");
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [photos, setPhotos] = useState(photoSeed);
  const [team, setTeam] = useState(teamSeed);
  const [teamName, setTeamName] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [prefs, setPrefs] = useState(prefsSeed);
  const [statsRange, setStatsRange] = useState("30");
  const logoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const [section, setSection] = useState("Account Settings");
  const [acctDraft, setAcctDraft] = useState(companySeed);
  const [acctErr, setAcctErr] = useState<Record<string, boolean>>({});
  const [notif, setNotif] = useState<Record<string, boolean>>({ matches: true, messages: true, applications: true, shortlists: true, interviews: true, jobUpdates: true, product: false });
  const [twoFA, setTwoFA] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [connected, setConnected] = useState<Record<string, boolean>>({ google: true, linkedin: true, github: false });
  const [emailEdit, setEmailEdit] = useState<string | null>(null);
  const [pwModal, setPwModal] = useState(false);
  const [pw, setPw] = useState({ cur: "", next: "", confirm: "" });
  const [pwErr, setPwErr] = useState("");
  const [delModal, setDelModal] = useState(false);
  const [delText, setDelText] = useState("");
  const [channels, setChannels] = useState<Record<string, boolean>>({ inapp: true, email: true, push: false });
  const [quiet, setQuiet] = useState({ on: true, start: "22:00", end: "07:00", days: [0, 1, 2, 3, 4, 5] });
  const [frequency, setFrequency] = useState("Immediate (Real-time)");
  const [hireTab, setHireTab] = useState("General Preferences");
  const [prefSkill, setPrefSkill] = useState("");
  const [prefCert, setPrefCert] = useState("");
  const [helpQuery, setHelpQuery] = useState("");
  const [helpTopic, setHelpTopic] = useState<string | null>(null);
  const [helpModal, setHelpModal] = useState<null | { kind: "article"; id: number } | { kind: "faq" } | { kind: "ticket"; type: "message" | "chat" | "call" }>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [tickets, setTickets] = useState<{ id: string; subject: string; kind: string; status: string; created: string }[]>([]);
  const [tk, setTk] = useState({ subject: "", category: "General", message: "", phone: "", date: "", slot: "9:00 AM - 12:00 PM" });
  const [tkErr, setTkErr] = useState<Record<string, string>>({});
  const [subPlan, setSubPlan] = useState<PlanName>("Free");
  const [subCycle, setSubCycle] = useState("Monthly");
  const [billCycle, setBillCycle] = useState("Monthly");
  const [nextBilling, setNextBilling] = useState("");
  const [checkout, setCheckout] = useState<PlanName | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [cardModal, setCardModal] = useState(false);
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [selCard, setSelCard] = useState(0);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paying, setPaying] = useState(false);
  const [cardForm, setCardForm] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [cardErr, setCardErr] = useState<Record<string, string>>({});
  const [visibility, setVisibility] = useState("visible");
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [showTeam, setShowTeam] = useState(true);
  const [pwChangedOn, setPwChangedOn] = useState("Aug 15, 2026");
  const [privModal, setPrivModal] = useState<null | "sessions" | "blocked" | "cookies" | "usage">(null);
  const [sessions, setSessions] = useState([
    { id: 1, device: "Web Browser (Mac)", place: "Quezon City, Philippines", when: "Oct 1, 2026, 10:45 AM", tag: "Current" },
    { id: 2, device: "iPhone (Mobile)", place: "Quezon City, Philippines", when: "Sep 30, 2026, 8:12 PM", tag: "Trusted" },
    { id: 3, device: "Web Browser (Windows)", place: "Manila, Philippines", when: "Sep 28, 2026, 3:20 PM", tag: "Trusted" },
    { id: 4, device: "iPad (Tablet)", place: "Makati, Philippines", when: "Sep 14, 2026, 1:05 PM", tag: "Trusted" },
  ]);
  const [blocked, setBlocked] = useState([{ id: 1, name: "Jordan Reyes", role: "Sales Associate" }, { id: 2, name: "Chris Tan", role: "Customer Support" }]);
  const [cookiePrefs, setCookiePrefs] = useState({ analytics: true, marketing: false });
  const [dataRequested, setDataRequested] = useState(false);
  useEffect(() => { if (activeNav === "Settings") setAcctDraft(company); }, [activeNav]);
  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [threads, activeChat, activeNav, showChat]);

  const q = query.trim().toLowerCase();
  const visible = deck.filter(c => (!q || [c.name, c.role, ...c.skills].join(" ").toLowerCase().includes(q)) && (!(prefs.quick.minMatchOnly || prefs.screening.belowThreshold) || c.match >= prefs.minMatch)).slice(0, prefs.dailyCount);
  const index = visible.length ? Math.min(deckPos, visible.length - 1) : 0;
  const current = visible[index];

  const tabs = ["All", "New", "In Review", "Shortlisted"];
  const countFor = (t: string) => employerCandidates.filter(c => t === "All" || statuses[c.id] === t).length;
  const matchList = employerCandidates
    .filter(c => (tab === "All" || statuses[c.id] === tab) && (!q || [c.name, c.role, ...c.skills].join(" ").toLowerCase().includes(q)))
    .sort((a, b) => sortBy === "match" ? b.match - a.match : sortBy === "name" ? a.name.localeCompare(b.name) : 0);

  const shortlist = (c: typeof employerCandidates[number]) => {
    setStatuses(prev => ({ ...prev, [c.id]: "Shortlisted" }));
    setNotice(`${c.name} added to your shortlist`);
    setTimeout(() => setNotice(""), 2500);
  };
  const openChat = (id: number) => {
    setActiveChat(id);
    setShowChat(true);
    setUnread(prev => ({ ...prev, [id]: 0 }));
    setActiveNav("Messages");
  };
  const messageCandidate = (id: number) => { setProfile(null); openChat(id); };

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);
  const lastMsg = (id: number) => threads[id][threads[id].length - 1];
  const convTabs = ["All", "Unread", "Shortlisted", "Archived"];
  const inConvTab = (id: number, t: string) =>
    t === "Archived" ? !!archived[id] : !archived[id] && (t === "All" || (t === "Unread" && (unread[id] || 0) > 0) || (t === "Shortlisted" && statuses[id] === "Shortlisted"));
  const convCount = (t: string) => employerCandidates.filter(c => inConvTab(c.id, t)).length;
  const cq = convQuery.trim().toLowerCase();
  const convList = employerCandidates.filter(c => inConvTab(c.id, convTab) && (!cq || [c.name, c.role, lastMsg(c.id).text].join(" ").toLowerCase().includes(cq)));
  const activeCand = employerCandidates.find(c => c.id === activeChat) ?? employerCandidates[0];

  const flash = (msg: string) => { setNotice(msg); setTimeout(() => setNotice(""), 2500); };
  type CompanyKey = keyof typeof companySeed;
  const val = (k: CompanyKey) => String(editing ? companyDraft[k] : company[k]);
  const setD = (k: CompanyKey, v: string) => setCompanyDraft(prev => ({ ...prev, [k]: v }));
  const startEdit = () => { setCompanyDraft(company); setEditing(true); };
  const saveProfile = () => { setCompany({ ...companyDraft, name: companyDraft.name.trim() || company.name }); setEditing(false); flash("Company profile saved"); };
  const pickImage = (file: File | undefined, apply: (url: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return flash("Please choose an image file.");
    apply(URL.createObjectURL(file));
  };
  const addPhotos = (files: FileList | null) => {
    const imgs = Array.from(files ?? []).filter(f => f.type.startsWith("image/"));
    if (!imgs.length) return;
    setPhotos(prev => [...prev, ...imgs.map((f, i) => ({ id: Date.now() + i, url: URL.createObjectURL(f), label: f.name }))].slice(0, 12));
  };
  const addMember = () => {
    if (!teamName.trim()) return;
    setTeam(prev => [...prev, { id: Date.now(), name: teamName.trim(), role: teamRole.trim() || "Team Member" }]);
    setTeamName(""); setTeamRole("");
  };
  const viewsByRange: Record<string, number> = { "7": 310, "30": 1240, "90": 3680 };
  const infoField = (label: string, k: CompanyKey, span = false) => (
    <div key={k} className={span ? "sm:col-span-2" : ""}>
      <p className="text-xs text-[#686781] mb-1">{label}</p>
      {editing
        ? <input value={val(k)} onChange={(e) => setD(k, e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#353457]/40 rounded-lg text-sm focus:outline-none focus:border-[#353457]" />
        : <p className="px-3 py-2.5 bg-[#f8f9fa] rounded-lg text-sm min-h-[40px]">{val(k)}</p>}
    </div>
  );
  const editBtn = (
    <button onClick={startEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#353457]/10 text-[#353457] text-xs font-semibold hover:bg-[#353457]/20"><Pencil size={13} /> Edit</button>
  );
  const setA = (k: CompanyKey, v: string) => { setAcctDraft(prev => ({ ...prev, [k]: v })); setAcctErr(prev => ({ ...prev, [k]: false })); };
  const acctCls = (k: string) => `w-full px-3 py-2.5 bg-[#f8f9fa] border rounded-lg text-sm focus:outline-none focus:border-[#353457] ${acctErr[k] ? "border-red-400" : "border-[#cdccd5]"}`;
  const validEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());
  const saveAccount = () => {
    const errs: Record<string, boolean> = {};
    if (!acctDraft.name.trim()) errs.name = true;
    if (!validEmail(acctDraft.email)) errs.email = true;
    if (acctDraft.phone.trim().length < 7) errs.phone = true;
    if (Object.keys(errs).length) { setAcctErr(errs); return flash("Please fix the highlighted fields"); }
    setCompany(prev => ({ ...prev, name: acctDraft.name.trim(), industry: acctDraft.industry, email: acctDraft.email.trim(), phone: acctDraft.phone.trim(), website: acctDraft.website.trim(), size: acctDraft.size, address: acctDraft.address.trim() }));
    flash("Account settings saved");
  };
  const saveEmail = () => {
    if (emailEdit === null) return;
    if (!validEmail(emailEdit)) return flash("Enter a valid email address");
    setA("email", emailEdit.trim());
    setCompany(prev => ({ ...prev, email: emailEdit.trim() }));
    setEmailEdit(null);
    flash("Email updated");
  };
  const submitPassword = () => {
    if (!pw.cur) return setPwErr("Enter your current password.");
    if (pw.next.length < 8) return setPwErr("New password must be at least 8 characters.");
    if (pw.next !== pw.confirm) return setPwErr("New passwords do not match.");
    setPwModal(false); setPw({ cur: "", next: "", confirm: "" }); setPwErr("");
    setPwChangedOn(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
    flash("Password updated");
  };
  const notifRowsFor = (keys?: string[], withIcons = false) => notifItems.filter(n => !keys || keys.includes(n.k)).map(n => {
    const Icon = n.icon;
    return (
      <div key={n.k} className="flex items-center gap-3 py-2.5">
        {withIcons && <Icon size={18} className="text-[#353457] shrink-0" />}
        <div className="flex-1 min-w-0"><p className="text-sm font-semibold">{n.title}</p><p className="text-xs text-[#686781]">{n.desc}</p></div>
        <Toggle on={!!notif[n.k]} onChange={(v) => setNotif(prev => ({ ...prev, [n.k]: v }))} label={n.title} />
      </div>
    );
  });
  const notifRows = notifRowsFor(["matches", "messages", "applications", "interviews", "product"]);
  const previewAll = [
    { k: "matches", title: "New Match", text: "Maria Santos matched with your UI/UX Designer position.", ago: "2m ago", icon: Heart },
    { k: "messages", title: "New Message", text: "Miguel Santos: \u201CHi! I'm interested in the position...\u201D", ago: "10m ago", icon: MessageCircle },
    { k: "applications", title: "New Application", text: "Erika Dela Cruz applied to Frontend Developer.", ago: "30m ago", icon: Briefcase },
    { k: "interviews", title: "Interview Reminder", text: "You have an interview with Nicole Tan tomorrow at 10:00 AM.", ago: "1h ago", icon: CalendarDays },
  ];
  const previewItems = previewAll.filter(n => notif[n.k]);
  const hourOptions = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);
  const privRow = (Icon: typeof Lock, title: string, desc: string, onClick: () => void, danger = false) => (
    <button key={title} onClick={onClick} className="w-full flex items-center gap-3 py-3 text-left hover:bg-gray-50 rounded-lg px-1">
      <Icon size={20} className={`shrink-0 ${danger ? "text-red-500" : "text-[#353457]"}`} />
      <span className="flex-1 min-w-0"><span className={`block text-sm font-semibold ${danger ? "text-red-600" : ""}`}>{title}</span><span className="block text-xs text-[#686781]">{desc}</span></span>
      <ChevronRight size={18} className={danger ? "text-red-400" : "text-[#9a99ab]"} />
    </button>
  );
  const setQuick = (k: keyof typeof prefsSeed.quick, v: boolean) => setPrefs(prev => ({ ...prev, quick: { ...prev.quick, [k]: v } }));
  const setScreen = (k: keyof typeof prefsSeed.screening, v: boolean) => setPrefs(prev => ({ ...prev, screening: { ...prev.screening, [k]: v } }));
  const prefToggle = (group: "diversity" | "autoMatch", k: string, title: string, desc: string) => (
    <div key={k} className="flex items-center gap-3 py-3">
      <div className="flex-1"><p className="text-sm font-semibold">{title}</p><p className="text-xs text-[#686781]">{desc}</p></div>
      <Toggle on={(prefs[group] as Record<string, boolean>)[k]} onChange={(v) => setPrefs(prev => ({ ...prev, [group]: { ...prev[group], [k]: v } }) as typeof prefsSeed)} label={title} />
    </div>
  );
  const addChip = (key: "skills" | "certs", value: string, clear: () => void) => {
    const v = value.trim();
    if (v && !prefs[key].some(x => x.toLowerCase() === v.toLowerCase())) setPrefs(prev => ({ ...prev, [key]: [...prev[key], v] }));
    clear();
  };
  const roleOptions = Array.from(new Set([...jobs.map(j => j.title), "Data Analyst", "Marketing Specialist", "Project Manager", "Product Designer", "Backend Developer"])).filter(r => !prefs.roles.includes(r));
  const quickItems = [
    { k: "minMatchOnly", icon: Shield, label: `Show only candidates who meet at least ${prefs.minMatch}% of qualifications` },
    { k: "highlightTop", icon: Star, label: "Highlight top matches" },
    { k: "relocation", icon: MapPin, label: "Show candidates open to relocation" },
    { k: "immediate", icon: Clock, label: "Show candidates available immediately" },
    { k: "notifyTop", icon: Bell, label: "Notify me when new top matches appear" },
  ] as const;
  const screenItems = [
    { k: "belowThreshold", icon: SlidersHorizontal, label: `Filter out candidates below ${prefs.minMatch}% match` },
    { k: "requireSkills", icon: Lightbulb, label: "Require specific skills" },
    { k: "minExperience", icon: Briefcase, label: "Require minimum experience" },
    { k: "requireEducation", icon: FileText, label: "Require educational background" },
    { k: "filterSetup", icon: MapPin, label: "Filter by preferred location/work setup" },
  ] as const;
  const workSetupCard = (
    <div className="border border-[#cdccd5]/60 rounded-xl p-4">
      <h4 className="font-bold text-sm">Preferred Work Setup</h4>
      <p className="text-xs text-[#686781] mb-2">Select your preferred arrangement.</p>
      {["On-site", "Remote", "Hybrid"].map(w => (
        <label key={w} className="flex items-center gap-2 text-sm py-1 text-[#03012d]"><input type="checkbox" checked={prefs.setups.includes(w)} onChange={() => setPrefs(prev => ({ ...prev, setups: prev.setups.includes(w) ? prev.setups.filter(x => x !== w) : [...prev.setups, w] }))} /> {w}</label>
      ))}
    </div>
  );
  const locationsCard = (
    <div className="border border-[#cdccd5]/60 rounded-xl p-4">
      <h4 className="font-bold text-sm">Preferred Locations</h4>
      <p className="text-xs text-[#686781] mb-2">Choose locations or allow nationwide.</p>
      {["Quezon City", "Metro Manila", "Nationwide", "Other Locations"].map(l => (
        <label key={l} className="flex items-center gap-2 text-sm py-1 text-[#03012d]"><input type="radio" name="hire-location" checked={prefs.locationMode === l} onChange={() => setPrefs(prev => ({ ...prev, locationMode: l }))} /> {l}</label>
      ))}
      {prefs.locationMode === "Other Locations" && <input value={prefs.otherLocation} onChange={(e) => setPrefs(prev => ({ ...prev, otherLocation: e.target.value }))} placeholder="e.g. Cebu City" className="mt-2 w-full px-3 py-2 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" />}
    </div>
  );
  const salaryCard = (
    <div className="border border-[#cdccd5]/60 rounded-xl p-4">
      <h4 className="font-bold text-sm">Salary Range (PHP)</h4>
      <p className="text-xs text-[#686781] mb-2">Set your preferred monthly salary range.</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Min. Salary">
          <select value={prefs.salaryMin} onChange={(e) => { const v = Number(e.target.value); setPrefs(prev => ({ ...prev, salaryMin: v, salaryMax: Math.max(prev.salaryMax, v) })); }} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">{salaryOptions.map(o => <option key={o} value={o}>{o.toLocaleString()}</option>)}</select>
        </Field>
        <Field label="Max. Salary">
          <select value={prefs.salaryMax} onChange={(e) => { const v = Number(e.target.value); setPrefs(prev => ({ ...prev, salaryMax: v, salaryMin: Math.min(prev.salaryMin, v) })); }} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">{salaryOptions.map(o => <option key={o} value={o}>{o.toLocaleString()}</option>)}</select>
        </Field>
      </div>
    </div>
  );
  const chatOnline = () => {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", weekday: "short", hour: "numeric", hour12: false }).formatToParts(new Date());
    const wd = parts.find(x => x.type === "weekday")?.value ?? "";
    const hr = Number(parts.find(x => x.type === "hour")?.value) % 24;
    return !["Sat", "Sun"].includes(wd) && hr >= 9 && hr < 18;
  };
  const openTicket = (type: "message" | "chat" | "call") => {
    setTk({ subject: type === "chat" ? "Live chat request" : "", category: "General", message: "", phone: company.phone, date: "", slot: "9:00 AM - 12:00 PM" });
    setTkErr({});
    setHelpModal({ kind: "ticket", type });
  };
  const submitTicket = () => {
    if (!helpModal || helpModal.kind !== "ticket") return;
    const type = helpModal.type;
    const errs: Record<string, string> = {};
    if (type === "call") {
      if (tk.phone.trim().length < 7) errs.phone = "Enter a phone number.";
      if (!tk.date) errs.date = "Pick a date.";
    } else {
      if (type === "message" && !tk.subject.trim()) errs.subject = "Add a subject.";
      if (!tk.message.trim()) errs.message = "Tell us how we can help.";
    }
    if (Object.keys(errs).length) { setTkErr(errs); return; }
    const subject = type === "call" ? `Call request (${tk.slot})` : type === "chat" ? "Live chat request" : tk.subject.trim();
    setTickets(prev => [{ id: `TCK-${1001 + prev.length}`, subject, kind: type === "message" ? "Message" : type === "chat" ? "Live chat" : "Call", status: "Open", created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }, ...prev]);
    setHelpModal(null);
    flash("Support request sent. We'll get back to you within one business day.");
  };
  const hq = helpQuery.trim().toLowerCase();
  const helpResults = helpArticles.filter(a => (!helpTopic || helpTopic === "All Guides" || a.topic === helpTopic) && (!hq || `${a.title} ${a.body.join(" ")} ${a.topic}`.toLowerCase().includes(hq)));
  const showHelpResults = !!hq || !!helpTopic;
  const activeJobs = jobs.filter(j => j.status === "Active").length;
  const viewsUsed = 28;
  const limits = planData[subPlan];
  const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const openCheckout = (name: PlanName) => { if (name === "Free") { setManageOpen(true); return; } setSelCard(cards[0]?.id ?? 0); setCheckout(name); };
  const payNow = () => {
    if (!checkout || !cards.length || paying) return;
    setPaying(true);
    const target = checkout;
    const cycle = billCycle;
    const card = cards.find(c => c.id === selCard) ?? cards[0];
    setTimeout(() => {
      const next = new Date();
      if (cycle === "Yearly") next.setFullYear(next.getFullYear() + 1); else next.setMonth(next.getMonth() + 1);
      setSubPlan(target);
      setSubCycle(cycle);
      setNextBilling(next.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
      setInvoices(prev => [{ id: `INV-${String(prev.length + 1).padStart(4, "0")}`, date: today(), desc: `${target} plan (${cycle})`, amount: planCost(target, cycle), card: `${card.brand} \u2022\u2022\u2022\u2022 ${card.last4}`, status: "Paid" }, ...prev]);
      setPaying(false);
      setCheckout(null);
      flash(`Payment successful. You're now on ${target}.`);
    }, 1200);
  };
  const cancelPlan = () => { setSubPlan("Free"); setSubCycle("Monthly"); setNextBilling(""); setManageOpen(false); flash("Subscription cancelled. You're back on Free."); };
  const submitCard = () => {
    const digits = cardForm.number.replace(/\s/g, "");
    const errs: Record<string, string> = {};
    if (!luhnOk(digits)) errs.number = "Enter a valid card number.";
    if (!cardForm.name.trim()) errs.name = "Enter the name on the card.";
    const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(cardForm.exp);
    if (!m || new Date(2000 + Number(m[2]), Number(m[1]), 0, 23, 59) < new Date()) errs.exp = "Enter a valid future date (MM/YY).";
    if (!/^\d{3,4}$/.test(cardForm.cvc)) errs.cvc = "3 or 4 digits.";
    if (Object.keys(errs).length) { setCardErr(errs); return; }
    const id = Date.now();
    setCards(prev => [...prev, { id, brand: cardBrand(digits), last4: digits.slice(-4), name: cardForm.name.trim(), exp: cardForm.exp }]);
    setSelCard(id);
    setCardForm({ number: "", name: "", exp: "", cvc: "" });
    setCardErr({});
    setCardModal(false);
    flash("Payment method added");
  };
  const downloadInvoice = (inv: Invoice) => {
    const text = [`KAIROS Invoice ${inv.id}`, `Date: ${inv.date}`, `Billed to: ${company.name}`, `Description: ${inv.desc}`, `Amount: ${peso(inv.amount)}`, `Paid with: ${inv.card}`, `Status: ${inv.status}`].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inv.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const usageBar = (label: string, used: number, limit: number) => {
    const pct = limit === Infinity ? 0 : Math.min(100, Math.round((used / limit) * 100));
    return (
      <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[170px_1fr] gap-3 items-center text-sm">
        <span className="text-[#686781]">{label}</span>
        <div>
          <p className="font-semibold">{used} / {limit === Infinity ? "Unlimited" : limit} used</p>
          {limit !== Infinity && <div className="flex items-center gap-2 mt-1"><div className="flex-1 h-2 bg-[#cdccd5]/50 rounded-full overflow-hidden"><div className={`h-full rounded-full ${pct >= 100 ? "bg-red-500" : "bg-[#353457]"}`} style={{ width: `${pct}%` }}></div></div><span className="text-xs text-[#686781] w-10 text-right">{pct}%</span></div>}
        </div>
      </div>
    );
  };
  const scheduled = events.filter(e => e.status === "Confirmed" && e.date);
  const eventsOn = (key: string) => scheduled.filter(e => e.date === key).sort((a, b) => a.time.localeCompare(b.time));
  const todayKey = dateKey(new Date());
  const monthPrefix = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  monthStart.setDate(1 - monthStart.getDay());
  const monthCells = Array.from({ length: 42 }, (_, i) => { const d = new Date(monthStart); d.setDate(monthStart.getDate() + i); return d; });
  const weekStart = new Date(cursor);
  weekStart.setDate(cursor.getDate() - cursor.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d; });
  const calTitle = calView === "Day"
    ? cursor.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : calView === "Week"
      ? `${weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      : cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const shiftCursor = (dir: number, monthly = false) => setCursor(prev => {
    const n = new Date(prev);
    if (!monthly && calView === "Week") n.setDate(n.getDate() + 7 * dir);
    else if (!monthly && calView === "Day") n.setDate(n.getDate() + dir);
    else { n.setDate(1); n.setMonth(n.getMonth() + dir); }
    return n;
  });
  const upcoming = scheduled.filter(e => e.date >= todayKey).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 3);
  const agendaList = scheduled.filter(e => e.date.startsWith(monthPrefix)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const invites = events.filter(e => e.invite && ["Invited", "Accepted", "Declined"].includes(e.status));
  const selEv = scheduled.find(e => e.id === selEvent) ?? null;
  const evCand = (e: CalEvent) => employerCandidates.find(c => c.id === e.candidateId);
  const openNewEvent = () => { setMf(emptyEventForm); setMfErr(""); setModal({ mode: "new" }); };
  const openSchedule = (e: CalEvent) => {
    setMf({ ...emptyEventForm, candidateId: e.candidateId ?? 1, title: e.title, date: e.date, time: e.time || "10:00", duration: e.duration || 45, platform: e.platform, notes: e.notes });
    setMfErr("");
    setModal({ mode: "schedule", id: e.id });
  };
  const cancelEvent = (id: number, msg: string) => { setEvents(prev => prev.map(e => e.id === id ? { ...e, status: "Cancelled" } : e)); setSelEvent(null); flash(msg); };
  const submitEvent = () => {
    if (!modal) return;
    if (modal.mode === "schedule") {
      if (!mf.date || !mf.time) return setMfErr("Choose a date and a time.");
      setEvents(prev => prev.map(e => e.id === modal.id ? { ...e, date: mf.date, time: mf.time, duration: mf.duration, platform: mf.platform, notes: mf.notes || e.notes, status: "Confirmed" } : e));
      setSelEvent(modal.id);
      setCursor(new Date(`${mf.date}T00:00:00`));
      flash("Interview scheduled. It now appears on both calendars.");
    } else if (mf.type === "Interview invite") {
      const c = employerCandidates.find(x => x.id === Number(mf.candidateId));
      if (!c) return;
      setEvents(prev => [...prev, { id: Date.now(), kind: "interview", title: `Interview with ${c.name}`, candidateId: c.id, date: "", time: "", duration: 45, platform: "Google Meet", notes: mf.notes || `Interview for ${c.role} position.`, status: "Invited", invite: true }]);
      flash(`Invite sent to ${c.name}`);
    } else {
      if (!mf.date || !mf.time) return setMfErr("Choose a date and a time.");
      const kind: CalEvent["kind"] = mf.type === "Deadline" ? "deadline" : mf.type === "Offer Discussion" ? "offer" : "meeting";
      const id = Date.now();
      setEvents(prev => [...prev, { id, kind, title: mf.title.trim() || mf.type, date: mf.date, time: mf.time, duration: mf.duration, platform: mf.platform, notes: mf.notes, status: "Confirmed", invite: false }]);
      setSelEvent(id);
      setCursor(new Date(`${mf.date}T00:00:00`));
      flash("Event added to your calendar");
    }
    setModal(null);
  };

  const candTabs = ["Matched", "Interested", "In Review", "Shortlisted", "Hired"];
  const yearsOf = (c: Cand) => parseInt(c.experience) || 0;
  const availOf = (c: Cand) => c.availability.includes("immediately") ? "Immediately" : c.availability.includes("2 weeks") ? "In 2 weeks" : "In 1 month";
  const cityOf = (c: Cand) => c.location.split(",")[0];
  const candStatusCount = (st: string) => employerCandidates.filter(c => candStatus[c.id] === st).length;
  const skillCounts = Object.entries(employerCandidates.flatMap(c => c.skills).reduce<Record<string, number>>((acc, sk) => ({ ...acc, [sk]: (acc[sk] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);
  const skillOptions = skillCounts.filter(([sk]) => sk.toLowerCase().includes(fSkillQuery.trim().toLowerCase()));
  const cLocations = Array.from(new Set(employerCandidates.map(cityOf)));
  const cqq = candQuery.trim().toLowerCase();
  const candList = employerCandidates.filter(c => {
    if (candSel.length && !candSel.includes(candStatus[c.id])) return false;
    if (fJob && candExtra[c.id].job !== fJob) return false;
    if (fLocation && cityOf(c) !== fLocation) return false;
    if (fAvail && availOf(c) !== fAvail) return false;
    if (fExp) {
      const y = yearsOf(c);
      if (fExp === "0-1" && y > 1) return false;
      if (fExp === "2-3" && (y < 2 || y > 3)) return false;
      if (fExp === "4+" && y < 4) return false;
    }
    if (fSkills.length && !fSkills.some(sk => c.skills.includes(sk))) return false;
    if (cqq && ![c.name, c.role, ...c.skills].join(" ").toLowerCase().includes(cqq)) return false;
    return true;
  }).sort((a, b) => candSort === "name" ? a.name.localeCompare(b.name) : candSort === "exp" ? yearsOf(b) - yearsOf(a) : b.match - a.match);
  const selected = employerCandidates.find(c => c.id === selCand) ?? null;
  const toggleIn = (list: string[], v: string) => list.includes(v) ? list.filter(x => x !== v) : [...list, v];
  const resetCandFilters = () => { setCandSel([]); setFJob(""); setFSkills([]); setFSkillQuery(""); setFLocation(""); setFAvail(""); setFExp(""); setCandQuery(""); };
  const shortlistCand = (ids: number[]) => {
    setCandStatus(prev => { const next = { ...prev }; ids.forEach(id => { next[id] = "Shortlisted"; }); return next; });
    setStatuses(prev => { const next = { ...prev }; ids.forEach(id => { next[id] = "Shortlisted"; }); return next; });
    setPicked([]);
    setNotice(ids.length === 1 ? "Candidate shortlisted" : `${ids.length} candidates shortlisted`);
    setTimeout(() => setNotice(""), 2500);
  };
  const exportCsv = () => {
    const rows = [["Name", "Role", "Location", "Experience", "Match %", "Status", "Skills"], ...candList.map(c => [c.name, c.role, c.location, c.experience, String(c.match), candStatus[c.id], c.skills.join("; ")])];
    const csv = rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "kairos-candidates.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const jobTabs = ["All", "Active", "Paused", "Closed"];
  const jobCount = (t: string) => jobs.filter(j => t === "All" || j.status === t).length;
  const jq = jobQuery.trim().toLowerCase();
  const jobList = jobs.filter(j => (jobTab === "All" || j.status === jobTab) && (!jq || [j.title, j.location, j.type].join(" ").toLowerCase().includes(jq)));
  const setJobStatus = (id: number, status: string) => setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));

  const setField = <K extends keyof JobForm>(key: K, value: JobForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setJobErrors(prev => ({ ...prev, [key]: false }));
  };
  const fieldCls = (key: string) => `w-full px-3 py-2.5 bg-[#f8f9fa] border rounded-lg text-sm focus:outline-none focus:border-[#353457] ${jobErrors[key] ? "border-red-400" : "border-[#cdccd5]"}`;
  const addSkill = () => {
    const sk = skillInput.trim();
    if (sk && !form.skills.some(x => x.toLowerCase() === sk.toLowerCase())) setField("skills", [...form.skills, sk]);
    setSkillInput("");
  };
  const focusJobForm = () => {
    titleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    titleRef.current?.focus();
  };
  const submitJob = (status: "Active" | "Draft") => {
    const required = status === "Draft" ? ["title"] : ["title", "type", "industry", "setup", ...(form.setup === "Remote" ? [] : ["city"])];
    const errs: Record<string, boolean> = {};
    required.forEach(k => { if (!String(form[k as keyof JobForm]).trim()) errs[k] = true; });
    if (Object.keys(errs).length) {
      setJobErrors(errs);
      setNotice("Please complete the highlighted fields");
      setTimeout(() => setNotice(""), 2500);
      return;
    }
    const location = form.setup === "Remote" ? "Remote" : form.city ? `${form.city}${form.setup ? ` (${form.setup})` : ""}` : "Location not set";
    setJobs(prev => [{ id: Date.now(), title: form.title.trim(), location, type: form.type || "Not set", status, matches: 0, views: 0 }, ...prev]);
    setForm(emptyJobForm);
    setSkillInput("");
    setJobErrors({});
    setJobTab("All");
    setNotice(status === "Active" ? "Job published" : "Saved as draft");
    setTimeout(() => setNotice(""), 2500);
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const id = activeChat;
    const now = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setThreads(prev => ({ ...prev, [id]: [...prev[id], { from: "me", text, time: now() }] }));
    setDraft("");
    setTimeout(() => {
      setThreads(prev => ({ ...prev, [id]: [...prev[id], { from: "them", text: "Thanks for the message! I'll get back to you shortly.", time: now() }] }));
    }, 1500);
  };

  const browse = (step: number) => {
    if (visible.length < 2) return;
    setDeckPos((index + step + visible.length) % visible.length);
  };

  const decide = (liked: boolean) => {
    if (!current) return;
    setDeck(prev => prev.filter(c => c.id !== current.id));
    if (liked) {
      setShortlisted(prev => [...prev, current.id]);
      setStatuses(prev => ({ ...prev, [current.id]: "Shortlisted" }));
    }
    setNotice(liked ? `${current.name} added to your shortlist` : `${current.name} passed`);
    setTimeout(() => setNotice(""), 2500);
  };

  const stats = [
    { label: "Interested Candidates", value: 24 },
    { label: "New Matches", value: 12 },
    { label: "In Review", value: 8 },
    { label: "Shortlisted", value: 4 + shortlisted.length },
  ];

  const glass = "bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl";

  return (
    <div className="min-h-screen lg:h-screen flex bg-gradient-to-br from-[#03012d] via-[#1b1a45] to-[#353457] text-white">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col p-5 bg-white/5 border-r border-white/10">
        <div className="mb-8 px-2">
          <p className="text-2xl font-extrabold tracking-tight">KAIROS</p>
          <p className="text-xs text-[#9a99ab]">For Employers</p>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activeNav === item.label;
            return (
              <button key={item.label} onClick={() => setActiveNav(item.label)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? "bg-white/15 text-white" : "text-[#cdccd5] hover:bg-white/10"}`}>
                <Icon size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.label === "Messages" && totalUnread > 0 && <span className="bg-[#686781] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{totalUnread}</span>}
              </button>
            );
          })}
        </nav>
        <div role="button" tabIndex={0} onClick={() => { setSection("Subscription & Billing"); setActiveNav("Settings"); }} className={`${glass} mt-auto p-4 cursor-pointer hover:bg-white/15 transition-colors`}>
          <Crown size={22} className="text-amber-300 mb-2" />
          <p className="font-bold text-sm">Upgrade to Pro Employer</p>
          <p className="text-xs text-[#cdccd5] mt-1">Get more access, featured listings and advanced filters.</p>
        </div>
        <button onClick={onBack} className="mt-4 text-sm text-[#cdccd5] hover:text-white text-left px-2">← Log Out</button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:overflow-hidden">
        {/* TOP BAR */}
        <header className="flex items-center gap-4 p-4 lg:px-6">
          <div className="relative flex-1 max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a99ab]" />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setDeckPos(0); }} placeholder="Search candidates, skills, or keywords..." className="w-full bg-white/10 border border-white/10 rounded-full py-3 pl-11 pr-4 text-sm placeholder:text-[#9a99ab] focus:outline-none focus:border-white/40" />
          </div>
          <button className="relative w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute top-2.5 right-3 w-2 h-2 bg-purple-400 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-xl bg-[#03012d] border border-white/10 flex items-center justify-center"><Building2 size={20} /></div>
            <div className="hidden sm:block leading-tight">
              <p className="font-bold text-sm">{companyName}</p>
              <p className="text-xs text-[#9a99ab]">Employer Account</p>
            </div>
            <button onClick={onBack} className="lg:hidden text-xs text-[#cdccd5] ml-2">Log Out</button>
          </div>
        </header>

        {activeNav === "Settings" ? (
          <main className="flex-1 overflow-y-auto p-4 lg:px-6 lg:pb-6">
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => { pickImage(e.target.files?.[0], setLogoUrl); e.target.value = ""; }} />
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => { pickImage(e.target.files?.[0], setCoverUrl); e.target.value = ""; }} />
            <h1 className="text-3xl font-extrabold">Settings</h1>
            <p className="text-[#cdccd5] text-sm mt-1 mb-5">Manage your account, notifications, privacy, and preferences.</p>

            <div className="grid xl:grid-cols-[210px_minmax(0,1fr)_330px] gap-4 items-start">
              <nav className="bg-white rounded-2xl p-3 text-[#03012d] shadow-2xl flex xl:flex-col gap-1 overflow-x-auto">
                {([["Account Settings", User], ["Notifications", Bell], ["Privacy & Security", Shield], ["Hiring Preferences", SlidersHorizontal], ["Subscription & Billing", CreditCard], ["Integrations", Link2], ["Help & Support", MessageCircle]] as const).map(([label, Icon]) => (
                  <button key={label} onClick={() => setSection(label)} className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${section === label ? "bg-[#353457]/10 text-[#353457] font-bold" : "text-[#686781] hover:bg-gray-50"}`}><Icon size={18} /> {label}</button>
                ))}
              </nav>

              <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl min-w-0">
                {section === "Account Settings" && (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between gap-3 border-b border-[#cdccd5]/60 pb-4">
                      <div><h2 className="text-xl font-extrabold flex items-center gap-2"><User size={20} /> Account Settings</h2><p className="text-xs text-[#686781] mt-1">Update your account information and login details.</p></div>
                      <button onClick={saveAccount} className="px-5 py-2.5 rounded-lg bg-[#353457] text-white text-sm font-bold hover:bg-[#03012d] shrink-0">Save Changes</button>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3">Profile Information</h3>
                      <div className="flex flex-wrap gap-4 mb-3">
                        <div className="relative w-24 h-24 shrink-0">
                          <div className="w-24 h-24 rounded-full bg-white border border-[#cdccd5] shadow flex items-center justify-center overflow-hidden">
                            {logoUrl ? <img src={logoUrl} alt="Company logo" className="w-full h-full object-cover" /> : <span className="text-4xl font-extrabold text-[#353457]">{company.name.charAt(0)}</span>}
                          </div>
                          <button onClick={() => logoRef.current?.click()} aria-label="Change logo" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#353457] text-white flex items-center justify-center border-2 border-white"><Camera size={14} /></button>
                        </div>
                        <div className="flex-1 min-w-[240px] grid sm:grid-cols-2 gap-3 content-start">
                          <Field label="Company Name" required><input value={acctDraft.name} onChange={(e) => setA("name", e.target.value)} className={acctCls("name")} /></Field>
                          <Field label="Industry" required>
                            <select value={acctDraft.industry} onChange={(e) => setA("industry", e.target.value)} className={acctCls("industry")}>{industryOptions.map(o => <option key={o}>{o}</option>)}</select>
                          </Field>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field label="Company Email" required><input type="email" value={acctDraft.email} onChange={(e) => setA("email", e.target.value)} className={acctCls("email")} /></Field>
                        <Field label="Contact Number" required><input value={acctDraft.phone} onChange={(e) => setA("phone", e.target.value)} className={acctCls("phone")} /></Field>
                        <Field label="Website"><input value={acctDraft.website} onChange={(e) => setA("website", e.target.value)} className={acctCls("website")} /></Field>
                        <Field label="Company Size">
                          <select value={acctDraft.size} onChange={(e) => setA("size", e.target.value)} className={acctCls("size")}>{sizeOptions.map(o => <option key={o}>{o}</option>)}</select>
                        </Field>
                        <Field label="Address" className="sm:col-span-2"><input value={acctDraft.address} onChange={(e) => setA("address", e.target.value)} className={acctCls("address")} /></Field>
                      </div>
                    </div>

                    <div className="border-t border-[#cdccd5]/60 pt-5">
                      <h3 className="font-bold mb-3 flex items-center gap-2"><Shield size={18} /> Login & Security</h3>
                      <div className="space-y-4 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1"><p className="font-semibold">Email Address</p>
                            {emailEdit === null ? <p className="text-[#686781] truncate">{company.email}</p> : <input value={emailEdit} onChange={(e) => setEmailEdit(e.target.value)} className="mt-1 w-full px-3 py-2 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />}
                          </div>
                          {emailEdit === null
                            ? <button onClick={() => setEmailEdit(company.email)} className="px-4 py-2 rounded-lg bg-[#f1f1f5] text-[#353457] text-xs font-semibold hover:bg-[#e4e4ea]">Change Email</button>
                            : <span className="flex gap-2"><button onClick={() => setEmailEdit(null)} className="text-xs text-[#686781]">Cancel</button><button onClick={saveEmail} className="px-4 py-2 rounded-lg bg-[#353457] text-white text-xs font-semibold">Save</button></span>}
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div><p className="font-semibold">Password</p><p className="text-[#686781] tracking-widest">• • • • • • • • • • • •</p></div>
                          <button onClick={() => { setPwModal(true); setPwErr(""); }} className="px-4 py-2 rounded-lg bg-[#f1f1f5] text-[#353457] text-xs font-semibold hover:bg-[#e4e4ea]">Change Password</button>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div><p className="font-semibold">Two-Factor Authentication</p><p className="text-xs text-[#686781]">Add an extra layer of security to your account.</p></div>
                          <Toggle on={twoFA} onChange={(v) => { setTwoFA(v); flash(v ? "Two-factor authentication on" : "Two-factor authentication off"); }} label="Two-factor authentication" />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#cdccd5]/60 pt-5">
                      <h3 className="font-bold flex items-center gap-2"><Link2 size={18} /> Connected Accounts</h3>
                      <p className="text-xs text-[#686781] mb-3">Link your accounts for faster access.</p>
                      <ul className="space-y-2">
                        {([["google", "Google", "G", "bg-red-500"], ["linkedin", "LinkedIn", "in", "bg-[#0077b5]"], ["github", "GitHub", "GH", "bg-[#03012d]"]] as const).map(([k, label, badge, color]) => (
                          <li key={k} className="flex items-center gap-3">
                            <span className={`w-9 h-9 rounded-lg ${color} text-white text-xs font-bold flex items-center justify-center shrink-0`}>{badge}</span>
                            <span className="font-semibold text-sm w-24">{label}</span>
                            <span className={`flex-1 text-xs font-semibold ${connected[k] ? "text-emerald-600" : "text-[#9a99ab]"}`}>{connected[k] ? "● Connected" : "Not connected"}</span>
                            <button onClick={() => { setConnected(prev => ({ ...prev, [k]: !prev[k] })); flash(connected[k] ? `${label} disconnected` : `${label} connected`); }} className="px-4 py-2 rounded-lg bg-[#f1f1f5] text-[#353457] text-xs font-semibold hover:bg-[#e4e4ea] w-28">{connected[k] ? "Disconnect" : "Connect"}</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {section === "Notifications" && (
                  <div className="space-y-6">
                    <div className="border-b border-[#cdccd5]/60 pb-4">
                      <h2 className="text-xl font-extrabold flex items-center gap-2"><Bell size={20} /> Notifications</h2>
                      <p className="text-xs text-[#686781] mt-1">Choose what notifications you want to receive and how.</p>
                    </div>
                    <div>
                      <h3 className="font-bold">Notification Channels</h3>
                      <p className="text-xs text-[#686781] mb-2">Receive notifications through your preferred channels.</p>
                      <div className="space-y-2">
                        {([["inapp", "In-App Notifications", "Get notifications within the platform", Monitor], ["email", "Email Notifications", "Receive updates via email", Mail], ["push", "Push Notifications", "Get instant alerts on your device", Smartphone]] as const).map(([k, title, desc, Icon]) => (
                          <div key={k} className="flex items-center gap-3 border border-[#cdccd5]/60 rounded-xl px-4 py-3">
                            <Icon size={20} className="text-[#353457] shrink-0" />
                            <div className="flex-1 min-w-0"><p className="text-sm font-semibold">{title}</p><p className="text-xs text-[#686781]">{desc}</p></div>
                            <Toggle on={channels[k]} onChange={(v) => setChannels(prev => ({ ...prev, [k]: v }))} label={title} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold">Notification Types</h3>
                      <p className="text-xs text-[#686781] mb-2">Configure notifications for different activities.</p>
                      <div className="border border-[#cdccd5]/60 rounded-xl px-4 divide-y divide-[#cdccd5]/50">{notifRowsFor(undefined, true)}</div>
                    </div>
                  </div>
                )}

                {section === "Privacy & Security" && (
                  <div className="space-y-6">
                    <div className="border-b border-[#cdccd5]/60 pb-4">
                      <h2 className="text-xl font-extrabold flex items-center gap-2"><Shield size={20} /> Privacy & Security</h2>
                      <p className="text-xs text-[#686781] mt-1">Control your data, privacy settings, and account security.</p>
                    </div>

                    <div>
                      <h3 className="font-bold flex items-center gap-2"><Eye size={18} /> Profile Visibility</h3>
                      <p className="text-xs text-[#686781] mb-3">Manage what information is visible to job seekers and other employers.</p>
                      <div className="space-y-2" role="radiogroup" aria-label="Profile visibility">
                        {([["visible", "Visible to job seekers", "Your company profile, job postings, and basic information will be visible to all job seekers."], ["limited", "Limited visibility", "Only show your company name and selected job postings."], ["hidden", "Hidden from job seekers", "Your company profile will not appear in search results. Only candidates you interact with can see your profile."]] as const).map(([k, title, desc]) => (
                          <button key={k} role="radio" aria-checked={visibility === k} onClick={() => { if (visibility !== k) { setVisibility(k); flash("Profile visibility updated"); } }} className={`w-full flex items-start gap-3 text-left border rounded-xl px-4 py-3 transition-colors ${visibility === k ? "border-[#353457] bg-[#353457]/5" : "border-[#cdccd5]/60 hover:bg-gray-50"}`}>
                            <span className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${visibility === k ? "border-[#353457]" : "border-[#9a99ab]"}`}>{visibility === k && <span className="w-2.5 h-2.5 rounded-full bg-[#353457]"></span>}</span>
                            <span><span className="block text-sm font-semibold">{title}</span><span className="block text-xs text-[#686781]">{desc}</span></span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#cdccd5]/60 pt-5">
                      <h3 className="font-bold flex items-center gap-2"><Shield size={18} /> Account Security</h3>
                      <p className="text-xs text-[#686781] mb-2">Keep your account safe and secure.</p>
                      <div className="divide-y divide-[#cdccd5]/50">
                        <div className="flex items-center gap-3 py-3"><Lock size={20} className="text-[#353457] shrink-0" /><div className="flex-1"><p className="text-sm font-semibold">Password</p><p className="text-xs text-[#686781]">Last changed: {pwChangedOn}</p></div><button onClick={() => { setPwModal(true); setPwErr(""); }} className="px-4 py-2 rounded-lg bg-[#f1f1f5] text-[#353457] text-xs font-semibold hover:bg-[#e4e4ea]">Change Password</button></div>
                        <div className="flex items-center gap-3 py-3"><Smartphone size={20} className="text-[#353457] shrink-0" /><div className="flex-1"><p className="text-sm font-semibold">Two-Factor Authentication</p><p className="text-xs text-[#686781]">Add an extra layer of security to your account.</p></div><Toggle on={twoFA} onChange={(v) => { setTwoFA(v); flash(v ? "Two-factor authentication on" : "Two-factor authentication off"); }} label="Two-factor authentication" /></div>
                        {privRow(Monitor, "Login Sessions", "Manage your active login sessions.", () => setPrivModal("sessions"))}
                        <div className="flex items-center gap-3 py-3"><Bell size={20} className="text-[#353457] shrink-0" /><div className="flex-1"><p className="text-sm font-semibold">Login Alerts</p><p className="text-xs text-[#686781]">Get notified of new logins from unrecognized devices.</p></div><Toggle on={loginAlerts} onChange={setLoginAlerts} label="Login alerts" /></div>
                      </div>
                    </div>

                    <div className="border-t border-[#cdccd5]/60 pt-5">
                      <h3 className="font-bold flex items-center gap-2"><Eye size={18} /> Privacy Preferences</h3>
                      <p className="text-xs text-[#686781] mb-2">Control what information you share and how you're contacted.</p>
                      <div className="divide-y divide-[#cdccd5]/50">
                        <div className="flex items-center gap-3 py-3"><MessageCircle size={20} className="text-[#353457] shrink-0" /><div className="flex-1"><p className="text-sm font-semibold">Allow messages from candidates</p><p className="text-xs text-[#686781]">Let candidates message you about job postings.</p></div><Toggle on={allowMessages} onChange={setAllowMessages} label="Allow messages from candidates" /></div>
                        <div className="flex items-center gap-3 py-3"><Users size={20} className="text-[#353457] shrink-0" /><div className="flex-1"><p className="text-sm font-semibold">Show company team members</p><p className="text-xs text-[#686781]">Display team members on your company profile.</p></div><Toggle on={showTeam} onChange={setShowTeam} label="Show company team members" /></div>
                      </div>
                    </div>
                  </div>
                )}

                {section === "Hiring Preferences" && (
                  <div className="space-y-5">
                    <div className="border-b border-[#cdccd5]/60 pb-4">
                      <h2 className="text-xl font-extrabold flex items-center gap-2"><SlidersHorizontal size={20} /> Hiring Preferences</h2>
                      <p className="text-xs text-[#686781] mt-1">Set your hiring criteria and preferences to get better matches.</p>
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {hireTabs.map(t => (
                        <button key={t} onClick={() => setHireTab(t)} className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${hireTab === t ? "bg-[#353457] text-white" : "bg-[#cdccd5]/30 text-[#353457] hover:bg-[#cdccd5]/50"}`}>{t}</button>
                      ))}
                    </div>

                    {hireTab === "General Preferences" && (
                      <div className="space-y-5">
                        <div>
                          <h3 className="font-bold text-sm">Preferred Roles</h3>
                          <p className="text-xs text-[#686781] mb-2">Select job roles you frequently hire for.</p>
                          <div className="flex flex-wrap items-center gap-1.5 border border-[#cdccd5]/60 rounded-xl p-2.5">
                            {prefs.roles.map(r => (
                              <span key={r} className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-[#353457]/10 text-[#353457] rounded-lg">{r}<button onClick={() => setPrefs(prev => ({ ...prev, roles: prev.roles.filter(x => x !== r) }))} aria-label={`Remove ${r}`}><X size={12} /></button></span>
                            ))}
                            <select value="" onChange={(e) => { const v = e.target.value; if (v) setPrefs(prev => ({ ...prev, roles: [...prev.roles, v] })); }} aria-label="Add role" className="text-xs bg-transparent text-[#686781] focus:outline-none ml-auto">
                              <option value="">+ Add role</option>{roleOptions.map(r => <option key={r}>{r}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">Hiring Priority</h3>
                          <p className="text-xs text-[#686781] mb-2">What's most important to you when reviewing candidates?</p>
                          <div className="flex flex-wrap gap-2">
                            {["Skills Match", "Experience", "Cultural Fit", "Availability"].map(o => (
                              <button key={o} onClick={() => setPrefs(prev => ({ ...prev, priority: o }))} aria-pressed={prefs.priority === o} className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${prefs.priority === o ? "bg-[#353457] text-white border-[#353457]" : "border-[#cdccd5] text-[#353457] hover:bg-gray-50"}`}>{prefs.priority === o ? "✓ " : ""}{o}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">Number of Candidates to See Daily</h3>
                          <p className="text-xs text-[#686781] mb-2">Set how many new candidates to show on your feed.</p>
                          <div className="flex items-center gap-3">
                            <input type="range" min={5} max={50} step={5} value={prefs.dailyCount} onChange={(e) => setPrefs(prev => ({ ...prev, dailyCount: Number(e.target.value) }))} className="flex-1" aria-label="Candidates per day" />
                            <span className="text-sm font-semibold w-28 text-right">{prefs.dailyCount} candidates</span>
                          </div>
                        </div>
                        <div className="rounded-2xl bg-gradient-to-r from-[#353457]/10 to-purple-100 p-4 flex items-center gap-4">
                          <Lightbulb size={32} className="text-[#353457] shrink-0" />
                          <div><p className="font-extrabold">Smarter Matches, Better Hires</p><p className="text-xs text-[#686781]">Set your preferences so we can show you only the most relevant and qualified candidates.</p></div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">{workSetupCard}{locationsCard}</div>
                        {salaryCard}
                      </div>
                    )}

                    {hireTab === "Candidate Criteria" && (
                      <div className="space-y-5">
                        <div>
                          <h3 className="font-bold text-sm">Minimum match score: <span className="text-[#353457]">{prefs.minMatch}%</span></h3>
                          <p className="text-xs text-[#686781] mb-2">Candidates below this score are hidden from your Home feed (when the filters on the right are on).</p>
                          <input type="range" min={50} max={100} step={5} value={prefs.minMatch} onChange={(e) => setPrefs(prev => ({ ...prev, minMatch: Number(e.target.value) }))} className="w-full" aria-label="Minimum match score" />
                        </div>
                        <div className="flex items-center gap-3"><div className="flex-1"><p className="text-sm font-semibold">Open to fresh graduates</p><p className="text-xs text-[#686781]">Include candidates with little or no work experience.</p></div><Toggle on={prefs.freshGrads} onChange={(v) => setPrefs(prev => ({ ...prev, freshGrads: v }))} label="Open to fresh graduates" /></div>
                      </div>
                    )}

                    {hireTab === "Skills & Experience" && (
                      <div className="space-y-5">
                        <div>
                          <h3 className="font-bold text-sm">Required Skills</h3>
                          <p className="text-xs text-[#686781] mb-2">Skills candidates should have.</p>
                          <div className="flex gap-2">
                            <input value={prefSkill} onChange={(e) => setPrefSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChip("skills", prefSkill, () => setPrefSkill("")); } }} placeholder="Add a skill (e.g. Figma)" className="flex-1 px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />
                            <button onClick={() => addChip("skills", prefSkill, () => setPrefSkill(""))} className="px-5 rounded-lg bg-[#353457] text-white text-sm font-semibold hover:bg-[#03012d]">Add</button>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">{prefs.skills.map(sk => <span key={sk} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-[#353457]/10 text-[#353457] rounded-full">{sk}<button onClick={() => setPrefs(prev => ({ ...prev, skills: prev.skills.filter(x => x !== sk) }))} aria-label={`Remove ${sk}`}><X size={12} /></button></span>)}</div>
                        </div>
                        <Field label="Experience level">
                          <select value={prefs.experience} onChange={(e) => setPrefs(prev => ({ ...prev, experience: e.target.value }))} className="w-full sm:w-64 px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none"><option>Any</option><option>0-1 years</option><option>2-3 years</option><option>4+ years</option></select>
                        </Field>
                      </div>
                    )}

                    {hireTab === "Education & Certifications" && (
                      <div className="space-y-5">
                        <Field label="Minimum education">
                          <select value={prefs.education} onChange={(e) => setPrefs(prev => ({ ...prev, education: e.target.value }))} className="w-full sm:w-64 px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none"><option>Any</option><option>High school</option><option>Bachelor's degree</option><option>Master's degree</option></select>
                        </Field>
                        <div>
                          <h3 className="font-bold text-sm">Preferred Certifications</h3>
                          <p className="text-xs text-[#686781] mb-2">Optional. Candidates with these stand out.</p>
                          <div className="flex gap-2">
                            <input value={prefCert} onChange={(e) => setPrefCert(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChip("certs", prefCert, () => setPrefCert("")); } }} placeholder="e.g. AWS Cloud Practitioner" className="flex-1 px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />
                            <button onClick={() => addChip("certs", prefCert, () => setPrefCert(""))} className="px-5 rounded-lg bg-[#353457] text-white text-sm font-semibold hover:bg-[#03012d]">Add</button>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">{prefs.certs.map(c => <span key={c} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-[#353457]/10 text-[#353457] rounded-full">{c}<button onClick={() => setPrefs(prev => ({ ...prev, certs: prev.certs.filter(x => x !== c) }))} aria-label={`Remove ${c}`}><X size={12} /></button></span>)}</div>
                        </div>
                      </div>
                    )}

                    {hireTab === "Work Setup & Location" && <div className="grid sm:grid-cols-2 gap-3">{workSetupCard}{locationsCard}</div>}
                    {hireTab === "Salary Range" && salaryCard}
                    {hireTab === "Diversity & Inclusion" && (
                      <div className="divide-y divide-[#cdccd5]/50">
                        {prefToggle("diversity", "inclusiveLanguage", "Use inclusive language", "Keep job posts and match summaries free of biased wording.")}
                        {prefToggle("diversity", "blindScreening", "Blind screening", "Hide names and photos until you shortlist a candidate.")}
                        {prefToggle("diversity", "underrepresented", "Welcome underrepresented groups", "Show that your company encourages all qualified applicants.")}
                      </div>
                    )}
                    {hireTab === "Auto-Match Settings" && (
                      <div className="divide-y divide-[#cdccd5]/50">
                        {prefToggle("autoMatch", "on", "Auto-match", "Automatically surface candidates who fit your preferences.")}
                        {prefToggle("autoMatch", "autoShortlist", "Auto-shortlist top matches", "Shortlist candidates with a 90%+ match.")}
                        {prefToggle("autoMatch", "autoInvite", "Auto-send interview invites", "Invite shortlisted candidates to interview automatically.")}
                      </div>
                    )}
                  </div>
                )}

                {section === "Subscription & Billing" && (
                  <div className="space-y-6">
                    <div className="border-b border-[#cdccd5]/60 pb-4">
                      <h2 className="text-xl font-extrabold flex items-center gap-2"><CreditCard size={20} /> Subscription & Billing</h2>
                      <p className="text-xs text-[#686781] mt-1">Manage your plan, payment method, and billing history.</p>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div><h3 className="font-bold">Choose a Plan</h3><p className="text-xs text-[#686781]">Upgrade or downgrade your plan anytime. Get more features to hire faster and smarter.</p></div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Save 20%</span>
                          <div className="flex bg-[#f1f1f5] rounded-full p-1">
                            {["Monthly", "Yearly"].map(c => <button key={c} onClick={() => setBillCycle(c)} aria-pressed={billCycle === c} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${billCycle === c ? "bg-[#353457] text-white" : "text-[#686781]"}`}>{c}</button>)}
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3 pt-2">
                        {planOrder.map(name => {
                          const d = planData[name];
                          const current = subPlan === name;
                          const popular = name === "Pro";
                          const higher = planOrder.indexOf(name) > planOrder.indexOf(subPlan);
                          return (
                            <div key={name} className={`relative rounded-2xl border p-4 flex flex-col ${popular ? "border-[#353457] ring-2 ring-[#353457]/20" : "border-[#cdccd5]/70"}`}>
                              {popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#353457] text-white text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">Most Popular</span>}
                              <h4 className="font-extrabold">{name}</h4>
                              <p className="text-xs text-[#686781]">{d.tagline}</p>
                              <p className="mt-3"><span className="text-2xl font-extrabold">{peso(planMonthly(name, billCycle))}</span><span className="text-xs text-[#686781]"> / month</span></p>
                              {billCycle === "Yearly" && d.price > 0 && <p className="text-[11px] text-[#9a99ab]">Billed {peso(planCost(name, "Yearly"))} yearly</p>}
                              <ul className="mt-3 space-y-1.5 text-xs flex-1">{d.features.map(f => <li key={f} className="flex gap-2"><span className="text-[#353457] font-bold">&#10003;</span>{f}</li>)}</ul>
                              <button onClick={() => openCheckout(name)} disabled={current} className={`mt-4 w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${current ? "border border-[#cdccd5] text-[#9a99ab] cursor-default" : popular ? "bg-[#353457] text-white hover:bg-[#03012d]" : "border border-[#353457] text-[#353457] hover:bg-[#353457]/10"}`}>
                                {current ? "Current Plan" : name === "Free" ? "Downgrade to Free" : higher ? `Upgrade to ${name}` : `Switch to ${name}`}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border border-[#cdccd5]/60 rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div><h3 className="font-bold flex items-center gap-2"><CreditCard size={18} /> Current Plan Details</h3><p className="text-xs text-[#686781]">View your plan information and usage.</p></div>
                        <button onClick={() => setManageOpen(true)} className="px-4 py-2 rounded-lg bg-[#f1f1f5] text-[#353457] text-xs font-semibold hover:bg-[#e4e4ea]">Manage Plan</button>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[170px_1fr] gap-3 text-sm border-b border-[#cdccd5]/40 pb-2"><span className="text-[#686781]">Plan</span><span className="font-semibold">{subPlan} Plan</span></div>
                        <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[170px_1fr] gap-3 text-sm border-b border-[#cdccd5]/40 pb-2"><span className="text-[#686781]">Billing Cycle</span><span className="font-semibold">{subPlan === "Free" ? "No billing required" : subCycle}</span></div>
                        <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[170px_1fr] gap-3 text-sm border-b border-[#cdccd5]/40 pb-2"><span className="text-[#686781]">Next Billing Date</span><span className="font-semibold">{nextBilling || "\u2014"}</span></div>
                        {usageBar("Active Job Postings", activeJobs, limits.jobLimit)}
                        {usageBar("Candidate Views (This Month)", viewsUsed, limits.viewLimit)}
                      </div>
                      {subPlan === "Free" && activeJobs >= limits.jobLimit && (
                        <p className="text-xs text-red-600 font-medium mt-3">You've reached your plan limit of {limits.jobLimit} active job postings. Upgrade to Pro for unlimited postings.</p>
                      )}
                    </div>
                  </div>
                )}

                {section === "Integrations" && (
                  <div>
                    <h2 className="text-xl font-extrabold">Integrations</h2>
                    <p className="text-sm text-[#686781] mt-2">Calendar and applicant-tracking integrations are coming next. Your Google and LinkedIn sign-in links are under Account Settings.</p>
                  </div>
                )}

                {section === "Help & Support" && (
                  <div className="space-y-6">
                    <div className="border-b border-[#cdccd5]/60 pb-4">
                      <h2 className="text-xl font-extrabold">Help & Support</h2>
                      <p className="text-xs text-[#686781] mt-1">Get the help you need. We're here for you.</p>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-r from-[#353457]/10 to-purple-100 p-5">
                      <h3 className="text-xl font-extrabold">How can we help you?</h3>
                      <p className="text-sm text-[#686781] mt-1 mb-3">Find quick answers, browse our guides, or contact our support team.</p>
                      <div className="relative">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99ab]" />
                        <input value={helpQuery} onChange={(e) => setHelpQuery(e.target.value)} placeholder="Search help articles, topics, or keywords..." className="w-full bg-white border border-[#cdccd5] rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#353457]" />
                      </div>
                    </div>

                    {showHelpResults ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold">{helpTopic ? helpTopic : "Search results"} <span className="text-xs font-normal text-[#686781]">({helpResults.length})</span></h3>
                          <button onClick={() => { setHelpQuery(""); setHelpTopic(null); }} className="text-xs font-semibold text-[#353457] hover:underline">Clear</button>
                        </div>
                        {helpResults.length === 0 ? (
                          <div className="border border-dashed border-[#cdccd5] rounded-xl p-6 text-center"><p className="text-sm font-semibold">No articles found.</p><p className="text-xs text-[#686781] mt-1">Try different words, or contact our support team.</p><button onClick={() => openTicket("message")} className="mt-3 px-4 py-2 rounded-lg bg-[#353457] text-white text-xs font-bold">Contact support</button></div>
                        ) : (
                          <ul className="divide-y divide-[#cdccd5]/50 border border-[#cdccd5]/60 rounded-xl">
                            {helpResults.map(a => (
                              <li key={a.id}><button onClick={() => setHelpModal({ kind: "article", id: a.id })} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"><span className="flex-1 min-w-0"><span className="block text-sm font-semibold">{a.title}</span><span className="block text-xs text-[#686781]">{a.topic}</span></span><ChevronRight size={18} className="text-[#9a99ab]" /></button></li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-bold">Quick Help Topics</h3>
                        <p className="text-xs text-[#686781] mb-3">Browse common topics to find answers quickly.</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {helpTopics.map(t => { const Icon = t.icon; return (
                            <button key={t.name} onClick={() => setHelpTopic(t.name)} className="flex items-center gap-3 border border-[#cdccd5]/60 rounded-xl p-3 text-left hover:bg-gray-50">
                              <span className="w-10 h-10 rounded-full bg-[#353457]/10 text-[#353457] flex items-center justify-center shrink-0"><Icon size={18} /></span>
                              <span className="flex-1 min-w-0"><span className="block text-sm font-bold">{t.name}</span><span className="block text-xs text-[#686781]">{t.desc}</span></span>
                              <ChevronRight size={18} className="text-[#9a99ab] shrink-0" />
                            </button>
                          ); })}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold">Additional Resources</h3>
                      <p className="text-xs text-[#686781] mb-3">Explore more ways to get the most out of KAIROS.</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {([["User Guide", "Step-by-step tutorials for employers", () => { setHelpQuery(""); setHelpTopic("All Guides"); }, Briefcase], ["Video Tutorials", "Watch quick guides and demos", () => flash("Video tutorials are coming soon"), CalendarDays], ["Community Forum", "Get tips from other employers", () => flash("The community forum is coming soon"), Users], ["FAQs", "Browse frequently asked questions", () => { setFaqOpen(0); setHelpModal({ kind: "faq" }); }, MessageCircle]] as const).map(([name, desc, onClick, Icon]) => (
                          <button key={name} onClick={onClick} className="flex items-center gap-3 border border-[#cdccd5]/60 rounded-xl p-3 text-left hover:bg-gray-50">
                            <span className="w-10 h-10 rounded-full bg-[#353457]/10 text-[#353457] flex items-center justify-center shrink-0"><Icon size={18} /></span>
                            <span className="flex-1 min-w-0"><span className="block text-sm font-bold">{name}</span><span className="block text-xs text-[#686781]">{desc}</span></span>
                            <ChevronRight size={18} className="text-[#9a99ab] shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {tickets.length > 0 && (
                      <div>
                        <h3 className="font-bold mb-2">Your Support Requests</h3>
                        <ul className="space-y-2">
                          {tickets.map(t => (
                            <li key={t.id} className="flex items-center gap-3 border border-[#cdccd5]/60 rounded-xl px-4 py-3">
                              <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{t.subject}</p><p className="text-xs text-[#686781]">{t.id} &#8226; {t.kind} &#8226; {t.created}</p></div>
                              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">{t.status}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* RIGHT COLUMN */}
              <div className="space-y-4 min-w-0">
                {section === "Help & Support" ? (
                  <>
                    <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                      <h3 className="font-extrabold">Contact Support</h3>
                      <p className="text-xs text-[#686781] mb-2">Still need help? Reach out to our support team.</p>
                      <div className="divide-y divide-[#cdccd5]/50">
                        {([["Send us a message", "Get support by email. We reply within 1 business day.", () => openTicket("message"), Mail], ["Live Chat", "Chat with our support team. Available Mon - Fri, 9AM - 6PM (PHT)", () => { if (chatOnline()) openTicket("chat"); else flash("Live chat is offline right now. Send us a message instead."); }, MessageCircle], ["Request a Call", "Schedule a call with our support team", () => openTicket("call"), Smartphone]] as const).map(([title, desc, onClick, Icon]) => (
                          <button key={title} onClick={onClick} className="w-full flex items-center gap-3 py-3 text-left hover:bg-gray-50 rounded-lg px-1">
                            <Icon size={20} className="text-[#353457] shrink-0" />
                            <span className="flex-1 min-w-0"><span className="block text-sm font-semibold">{title}{title === "Live Chat" && <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${chatOnline() ? "bg-emerald-100 text-emerald-700" : "bg-[#f1f1f5] text-[#686781]"}`}>{chatOnline() ? "Online" : "Offline"}</span>}</span><span className="block text-xs text-[#686781]">{desc}</span></span>
                            <ChevronRight size={18} className="text-[#9a99ab] shrink-0" />
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                      <h3 className="font-extrabold">Popular Articles</h3>
                      <p className="text-xs text-[#686781] mb-2">Most helpful guides from our Help Center.</p>
                      <ul className="divide-y divide-[#cdccd5]/50">
                        {popularArticleIds.map(id => { const a = helpArticles.find(x => x.id === id)!; return (
                          <li key={id}><button onClick={() => setHelpModal({ kind: "article", id })} className="w-full flex items-center gap-3 py-3 text-left text-sm hover:bg-gray-50 px-1"><span className="flex-1">{a.title}</span><ChevronRight size={18} className="text-[#9a99ab] shrink-0" /></button></li>
                        ); })}
                      </ul>
                    </section>
                  </>
                ) : section === "Subscription & Billing" ? (
                  <>
                    <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div><h3 className="font-extrabold">Payment Method</h3><p className="text-xs text-[#686781]">Manage your payment method for future billing.</p></div>
                        <button onClick={() => { setCardErr({}); setCardModal(true); }} className="px-3 py-2 rounded-lg bg-[#353457] text-white text-xs font-bold hover:bg-[#03012d] shrink-0">Add Payment Method</button>
                      </div>
                      {cards.length === 0 ? (
                        <div className="border border-dashed border-[#cdccd5] rounded-xl p-4 text-center"><p className="text-sm font-semibold">No payment method added yet.</p><p className="text-xs text-[#686781] mt-1">Add a credit/debit card or other payment method to subscribe to a plan.</p></div>
                      ) : (
                        <ul className="space-y-2">
                          {cards.map(c => (
                            <li key={c.id} className="flex items-center gap-3 border border-[#cdccd5]/60 rounded-xl p-3">
                              <span className="w-10 h-8 rounded-md bg-[#353457] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{c.brand.slice(0, 4).toUpperCase()}</span>
                              <div className="flex-1 min-w-0"><p className="text-sm font-semibold">{c.brand} &#8226;&#8226;&#8226;&#8226; {c.last4}</p><p className="text-xs text-[#686781]">{c.name} &#8226; Expires {c.exp}</p></div>
                              <button onClick={() => { setCards(prev => prev.filter(x => x.id !== c.id)); flash("Payment method removed"); }} className="text-xs text-[#686781] hover:text-red-500">Remove</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>

                    <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                      <h3 className="font-extrabold">Billing History</h3>
                      <p className="text-xs text-[#686781] mb-3">View your past payments and invoices.</p>
                      {invoices.length === 0 ? (
                        <div className="border border-dashed border-[#cdccd5] rounded-xl p-4 text-center"><p className="text-sm font-semibold">No billing history yet.</p><p className="text-xs text-[#686781] mt-1">Your invoices and payment history will appear here once you subscribe to a paid plan.</p></div>
                      ) : (
                        <ul className="space-y-2">
                          {invoices.map(inv => (
                            <li key={inv.id} className="flex items-center gap-3 border border-[#cdccd5]/60 rounded-xl p-3">
                              <div className="flex-1 min-w-0"><p className="text-sm font-semibold">{inv.desc}</p><p className="text-xs text-[#686781]">{inv.id} &#8226; {inv.date} &#8226; {peso(inv.amount)}</p></div>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{inv.status}</span>
                              <button onClick={() => downloadInvoice(inv)} className="text-xs font-semibold text-[#353457] hover:underline">Download</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  </>
                ) : section === "Hiring Preferences" ? (
                  <>
                    <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                      <h3 className="font-extrabold">Quick Preferences</h3>
                      <p className="text-xs text-[#686781] mb-1">Enable quick filters to find your ideal candidates.</p>
                      <div className="divide-y divide-[#cdccd5]/50">
                        {quickItems.map(it => { const Icon = it.icon; return (
                          <div key={it.k} className="flex items-center gap-3 py-2.5"><Icon size={18} className="text-[#353457] shrink-0" /><p className="flex-1 text-sm">{it.label}</p><Toggle on={prefs.quick[it.k]} onChange={(v) => setQuick(it.k, v)} label={it.label} /></div>
                        ); })}
                      </div>
                    </section>
                    <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                      <h3 className="font-extrabold">Auto-Screening</h3>
                      <p className="text-xs text-[#686781] mb-1">Set automatic filters to only see qualified candidates.</p>
                      <div className="divide-y divide-[#cdccd5]/50">
                        {screenItems.map(it => { const Icon = it.icon; return (
                          <div key={it.k} className="flex items-center gap-3 py-2.5"><Icon size={18} className="text-[#353457] shrink-0" /><p className="flex-1 text-sm">{it.label}</p><Toggle on={prefs.screening[it.k]} onChange={(v) => setScreen(it.k, v)} label={it.label} /></div>
                        ); })}
                      </div>
                    </section>
                  </>
                ) : section === "Privacy & Security" ? (
                  <>
                    <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                      <h3 className="font-extrabold flex items-center gap-2"><Lock size={18} /> Data & Privacy</h3>
                      <p className="text-xs text-[#686781] mb-1">Manage how your data is used on KAIROS.</p>
                      <div className="divide-y divide-[#cdccd5]/50">
                        {privRow(FileText, "Data Usage", "Manage how we use your data", () => setPrivModal("usage"))}
                        {privRow(Download, dataRequested ? "Data request sent" : "Download My Data", dataRequested ? `We'll email a download link to ${company.email}` : "Request a copy of your company data", () => { if (!dataRequested) { setDataRequested(true); flash("Data request received"); } })}
                        {privRow(Trash2, "Delete Account", "Permanently delete your account and data", () => { setDelText(""); setDelModal(true); }, true)}
                        {privRow(Cookie, "Cookies & Tracking", "Manage cookie preferences", () => setPrivModal("cookies"))}
                      </div>
                    </section>

                    <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                      <h3 className="font-extrabold flex items-center gap-2"><Ban size={18} /> Blocked Users</h3>
                      <p className="text-xs text-[#686781] mb-1">Manage users you've blocked.</p>
                      {privRow(Users, "View Blocked Users", blocked.length ? `${blocked.length} blocked. Unblock or manage candidates.` : "No blocked candidates.", () => setPrivModal("blocked"))}
                    </section>

                    <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                      <h3 className="font-extrabold flex items-center gap-2"><Clock size={18} /> Security Activity</h3>
                      <p className="text-xs text-[#686781] mb-2">Recent account activity for your security.</p>
                      <ul className="space-y-3">
                        {sessions.slice(0, 3).map(se => (
                          <li key={se.id} className="flex items-center gap-3">
                            {se.device.includes("iPhone") || se.device.includes("iPad") ? <Smartphone size={20} className="text-[#353457] shrink-0" /> : <Monitor size={20} className="text-[#353457] shrink-0" />}
                            <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{se.device}</p><p className="text-[11px] text-[#686781]">{se.place} • {se.when}</p></div>
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${se.tag === "Current" ? "bg-emerald-100 text-emerald-700" : "bg-[#f1f1f5] text-[#686781]"}`}>{se.tag}</span>
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => setPrivModal("sessions")} className="w-full flex items-center justify-between mt-3 px-4 py-3 border border-[#cdccd5]/60 rounded-xl text-sm font-semibold text-[#353457] hover:bg-gray-50">View All Activity <ChevronRight size={18} /></button>
                    </section>
                  </>
                ) : section === "Notifications" ? (
                  <>
                    <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                      <h3 className="font-extrabold flex items-center gap-2"><Bell size={18} /> Notification Preview</h3>
                      <p className="text-xs text-[#686781] mb-3">Here's how your notifications will look.</p>
                      {!channels.inapp ? <p className="text-xs text-[#686781] py-4 text-center">In-app notifications are off.</p>
                        : previewItems.length === 0 ? <p className="text-xs text-[#686781] py-4 text-center">All notification types are off.</p>
                        : (
                          <ul className="space-y-2">
                            {previewItems.map(n => {
                              const Icon = n.icon;
                              return (
                                <li key={n.k} className="flex items-start gap-3 bg-[#f8f9fa] rounded-xl p-3">
                                  <Icon size={20} className="text-[#353457] shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0"><p className="text-sm font-bold">{n.title}</p><p className="text-xs text-[#686781]">{n.text}</p></div>
                                  <div className="text-right shrink-0"><p className="text-[11px] text-[#9a99ab]">{n.ago}</p><span className="inline-block w-2 h-2 bg-[#353457] rounded-full mt-1"></span></div>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                    </section>

                    <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                      <div className="flex items-start gap-3">
                        <Moon size={20} className="text-[#353457] shrink-0 mt-0.5" />
                        <div className="flex-1"><h3 className="font-extrabold">Quiet Hours</h3><p className="text-xs text-[#686781]">Turn off non-urgent notifications during specific hours.</p></div>
                        <Toggle on={quiet.on} onChange={(v) => setQuiet(prev => ({ ...prev, on: v }))} label="Quiet hours" />
                      </div>
                      <div className={`mt-3 ${quiet.on ? "" : "opacity-50 pointer-events-none"}`}>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Start Time">
                            <select value={quiet.start} onChange={(e) => setQuiet(prev => ({ ...prev, start: e.target.value }))} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">{hourOptions.map(h => <option key={h} value={h}>{fmtTime(h)}</option>)}</select>
                          </Field>
                          <Field label="End Time">
                            <select value={quiet.end} onChange={(e) => setQuiet(prev => ({ ...prev, end: e.target.value }))} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">{hourOptions.map(h => <option key={h} value={h}>{fmtTime(h)}</option>)}</select>
                          </Field>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                            <button key={d} onClick={() => setQuiet(prev => ({ ...prev, days: prev.days.includes(i) ? prev.days.filter(x => x !== i) : [...prev.days, i] }))} aria-pressed={quiet.days.includes(i)} className={`w-11 h-11 rounded-full text-xs font-semibold transition-colors ${quiet.days.includes(i) ? "bg-[#353457] text-white" : "bg-[#f1f1f5] text-[#686781]"}`}>{d}</button>
                          ))}
                        </div>
                      </div>
                    </section>

                    <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                      <div className="flex items-start gap-3 mb-3">
                        <Clock size={20} className="text-[#353457] shrink-0 mt-0.5" />
                        <div><h3 className="font-extrabold">Notification Frequency</h3><p className="text-xs text-[#686781]">Choose how often you want to receive email digests.</p></div>
                      </div>
                      <select value={frequency} onChange={(e) => setFrequency(e.target.value)} aria-label="Notification frequency" className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">
                        <option>Immediate (Real-time)</option><option>Hourly digest</option><option>Daily digest</option><option>Weekly digest</option>
                      </select>
                      {!channels.email && <p className="text-xs text-amber-600 mt-2">Email notifications are off, so digests won't be sent.</p>}
                    </section>
                  </>
                ) : (
                  <>
                    <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                  <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold">Profile Preview</h3><button onClick={() => setActiveNav("Company Profile")} className="text-xs font-semibold text-[#353457] hover:underline">View Public Profile</button></div>
                  <div className="relative h-28 rounded-xl overflow-hidden bg-gradient-to-r from-[#353457] via-[#686781] to-purple-300" style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                    <button onClick={() => coverRef.current?.click()} className="absolute bottom-2 right-2 flex items-center gap-1 bg-[#03012d]/70 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg"><Camera size={12} /> Change Cover</button>
                  </div>
                  <div className="flex gap-3 -mt-6 px-2">
                    <div className="w-16 h-16 rounded-xl bg-white border border-[#cdccd5] shadow flex items-center justify-center overflow-hidden shrink-0">
                      {logoUrl ? <img src={logoUrl} alt="Company logo" className="w-full h-full object-cover" /> : <span className="text-2xl font-extrabold text-[#353457]">{company.name.charAt(0)}</span>}
                    </div>
                    <div className="pt-7 min-w-0"><p className="font-extrabold flex items-center gap-1.5 truncate">{company.name} <BadgeCheck size={16} className="text-[#686781] shrink-0" /></p></div>
                  </div>
                  <div className="text-xs text-[#686781] space-y-1 mt-3 px-2">
                    <p>{company.industry}</p>
                    <p className="flex items-center gap-1"><MapPin size={12} /> {company.city}</p>
                    <p className="flex items-center gap-1"><Users size={12} /> {company.size}</p>
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                  <h3 className="font-extrabold">Notification Preferences</h3>
                  <p className="text-xs text-[#686781] mb-1">Choose what notifications you want to receive.</p>
                  <div className="divide-y divide-[#cdccd5]/50">{notifRows}</div>
                </section>

                <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                  <h3 className="font-extrabold text-red-600">Delete Account</h3>
                  <p className="text-xs text-[#686781] mt-1 mb-3">Permanently delete your account and all company data. This action cannot be undone.</p>
                  <button onClick={() => { setDelText(""); setDelModal(true); }} className="w-full py-2.5 rounded-xl border border-red-400 text-red-600 text-sm font-semibold hover:bg-red-50">Delete Account</button>
                </section>
                  </>
                )}
              </div>
            </div>
          </main>
        ) : activeNav === "Company Profile" ? (
          <main className="flex-1 overflow-y-auto p-4 lg:px-6 lg:pb-6">
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => { pickImage(e.target.files?.[0], setLogoUrl); e.target.value = ""; }} />
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => { pickImage(e.target.files?.[0], setCoverUrl); e.target.value = ""; }} />
            <input ref={photoRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} />

            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <h1 className="text-3xl font-extrabold">Company Profile</h1>
                <p className="text-[#cdccd5] text-sm mt-1">Manage your company information, branding, and hiring preferences.</p>
              </div>
              {editing ? (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="px-5 py-3 rounded-full bg-white/10 border border-white/20 text-sm font-bold hover:bg-white/20">Cancel</button>
                  <button onClick={saveProfile} className="px-6 py-3 rounded-full bg-[#686781] hover:bg-[#353457] text-sm font-bold shadow-lg">Save Changes</button>
                </div>
              ) : (
                <button onClick={startEdit} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#686781] hover:bg-[#353457] text-sm font-bold transition-colors shadow-lg"><Pencil size={16} /> Edit Profile</button>
              )}
            </div>

            <div className="grid xl:grid-cols-[minmax(0,1fr)_340px] gap-4 items-start">
              <div className="space-y-4 min-w-0">
                {/* BANNER */}
                <section className="bg-white rounded-2xl overflow-hidden text-[#03012d] shadow-2xl">
                  <div className="relative h-40 bg-gradient-to-r from-[#353457] via-[#686781] to-purple-300" style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                    <button onClick={() => coverRef.current?.click()} className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#03012d]/70 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#03012d]"><Camera size={14} /> Change Cover</button>
                  </div>
                  <div className="px-5 pb-5 flex flex-wrap gap-4">
                    <div className="shrink-0 -mt-12 text-center">
                      <div className="w-24 h-24 rounded-2xl bg-white shadow-lg border border-[#cdccd5] flex items-center justify-center overflow-hidden">
                        {logoUrl ? <img src={logoUrl} alt="Company logo" className="w-full h-full object-cover" /> : <span className="text-4xl font-extrabold text-[#353457]">{company.name.charAt(0)}</span>}
                      </div>
                      <button onClick={() => logoRef.current?.click()} className="mt-2 flex items-center gap-1 mx-auto text-xs font-semibold text-[#353457] border border-[#cdccd5] rounded-lg px-2.5 py-1.5 bg-white hover:bg-gray-50"><Camera size={12} /> Change Logo</button>
                    </div>
                    <div className="flex-1 min-w-[220px] pt-3">
                      {editing ? (
                        <div className="space-y-2">
                          <input value={companyDraft.name} onChange={(e) => setD("name", e.target.value)} className="w-full px-3 py-2 border border-[#353457]/40 rounded-lg text-lg font-extrabold focus:outline-none" />
                          <input value={companyDraft.tagline} onChange={(e) => setD("tagline", e.target.value)} className="w-full px-3 py-2 border border-[#353457]/40 rounded-lg text-sm focus:outline-none" />
                        </div>
                      ) : (
                        <>
                          <h2 className="text-2xl font-extrabold flex items-center gap-2">{company.name} {company.verified && <BadgeCheck size={22} className="text-[#686781]" />}</h2>
                          <p className="text-sm text-[#686781] mt-0.5">{company.tagline}</p>
                        </>
                      )}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-[#686781]">
                        <span className="flex items-center gap-1"><MapPin size={13} /> {company.city}</span>
                        <span className="flex items-center gap-1"><Building2 size={13} /> {company.industry}</span>
                        <span className="flex items-center gap-1"><Users size={13} /> {company.size}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* TABS */}
                <div className="flex flex-wrap gap-2">
                  {["Overview", "Company Details", "Team", "Media", "Hiring Preferences", "Subscription"].map(t => (
                    <button key={t} onClick={() => setProfTab(t)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${profTab === t ? "bg-[#686781] text-white" : "bg-white/10 text-[#cdccd5] hover:bg-white/15"}`}>{t}</button>
                  ))}
                </div>

                {profTab === "Overview" && (
                  <>
                    <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl">
                      <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold">About Company</h3>{!editing && editBtn}</div>
                      {editing
                        ? <textarea rows={4} value={companyDraft.about} onChange={(e) => setD("about", e.target.value)} className="w-full px-3 py-2.5 border border-[#353457]/40 rounded-lg text-sm focus:outline-none" />
                        : <p className="text-sm text-[#686781] leading-relaxed">{company.about}</p>}
                    </section>
                    <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl">
                      <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold">Company Information</h3>{!editing && editBtn}</div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {infoField("Company Name", "name")}
                        {infoField("Contact Person", "contactPerson")}
                        {infoField("Industry", "industry")}
                        {infoField("Email Address", "email")}
                        {infoField("Company Size", "size")}
                        {infoField("Contact Number", "phone")}
                        {infoField("Address", "address")}
                        {infoField("Website", "website")}
                      </div>
                    </section>
                  </>
                )}

                {profTab === "Company Details" && (
                  <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl">
                    <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold">Company Details</h3>{!editing && editBtn}</div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {infoField("Industry", "industry")}
                      {infoField("Company Size", "size")}
                      {infoField("Location", "city")}
                      {infoField("Website", "website")}
                      {infoField("Year Founded", "founded")}
                      {infoField("Full Address", "address")}
                    </div>
                  </section>
                )}

                {profTab === "Team" && (
                  <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl">
                    <h3 className="font-extrabold mb-3">Team Members</h3>
                    <ul className="space-y-2 mb-4">
                      {team.map(m => (
                        <li key={m.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#cdccd5]/60">
                          <Avatar name={m.name} className="w-10 h-10 text-xs" />
                          <div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{m.name}</p><p className="text-xs text-[#686781]">{m.role}</p></div>
                          <button onClick={() => setTeam(prev => prev.filter(x => x.id !== m.id))} className="text-xs text-[#686781] hover:text-red-500">Remove</button>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Name" className="flex-1 min-w-[140px] px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" />
                      <input value={teamRole} onChange={(e) => setTeamRole(e.target.value)} placeholder="Role" className="flex-1 min-w-[140px] px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" />
                      <button onClick={addMember} className="px-5 rounded-lg bg-[#353457] text-white text-sm font-semibold hover:bg-[#03012d]">Add</button>
                    </div>
                  </section>
                )}

                {profTab === "Media" && (
                  <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl">
                    <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold">Company Media</h3><button onClick={() => photoRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#353457] text-white text-xs font-semibold hover:bg-[#03012d]"><Plus size={14} /> Add photos</button></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {photos.map((ph, i) => (
                        <div key={ph.id} className={`relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br ${tileGradients[i % 4]} flex items-end`}>
                          {ph.url ? <img src={ph.url} alt={ph.label} className="absolute inset-0 w-full h-full object-cover" /> : <span className="relative text-white text-xs font-semibold p-2">{ph.label}</span>}
                          <button onClick={() => setPhotos(prev => prev.filter(x => x.id !== ph.id))} aria-label={`Remove ${ph.label}`} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#03012d]/70 text-white flex items-center justify-center"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {profTab === "Hiring Preferences" && (
                  <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl space-y-5">
                    <div><h3 className="font-extrabold">Hiring Preferences</h3><p className="text-xs text-[#686781]">Changes here save automatically.</p></div>
                    <div>
                      <p className="text-xs font-semibold text-[#353457] mb-2">Preferred work setups</p>
                      <div className="flex flex-wrap gap-4">
                        {["On-site", "Hybrid", "Remote"].map(w => (
                          <label key={w} className="flex items-center gap-2 text-sm text-[#686781]"><input type="checkbox" checked={prefs.setups.includes(w)} onChange={() => setPrefs(prev => ({ ...prev, setups: prev.setups.includes(w) ? prev.setups.filter(x => x !== w) : [...prev.setups, w] }))} /> {w}</label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#353457] mb-2">Minimum match score: <span className="text-[#03012d]">{prefs.minMatch}%</span></p>
                      <input type="range" min={50} max={100} step={5} value={prefs.minMatch} onChange={(e) => setPrefs(prev => ({ ...prev, minMatch: Number(e.target.value) }))} className="w-full" />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-[#686781]"><input type="checkbox" checked={prefs.freshGrads} onChange={(e) => setPrefs(prev => ({ ...prev, freshGrads: e.target.checked }))} /> Open to fresh graduates</label>
                    <Field label="Default interview platform">
                      <select value={prefs.platform} onChange={(e) => setPrefs(prev => ({ ...prev, platform: e.target.value }))} className="w-full sm:w-64 px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">
                        <option>Google Meet</option><option>Zoom</option><option>Microsoft Teams</option><option>On-site</option><option>Phone call</option>
                      </select>
                    </Field>
                  </section>
                )}

                {profTab === "Subscription" && (
                  <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl">
                    <h3 className="font-extrabold">Subscription</h3>
                    <p className="text-sm text-[#686781] mt-1">You're on the <span className="font-bold text-[#353457]">{subPlan} Employer</span> plan.</p>
                    <ul className="text-sm text-[#686781] list-disc pl-5 mt-3 space-y-1"><li>Verified company badge</li><li>More active job postings</li><li>Advanced filters and analytics</li><li>Priority visibility to candidates</li></ul>
                    <button onClick={() => { setSection("Subscription & Billing"); setActiveNav("Settings"); }} className="mt-4 px-6 py-3 rounded-xl bg-[#353457] text-white text-sm font-bold hover:bg-[#03012d]">Upgrade to Pro Employer</button>
                  </section>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4 min-w-0">
                <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold">Company Stats</h3>
                    <select value={statsRange} onChange={(e) => setStatsRange(e.target.value)} aria-label="Stats period" className="text-xs border border-[#cdccd5] rounded-lg px-2 py-1.5 bg-white focus:outline-none">
                      <option value="7">Last 7 Days</option><option value="30">Last 30 Days</option><option value="90">Last 90 Days</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: Briefcase, value: jobs.filter(j => j.status === "Active").length, label: "Active Job Postings" },
                      { icon: Users, value: employerCandidates.length, label: "Total Applicants" },
                      { icon: Eye, value: viewsByRange[statsRange].toLocaleString(), label: "Profile Views" },
                      { icon: Heart, value: employerCandidates.length, label: "Total Matches" },
                    ].map(t => {
                      const Icon = t.icon;
                      return (
                        <div key={t.label} className="flex items-center gap-2.5 bg-[#f8f9fa] rounded-xl p-3">
                          <Icon size={20} className="text-[#353457] shrink-0" />
                          <div><p className="text-lg font-extrabold leading-none">{t.value}</p><p className="text-[10px] text-[#686781] mt-1">{t.label}</p></div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl">
                  <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold">Social Media Links</h3>{!editing && editBtn}</div>
                  <div className="space-y-2">
                    {([["in", "linkedin", "bg-[#0077b5]"], ["f", "facebook", "bg-[#1877f2]"], ["ig", "instagram", "bg-pink-500"], ["w", "web", "bg-[#353457]"]] as const).map(([badge, k, color]) => (
                      <div key={k} className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-lg ${color} text-white text-[11px] font-bold flex items-center justify-center shrink-0`}>{badge}</span>
                        <input readOnly={!editing} value={val(k)} onChange={(e) => setD(k, e.target.value)} aria-label={k} className={`flex-1 min-w-0 px-3 py-2 border rounded-lg text-xs focus:outline-none ${editing ? "bg-white border-[#353457]/40" : "bg-[#f8f9fa] border-[#cdccd5]"}`} />
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl">
                  <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold">Company Media</h3><button onClick={() => setProfTab("Media")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#353457]/10 text-[#353457] text-xs font-semibold hover:bg-[#353457]/20"><Pencil size={13} /> Edit</button></div>
                  <div className="grid grid-cols-4 gap-2">
                    {photos.slice(0, 4).map((ph, i) => (
                      <div key={ph.id} className={`relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br ${tileGradients[i % 4]}`}>
                        {ph.url && <img src={ph.url} alt={ph.label} className="absolute inset-0 w-full h-full object-cover" />}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </main>
        ) : activeNav === "Calendar" ? (
          <main className="flex-1 overflow-y-auto p-4 lg:px-6 lg:pb-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <h1 className="text-3xl font-extrabold">Calendar</h1>
                <p className="text-[#cdccd5] text-sm mt-1">Manage interviews, meetings, and hiring activities.</p>
              </div>
              <button onClick={openNewEvent} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#686781] hover:bg-[#353457] text-sm font-bold transition-colors shadow-lg"><Plus size={18} /> Schedule Event</button>
            </div>

            <div className="grid xl:grid-cols-[minmax(0,1fr)_340px] gap-4 items-start">
              {/* MAIN CALENDAR */}
              <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="flex gap-1.5">
                    {["Month", "Week", "Day", "Agenda"].map(v => (
                      <button key={v} onClick={() => setCalView(v)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${calView === v ? "bg-[#353457] text-white" : "bg-[#cdccd5]/30 text-[#353457] hover:bg-[#cdccd5]/50"}`}>{v}</button>
                    ))}
                  </div>
                  <button onClick={() => setCursor(new Date())} className="px-3 py-1.5 rounded-lg border border-[#cdccd5] text-xs font-semibold hover:bg-gray-50">Today</button>
                  <button onClick={() => shiftCursor(-1)} aria-label="Previous" className="text-[#686781] hover:text-[#03012d]"><ChevronLeft size={20} /></button>
                  <button onClick={() => shiftCursor(1)} aria-label="Next" className="text-[#686781] hover:text-[#03012d]"><ChevronRight size={20} /></button>
                  <h2 className="font-extrabold text-lg ml-1">{calTitle}</h2>
                </div>

                {calView === "Month" && (
                  <div className="overflow-x-auto">
                    <div className="min-w-[640px]">
                      <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#686781] mb-1">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="py-2">{d}</div>)}</div>
                      <div className="grid grid-cols-7">
                        {monthCells.map(d => {
                          const key = dateKey(d);
                          const evs = eventsOn(key);
                          const inMonth = d.getMonth() === cursor.getMonth();
                          return (
                            <div key={key} className={`min-h-[96px] border border-[#cdccd5]/40 p-1 ${inMonth ? "" : "bg-[#f8f9fa]/70"}`}>
                              <p className={`text-xs mb-1 w-6 h-6 flex items-center justify-center rounded-full ${key === todayKey ? "bg-[#353457] text-white font-bold" : inMonth ? "text-[#353457]" : "text-[#cdccd5]"}`}>{d.getDate()}</p>
                              <div className="space-y-1">
                                {evs.slice(0, 2).map(e => <EventChip key={e.id} e={e} selected={selEvent === e.id} onClick={() => setSelEvent(e.id)} />)}
                                {evs.length > 2 && <button onClick={() => { setCursor(d); setCalView("Day"); }} className="text-[10px] font-semibold text-[#353457]">+{evs.length - 2} more</button>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {(calView === "Week" || calView === "Day") && (
                  <div className="overflow-x-auto">
                    <div className={`grid gap-2 ${calView === "Week" ? "grid-cols-7 min-w-[760px]" : "grid-cols-1"}`}>
                      {(calView === "Week" ? weekDays : [cursor]).map(d => {
                        const key = dateKey(d);
                        const evs = eventsOn(key);
                        return (
                          <div key={key} className="border border-[#cdccd5]/40 rounded-xl p-2 min-h-[220px]">
                            <p className={`text-xs font-bold mb-2 ${key === todayKey ? "text-[#353457]" : "text-[#686781]"}`}>{d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                            <div className="space-y-1.5">
                              {evs.length === 0 && <p className="text-[11px] text-[#9a99ab]">No events</p>}
                              {evs.map(e => <EventChip key={e.id} e={e} selected={selEvent === e.id} onClick={() => setSelEvent(e.id)} />)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {calView === "Agenda" && (
                  <div className="space-y-1">
                    {agendaList.length === 0 && <p className="text-sm text-[#686781] text-center py-10">Nothing scheduled this month.</p>}
                    {agendaList.map((e, i) => (
                      <div key={e.id}>
                        {(i === 0 || agendaList[i - 1].date !== e.date) && <p className="text-xs font-bold text-[#686781] mt-3 mb-1">{fmtDate(e.date, { weekday: "long", month: "long", day: "numeric" })}</p>}
                        <button onClick={() => setSelEvent(e.id)} className={`w-full flex items-center gap-3 text-left border-l-4 rounded-lg px-3 py-2 ${kindStyle[e.kind]} ${selEvent === e.id ? "ring-2 ring-[#353457]" : ""}`}>
                          <span className="text-xs font-bold w-20 shrink-0">{fmtTime(e.time)}</span>
                          <span className="text-sm font-semibold flex-1 truncate">{e.title}</span>
                          <span className="text-xs hidden sm:inline">{e.platform}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* RIGHT COLUMN */}
              <div className="space-y-4 min-w-0">
                <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold">{cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
                    <span className="flex gap-2 text-[#686781]">
                      <button onClick={() => shiftCursor(-1, true)} aria-label="Previous month"><ChevronLeft size={18} /></button>
                      <button onClick={() => shiftCursor(1, true)} aria-label="Next month"><ChevronRight size={18} /></button>
                    </span>
                  </div>
                  <div className="grid grid-cols-7 text-center text-[11px] text-[#9a99ab] mb-1">{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
                  <div className="grid grid-cols-7 gap-y-1">
                    {monthCells.map(d => {
                      const key = dateKey(d);
                      const inMonth = d.getMonth() === cursor.getMonth();
                      const picked = key === dateKey(cursor);
                      return (
                        <button key={key} onClick={() => setCursor(d)} className={`relative h-8 text-xs rounded-full ${picked ? "bg-[#353457] text-white font-bold" : key === todayKey ? "ring-1 ring-[#353457] text-[#353457] font-bold" : inMonth ? "text-[#03012d] hover:bg-gray-100" : "text-[#cdccd5]"}`}>
                          {d.getDate()}
                          {eventsOn(key).length > 0 && <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${picked ? "bg-white" : "bg-[#686781]"}`}></span>}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                  <h3 className="font-extrabold mb-2">Interview Invites</h3>
                  {invites.length === 0 && <p className="text-xs text-[#686781]">No pending invites. Use Schedule Event to invite a matched candidate. They must accept before you can set a date and time.</p>}
                  <ul className="space-y-3">
                    {invites.map(e => {
                      const c = evCand(e);
                      return (
                        <li key={e.id} className="flex items-center gap-3">
                          {c && <Avatar name={c.name} className="w-10 h-10 text-xs" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{c?.name}</p>
                            <p className={`text-xs font-semibold ${e.status === "Accepted" ? "text-emerald-600" : e.status === "Declined" ? "text-red-500" : "text-amber-600"}`}>{e.status === "Invited" ? "Waiting for response" : e.status === "Accepted" ? "Accepted. Ready to schedule" : "Declined the invite"}</p>
                          </div>
                          {e.status === "Accepted" && <button onClick={() => openSchedule(e)} className="px-3 py-1.5 rounded-lg bg-[#353457] text-white text-xs font-bold hover:bg-[#03012d]">Schedule</button>}
                          <button onClick={() => cancelEvent(e.id, e.status === "Declined" ? "Invite dismissed" : "Invite withdrawn")} className="text-xs text-[#686781] hover:underline">{e.status === "Declined" ? "Dismiss" : "Withdraw"}</button>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold">Upcoming Schedule</h3>
                    <button onClick={() => setCalView("Agenda")} className="text-xs font-semibold text-[#353457] hover:underline">View All</button>
                  </div>
                  {upcoming.length === 0 && <p className="text-xs text-[#686781]">Nothing coming up.</p>}
                  <ul className="space-y-2">
                    {upcoming.map(e => (
                      <li key={e.id}>
                        <button onClick={() => { setSelEvent(e.id); setCursor(new Date(`${e.date}T00:00:00`)); }} className={`w-full text-left border-l-4 rounded-lg px-3 py-2 ${kindStyle[e.kind]}`}>
                          <p className="text-sm font-bold truncate">{e.title}</p>
                          <p className="text-xs">{fmtDate(e.date, { month: "short", day: "numeric", year: "numeric" })} • {fmtTime(e.time)} – {fmtTime(addMinutes(e.time, e.duration))}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-white rounded-2xl p-4 text-[#03012d] shadow-2xl">
                  <h3 className="font-extrabold mb-2">Event Details</h3>
                  {!selEv ? <p className="text-xs text-[#686781]">Select an event to see its details.</p> : (
                    <div className="text-sm space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold">{selEv.title}</p>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 shrink-0">Confirmed</span>
                      </div>
                      <p className="text-[#686781]">{fmtDate(selEv.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                      <p className="text-[#686781]">{fmtTime(selEv.time)} – {fmtTime(addMinutes(selEv.time, selEv.duration))} ({selEv.duration} minutes)</p>
                      <p className="text-[#686781]">{selEv.platform}</p>
                      {selEv.notes && <p className="text-xs text-[#686781]">{selEv.notes}</p>}
                      {evCand(selEv) && (
                        <div className="flex items-center gap-3 pt-1">
                          <Avatar name={evCand(selEv)!.name} className="w-10 h-10 text-xs" />
                          <div><p className="font-bold text-sm">{evCand(selEv)!.name}</p><p className="text-xs text-[#686781]">{evCand(selEv)!.role}</p></div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button onClick={() => openSchedule(selEv)} className="py-2.5 rounded-xl border border-[#cdccd5] text-sm font-semibold hover:bg-gray-50">Reschedule</button>
                        <button onClick={() => cancelEvent(selEv.id, "Event cancelled")} className="py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">Cancel</button>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </main>
        ) : activeNav === "Candidates" ? (
          <main className="flex-1 overflow-y-auto p-4 lg:px-6 lg:pb-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <h1 className="text-3xl font-extrabold">Candidates</h1>
                <p className="text-[#cdccd5] text-sm mt-1">Browse and manage candidates who showed interest in your job postings.</p>
              </div>
              <button onClick={exportCsv} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-sm font-bold transition-colors"><Download size={18} /> Export List</button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => setCandSel([])} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${candSel.length === 0 ? "bg-[#686781] text-white" : "bg-white/10 text-[#cdccd5] hover:bg-white/15"}`}>All Candidates ({employerCandidates.length})</button>
              {candTabs.map(t => (
                <button key={t} onClick={() => setCandSel([t])} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${candSel.length === 1 && candSel[0] === t ? "bg-[#686781] text-white" : "bg-white/10 text-[#cdccd5] hover:bg-white/15"}`}>{t} ({candStatusCount(t)})</button>
              ))}
            </div>

            <div className="grid xl:grid-cols-[240px_minmax(0,1fr)_360px] gap-4 items-start">
              {/* FILTERS */}
              <aside className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-extrabold">Filters</h2>
                  <button onClick={resetCandFilters} className="text-xs font-semibold text-[#353457] hover:underline">Reset</button>
                </div>
                <Field label="Job Posting">
                  <select value={fJob} onChange={(e) => setFJob(e.target.value)} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">
                    <option value="">All Job Postings</option>
                    {jobs.map(j => <option key={j.id} value={j.title}>{j.title}</option>)}
                  </select>
                </Field>
                <div>
                  <p className="text-xs font-semibold text-[#353457] mb-1.5">Status</p>
                  {candTabs.map(t => (
                    <label key={t} className="flex items-center gap-2 text-sm py-1 text-[#686781]">
                      <input type="checkbox" checked={candSel.includes(t)} onChange={() => setCandSel(toggleIn(candSel, t))} />
                      <span className="flex-1">{t}</span><span className="text-xs text-[#9a99ab]">{candStatusCount(t)}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#353457] mb-1.5">Skills</p>
                  <input value={fSkillQuery} onChange={(e) => setFSkillQuery(e.target.value)} placeholder="Search skills..." className="w-full px-3 py-2 mb-1.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" />
                  {(showAllSkills || fSkillQuery ? skillOptions : skillOptions.slice(0, 5)).map(([sk, n]) => (
                    <label key={sk} className="flex items-center gap-2 text-sm py-1 text-[#686781]">
                      <input type="checkbox" checked={fSkills.includes(sk)} onChange={() => setFSkills(toggleIn(fSkills, sk))} />
                      <span className="flex-1">{sk}</span><span className="text-xs text-[#9a99ab]">{n}</span>
                    </label>
                  ))}
                  {!fSkillQuery && skillOptions.length > 5 && (
                    <button onClick={() => setShowAllSkills(v => !v)} className="flex items-center gap-1 text-xs font-semibold text-[#353457] mt-1">{showAllSkills ? "Show less" : "Show more"} <ChevronDown size={14} className={showAllSkills ? "rotate-180" : ""} /></button>
                  )}
                </div>
                <Field label="Experience">
                  <select value={fExp} onChange={(e) => setFExp(e.target.value)} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">
                    <option value="">Any</option><option value="0-1">0-1 years</option><option value="2-3">2-3 years</option><option value="4+">4+ years</option>
                  </select>
                </Field>
                <Field label="Location">
                  <select value={fLocation} onChange={(e) => setFLocation(e.target.value)} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">
                    <option value="">All Locations</option>
                    {cLocations.map(l => <option key={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Availability">
                  <select value={fAvail} onChange={(e) => setFAvail(e.target.value)} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">
                    <option value="">Any</option><option>Immediately</option><option>In 2 weeks</option><option>In 1 month</option>
                  </select>
                </Field>
              </aside>

              {/* CANDIDATE LIST */}
              <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl min-w-0">
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99ab]" />
                    <input value={candQuery} onChange={(e) => setCandQuery(e.target.value)} placeholder="Search candidates..." className="w-full bg-[#f8f9fa] border border-[#cdccd5] rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#353457]" />
                  </div>
                  <select value={candSort} onChange={(e) => setCandSort(e.target.value)} aria-label="Sort candidates" className="bg-[#f8f9fa] border border-[#cdccd5] rounded-xl px-3 text-sm focus:outline-none">
                    <option value="match">Best Match</option><option value="name">Name (A-Z)</option><option value="exp">Most Experience</option>
                  </select>
                </div>
                {picked.length > 0 && (
                  <div className="flex items-center justify-between bg-[#353457]/10 rounded-xl px-4 py-2.5 mb-3 text-sm">
                    <span className="font-semibold text-[#353457]">{picked.length} selected</span>
                    <span className="flex gap-3">
                      <button onClick={() => shortlistCand(picked)} className="font-bold text-[#353457] hover:underline">Shortlist selected</button>
                      <button onClick={() => setPicked([])} className="text-[#686781] hover:underline">Clear</button>
                    </span>
                  </div>
                )}
                <ul className="space-y-1 max-h-[640px] overflow-y-auto">
                  {candList.length === 0 && <li className="p-8 text-center text-sm text-[#686781]">No candidates match these filters.</li>}
                  {candList.map(c => (
                    <li key={c.id} onClick={() => { setSelCand(c.id); setCandDetailTab("Profile"); }} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selCand === c.id ? "bg-[#353457]/10" : "hover:bg-[#f8f9fa]"}`}>
                      <input type="checkbox" checked={picked.includes(c.id)} onClick={(e) => e.stopPropagation()} onChange={() => setPicked(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])} aria-label={`Select ${c.name}`} />
                      <Avatar name={c.name} className="w-12 h-12 text-sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{c.name}</p>
                        <p className="text-xs text-[#686781] truncate">{c.role}</p>
                        <p className="flex items-center gap-1 text-[11px] text-[#9a99ab] truncate"><MapPin size={10} /> {cityOf(c)} • {c.experience}</p>
                      </div>
                      <div className="text-right shrink-0 space-y-1">
                        <p className="text-xs font-bold text-emerald-600">{c.match}% Match</p>
                        <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-lg ${candStatusStyle[candStatus[c.id]]}`}>{candStatus[c.id]}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* PROFILE PREVIEW */}
              <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl">
                {!selected ? (
                  <p className="text-sm text-[#686781] text-center py-16">Select a candidate to preview their profile.</p>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <Avatar name={selected.name} className="w-16 h-16 text-xl" />
                        {selected.online && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-extrabold text-lg">{selected.name}, {selected.age}</h2>
                        <p className="text-sm text-[#686781]">{selected.role}</p>
                        <p className="flex items-center gap-2 text-xs text-[#9a99ab]"><span className="flex items-center gap-1"><MapPin size={11} /> {selected.location}</span>{selected.online && <span className="text-emerald-600 font-medium">Online</span>}</p>
                      </div>
                      <button onClick={() => setSelCand(null)} aria-label="Close preview" className="text-[#9a99ab] hover:text-[#03012d]"><X size={20} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button onClick={() => openChat(selected.id)} className="py-2.5 rounded-xl bg-[#353457] text-white text-sm font-semibold hover:bg-[#03012d] flex items-center justify-center gap-2"><MessageCircle size={15} /> Message</button>
                      <button onClick={() => shortlistCand([selected.id])} disabled={candStatus[selected.id] === "Shortlisted"} className="py-2.5 rounded-xl border border-[#cdccd5] text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 disabled:text-[#9a99ab] disabled:hover:bg-white"><Star size={15} /> {candStatus[selected.id] === "Shortlisted" ? "Shortlisted" : "Shortlist"}</button>
                    </div>
                    <div className="flex gap-4 border-b border-[#cdccd5]/60 mt-4 text-sm">
                      {["Profile", "Resume", "Notes", "Activity"].map(t => (
                        <button key={t} onClick={() => setCandDetailTab(t)} className={`pb-2 font-semibold border-b-2 transition-colors ${candDetailTab === t ? "border-[#353457] text-[#353457]" : "border-transparent text-[#9a99ab] hover:text-[#686781]"}`}>{t}</button>
                      ))}
                    </div>
                    <div className="pt-4 text-sm">
                      {candDetailTab === "Profile" && (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-bold mb-1">About Me</h3>
                            <p className="text-[#686781] leading-relaxed">{selected.bio}</p>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs text-[#686781]">
                            <p className="flex items-start gap-1.5"><Briefcase size={14} className="shrink-0 mt-0.5" /> {selected.experience}</p>
                            <p className="flex items-start gap-1.5"><MapPin size={14} className="shrink-0 mt-0.5" /> {selected.location}</p>
                            <p className="flex items-start gap-1.5"><Building2 size={14} className="shrink-0 mt-0.5" /> {candExtra[selected.id].relocate ? "Open to Relocation" : "Not relocating"}</p>
                          </div>
                          <div>
                            <h3 className="font-bold mb-1.5">Skills</h3>
                            <div className="flex flex-wrap gap-1.5">{selected.skills.map(sk => <span key={sk} className="text-xs px-2.5 py-1 bg-[#cdccd5]/30 text-[#353457] rounded-full">{sk}</span>)}</div>
                          </div>
                          <div>
                            <h3 className="font-bold mb-1.5">Experience</h3>
                            <div className="flex justify-between gap-2"><p className="font-semibold">{candExtra[selected.id].exp.title}</p><p className="text-xs text-[#9a99ab] shrink-0">{candExtra[selected.id].exp.dates}</p></div>
                            <p className="text-xs text-[#686781] mb-1">{candExtra[selected.id].exp.company}</p>
                            <ul className="list-disc pl-4 text-xs text-[#686781] space-y-0.5">{candExtra[selected.id].exp.points.map(pt => <li key={pt}>{pt}</li>)}</ul>
                          </div>
                        </div>
                      )}
                      {candDetailTab === "Resume" && (
                        <div className="border-2 border-dashed border-[#cdccd5] rounded-xl p-6 text-center">
                          <p className="font-semibold">{selected.name.replace(" ", "_")}_Resume.pdf</p>
                          <p className="text-xs text-[#9a99ab] mt-1">Resume preview will appear here once uploaded resumes are connected to storage.</p>
                        </div>
                      )}
                      {candDetailTab === "Notes" && (
                        <div>
                          <textarea value={notes[selected.id] || ""} onChange={(e) => setNotes(prev => ({ ...prev, [selected.id]: e.target.value }))} rows={6} placeholder="Add private notes about this candidate..." className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />
                          <p className="text-[11px] text-[#9a99ab] mt-1">Only your team can see notes.</p>
                        </div>
                      )}
                      {candDetailTab === "Activity" && (
                        <ul className="space-y-2 text-xs text-[#686781]">
                          <li>Current status: <span className="font-semibold text-[#353457]">{candStatus[selected.id]}</span></li>
                          <li>Applied to {candExtra[selected.id].job} • {selected.ago}</li>
                          <li>Match score calculated at {selected.match}%</li>
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </section>
            </div>
          </main>
        ) : activeNav === "Job Postings" ? (
          <main className="flex-1 overflow-y-auto p-4 lg:px-6 lg:pb-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <h1 className="text-3xl font-extrabold">Job Postings</h1>
                <p className="text-[#cdccd5] text-sm mt-1">Create and manage your job listings to attract the right talent.</p>
              </div>
              <button onClick={focusJobForm} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#686781] hover:bg-[#353457] text-sm font-bold transition-colors shadow-lg"><Plus size={18} /> Post a New Job</button>
            </div>

            <div className="grid xl:grid-cols-2 gap-4 items-start">
              {/* POSTINGS LIST */}
              <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {jobTabs.map(t => (
                    <button key={t} onClick={() => setJobTab(t)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${jobTab === t ? "bg-[#353457] text-white" : "bg-[#cdccd5]/30 text-[#353457] hover:bg-[#cdccd5]/50"}`}>{t} ({jobCount(t)})</button>
                  ))}
                </div>
                <div className="relative mb-3">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99ab]" />
                  <input value={jobQuery} onChange={(e) => setJobQuery(e.target.value)} placeholder="Search job postings..." className="w-full bg-[#f8f9fa] border border-[#cdccd5] rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#353457]" />
                </div>
                <ul className="space-y-2 max-h-[620px] overflow-y-auto">
                  {jobList.length === 0 && <li className="p-6 text-center text-sm text-[#686781]">No job postings here yet.</li>}
                  {jobList.map(j => (
                    <li key={j.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#cdccd5]/60 hover:bg-[#f8f9fa]">
                      <div className="w-11 h-11 rounded-xl bg-[#353457]/10 text-[#353457] flex items-center justify-center shrink-0"><Briefcase size={20} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{j.title}</p>
                        <p className="text-xs text-[#686781]">{companyName}</p>
                        <p className="flex items-center gap-1 text-xs text-[#9a99ab] truncate"><MapPin size={11} /> {j.location} • {j.type}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${jobStatusStyle[j.status]}`}>{j.status}</span>
                        <p className="text-xs font-bold text-[#353457] mt-1">{j.matches} Matches</p>
                        <p className="text-[11px] text-[#9a99ab]">{j.views} Views</p>
                      </div>
                      <select value={j.status} onChange={(e) => setJobStatus(j.id, e.target.value)} aria-label={`Change status of ${j.title}`} className="text-xs border border-[#cdccd5] rounded-lg px-1.5 py-1 bg-white text-[#353457] focus:outline-none">
                        <option>Active</option>
                        <option>Paused</option>
                        <option>Closed</option>
                        <option>Draft</option>
                      </select>
                    </li>
                  ))}
                </ul>
              </section>

              {/* POST A NEW JOB */}
              <section className="bg-white rounded-2xl p-5 text-[#03012d] shadow-2xl">
                <h2 className="text-xl font-extrabold">Post a New Job</h2>
                <p className="text-xs text-[#686781] mt-1 mb-4">Fill in the details to create a job posting. The more details you provide, the better matches you'll get.</p>

                <h3 className="text-sm font-bold mb-2">Basic Information</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Job Title" required><input ref={titleRef} value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="e.g. UI/UX Designer" className={fieldCls("title")} /></Field>
                  <Field label="Job Type" required>
                    <select value={form.type} onChange={(e) => setField("type", e.target.value)} className={fieldCls("type")}>
                      <option value="">Select job type</option><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                    </select>
                  </Field>
                  <Field label="Industry" required>
                    <select value={form.industry} onChange={(e) => setField("industry", e.target.value)} className={fieldCls("industry")}>
                      <option value="">Select industry</option><option>Technology</option><option>Design</option><option>Marketing</option><option>Finance</option><option>Healthcare</option><option>Education</option>
                    </select>
                  </Field>
                  <Field label="Work Setup" required>
                    <select value={form.setup} onChange={(e) => setField("setup", e.target.value)} className={fieldCls("setup")}>
                      <option value="">Select work setup</option><option>On-site</option><option>Hybrid</option><option>Remote</option>
                    </select>
                  </Field>
                  <Field label="Salary Range (monthly, PHP)" className="sm:col-span-2">
                    <div className="flex items-center gap-2">
                      <input type="number" min="0" value={form.salaryMin} onChange={(e) => setField("salaryMin", e.target.value)} placeholder="Min" className={fieldCls("salaryMin")} />
                      <span className="text-[#9a99ab]">to</span>
                      <input type="number" min="0" value={form.salaryMax} onChange={(e) => setField("salaryMax", e.target.value)} placeholder="Max" className={fieldCls("salaryMax")} />
                    </div>
                  </Field>
                </div>

                <h3 className="text-sm font-bold mt-5 mb-2">Job Location</h3>
                <div className="flex flex-wrap items-end gap-3">
                  <Field label={form.setup === "Remote" ? "City / Location (optional for remote)" : "City / Location"} required={form.setup !== "Remote"} className="flex-1 min-w-[200px]">
                    <input value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="e.g. Makati, Metro Manila" className={fieldCls("city")} />
                  </Field>
                  <label className="flex items-center gap-2 text-xs text-[#353457] pb-3"><input type="checkbox" checked={form.relocate} onChange={(e) => setField("relocate", e.target.checked)} /> Open to Relocation</label>
                </div>

                <h3 className="text-sm font-bold mt-5 mb-2">Job Description</h3>
                <textarea value={form.description} maxLength={2000} rows={4} onChange={(e) => setField("description", e.target.value)} placeholder="Describe the role, responsibilities, and what you're looking for..." className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />
                <p className="text-right text-[11px] text-[#9a99ab]">{form.description.length}/2000</p>

                <h3 className="text-sm font-bold mt-3 mb-2">Required Skills</h3>
                <div className="flex gap-2">
                  <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="Add a skill (e.g. Figma)" className="flex-1 px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />
                  <button onClick={addSkill} className="px-5 rounded-lg bg-[#353457] text-white text-sm font-semibold hover:bg-[#03012d]">Add</button>
                </div>
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.skills.map(sk => (
                      <span key={sk} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-[#353457]/10 text-[#353457] rounded-full">{sk}
                        <button onClick={() => setField("skills", form.skills.filter(x => x !== sk))} aria-label={`Remove ${sk}`}><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                )}

                <button onClick={() => setShowMore(v => !v)} className="w-full flex items-center justify-between mt-5 py-3 border-t border-[#cdccd5]/60 text-sm font-bold">
                  Additional Details (Optional)
                  <ChevronDown size={18} className={`transition-transform ${showMore ? "rotate-180" : ""}`} />
                </button>
                {showMore && (
                  <div className="grid sm:grid-cols-2 gap-3 pb-3">
                    <Field label="Experience Required"><input value={form.experience} onChange={(e) => setField("experience", e.target.value)} placeholder="e.g. 2+ years" className={fieldCls("experience")} /></Field>
                    <Field label="Application Deadline"><input type="date" value={form.deadline} onChange={(e) => setField("deadline", e.target.value)} className={fieldCls("deadline")} /></Field>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <button onClick={() => submitJob("Draft")} className="py-3 rounded-xl border border-[#cdccd5] text-sm font-semibold hover:bg-gray-50">Save as Draft</button>
                  <button onClick={() => submitJob("Active")} className="py-3 rounded-xl bg-[#353457] text-white text-sm font-bold hover:bg-[#03012d] flex items-center justify-center gap-2"><Send size={15} /> Publish Job</button>
                </div>
              </section>
            </div>
          </main>
        ) : activeNav === "Messages" ? (
          <main className="flex-1 min-h-0 flex p-4 lg:px-6 lg:pb-6">
            <div className="flex-1 flex min-h-[560px] min-w-0 bg-white rounded-2xl overflow-hidden text-[#03012d] shadow-2xl">
              {/* CONVERSATION LIST */}
              <div className={`${showChat ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 shrink-0 flex-col min-h-0 border-r border-[#cdccd5]/60`}>
                <div className="p-5 pb-3">
                  <h1 className="text-2xl font-extrabold">Messages</h1>
                  <p className="text-xs text-[#686781] mt-1">Chat with job seekers who matched with your company.</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {convTabs.map(t => (
                      <button key={t} onClick={() => setConvTab(t)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${convTab === t ? "bg-[#353457] text-white" : "bg-[#cdccd5]/30 text-[#353457] hover:bg-[#cdccd5]/50"}`}>
                        {t}<span className={`px-1.5 rounded-full text-[10px] ${convTab === t ? "bg-white/20" : "bg-white"}`}>{convCount(t)}</span>
                      </button>
                    ))}
                  </div>
                  <div className="relative mt-3">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99ab]" />
                    <input value={convQuery} onChange={(e) => setConvQuery(e.target.value)} placeholder="Search conversations..." className="w-full bg-[#f8f9fa] border border-[#cdccd5] rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#353457]" />
                  </div>
                </div>
                <ul className="flex-1 overflow-y-auto">
                  {convList.length === 0 && <li className="p-6 text-center text-sm text-[#686781]">No conversations here.</li>}
                  {convList.map(c => {
                    const last = lastMsg(c.id);
                    const n = unread[c.id] || 0;
                    return (
                      <li key={c.id}>
                        <button onClick={() => openChat(c.id)} className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${activeChat === c.id ? "bg-[#353457]/10" : "hover:bg-gray-50"}`}>
                          <div className="relative shrink-0">
                            <Avatar name={c.name} className="w-12 h-12 text-sm" />
                            {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between gap-2">
                              <p className="font-bold text-sm truncate">{c.name}</p>
                              <span className="text-[11px] text-[#9a99ab] shrink-0">{last.time}</span>
                            </div>
                            <p className="text-xs text-[#686781] truncate">{c.role}</p>
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs truncate ${n ? "font-semibold text-[#03012d]" : "text-[#9a99ab]"}`}>{last.text}</p>
                              {n > 0 && <span className="bg-[#353457] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">{n}</span>}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* CHAT WINDOW */}
              <div className={`${showChat ? "flex" : "hidden md:flex"} flex-1 flex-col min-w-0 min-h-0`}>
                <div className="flex items-center gap-3 p-4 border-b border-[#cdccd5]/60">
                  <button onClick={() => setShowChat(false)} aria-label="Back to conversations" className="md:hidden text-[#686781]"><ChevronLeft size={22} /></button>
                  <div className="relative shrink-0">
                    <Avatar name={activeCand.name} className="w-12 h-12 text-sm" />
                    {activeCand.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold truncate">{activeCand.name}, {activeCand.age}</h2>
                    <p className="text-sm text-[#686781] truncate">{activeCand.role}</p>
                    <p className="flex items-center gap-2 text-xs text-[#9a99ab]"><span className="flex items-center gap-1"><MapPin size={11} /> {activeCand.location}</span>{activeCand.online && <span className="text-emerald-600 font-medium">Online</span>}</p>
                  </div>
                  <button onClick={() => setStarred(prev => ({ ...prev, [activeCand.id]: !prev[activeCand.id] }))} aria-label="Star conversation" className="w-10 h-10 rounded-xl border border-[#cdccd5] flex items-center justify-center hover:bg-gray-50">
                    <Star size={18} className={starred[activeCand.id] ? "fill-amber-400 text-amber-400" : "text-[#686781]"} />
                  </button>
                  <button onClick={() => setArchived(prev => ({ ...prev, [activeCand.id]: !prev[activeCand.id] }))} className="px-3 h-10 rounded-xl border border-[#cdccd5] text-xs font-semibold text-[#353457] hover:bg-gray-50">
                    {archived[activeCand.id] ? "Unarchive" : "Archive"}
                  </button>
                </div>

                <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8f9fa]/60">
                  <p className="text-center text-xs text-[#9a99ab]">Today</p>
                  {threads[activeCand.id].map((m, i) => (
                    <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} gap-2`}>
                      {m.from === "them" && <Avatar name={activeCand.name} className="w-8 h-8 text-xs self-end" />}
                      <div className="max-w-[75%]">
                        <div className={`px-4 py-3 text-sm leading-relaxed rounded-2xl ${m.from === "me" ? "bg-[#353457] text-white rounded-br-md" : "bg-[#cdccd5]/40 text-[#03012d] rounded-bl-md"}`}>{m.text}</div>
                        <p className={`text-[11px] text-[#9a99ab] mt-1 ${m.from === "me" ? "text-right" : ""}`}>{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-[#cdccd5]/60 flex items-center gap-3">
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }} placeholder="Type a message..." className="flex-1 bg-[#f8f9fa] border border-[#cdccd5] rounded-full py-3 px-5 text-sm focus:outline-none focus:border-[#353457]" />
                  <button onClick={sendMessage} disabled={!draft.trim()} aria-label="Send message" className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors shrink-0 ${draft.trim() ? "bg-[#353457] hover:bg-[#03012d]" : "bg-[#cdccd5]"}`}><Send size={18} /></button>
                </div>
              </div>
            </div>
          </main>
        ) : activeNav === "Matches" ? (
          <main className="flex-1 overflow-y-auto p-4 lg:px-6 lg:pb-6">
            <h1 className="text-3xl font-extrabold">Matches</h1>
            <p className="text-[#cdccd5] text-sm mt-1 mb-5">Job seekers who have already liked your company.</p>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex flex-wrap gap-2">
                {tabs.map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${tab === t ? "bg-[#686781] text-white" : "bg-white/10 text-[#cdccd5] hover:bg-white/15"}`}>
                    {t === "All" ? "All Matches" : t} ({countFor(t)})
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm text-[#cdccd5]">
                Sort by:
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#1b1a45] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none">
                  <option value="recent">Most Recent</option>
                  <option value="match">Highest Match</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </label>
            </div>
            {matchList.length === 0 ? (
              <div className={`${glass} p-10 text-center max-w-md`}>
                <h2 className="text-xl font-bold mb-2">No matches here yet</h2>
                <p className="text-sm text-[#cdccd5]">Try another tab or a different search.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {matchList.map(c => {
                  const status = statuses[c.id];
                  return (
                    <div key={c.id} className="bg-white rounded-2xl p-4 text-[#03012d] shadow-xl">
                      <div className="flex gap-3">
                        <div className="relative shrink-0">
                          <Avatar name={c.name} className="w-24 h-28 !rounded-xl text-2xl" />
                          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${statusStyle[status]}`}>{status}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold truncate">{c.name}, {c.age}</h3>
                          <p className="text-sm text-[#686781] truncate">{c.role}</p>
                          <p className="flex items-center gap-1 text-xs text-[#686781] mt-1.5"><MapPin size={12} /> {c.location}</p>
                          <p className="flex items-center gap-1 text-xs text-[#686781] mt-1"><Briefcase size={12} /> {c.experience}</p>
                          <span className="inline-flex items-center gap-1.5 mt-2 bg-[#353457]/10 text-[#353457] text-xs font-bold px-3 py-1.5 rounded-lg"><Heart size={12} className="fill-[#353457]" /> {c.match}% Match</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {c.skills.slice(0, 3).map(sk => <span key={sk} className="text-xs px-2.5 py-1 bg-[#cdccd5]/30 text-[#353457] rounded-full">{sk}</span>)}
                        {c.skills.length > 3 && <span className="text-xs px-2.5 py-1 bg-[#cdccd5]/30 text-[#353457] rounded-full">+{c.skills.length - 3}</span>}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button onClick={() => setProfile(c)} className="py-2.5 rounded-xl border border-[#cdccd5] text-sm font-semibold hover:bg-gray-50">View Profile</button>
                        {status === "Shortlisted" ? (
                          <button onClick={() => openChat(c.id)} className="py-2.5 rounded-xl bg-[#03012d] text-white text-sm font-semibold hover:bg-[#353457] flex items-center justify-center gap-2"><MessageCircle size={15} /> Message</button>
                        ) : (
                          <button onClick={() => shortlist(c)} className="py-2.5 rounded-xl bg-[#03012d] text-white text-sm font-semibold hover:bg-[#353457]">Shortlist</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        ) : activeNav !== "Home" ? (
          <main className="flex-1 flex items-center justify-center p-6 text-center">
            <div className={`${glass} p-10 max-w-md`}>
              <h2 className="text-2xl font-bold mb-2">{activeNav}</h2>
              <p className="text-[#cdccd5] text-sm">This section is coming next. Head back to Home to keep reviewing candidates.</p>
              <button onClick={() => setActiveNav("Home")} className="mt-6 px-6 py-2.5 rounded-full bg-white text-[#03012d] text-sm font-bold">Back to Home</button>
            </div>
          </main>
        ) : (
          <main className="flex-1 grid lg:grid-cols-[1fr_380px] gap-6 p-4 lg:px-6 lg:pb-6 overflow-y-auto">
            {/* CANDIDATE DECK */}
            <section className="flex flex-col items-center min-w-0">
              <div className="w-full mb-4">
                <h1 className="text-2xl lg:text-3xl font-extrabold">Good day, {companyName}!</h1>
                <p className="text-[#cdccd5] text-sm mt-1">Swipe through job seekers who are interested in your company.</p>
              </div>

              {current ? (
                <div className="relative w-full max-w-sm flex items-center justify-center">
                  <button onClick={() => browse(-1)} aria-label="Previous candidate" className="absolute -left-4 sm:-left-14 z-10 w-11 h-11 rounded-full bg-white/90 text-[#03012d] flex items-center justify-center shadow-lg"><ChevronLeft size={20} /></button>
                  <AnimatePresence mode="wait">
                    <motion.div key={current.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.2 }} className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden text-[#03012d]">
                      <div className="relative h-60 bg-gradient-to-br from-[#353457] via-[#686781] to-purple-300 flex items-center justify-center">
                        <span className="text-7xl font-extrabold text-white/80">{current.name.split(" ").map(n => n[0]).slice(0, 2).join("")}</span>
                        <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 text-[#353457] text-xs font-semibold px-3 py-1.5 rounded-full"><Heart size={12} className="fill-[#353457]" /> Interested in you</span>
                        <span className="absolute top-4 right-4 bg-[#03012d]/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full">{index + 1} / {visible.length}</span>
                        <span className="absolute bottom-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">{current.match}% Match</span>
                        {prefs.quick.highlightTop && current.match >= 90 && <span className="absolute bottom-4 left-4 bg-amber-400 text-[#03012d] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"><Star size={12} /> Top Match</span>}
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="text-xl font-bold">{current.name}, {current.age}</h2>
                          {current.online && <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span>Online</span>}
                        </div>
                        <p className="flex items-center gap-1 text-sm text-[#686781] mt-1"><MapPin size={14} /> {current.location}</p>
                        <p className="font-bold mt-3">{current.role}</p>
                        <p className="text-xs text-[#686781]">{current.experience} • {current.availability}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {current.skills.slice(0, 4).map(s => <span key={s} className="text-xs px-2.5 py-1 bg-[#cdccd5]/30 text-[#353457] rounded-full">{s}</span>)}
                          {current.skills.length > 4 && <span className="text-xs px-2.5 py-1 bg-[#cdccd5]/30 text-[#353457] rounded-full">+{current.skills.length - 4}</span>}
                        </div>
                        <p className="text-sm text-[#686781] mt-3 leading-relaxed">{current.bio}</p>
                        <div className="flex justify-center gap-6 mt-5">
                          <button onClick={() => decide(false)} aria-label="Pass" className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shadow-md"><X size={28} /></button>
                          <button onClick={() => decide(true)} aria-label="Add to shortlist" className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-md"><Heart size={28} /></button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <button onClick={() => browse(1)} aria-label="Next candidate" className="absolute -right-4 sm:-right-14 z-10 w-11 h-11 rounded-full bg-white/90 text-[#03012d] flex items-center justify-center shadow-lg"><ChevronRight size={20} /></button>
                </div>
              ) : (
                <div className={`${glass} p-10 text-center max-w-sm w-full`}>
                  <h2 className="text-xl font-bold mb-2">{q ? "No candidates match your search" : deck.length > 0 ? "Your hiring preferences are filtering everyone out" : "You've reviewed everyone for now"}</h2>
                  <p className="text-sm text-[#cdccd5]">{q ? "Try a different skill or role." : deck.length > 0 ? "Lower the minimum match in Settings, then Hiring Preferences." : "New interested candidates will show up here."}</p>
                </div>
              )}
            </section>

            {/* RIGHT PANEL */}
            <aside className="flex flex-col gap-4 min-w-0">
              <div className={`${glass} p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2"><Heart size={18} /> Your Matches</h3>
                  <button onClick={() => setActiveNav("Matches")} className="text-xs text-[#cdccd5] hover:text-white">View All</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {stats.map((s, i) => (
                    <div key={s.label} className={`rounded-xl p-2 text-center ${i === 0 ? "bg-[#686781]" : "bg-white/10"}`}>
                      <p className="text-xl font-extrabold">{s.value}</p>
                      <p className="text-[10px] leading-tight text-[#cdccd5]">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${glass} p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold flex items-center gap-2"><Users size={18} /> Recent Matches</h3>
                  <button onClick={() => setActiveNav("Matches")} className="text-xs text-[#cdccd5] hover:text-white">View All</button>
                </div>
                <ul className="space-y-3">
                  {employerCandidates.map(c => (
                    <li key={c.id} className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar name={c.name} className="w-11 h-11 text-sm" />
                        {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#1b1a45] rounded-full"></span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{c.name}</p>
                        <p className="text-xs text-[#cdccd5] truncate">{c.role}</p>
                        <p className="text-[11px] text-[#9a99ab]">{c.ago}</p>
                      </div>
                      {c.isNew && <span className="text-[10px] font-bold bg-purple-300/30 text-purple-100 px-2 py-0.5 rounded-md">New</span>}
                      <button aria-label={`Message ${c.name}`} className="w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10"><MessageCircle size={16} /></button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`${glass} p-5 flex items-center gap-4`}>
                <div className="flex-1">
                  <h3 className="font-bold flex items-center gap-2 text-sm"><Lightbulb size={16} className="text-amber-300" /> Recruit Smarter</h3>
                  <p className="text-xs text-[#cdccd5] mt-1">Use filters and job requirements to find the best candidates for your team.</p>
                </div>
                <button className="px-4 py-2 rounded-full bg-white/15 text-xs font-bold hover:bg-white/25 shrink-0">Learn More</button>
              </div>
            </aside>
          </main>
        )}
      </div>

      {helpModal && (
        <div className="fixed inset-0 bg-[#03012d]/80 z-50 flex items-center justify-center p-4" onClick={() => setHelpModal(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white text-[#03012d] rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setHelpModal(null)} aria-label="Close" className="absolute top-4 right-4 text-[#9a99ab] hover:text-[#03012d]"><X size={22} /></button>
            {helpModal.kind === "article" && (() => {
              const art = helpArticles.find(x => x.id === (helpModal as { kind: "article"; id: number }).id);
              if (!art) return null;
              return (
                <>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#353457]/10 text-[#353457]">{art.topic}</span>
                  <h2 className="text-xl font-extrabold mt-3 mb-3 pr-6">{art.title}</h2>
                  <div className="space-y-3 text-sm text-[#686781] leading-relaxed">{art.body.map((para, i) => <p key={i}>{para}</p>)}</div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-[#cdccd5]/60">
                    <div className="flex items-center gap-2 text-sm"><span className="text-[#686781]">Was this helpful?</span>
                      <button onClick={() => { setHelpModal(null); flash("Thanks for your feedback"); }} className="px-3 py-1.5 rounded-lg border border-[#cdccd5] text-xs font-semibold hover:bg-gray-50">Yes</button>
                      <button onClick={() => { setHelpModal(null); flash("Thanks. We'll work on improving this article."); }} className="px-3 py-1.5 rounded-lg border border-[#cdccd5] text-xs font-semibold hover:bg-gray-50">No</button>
                    </div>
                    <button onClick={() => openTicket("message")} className="text-xs font-semibold text-[#353457] hover:underline">Still need help? Contact support</button>
                  </div>
                </>
              );
            })()}
            {helpModal.kind === "faq" && (
              <>
                <h2 className="text-xl font-extrabold mb-4">Frequently Asked Questions</h2>
                <ul className="divide-y divide-[#cdccd5]/50 border border-[#cdccd5]/60 rounded-xl">
                  {faqs.map((f, i) => (
                    <li key={f.q}>
                      <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} aria-expanded={faqOpen === i} className="w-full flex items-center gap-3 px-4 py-3 text-left"><span className="flex-1 text-sm font-semibold">{f.q}</span><ChevronDown size={18} className={`text-[#9a99ab] transition-transform ${faqOpen === i ? "rotate-180" : ""}`} /></button>
                      {faqOpen === i && <p className="px-4 pb-3 text-sm text-[#686781] leading-relaxed">{f.a}</p>}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {helpModal.kind === "ticket" && (
              <>
                <h2 className="text-xl font-extrabold mb-1">{helpModal.type === "call" ? "Request a Call" : helpModal.type === "chat" ? "Start a Live Chat" : "Send us a message"}</h2>
                <p className="text-xs text-[#686781] mb-4">{helpModal.type === "call" ? "Tell us when to call and we'll schedule it." : helpModal.type === "chat" ? "An agent will pick up your request as soon as they can." : "We reply within 1 business day."}</p>
                <div className="space-y-3">
                  {helpModal.type === "call" ? (
                    <>
                      <Field label="Phone number" required><input value={tk.phone} onChange={(e) => setTk({ ...tk, phone: e.target.value })} className={`w-full px-3 py-2.5 bg-[#f8f9fa] border rounded-lg text-sm focus:outline-none ${tkErr.phone ? "border-red-400" : "border-[#cdccd5]"}`} />{tkErr.phone && <span className="text-xs text-red-600">{tkErr.phone}</span>}</Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Preferred date" required><input type="date" value={tk.date} onChange={(e) => setTk({ ...tk, date: e.target.value })} className={`w-full px-3 py-2.5 bg-[#f8f9fa] border rounded-lg text-sm focus:outline-none ${tkErr.date ? "border-red-400" : "border-[#cdccd5]"}`} />{tkErr.date && <span className="text-xs text-red-600">{tkErr.date}</span>}</Field>
                        <Field label="Time window"><select value={tk.slot} onChange={(e) => setTk({ ...tk, slot: e.target.value })} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none"><option>9:00 AM - 12:00 PM</option><option>1:00 PM - 3:00 PM</option><option>3:00 PM - 6:00 PM</option></select></Field>
                      </div>
                      <Field label="What's it about? (optional)"><textarea rows={3} value={tk.message} onChange={(e) => setTk({ ...tk, message: e.target.value })} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" /></Field>
                    </>
                  ) : (
                    <>
                      {helpModal.type === "message" && <Field label="Subject" required><input value={tk.subject} onChange={(e) => setTk({ ...tk, subject: e.target.value })} className={`w-full px-3 py-2.5 bg-[#f8f9fa] border rounded-lg text-sm focus:outline-none ${tkErr.subject ? "border-red-400" : "border-[#cdccd5]"}`} />{tkErr.subject && <span className="text-xs text-red-600">{tkErr.subject}</span>}</Field>}
                      <Field label="Topic"><select value={tk.category} onChange={(e) => setTk({ ...tk, category: e.target.value })} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none"><option>General</option>{helpTopics.map(t => <option key={t.name}>{t.name}</option>)}</select></Field>
                      <Field label="How can we help?" required><textarea rows={4} value={tk.message} onChange={(e) => setTk({ ...tk, message: e.target.value })} className={`w-full px-3 py-2.5 bg-[#f8f9fa] border rounded-lg text-sm focus:outline-none ${tkErr.message ? "border-red-400" : "border-[#cdccd5]"}`} />{tkErr.message && <span className="text-xs text-red-600">{tkErr.message}</span>}</Field>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button onClick={() => setHelpModal(null)} className="py-3 rounded-xl border border-[#cdccd5] text-sm font-semibold">Cancel</button>
                  <button onClick={submitTicket} className="py-3 rounded-xl bg-[#353457] text-white text-sm font-bold hover:bg-[#03012d]">{helpModal.type === "call" ? "Request call" : "Send"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {checkout && (
        <div className="fixed inset-0 bg-[#03012d]/80 z-50 flex items-center justify-center p-4" onClick={() => !paying && setCheckout(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white text-[#03012d] rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => !paying && setCheckout(null)} aria-label="Close" className="absolute top-4 right-4 text-[#9a99ab] hover:text-[#03012d]"><X size={22} /></button>
            <h2 className="text-xl font-extrabold mb-4">{planOrder.indexOf(checkout) > planOrder.indexOf(subPlan) ? "Upgrade" : "Switch"} to {checkout}</h2>
            <div className="flex bg-[#f1f1f5] rounded-full p-1 mb-4 w-fit">
              {["Monthly", "Yearly"].map(c => <button key={c} onClick={() => setBillCycle(c)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${billCycle === c ? "bg-[#353457] text-white" : "text-[#686781]"}`}>{c}{c === "Yearly" ? " (-20%)" : ""}</button>)}
            </div>
            <div className="border border-[#cdccd5]/60 rounded-xl p-3 text-sm space-y-1.5 mb-4">
              <div className="flex justify-between"><span className="text-[#686781]">Plan</span><span className="font-semibold">{checkout}</span></div>
              <div className="flex justify-between"><span className="text-[#686781]">Billing cycle</span><span className="font-semibold">{billCycle}</span></div>
              <div className="flex justify-between border-t border-[#cdccd5]/50 pt-1.5"><span className="font-bold">Total due today</span><span className="font-extrabold">{peso(planCost(checkout, billCycle))}</span></div>
            </div>
            <p className="text-xs font-semibold text-[#353457] mb-1.5">Payment method</p>
            {cards.length === 0 ? (
              <button onClick={() => { setCardErr({}); setCardModal(true); }} className="w-full py-3 rounded-xl border border-dashed border-[#353457] text-[#353457] text-sm font-semibold hover:bg-[#353457]/5">+ Add a payment method</button>
            ) : (
              <select value={selCard} onChange={(e) => setSelCard(Number(e.target.value))} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">{cards.map(c => <option key={c.id} value={c.id}>{c.brand} •••• {c.last4} (exp {c.exp})</option>)}</select>
            )}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button onClick={() => setCheckout(null)} disabled={paying} className="py-3 rounded-xl border border-[#cdccd5] text-sm font-semibold">Cancel</button>
              <button onClick={payNow} disabled={!cards.length || paying} className={`py-3 rounded-xl text-sm font-bold text-white ${cards.length && !paying ? "bg-[#353457] hover:bg-[#03012d]" : "bg-[#cdccd5] cursor-not-allowed"}`}>{paying ? "Processing..." : `Pay ${peso(planCost(checkout, billCycle))}`}</button>
            </div>
            <p className="text-[11px] text-[#9a99ab] mt-3 text-center">Demo only: no real payment is processed.</p>
          </div>
        </div>
      )}

      {cardModal && (
        <div className="fixed inset-0 bg-[#03012d]/80 z-[60] flex items-center justify-center p-4" onClick={() => setCardModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white text-[#03012d] rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setCardModal(false)} aria-label="Close" className="absolute top-4 right-4 text-[#9a99ab] hover:text-[#03012d]"><X size={22} /></button>
            <h2 className="text-xl font-extrabold mb-4">Add Payment Method</h2>
            <div className="space-y-3">
              <Field label="Card number" required>
                <input inputMode="numeric" autoComplete="off" value={cardForm.number} onChange={(e) => setCardForm({ ...cardForm, number: e.target.value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim() })} placeholder="1234 5678 9012 3456" className={`w-full px-3 py-2.5 bg-[#f8f9fa] border rounded-lg text-sm focus:outline-none ${cardErr.number ? "border-red-400" : "border-[#cdccd5]"}`} />
                {cardErr.number && <span className="text-xs text-red-600">{cardErr.number}</span>}
              </Field>
              <Field label="Name on card" required>
                <input value={cardForm.name} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })} className={`w-full px-3 py-2.5 bg-[#f8f9fa] border rounded-lg text-sm focus:outline-none ${cardErr.name ? "border-red-400" : "border-[#cdccd5]"}`} />
                {cardErr.name && <span className="text-xs text-red-600">{cardErr.name}</span>}
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Expiry (MM/YY)" required>
                  <input inputMode="numeric" value={cardForm.exp} onChange={(e) => { const d = e.target.value.replace(/\D/g, "").slice(0, 4); setCardForm({ ...cardForm, exp: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }); }} placeholder="08/29" className={`w-full px-3 py-2.5 bg-[#f8f9fa] border rounded-lg text-sm focus:outline-none ${cardErr.exp ? "border-red-400" : "border-[#cdccd5]"}`} />
                  {cardErr.exp && <span className="text-xs text-red-600">{cardErr.exp}</span>}
                </Field>
                <Field label="CVC" required>
                  <input inputMode="numeric" autoComplete="off" type="password" value={cardForm.cvc} onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="123" className={`w-full px-3 py-2.5 bg-[#f8f9fa] border rounded-lg text-sm focus:outline-none ${cardErr.cvc ? "border-red-400" : "border-[#cdccd5]"}`} />
                  {cardErr.cvc && <span className="text-xs text-red-600">{cardErr.cvc}</span>}
                </Field>
              </div>
              <p className="text-[11px] text-[#9a99ab]">Demo only. Only the card type and last 4 digits are kept, and nothing is sent anywhere.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button onClick={() => setCardModal(false)} className="py-3 rounded-xl border border-[#cdccd5] text-sm font-semibold">Cancel</button>
              <button onClick={submitCard} className="py-3 rounded-xl bg-[#353457] text-white text-sm font-bold hover:bg-[#03012d]">Save card</button>
            </div>
          </div>
        </div>
      )}

      {manageOpen && (
        <div className="fixed inset-0 bg-[#03012d]/80 z-50 flex items-center justify-center p-4" onClick={() => setManageOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white text-[#03012d] rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setManageOpen(false)} aria-label="Close" className="absolute top-4 right-4 text-[#9a99ab] hover:text-[#03012d]"><X size={22} /></button>
            <h2 className="text-xl font-extrabold mb-2">Manage Plan</h2>
            {subPlan === "Free" ? (
              <>
                <p className="text-sm text-[#686781] mb-4">You're on the Free plan. Pick Pro or Business to get unlimited job postings and candidate views.</p>
                <button onClick={() => setManageOpen(false)} className="w-full py-3 rounded-xl bg-[#353457] text-white text-sm font-bold">Choose a plan</button>
              </>
            ) : (
              <>
                <p className="text-sm text-[#686781] mb-1">You're on the <span className="font-bold">{subPlan}</span> plan, billed {subCycle.toLowerCase()}.</p>
                <p className="text-sm text-[#686781] mb-4">Next billing date: {nextBilling || "\u2014"}</p>
                <button onClick={cancelPlan} className="w-full py-3 rounded-xl border border-red-400 text-red-600 text-sm font-semibold hover:bg-red-50">Cancel subscription</button>
                <button onClick={() => setManageOpen(false)} className="w-full mt-2 py-3 rounded-xl border border-[#cdccd5] text-sm font-semibold">Keep my plan</button>
              </>
            )}
          </div>
        </div>
      )}

      {privModal && (
        <div className="fixed inset-0 bg-[#03012d]/80 z-50 flex items-center justify-center p-4" onClick={() => setPrivModal(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white text-[#03012d] rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setPrivModal(null)} aria-label="Close" className="absolute top-4 right-4 text-[#9a99ab] hover:text-[#03012d]"><X size={22} /></button>
            {privModal === "sessions" && (
              <>
                <h2 className="text-xl font-extrabold mb-1">Login Sessions</h2>
                <p className="text-xs text-[#686781] mb-4">Devices that are signed in to your account.</p>
                <ul className="space-y-3">
                  {sessions.map(se => (
                    <li key={se.id} className="flex items-center gap-3 border border-[#cdccd5]/60 rounded-xl p-3">
                      <div className="flex-1 min-w-0"><p className="text-sm font-semibold">{se.device}</p><p className="text-[11px] text-[#686781]">{se.place} • {se.when}</p></div>
                      {se.tag === "Current" ? <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Current</span>
                        : <button onClick={() => { setSessions(prev => prev.filter(x => x.id !== se.id)); flash("Device signed out"); }} className="text-xs font-semibold text-red-600 hover:underline">Sign out</button>}
                    </li>
                  ))}
                </ul>
                {sessions.length > 1 && <button onClick={() => { setSessions(prev => prev.filter(x => x.tag === "Current")); flash("Signed out of all other devices"); }} className="w-full mt-4 py-3 rounded-xl border border-red-400 text-red-600 text-sm font-semibold hover:bg-red-50">Sign out of all other devices</button>}
              </>
            )}
            {privModal === "blocked" && (
              <>
                <h2 className="text-xl font-extrabold mb-1">Blocked Users</h2>
                <p className="text-xs text-[#686781] mb-4">Blocked candidates can't see your jobs or message you.</p>
                {blocked.length === 0 && <p className="text-sm text-[#686781] text-center py-6">You haven't blocked anyone.</p>}
                <ul className="space-y-3">
                  {blocked.map(b => (
                    <li key={b.id} className="flex items-center gap-3 border border-[#cdccd5]/60 rounded-xl p-3">
                      <Avatar name={b.name} className="w-10 h-10 text-xs" />
                      <div className="flex-1 min-w-0"><p className="text-sm font-semibold">{b.name}</p><p className="text-xs text-[#686781]">{b.role}</p></div>
                      <button onClick={() => { setBlocked(prev => prev.filter(x => x.id !== b.id)); flash(`${b.name} unblocked`); }} className="px-3 py-1.5 rounded-lg bg-[#f1f1f5] text-[#353457] text-xs font-semibold hover:bg-[#e4e4ea]">Unblock</button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {privModal === "cookies" && (
              <>
                <h2 className="text-xl font-extrabold mb-1">Cookies & Tracking</h2>
                <p className="text-xs text-[#686781] mb-4">Choose which cookies we can use.</p>
                <div className="divide-y divide-[#cdccd5]/50">
                  <div className="flex items-center gap-3 py-3"><div className="flex-1"><p className="text-sm font-semibold">Essential</p><p className="text-xs text-[#686781]">Needed for sign-in and security. Always on.</p></div><Toggle on={true} onChange={() => {}} label="Essential cookies" /></div>
                  <div className="flex items-center gap-3 py-3"><div className="flex-1"><p className="text-sm font-semibold">Analytics</p><p className="text-xs text-[#686781]">Helps us understand how the platform is used.</p></div><Toggle on={cookiePrefs.analytics} onChange={(v) => setCookiePrefs(prev => ({ ...prev, analytics: v }))} label="Analytics cookies" /></div>
                  <div className="flex items-center gap-3 py-3"><div className="flex-1"><p className="text-sm font-semibold">Marketing</p><p className="text-xs text-[#686781]">Used to show relevant announcements.</p></div><Toggle on={cookiePrefs.marketing} onChange={(v) => setCookiePrefs(prev => ({ ...prev, marketing: v }))} label="Marketing cookies" /></div>
                </div>
                <button onClick={() => { setPrivModal(null); flash("Cookie preferences saved"); }} className="w-full mt-4 py-3 rounded-xl bg-[#353457] text-white text-sm font-bold hover:bg-[#03012d]">Save preferences</button>
              </>
            )}
            {privModal === "usage" && (
              <>
                <h2 className="text-xl font-extrabold mb-3">Data Usage</h2>
                <div className="space-y-3 text-sm text-[#686781] leading-relaxed">
                  <p>KAIROS uses your company details, job postings and hiring activity to match you with candidates and to show your listings to job seekers.</p>
                  <p>Candidate information you view stays tied to the roles you hire for, and your messages are only visible to you and the candidate.</p>
                  <p>You can request a copy of your data or delete your account at any time from this page.</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {pwModal && (
        <div className="fixed inset-0 bg-[#03012d]/80 z-50 flex items-center justify-center p-4" onClick={() => setPwModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white text-[#03012d] rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setPwModal(false)} aria-label="Close" className="absolute top-4 right-4 text-[#9a99ab] hover:text-[#03012d]"><X size={22} /></button>
            <h2 className="text-xl font-extrabold mb-4">Change Password</h2>
            <div className="space-y-3">
              <Field label="Current password"><input type="password" value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" /></Field>
              <Field label="New password (8+ characters)"><input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" /></Field>
              <Field label="Confirm new password"><input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" /></Field>
              {pwErr && <p className="text-xs text-red-600 font-medium">{pwErr}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button onClick={() => setPwModal(false)} className="py-3 rounded-xl border border-[#cdccd5] text-sm font-semibold">Cancel</button>
              <button onClick={submitPassword} className="py-3 rounded-xl bg-[#353457] text-white text-sm font-bold hover:bg-[#03012d]">Update</button>
            </div>
          </div>
        </div>
      )}

      {delModal && (
        <div className="fixed inset-0 bg-[#03012d]/80 z-50 flex items-center justify-center p-4" onClick={() => setDelModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white text-[#03012d] rounded-2xl p-6 w-full max-w-sm shadow-2xl border-t-8 border-red-500">
            <h2 className="text-xl font-extrabold mb-2">Delete account?</h2>
            <p className="text-sm text-[#686781] mb-3">This permanently removes your account and all company data. Type <span className="font-bold">DELETE</span> to confirm.</p>
            <input value={delText} onChange={(e) => setDelText(e.target.value)} placeholder="DELETE" className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" />
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button onClick={() => setDelModal(false)} className="py-3 rounded-xl border border-[#cdccd5] text-sm font-semibold">Cancel</button>
              <button onClick={() => { setDelModal(false); onBack(); }} disabled={delText !== "DELETE"} className={`py-3 rounded-xl text-sm font-bold text-white ${delText === "DELETE" ? "bg-red-500 hover:bg-red-600" : "bg-red-200 cursor-not-allowed"}`}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-[#03012d]/80 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white text-[#03012d] rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModal(null)} aria-label="Close" className="absolute top-4 right-4 text-[#9a99ab] hover:text-[#03012d]"><X size={22} /></button>
            <h2 className="text-xl font-extrabold mb-4">{modal.mode === "schedule" ? "Schedule interview" : "Schedule Event"}</h2>
            <div className="space-y-3">
              {modal.mode === "new" && (
                <Field label="Event type">
                  <select value={mf.type} onChange={(e) => setMf({ ...mf, type: e.target.value })} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">
                    <option>Interview invite</option><option>Team Meeting</option><option>Client Meeting</option><option>Deadline</option><option>Offer Discussion</option>
                  </select>
                </Field>
              )}
              {modal.mode === "new" && mf.type === "Interview invite" ? (
                <>
                  <Field label="Candidate">
                    <select value={mf.candidateId} onChange={(e) => setMf({ ...mf, candidateId: Number(e.target.value) })} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">
                      {employerCandidates.map(c => <option key={c.id} value={c.id}>{c.name} • {c.role}</option>)}
                    </select>
                  </Field>
                  <Field label="Message (optional)"><textarea rows={3} value={mf.notes} onChange={(e) => setMf({ ...mf, notes: e.target.value })} placeholder="Add a short note for the candidate..." className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" /></Field>
                  <p className="text-xs text-[#686781]">The candidate has to accept this invite first. After that, you can pick the date and time.</p>
                </>
              ) : (
                <>
                  {modal.mode === "new" && <Field label="Title"><input value={mf.title} onChange={(e) => setMf({ ...mf, title: e.target.value })} placeholder={mf.type} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" /></Field>}
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Date" required><input type="date" value={mf.date} onChange={(e) => { setMf({ ...mf, date: e.target.value }); setMfErr(""); }} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" /></Field>
                    <Field label="Time" required><input type="time" value={mf.time} onChange={(e) => { setMf({ ...mf, time: e.target.value }); setMfErr(""); }} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" /></Field>
                    <Field label="Duration">
                      <select value={mf.duration} onChange={(e) => setMf({ ...mf, duration: Number(e.target.value) })} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">
                        <option value={30}>30 minutes</option><option value={45}>45 minutes</option><option value={60}>1 hour</option><option value={90}>1.5 hours</option>
                      </select>
                    </Field>
                    <Field label="Where">
                      <select value={mf.platform} onChange={(e) => setMf({ ...mf, platform: e.target.value })} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none">
                        <option>Google Meet</option><option>Zoom</option><option>Microsoft Teams</option><option>On-site</option><option>Phone call</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Notes (optional)"><textarea rows={2} value={mf.notes} onChange={(e) => setMf({ ...mf, notes: e.target.value })} className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#cdccd5] rounded-lg text-sm focus:outline-none" /></Field>
                </>
              )}
              {mfErr && <p className="text-xs text-red-600 font-medium">{mfErr}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button onClick={() => setModal(null)} className="py-3 rounded-xl border border-[#cdccd5] text-sm font-semibold">Cancel</button>
              <button onClick={submitEvent} className="py-3 rounded-xl bg-[#353457] text-white text-sm font-bold hover:bg-[#03012d]">{modal.mode === "schedule" ? "Confirm schedule" : mf.type === "Interview invite" ? "Send invite" : "Add to calendar"}</button>
            </div>
          </div>
        </div>
      )}

      {profile && (
        <div className="fixed inset-0 bg-[#03012d]/80 z-50 flex items-center justify-center p-4" onClick={() => setProfile(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white text-[#03012d] rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setProfile(null)} aria-label="Close" className="absolute top-4 right-4 text-[#9a99ab] hover:text-[#03012d]"><X size={22} /></button>
            <div className="flex items-center gap-4 mb-4">
              <Avatar name={profile.name} className="w-16 h-16 text-xl" />
              <div>
                <h2 className="text-xl font-bold">{profile.name}, {profile.age}</h2>
                <p className="text-sm text-[#686781]">{profile.role}</p>
              </div>
            </div>
            <p className="text-sm text-[#686781] flex items-center gap-1"><MapPin size={14} /> {profile.location}</p>
            <p className="text-sm text-[#686781] mt-1">{profile.experience} • {profile.availability}</p>
            <p className="text-sm font-bold text-[#353457] mt-3">{profile.match}% Match • {statuses[profile.id]}</p>
            <p className="text-sm text-[#686781] mt-3 leading-relaxed">{profile.bio}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profile.skills.map(sk => <span key={sk} className="text-xs px-2.5 py-1 bg-[#cdccd5]/30 text-[#353457] rounded-full">{sk}</span>)}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button onClick={() => setProfile(null)} className="py-3 rounded-xl border border-[#cdccd5] text-sm font-semibold">Close</button>
              {statuses[profile.id] === "Shortlisted" ? (
                <button onClick={() => messageCandidate(profile.id)} className="py-3 rounded-xl bg-[#03012d] text-white text-sm font-semibold">Message</button>
              ) : (
                <button onClick={() => { shortlist(profile); setProfile(null); }} className="py-3 rounded-xl bg-[#03012d] text-white text-sm font-semibold">Shortlist</button>
              )}
            </div>
          </div>
        </div>
      )}

      {notice && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-[#03012d] text-sm font-semibold px-5 py-3 rounded-full shadow-xl z-50">{notice}</div>}
    </div>
  );
}

// --- JOB SEEKER VIEW ---
const moreJobs: typeof jobListings = [
  { id: 7, title: "Digital Marketing Associate", company: "Lumina Studio", location: "Makati City, Metro Manila", jobType: "Full-time", workSetup: "Hybrid", level: "Entry", reqEducation: ["BS Business Administration", "BS Marketing"], reqCerts: [], reqSkills: ["Marketing", "SEO", "Content Writing", "Analytics"], description: "Help plan and measure digital campaigns for creative and retail brands.", color: "from-purple-300 to-[#686781]" },
  { id: 8, title: "Data Analyst", company: "Harbor Analytics", location: "Remote (Philippines)", jobType: "Full-time", workSetup: "Remote", level: "Mid", reqEducation: ["BS Business Administration", "BS Information Technology"], reqCerts: ["Google Data Analytics"], reqSkills: ["Data Analysis", "SQL", "Excel", "Reporting"], description: "Turn business questions into dashboards and clear recommendations for client teams.", color: "from-[#353457] to-sky-300" },
  { id: 9, title: "UI/UX Designer", company: "Northwind Digital", location: "Remote (Philippines)", jobType: "Full-time", workSetup: "Remote", level: "Mid", reqEducation: ["BS Information Technology", "BS Multimedia Arts"], reqCerts: [], reqSkills: ["UI/UX", "Figma", "Product Design", "User Research"], description: "Design intuitive, user-centered interfaces for web and mobile products.", color: "from-[#686781] to-purple-300" },
  { id: 10, title: "Customer Success Associate", company: "Kape Collective", location: "Quezon City, Metro Manila", jobType: "Part-time", workSetup: "On-site", level: "Entry", reqEducation: ["BS Business Administration"], reqCerts: [], reqSkills: ["Communication", "Customer Service", "Excel"], description: "Welcome new customers, answer questions and keep our community happy.", color: "from-[#03012d] to-[#353457]" },
  { id: 11, title: "Operations Intern", company: "Sunrise Retail Group", location: "Mandaluyong, Metro Manila", jobType: "Internship", workSetup: "On-site", level: "Entry", reqEducation: ["BS Business Administration"], reqCerts: [], reqSkills: ["Excel", "Communication", "Reporting"], description: "Support store operations with reports, inventory checks and team coordination.", color: "from-purple-300 to-[#353457]" },
  { id: 12, title: "Business Development Manager", company: "PixelForge", location: "BGC, Taguig", jobType: "Contract", workSetup: "Hybrid", level: "Senior", reqEducation: ["BS Business Administration"], reqCerts: [], reqSkills: ["Sales", "Negotiation", "Communication", "Marketing"], description: "Grow partnerships and new revenue by building relationships with key clients.", color: "from-[#353457] to-[#686781]" },
];
const searchExtra: Record<number, { salaryMin: number; salaryMax: number; industry: string; posted: number; resp: string[] }> = {
  1: { salaryMin: 35000, salaryMax: 55000, industry: "Consulting", posted: 2, resp: ["Analyze business data and spot improvement opportunities", "Write clear requirements for project teams", "Present findings to stakeholders"] },
  2: { salaryMin: 25000, salaryMax: 35000, industry: "Retail", posted: 3, resp: ["Plan and run marketing campaigns", "Coordinate with creative and sales teams", "Track campaign results and report on them"] },
  3: { salaryMin: 20000, salaryMax: 28000, industry: "Telecommunications", posted: 4, resp: ["Answer customer questions by chat and phone", "Solve issues on the first contact where possible", "Log feedback to help improve our service"] },
  4: { salaryMin: 15000, salaryMax: 22000, industry: "BPO", posted: 5, resp: ["Enter and verify records accurately", "Keep spreadsheets clean and organized", "Meet daily accuracy and speed targets"] },
  5: { salaryMin: 18000, salaryMax: 25000, industry: "Creative Services", posted: 1, resp: ["Manage calendars and meeting logistics", "Prepare and file documents", "Support the team with day-to-day requests"] },
  6: { salaryMin: 110000, salaryMax: 150000, industry: "Finance", posted: 6, resp: ["Design and build secure web applications", "Review code and mentor engineers", "Plan releases with product teams"] },
  7: { salaryMin: 22000, salaryMax: 32000, industry: "Marketing & Advertising", posted: 1, resp: ["Create and schedule content across channels", "Run SEO and social media experiments", "Report on traffic and engagement"] },
  8: { salaryMin: 45000, salaryMax: 70000, industry: "Technology", posted: 2, resp: ["Build dashboards in SQL and BI tools", "Clean and validate data sources", "Share insights with clients each week"] },
  9: { salaryMin: 80000, salaryMax: 120000, industry: "Technology", posted: 2, resp: ["Design user-centered interfaces and experiences", "Conduct user research and usability testing", "Create wireframes, prototypes and high-fidelity designs"] },
  10: { salaryMin: 15000, salaryMax: 20000, industry: "Food & Hospitality", posted: 4, resp: ["Greet and support customers", "Handle orders and follow-ups", "Share customer feedback with the team"] },
  11: { salaryMin: 10000, salaryMax: 12000, industry: "Retail", posted: 6, resp: ["Prepare daily and weekly reports", "Help with inventory checks", "Support the operations manager"] },
  12: { salaryMin: 90000, salaryMax: 130000, industry: "Technology", posted: 7, resp: ["Find and win new partnerships", "Negotiate and close agreements", "Report on pipeline and revenue"] },
};
const searchCatalog = [...jobListings, ...moreJobs].map(j => ({ ...j, ...searchExtra[j.id] }));
type SearchJob = typeof searchCatalog[number];
const searchIndustries = Array.from(new Set(searchCatalog.map(j => j.industry))).sort();
const defaultBenefits = ["HMO coverage from day one", "13th month pay", "Paid time off", "Learning and development budget"];
const searchFilterDefaults = { types: [] as string[], setups: [] as string[], location: "", salaryMin: 10000, salaryMax: 150000, levels: [] as string[], industry: "", skills: [] as string[] };
const postedLabel = (d: number) => `${d} day${d > 1 ? "s" : ""} ago`;

type SeekerJob = typeof jobListings[number];
const tierBadge: Record<string, string> = { green: "bg-emerald-100 text-emerald-700", orange: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700" };
const seekerNav = [
  { label: "Home", icon: Home }, { label: "Search", icon: Search }, { label: "Messages", icon: MessageCircle, badge: 3 },
  { label: "Saved Jobs", icon: Bookmark }, { label: "Calendar", icon: CalendarDays }, { label: "Profile", icon: User }, { label: "Settings", icon: Settings },
];
const seekerTabs = [{ label: "For You", icon: Sparkles }, { label: "Remote", icon: Globe }, { label: "On-site", icon: Building2 }, { label: "Hybrid", icon: Monitor }, { label: "Entry Level", icon: Briefcase }];
const quickTips = ["Complete your profile to get better matches", "Keep your skills up to date", "Be active to get noticed by employers", "Upload your latest resume", "Add certifications to stand out", "Respond to interview invites quickly"];
const activitySeed = [
  { id: 1, kind: "like", title: "You liked a job", sub: "Business Analyst at Accenture", ago: "2h ago" },
  { id: 2, kind: "save", title: "You saved a job", sub: "Marketing Specialist at SM Investments", ago: "5h ago" },
  { id: 3, kind: "view", title: "Your profile was viewed", sub: "by a recruiter from Globe Telecom", ago: "1d ago" },
];

function SeekerCard({ job, score, tier, canLike, onPass, onLike, onDetails }: { job: SeekerJob; score: number; tier: string; canLike: boolean; onPass: () => void; onLike: () => void; onDetails: () => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  return (
    <motion.div
      className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-[#cdccd5]/60 overflow-hidden flex flex-col cursor-grab active:cursor-grabbing z-10"
      style={{ x, rotate }}
      drag="x"
      dragSnapToOrigin
      dragConstraints={{ left: -300, right: canLike ? 300 : 0 }}
      dragElastic={canLike ? 0.6 : { left: 0.6, right: 0.1 }}
      onDragEnd={(_: unknown, info: { offset: { x: number } }) => { if (info.offset.x < -100) onPass(); else if (info.offset.x > 100 && canLike) onLike(); }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className={`relative h-44 shrink-0 bg-gradient-to-br ${job.color}`}>
        <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full ${tierBadge[tier]}`}>{score}% Match</span>
        <div className="absolute -bottom-7 left-5 w-16 h-16 rounded-2xl bg-white shadow-lg border border-[#cdccd5]/60 flex items-center justify-center text-2xl font-extrabold text-[#353457]">{job.company.charAt(0)}</div>
      </div>
      <div className="pt-10 px-5 pb-5 flex-1 flex flex-col min-h-0 overflow-y-auto select-none">
        <p className="text-sm text-[#686781]">{job.company}</p>
        <h2 className="text-2xl font-extrabold leading-tight">{job.title}</h2>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#686781] mt-2"><span className="flex items-center gap-1"><MapPin size={13} /> {job.location}</span><span className="flex items-center gap-1"><Briefcase size={13} /> {job.jobType}</span><span className="flex items-center gap-1"><Building2 size={13} /> {job.workSetup}</span></p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.reqSkills.slice(0, 3).map(sk => <span key={sk} className="text-xs px-2.5 py-1 bg-[#cdccd5]/30 text-[#353457] rounded-full">{sk}</span>)}
          {job.reqSkills.length > 3 && <span className="text-xs px-2.5 py-1 bg-[#cdccd5]/30 text-[#353457] rounded-full">+{job.reqSkills.length - 3} more</span>}
        </div>
        <p className="text-sm text-[#686781] mt-3 leading-relaxed">{job.description}</p>
        <button onPointerDown={(e) => e.stopPropagation()} onClick={onDetails} className="mt-auto pt-3 text-sm font-semibold text-[#353457] hover:underline text-left">View Details &rarr;</button>
      </div>
    </motion.div>
  );
}

function JobSeekerView({ onBack, events, setEvents }: { onBack: () => void; events: CalEvent[]; setEvents: React.Dispatch<React.SetStateAction<CalEvent[]>> }) {
  const [nav, setNav] = useState("Home");
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [jobs, setJobs] = useState(jobListings);
  const [tab, setTab] = useState("For You");
  const [searchQuery, setSearchQuery] = useState("");
  const [minMatch, setMinMatch] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [saved, setSaved] = useState<SeekerJob[]>([]);
  const [activity, setActivity] = useState(activitySeed);
  const [prefs, setPrefs] = useState({ jobType: "Full-time", location: "Calamba, Laguna + 20 km", roles: "Marketing, Data Entry, Admin, Customer Support" });
  const [prefsDraft, setPrefsDraft] = useState(prefs);
  const [modal, setModal] = useState<null | "profile" | "prefs" | "tips" | "activity">(null);
  const [detailsJob, setDetailsJob] = useState<SeekerJob | null>(null);
  const [warningData, setWarningData] = useState<{ show: boolean; missing: string[]; job: SeekerJob | null }>({ show: false, missing: [], job: null });
  const [notice, setNotice] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const resumeRef = useRef<HTMLInputElement>(null);
  const [sf, setSf] = useState(searchFilterDefaults);
  const [sortBy, setSortBy] = useState("relevant");
  const [selSearch, setSelSearch] = useState<number | null>(null);
  const [sTab, setSTab] = useState("Overview");
  const [applied, setApplied] = useState<number[]>([]);
  const [showMatchInfo, setShowMatchInfo] = useState(false);
  const [sfSkill, setSfSkill] = useState("");

  const flash = (msg: string) => { setNotice(msg); setTimeout(() => setNotice(""), 2800); };
  const logActivity = (kind: string, title: string, sub: string) => setActivity(prev => [{ id: Date.now(), kind, title, sub, ago: "Just now" }, ...prev]);
  const removeJob = (id: number) => setJobs(prev => prev.filter(j => j.id !== id));
  const matchOf = (job: SeekerJob) => calculateMatch(userProfile, job);

  const q = searchQuery.trim().toLowerCase();
  const visible = useMemo(() => jobs.filter(j => {
    if (tab === "Remote" && j.workSetup !== "Remote") return false;
    if (tab === "On-site" && j.workSetup !== "On-site") return false;
    if (tab === "Hybrid" && j.workSetup !== "Hybrid") return false;
    if (tab === "Entry Level" && j.level !== "Entry") return false;
    if (calculateMatch(userProfile, j).score < minMatch) return false;
    return !q || [j.title, j.company, ...j.reqSkills].join(" ").toLowerCase().includes(q);
  }).sort((a, b) => calculateMatch(userProfile, b).score - calculateMatch(userProfile, a).score), [jobs, tab, q, minMatch, userProfile]);

  const top = visible[0];
  const completion = [userProfile.bio.trim().length > 10, !!userProfile.education, userProfile.skills.length >= 5, userProfile.certs.length >= 1, userProfile.resumeUploaded].filter(Boolean).length * 20;
  const ringC = 2 * Math.PI * 26;

  const applyTo = (job: SeekerJob) => {
    removeJob(job.id);
    setApplied(prev => prev.includes(job.id) ? prev : [...prev, job.id]);
    setSaved(prev => prev.filter(j => j.id !== job.id));
    logActivity("like", "You liked a job", `${job.title} at ${job.company}`);
    flash(`Your interest was sent to ${job.company}`);
  };
  const likeJob = (job: SeekerJob) => {
    const { tier, missingSkills } = matchOf(job);
    if (tier === "green") applyTo(job);
    else if (tier === "orange") setWarningData({ show: true, missing: missingSkills, job });
    else flash("Your match is below the minimum for this role. Improve your profile to unlock it.");
  };
  const saveJob = (job: SeekerJob) => {
    setSaved(prev => prev.some(j => j.id === job.id) ? prev : [...prev, job]);
    removeJob(job.id);
    logActivity("save", "You saved a job", `${job.title} at ${job.company}`);
    flash("Saved to your Saved Jobs");
  };
  const toggleSave = (job: SeekerJob) => {
    const has = saved.some(j => j.id === job.id);
    setSaved(prev => has ? prev.filter(j => j.id !== job.id) : [...prev, job]);
    if (!has) logActivity("save", "You saved a job", `${job.title} at ${job.company}`);
    flash(has ? "Removed from Saved Jobs" : "Saved to your Saved Jobs");
  };
  const toggleIn = (list: string[], v: string) => list.includes(v) ? list.filter(x => x !== v) : [...list, v];
  const lower = (arr: string[]) => arr.map(x => x.toLowerCase());
  const searchResults = searchCatalog.filter(j => {
    if (q && ![j.title, j.company, j.industry, ...j.reqSkills].join(" ").toLowerCase().includes(q)) return false;
    if (sf.types.length && !sf.types.includes(j.jobType)) return false;
    if (sf.setups.length && !sf.setups.includes(j.workSetup)) return false;
    if (sf.location.trim() && !j.location.toLowerCase().includes(sf.location.trim().toLowerCase())) return false;
    if (j.salaryMax < sf.salaryMin || j.salaryMin > sf.salaryMax) return false;
    if (sf.levels.length && !sf.levels.map(l => l.replace(" Level", "")).includes(j.level)) return false;
    if (sf.industry && j.industry !== sf.industry) return false;
    if (sf.skills.length && !sf.skills.some(sk => lower(j.reqSkills).includes(sk.toLowerCase()))) return false;
    return true;
  }).sort((a, b) => sortBy === "newest" ? a.posted - b.posted : sortBy === "salary" ? b.salaryMax - a.salaryMax : calculateMatch(userProfile, b).score - calculateMatch(userProfile, a).score);
  const selJob = searchResults.find(j => j.id === selSearch) ?? searchResults[0] ?? null;
  const breakdown = (job: SeekerJob) => {
    const edu = job.reqEducation.includes(userProfile.education) ? 30 : 0;
    const cert = job.reqCerts.length ? Math.round((job.reqCerts.filter(c => userProfile.certs.includes(c)).length / job.reqCerts.length) * 30) : 30;
    const skill = job.reqSkills.length ? Math.round((job.reqSkills.filter(sk => userProfile.skills.includes(sk)).length / job.reqSkills.length) * 40) : 40;
    return { edu, cert, skill };
  };
  const addSkill = () => {
    const sk = skillInput.trim();
    if (sk && !userProfile.skills.some(x => x.toLowerCase() === sk.toLowerCase())) setUserProfile(prev => ({ ...prev, skills: [...prev.skills, sk] }));
    setSkillInput("");
  };
  const pickResume = (file: File | undefined) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["pdf", "doc", "docx"].includes(ext)) return flash("Please upload a PDF, DOC, or DOCX file.");
    if (file.size > 5 * 1024 * 1024) return flash("File is too large. The limit is 5 MB.");
    setUserProfile(prev => ({ ...prev, resumeUploaded: true, resumeName: file.name }));
    flash("Resume uploaded");
  };
  const respondInvite = (id: number, status: "Accepted" | "Declined") => setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  const myInvites = events.filter(e => e.invite && e.status !== "Cancelled");
  const newInvites = events.filter(e => e.invite && e.status === "Invited").length;
  const firstName = userProfile.name.split(" ")[0];
  const card = "bg-white rounded-2xl shadow-lg border border-[#cdccd5]/50";
  const activityIcon = (k: string) => k === "like" ? <Heart size={18} className="text-orange-500 fill-orange-500" /> : k === "save" ? <Bookmark size={18} className="text-[#353457] fill-[#353457]" /> : <Eye size={18} className="text-[#353457]" />;

  return (
    <div className="min-h-screen lg:h-screen flex bg-gradient-to-br from-white via-slate-50 to-purple-100/60 text-[#03012d]">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col p-5 bg-[#03012d] text-white">
        <div className="mb-8 px-2"><p className="text-2xl font-extrabold tracking-tight">KAIROS</p><p className="text-[10px] tracking-widest text-[#9a99ab]">FOR JOB SEEKERS</p></div>
        <nav className="flex flex-col gap-1">
          {seekerNav.map(item => { const Icon = item.icon; const active = nav === item.label; const badge = item.label === "Calendar" ? newInvites : item.badge ?? 0; return (
            <button key={item.label} onClick={() => setNav(item.label)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? "bg-[#353457] text-white" : "text-[#cdccd5] hover:bg-white/10"}`}>
              <Icon size={18} /><span className="flex-1 text-left">{item.label}</span>
              {badge > 0 && <span className="bg-[#686781] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{badge}</span>}
            </button>
          ); })}
        </nav>
        <div className="mt-auto rounded-2xl bg-white/10 border border-white/10 p-4 cursor-pointer hover:bg-white/15" role="button" tabIndex={0} onClick={() => flash("Pro Job Seeker plans are coming soon")}>
          <Crown size={22} className="text-amber-300 mb-2" /><p className="font-bold text-sm">Upgrade to Pro Job Seeker</p><p className="text-xs text-[#cdccd5] mt-1">Get more matches, exclusive opportunities, and advanced insights.</p>
        </div>
        <button onClick={onBack} className="mt-4 text-sm text-[#cdccd5] hover:text-white text-left px-2">&larr; Log Out</button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:overflow-hidden">
        {/* TOP BAR */}
        <header className="flex items-center gap-3 p-4 lg:px-6 relative z-30">
          <div className="relative flex-1 max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a99ab]" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") setNav("Search"); }} placeholder="Search for job titles, companies, or keywords..." className="w-full bg-white border border-[#cdccd5] rounded-full py-3 pl-11 pr-12 text-sm focus:outline-none focus:border-[#353457] shadow-sm" />
            <button onClick={() => setShowFilter(v => !v)} aria-label="Filters" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#686781] hover:text-[#03012d]"><SlidersHorizontal size={18} /></button>
            {showFilter && (
              <div className={`${card} absolute right-0 top-full mt-2 w-64 p-4 z-40`}>
                <p className="text-sm font-bold mb-1">Minimum match: {minMatch}%</p>
                <input type="range" min={0} max={90} step={10} value={minMatch} onChange={(e) => setMinMatch(Number(e.target.value))} className="w-full" aria-label="Minimum match" />
                <button onClick={() => { setMinMatch(0); setShowFilter(false); }} className="mt-2 text-xs font-semibold text-[#353457] hover:underline">Reset</button>
              </div>
            )}
          </div>
          <button aria-label="Notifications" className="relative w-11 h-11 rounded-full bg-white border border-[#cdccd5] flex items-center justify-center shrink-0"><Bell size={18} /><span className="absolute top-2.5 right-3 w-2 h-2 bg-orange-500 rounded-full"></span></button>
          <button onClick={() => setModal("profile")} className="flex items-center gap-3 shrink-0 text-left">
            <Avatar name={userProfile.name} className="w-11 h-11 text-sm" />
            <span className="hidden sm:block leading-tight"><span className="block font-bold text-sm">{userProfile.name}</span><span className="block text-xs text-[#686781]">Job Seeker Account</span></span>
          </button>
        </header>

        <div className="lg:hidden flex gap-2 overflow-x-auto px-4 pb-2">
          {seekerNav.map(item => <button key={item.label} onClick={() => setNav(item.label)} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap ${nav === item.label ? "bg-[#353457] text-white" : "bg-white border border-[#cdccd5] text-[#686781]"}`}>{item.label}</button>)}
          <button onClick={onBack} className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap bg-white border border-[#cdccd5] text-[#686781]">Log Out</button>
        </div>

        {nav === "Home" && (
          <main className="flex-1 grid xl:grid-cols-[minmax(0,1fr)_330px] gap-5 p-4 lg:px-6 lg:pb-6 overflow-y-auto">
            <section className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-extrabold">Hi, {firstName}!</h1>
                  <p className="text-xl font-extrabold">Swipe. Match. Get Hired.</p>
                  <p className="text-sm text-[#686781] mt-1 max-w-sm">Discover job opportunities that match your skills, experience, and career goals.</p>
                </div>
                <div className={`${card} p-4 flex items-center gap-4`}>
                  <div className="relative w-16 h-16 shrink-0">
                    <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90"><circle cx="32" cy="32" r="26" fill="none" stroke="#e4e4ea" strokeWidth="6" /><circle cx="32" cy="32" r="26" fill="none" stroke="#353457" strokeWidth="6" strokeLinecap="round" strokeDasharray={ringC} strokeDashoffset={ringC * (1 - completion / 100)} /></svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold">{completion}%</span>
                  </div>
                  <div><p className="font-bold text-sm">Profile Match</p><p className="text-xs text-[#686781] max-w-[160px]">Complete your profile to get more accurate matches.</p><button onClick={() => setModal("profile")} className="text-xs font-semibold text-[#353457] hover:underline mt-1">Improve Profile &rarr;</button></div>
                </div>
              </div>

              <div className="flex gap-1.5 overflow-x-auto mb-5 bg-white/70 border border-[#cdccd5]/50 rounded-2xl p-1.5">
                {seekerTabs.map(t => { const Icon = t.icon; return (
                  <button key={t.label} onClick={() => setTab(t.label)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${tab === t.label ? "bg-white shadow text-[#03012d] border-b-2 border-[#353457]" : "text-[#686781] hover:bg-white/70"}`}><Icon size={16} /> {t.label}</button>
                ); })}
              </div>

              {top ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md h-[470px]">
                    {visible[2] && <div className="absolute inset-0 translate-x-6 rotate-6 scale-90 opacity-60 bg-white rounded-3xl border border-[#cdccd5]/60 shadow-lg p-5 pt-48"><p className="text-xs text-[#686781]">{visible[2].company}</p><p className="font-bold">{visible[2].title}</p></div>}
                    {visible[1] && <div className="absolute inset-0 -translate-x-6 -rotate-6 scale-90 opacity-70 bg-white rounded-3xl border border-[#cdccd5]/60 shadow-lg p-5 pt-48"><p className="text-xs text-[#686781]">{visible[1].company}</p><p className="font-bold">{visible[1].title}</p><span className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${tierBadge[matchOf(visible[1]).tier]}`}>{matchOf(visible[1]).score}% Match</span></div>}
                    <AnimatePresence mode="popLayout">
                      <SeekerCard key={top.id} job={top} score={matchOf(top).score} tier={matchOf(top).tier} canLike={matchOf(top).tier !== "red"} onPass={() => removeJob(top.id)} onLike={() => likeJob(top)} onDetails={() => setDetailsJob(top)} />
                    </AnimatePresence>
                  </div>
                  <div className="flex items-start justify-center gap-8 mt-5">
                    {([["Pass", X, "text-red-500", () => removeJob(top.id)], ["Save", Bookmark, "text-[#353457]", () => saveJob(top)], ["Like", Heart, "text-emerald-500", () => likeJob(top)]] as const).map(([label, Icon, color, onClick]) => (
                      <button key={label} onClick={onClick} className="flex flex-col items-center gap-2 group" aria-label={label}>
                        <span className={`w-16 h-16 rounded-full bg-white shadow-lg border border-[#cdccd5]/50 flex items-center justify-center ${color} group-hover:scale-105 transition-transform`}><Icon size={28} /></span>
                        <span className="text-sm font-semibold text-[#353457]">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`${card} p-10 text-center max-w-md mx-auto`}>
                  <h2 className="text-xl font-bold mb-2">{jobs.length === 0 ? "You're all caught up" : "No jobs match these filters"}</h2>
                  <p className="text-sm text-[#686781]">{jobs.length === 0 ? "New jobs matching your profile will show up here." : "Try another tab, a different search, or lower the minimum match."}</p>
                </div>
              )}
            </section>

            <aside className="space-y-4 min-w-0">
              <div className={`${card} p-5`}>
                <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold">My Job Preferences</h3><button onClick={() => { setPrefsDraft(prefs); setModal("prefs"); }} className="flex items-center gap-1 text-xs font-semibold text-[#353457] hover:underline"><Pencil size={13} /> Edit</button></div>
                <ul className="space-y-3">
                  {([[Briefcase, "Job Type", prefs.jobType], [MapPin, "Location", prefs.location], [BadgeCheck, "Preferred Roles", prefs.roles]] as const).map(([Icon, label, value]) => (
                    <li key={label}><button onClick={() => { setPrefsDraft(prefs); setModal("prefs"); }} className="w-full flex items-center gap-3 text-left"><span className="w-10 h-10 rounded-xl bg-[#353457]/10 text-[#353457] flex items-center justify-center shrink-0"><Icon size={18} /></span><span className="flex-1 min-w-0"><span className="block text-sm font-bold">{label}</span><span className="block text-xs text-[#686781]">{value}</span></span><ChevronRight size={18} className="text-[#9a99ab] shrink-0" /></button></li>
                  ))}
                </ul>
              </div>
              <div className={`${card} p-5`}>
                <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold flex items-center gap-2"><Lightbulb size={18} className="text-amber-400" /> Quick Tips</h3><button onClick={() => setModal("tips")} className="text-xs font-semibold text-[#353457] hover:underline">View All</button></div>
                <ul className="space-y-2.5">{quickTips.slice(0, 3).map(t => <li key={t} className="flex items-center gap-2.5 text-sm"><BadgeCheck size={18} className="text-[#353457] shrink-0" /> {t}</li>)}</ul>
              </div>
              <div className={`${card} p-5`}>
                <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold">Recent Activity</h3><button onClick={() => setModal("activity")} className="text-xs font-semibold text-[#353457] hover:underline">View All</button></div>
                <ul className="space-y-3">{activity.slice(0, 3).map(a => (
                  <li key={a.id} className="flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-[#f1f1f5] flex items-center justify-center shrink-0">{activityIcon(a.kind)}</span><span className="flex-1 min-w-0"><span className="block text-sm font-bold">{a.title}</span><span className="block text-xs text-[#686781] truncate">{a.sub}</span></span><span className="text-[11px] text-[#9a99ab] shrink-0">{a.ago}</span></li>
                ))}</ul>
              </div>
            </aside>
          </main>
        )}

        {nav === "Search" && (
          <main className="flex-1 grid xl:grid-cols-[250px_minmax(0,1fr)_390px] gap-4 p-4 lg:px-6 lg:pb-6 overflow-y-auto items-start">
            {/* FILTERS */}
            <aside className={`${card} p-5 space-y-5`}>
              <div className="flex items-center justify-between"><h2 className="font-extrabold">Filters</h2><button onClick={() => { setSf(searchFilterDefaults); setSearchQuery(""); }} className="text-xs font-semibold text-[#353457] hover:underline">Clear All</button></div>
              <div>
                <p className="text-sm font-bold mb-1.5">Job Type</p>
                {["Full-time", "Part-time", "Contract", "Internship"].map(t => <label key={t} className="flex items-center gap-2 text-sm py-1 text-[#686781]"><input type="checkbox" checked={sf.types.includes(t)} onChange={() => setSf(prev => ({ ...prev, types: toggleIn(prev.types, t) }))} /> {t}</label>)}
              </div>
              <div>
                <p className="text-sm font-bold mb-1.5">Location</p>
                <div className="relative mb-1.5"><MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99ab]" /><input value={sf.location} onChange={(e) => setSf(prev => ({ ...prev, location: e.target.value }))} placeholder="City or area" className="w-full pl-8 pr-8 py-2 border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />{sf.location && <button onClick={() => setSf(prev => ({ ...prev, location: "" }))} aria-label="Clear location" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9a99ab]"><X size={14} /></button>}</div>
                {["Remote", "Hybrid", "On-site"].map(t => <label key={t} className="flex items-center gap-2 text-sm py-1 text-[#686781]"><input type="checkbox" checked={sf.setups.includes(t)} onChange={() => setSf(prev => ({ ...prev, setups: toggleIn(prev.setups, t) }))} /> {t}</label>)}
              </div>
              <div>
                <p className="text-sm font-bold mb-1">Salary Range <span className="font-normal text-[#686781]">(per month)</span></p>
                <p className="text-xs text-[#353457] font-semibold mb-2">{peso(sf.salaryMin)} &ndash; {peso(sf.salaryMax)}{sf.salaryMax >= 150000 ? "+" : ""}</p>
                <label className="block text-[11px] text-[#9a99ab]">Minimum<input type="range" min={10000} max={150000} step={5000} value={sf.salaryMin} onChange={(e) => { const v = Number(e.target.value); setSf(prev => ({ ...prev, salaryMin: v, salaryMax: Math.max(prev.salaryMax, v) })); }} className="w-full" aria-label="Minimum salary" /></label>
                <label className="block text-[11px] text-[#9a99ab] mt-1">Maximum<input type="range" min={10000} max={150000} step={5000} value={sf.salaryMax} onChange={(e) => { const v = Number(e.target.value); setSf(prev => ({ ...prev, salaryMax: v, salaryMin: Math.min(prev.salaryMin, v) })); }} className="w-full" aria-label="Maximum salary" /></label>
              </div>
              <div>
                <p className="text-sm font-bold mb-1.5">Experience Level</p>
                {["Entry Level", "Mid Level", "Senior Level", "Executive"].map(t => <label key={t} className="flex items-center gap-2 text-sm py-1 text-[#686781]"><input type="checkbox" checked={sf.levels.includes(t)} onChange={() => setSf(prev => ({ ...prev, levels: toggleIn(prev.levels, t) }))} /> {t}</label>)}
              </div>
              <div>
                <p className="text-sm font-bold mb-1.5">Industry</p>
                <select value={sf.industry} onChange={(e) => setSf(prev => ({ ...prev, industry: e.target.value }))} className="w-full px-3 py-2 border border-[#cdccd5] rounded-lg text-sm focus:outline-none"><option value="">All industries</option>{searchIndustries.map(i => <option key={i}>{i}</option>)}</select>
              </div>
              <div>
                <p className="text-sm font-bold mb-1.5">Skills</p>
                <input value={sfSkill} onChange={(e) => setSfSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const v = sfSkill.trim(); if (v && !sf.skills.includes(v)) setSf(prev => ({ ...prev, skills: [...prev.skills, v] })); setSfSkill(""); } }} placeholder="Add skills (e.g. Excel, SQL)" className="w-full px-3 py-2 border border-[#cdccd5] rounded-lg text-sm focus:outline-none focus:border-[#353457]" />
                <div className="flex flex-wrap gap-1.5 mt-2">{sf.skills.map(sk => <span key={sk} className="flex items-center gap-1 text-[11px] px-2 py-1 bg-[#353457]/10 text-[#353457] rounded-full">{sk}<button onClick={() => setSf(prev => ({ ...prev, skills: prev.skills.filter(x => x !== sk) }))} aria-label={`Remove ${sk}`}><X size={11} /></button></span>)}</div>
                <button onClick={() => setSf(prev => ({ ...prev, skills: Array.from(new Set([...prev.skills, ...userProfile.skills])) }))} className="mt-2 text-xs font-semibold text-[#353457] hover:underline">Use my skills</button>
              </div>
            </aside>

            {/* RESULTS */}
            <section className={`${card} p-4 min-w-0`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div><h2 className="font-extrabold">Search Results</h2><p className="text-xs text-[#686781]">Showing {searchResults.length} job{searchResults.length === 1 ? "" : "s"}{searchQuery.trim() ? ` for "${searchQuery.trim()}"` : ""}</p></div>
                <label className="flex items-center gap-2 text-xs text-[#686781] shrink-0">Sort by<select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-[#cdccd5] rounded-lg px-2 py-1.5 text-sm text-[#03012d] bg-white focus:outline-none"><option value="relevant">Most Relevant</option><option value="newest">Newest</option><option value="salary">Highest Salary</option></select></label>
              </div>
              {searchResults.length === 0 ? (
                <div className="border border-dashed border-[#cdccd5] rounded-xl p-8 text-center"><p className="font-bold">No jobs found</p><p className="text-sm text-[#686781] mt-1">Try removing a filter or searching different keywords.</p><button onClick={() => { setSf(searchFilterDefaults); setSearchQuery(""); }} className="mt-3 px-4 py-2 rounded-lg bg-[#353457] text-white text-xs font-bold">Clear all filters</button></div>
              ) : (
                <ul className="space-y-2 xl:max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
                  {searchResults.map(j => { const m = calculateMatch(userProfile, j); const isSaved = saved.some(x => x.id === j.id); return (
                    <li key={j.id}>
                      <div role="button" tabIndex={0} onClick={() => { setSelSearch(j.id); setSTab("Overview"); setShowMatchInfo(false); }} onKeyDown={(e) => { if (e.key === "Enter") { setSelSearch(j.id); setSTab("Overview"); } }} className={`w-full text-left rounded-xl border p-3 cursor-pointer transition-colors ${selJob?.id === j.id ? "border-[#353457] bg-[#353457]/5" : "border-[#cdccd5]/60 hover:bg-gray-50"}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${j.color} text-white text-lg font-extrabold flex items-center justify-center shrink-0`}>{j.company.charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{j.title}</p>
                            <p className="text-xs text-[#686781]">{j.company}</p>
                            <p className="flex flex-wrap items-center gap-x-3 text-[11px] text-[#9a99ab] mt-1"><span className="flex items-center gap-1"><MapPin size={11} /> {j.workSetup}</span><span className="flex items-center gap-1"><Briefcase size={11} /> {j.jobType}</span><span>{postedLabel(j.posted)}</span></p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); toggleSave(j); }} aria-label={isSaved ? "Unsave job" : "Save job"} className="shrink-0 text-[#686781] hover:text-[#03012d]"><Bookmark size={18} className={isSaved ? "fill-[#353457] text-[#353457]" : ""} /></button>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          {j.reqSkills.slice(0, 3).map(sk => <span key={sk} className="text-[11px] px-2 py-0.5 bg-[#cdccd5]/30 text-[#353457] rounded-full">{sk}</span>)}
                          <span className={`ml-auto text-[11px] font-bold px-2.5 py-1 rounded-full ${tierBadge[m.tier]}`}>{m.score}% Match</span>
                        </div>
                      </div>
                    </li>
                  ); })}
                </ul>
              )}
            </section>

            {/* DETAILS */}
            <section className={`${card} p-5 min-w-0`}>
              {!selJob ? <p className="text-sm text-[#686781] text-center py-16">Select a job to see its details.</p> : (() => {
                const m = calculateMatch(userProfile, selJob);
                const b = breakdown(selJob);
                const isSaved = saved.some(x => x.id === selJob.id);
                const isApplied = applied.includes(selJob.id);
                return (
                  <>
                    <div className="flex items-start gap-3">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selJob.color} text-white text-xl font-extrabold flex items-center justify-center shrink-0`}>{selJob.company.charAt(0)}</div>
                      <div className="flex-1 min-w-0"><h2 className="text-xl font-extrabold leading-tight">{selJob.title}</h2><p className="text-sm text-[#686781]">{selJob.company}</p></div>
                      <button onClick={() => toggleSave(selJob)} aria-label={isSaved ? "Unsave job" : "Save job"} className="w-10 h-10 rounded-xl border border-[#cdccd5] flex items-center justify-center shrink-0"><Bookmark size={18} className={isSaved ? "fill-[#353457] text-[#353457]" : "text-[#686781]"} /></button>
                    </div>
                    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#686781] mt-3"><span className="flex items-center gap-1"><MapPin size={13} /> {selJob.workSetup === "Remote" ? "Remote" : selJob.location}</span><span className="flex items-center gap-1"><Briefcase size={13} /> {selJob.jobType}</span><span className="font-semibold text-[#353457]">{peso(selJob.salaryMin)} &ndash; {peso(selJob.salaryMax)}</span></p>
                    <p className="text-xs text-[#9a99ab] mt-1">Posted {postedLabel(selJob.posted)}</p>
                    <div className="relative flex items-center gap-2 mt-3">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${tierBadge[m.tier]}`}>{m.score}% Match</span>
                      <button onClick={() => setShowMatchInfo(v => !v)} aria-label="How is my match calculated?" className="text-[#9a99ab] hover:text-[#353457]"><Info size={16} /></button>
                      {showMatchInfo && <div className="absolute left-0 top-full mt-2 z-10 w-60 bg-white border border-[#cdccd5] rounded-xl shadow-xl p-3 text-xs space-y-1"><p className="font-bold mb-1">How your match is calculated</p><p className="flex justify-between"><span>Education</span><span className="font-semibold">{b.edu} / 30</span></p><p className="flex justify-between"><span>Certifications</span><span className="font-semibold">{b.cert} / 30</span></p><p className="flex justify-between"><span>Skills</span><span className="font-semibold">{b.skill} / 40</span></p></div>}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">{selJob.reqSkills.map(sk => <span key={sk} className="text-xs px-2.5 py-1 bg-[#cdccd5]/30 text-[#353457] rounded-full">{sk}</span>)}</div>

                    <div className="flex gap-5 border-b border-[#cdccd5]/60 mt-4 text-sm">
                      {["Overview", "About", "Requirements", "Benefits"].map(t => <button key={t} onClick={() => setSTab(t)} className={`pb-2 font-semibold border-b-2 transition-colors ${sTab === t ? "border-[#353457] text-[#353457]" : "border-transparent text-[#9a99ab] hover:text-[#686781]"}`}>{t}</button>)}
                    </div>
                    <div className="pt-4 text-sm space-y-4 xl:max-h-[calc(100vh-26rem)] overflow-y-auto pr-1">
                      {sTab === "Overview" && (
                        <>
                          <div><h3 className="font-bold mb-1">Job Description</h3><p className="text-[#686781] leading-relaxed">{selJob.description}</p></div>
                          <div><h3 className="font-bold mb-1">Key Responsibilities</h3><ul className="list-disc pl-5 text-[#686781] space-y-1">{selJob.resp.map(r => <li key={r}>{r}</li>)}</ul></div>
                          <div><h3 className="font-bold mb-1">Requirements</h3><ul className="list-disc pl-5 text-[#686781] space-y-1"><li>{selJob.level === "Entry" ? "Fresh graduates are welcome" : selJob.level === "Mid" ? "2+ years of relevant experience" : "5+ years of relevant experience"}</li><li>{selJob.reqEducation.join(" or ")}</li><li>Skills in {selJob.reqSkills.join(", ")}</li></ul></div>
                        </>
                      )}
                      {sTab === "About" && <div><h3 className="font-bold mb-1">About {selJob.company}</h3><p className="text-[#686781] leading-relaxed">{selJob.company} is a growing organization in {selJob.industry.toLowerCase()}, based in {selJob.location}. The team works {selJob.workSetup.toLowerCase()} and is hiring for a {selJob.jobType.toLowerCase()} {selJob.title} position.</p></div>}
                      {sTab === "Requirements" && (
                        <div className="space-y-3">
                          <p><span className="font-semibold">Education:</span> {selJob.reqEducation.join(" or ")} <span className={selJob.reqEducation.includes(userProfile.education) ? "text-emerald-600" : "text-red-500"}>{selJob.reqEducation.includes(userProfile.education) ? "(you meet this)" : "(not a match)"}</span></p>
                          {selJob.reqCerts.length > 0 && <p><span className="font-semibold">Certifications:</span> {selJob.reqCerts.map(c => <span key={c} className={`mr-2 ${userProfile.certs.includes(c) ? "text-emerald-600" : "text-red-500"}`}>{c}</span>)}</p>}
                          <div><p className="font-semibold mb-1.5">Skills</p><div className="flex flex-wrap gap-1.5">{selJob.reqSkills.map(sk => <span key={sk} className={`text-xs px-2.5 py-1 rounded-full ${userProfile.skills.includes(sk) ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{userProfile.skills.includes(sk) ? "\u2713 " : ""}{sk}</span>)}</div></div>
                        </div>
                      )}
                      {sTab === "Benefits" && <ul className="list-disc pl-5 text-[#686781] space-y-1">{defaultBenefits.map(x => <li key={x}>{x}</li>)}</ul>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-5">
                      <button onClick={() => toggleSave(selJob)} className="py-3 rounded-xl border border-[#353457] text-[#353457] text-sm font-bold hover:bg-[#353457]/10 flex items-center justify-center gap-2"><Bookmark size={16} className={isSaved ? "fill-[#353457]" : ""} /> {isSaved ? "Saved" : "Save Job"}</button>
                      <button onClick={() => likeJob(selJob)} disabled={isApplied} className={`py-3 rounded-xl text-sm font-bold text-white ${isApplied ? "bg-emerald-500 cursor-default" : "bg-[#03012d] hover:bg-[#353457]"}`}>{isApplied ? "Applied \u2713" : "Apply Now"}</button>
                    </div>
                  </>
                );
              })()}
            </section>
          </main>
        )}

        {nav === "Saved Jobs" && (
          <main className="flex-1 overflow-y-auto p-4 lg:px-6 lg:pb-6">
            <h1 className="text-3xl font-extrabold">Saved Jobs</h1>
            <p className="text-sm text-[#686781] mt-1 mb-5">Jobs you've bookmarked to come back to.</p>
            {saved.length === 0 ? <div className={`${card} p-10 text-center max-w-md`}><p className="font-bold">Nothing saved yet</p><p className="text-sm text-[#686781] mt-1">Tap Save on a job card to keep it here.</p></div> : (
              <ul className="grid md:grid-cols-2 gap-4">{saved.map(j => { const m = matchOf(j); return (
                <li key={j.id} className={`${card} p-4 flex items-center gap-4`}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${j.color} text-white text-xl font-extrabold flex items-center justify-center shrink-0`}>{j.company.charAt(0)}</div>
                  <div className="flex-1 min-w-0"><p className="font-bold truncate">{j.title}</p><p className="text-xs text-[#686781]">{j.company} &bull; {j.workSetup}</p><span className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${tierBadge[m.tier]}`}>{m.score}% Match</span></div>
                  <div className="flex flex-col gap-1.5">
                    <button onClick={() => likeJob(j)} className="px-3 py-1.5 rounded-lg bg-[#353457] text-white text-xs font-bold hover:bg-[#03012d]">Like</button>
                    <button onClick={() => setSaved(prev => prev.filter(x => x.id !== j.id))} className="text-xs text-[#686781] hover:text-red-500">Remove</button>
                  </div>
                </li>
              ); })}</ul>
            )}
          </main>
        )}

        {nav === "Calendar" && (
          <main className="flex-1 overflow-y-auto p-4 lg:px-6 lg:pb-6">
            <h1 className="text-3xl font-extrabold">Calendar</h1>
            <p className="text-sm text-[#686781] mt-1 mb-5">Interview invites from employers and your confirmed schedule.</p>
            {myInvites.length === 0 ? <div className={`${card} p-10 text-center max-w-md`}><p className="font-bold">No interview invites yet</p><p className="text-sm text-[#686781] mt-1">When an employer invites you, it will show up here.</p></div> : (
              <ul className="space-y-3 max-w-2xl">{myInvites.map(e => (
                <li key={e.id} className={`${card} p-4`}>
                  <p className="font-bold">Creative Studio PH</p>
                  <p className="text-sm text-[#686781]">{e.title.replace("Interview with ", "Interview for ")} &bull; {employerCandidates.find(c => c.id === e.candidateId)?.role}</p>
                  {e.notes && <p className="text-xs text-[#9a99ab] mt-1">{e.notes}</p>}
                  {e.status === "Invited" && <div className="grid grid-cols-2 gap-2 mt-3 max-w-xs"><button onClick={() => respondInvite(e.id, "Declined")} className="py-2 rounded-lg border border-[#cdccd5] text-sm font-semibold">Decline</button><button onClick={() => respondInvite(e.id, "Accepted")} className="py-2 rounded-lg bg-[#03012d] text-white text-sm font-bold hover:bg-[#353457]">Accept</button></div>}
                  {e.status === "Accepted" && <p className="text-sm font-semibold text-amber-600 mt-3">Accepted. Waiting for the employer to set a date and time.</p>}
                  {e.status === "Declined" && <p className="text-sm font-semibold text-red-500 mt-3">You declined this invite.</p>}
                  {e.status === "Confirmed" && <div className="mt-3 bg-emerald-50 rounded-lg p-3 text-sm"><p className="font-bold text-emerald-700">Confirmed</p><p>{fmtDate(e.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p><p>{fmtTime(e.time)} &ndash; {fmtTime(addMinutes(e.time, e.duration))} &bull; {e.platform}</p></div>}
                </li>
              ))}</ul>
            )}
          </main>
        )}

        {["Messages", "Profile", "Settings"].includes(nav) && (
          <main className="flex-1 flex items-center justify-center p-6 text-center">
            <div className={`${card} p-10 max-w-md`}><h2 className="text-2xl font-bold mb-2">{nav}</h2><p className="text-sm text-[#686781]">This section is coming next. Head back to Home to keep swiping.</p><button onClick={() => setNav("Home")} className="mt-6 px-6 py-2.5 rounded-full bg-[#03012d] text-white text-sm font-bold hover:bg-[#353457]">Back to Home</button></div>
          </main>
        )}
      </div>

      {/* MODALS */}
      {modal && (
        <div className="fixed inset-0 bg-[#03012d]/80 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModal(null)} aria-label="Close" className="absolute top-4 right-4 text-[#9a99ab] hover:text-[#03012d]"><X size={22} /></button>
            {modal === "profile" && (
              <>
                <h2 className="text-2xl font-bold mb-1">Edit Profile & Resume</h2>
                <p className="text-xs text-[#686781] mb-4">Profile completion: <span className="font-bold text-[#353457]">{completion}%</span></p>
                <div className="space-y-4">
                  <div><label className="block text-sm font-bold text-[#353457] mb-1">Bio</label><textarea className="w-full border border-[#cdccd5] rounded-lg p-3 text-sm focus:outline-none focus:border-[#353457]" rows={3} value={userProfile.bio} onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })} /></div>
                  <div>
                    <label className="block text-sm font-bold text-[#353457] mb-1">Skills</label>
                    <div className="flex gap-2"><input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="Add a skill" className="flex-1 border border-[#cdccd5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#353457]" /><button onClick={addSkill} className="px-4 rounded-lg bg-[#353457] text-white text-sm font-semibold">Add</button></div>
                    <div className="flex flex-wrap gap-1.5 mt-2">{userProfile.skills.map(sk => <span key={sk} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-[#353457]/10 text-[#353457] rounded-full">{sk}<button onClick={() => setUserProfile(prev => ({ ...prev, skills: prev.skills.filter(x => x !== sk) }))} aria-label={`Remove ${sk}`}><X size={12} /></button></span>)}</div>
                  </div>
                  <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => { pickResume(e.target.files?.[0]); e.target.value = ""; }} />
                  <button onClick={() => resumeRef.current?.click()} className="w-full border-2 border-dashed border-[#cdccd5] rounded-xl p-4 flex flex-col items-center hover:bg-gray-50">
                    <UploadCloud size={24} className="text-[#353457] mb-2" />
                    <span className="text-xs font-bold text-[#686781]">{userProfile.resumeUploaded ? `Uploaded: ${userProfile.resumeName}` : "UPLOAD RESUME (PDF, DOCX)"}</span>
                    <span className="mt-1.5 bg-[#03012d] text-white text-xs px-4 py-1.5 rounded-full font-semibold">{userProfile.resumeUploaded ? "Replace file" : "Browse Files"}</span>
                  </button>
                </div>
                <button onClick={() => setModal(null)} className="w-full mt-6 bg-[#03012d] text-white py-3 rounded-xl font-bold hover:bg-[#353457]">Done</button>
              </>
            )}
            {modal === "prefs" && (
              <>
                <h2 className="text-2xl font-bold mb-4">My Job Preferences</h2>
                <div className="space-y-3">
                  <Field label="Job type"><select value={prefsDraft.jobType} onChange={(e) => setPrefsDraft({ ...prefsDraft, jobType: e.target.value })} className="w-full px-3 py-2.5 border border-[#cdccd5] rounded-lg text-sm focus:outline-none"><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></Field>
                  <Field label="Location"><input value={prefsDraft.location} onChange={(e) => setPrefsDraft({ ...prefsDraft, location: e.target.value })} className="w-full px-3 py-2.5 border border-[#cdccd5] rounded-lg text-sm focus:outline-none" /></Field>
                  <Field label="Preferred roles (comma separated)"><input value={prefsDraft.roles} onChange={(e) => setPrefsDraft({ ...prefsDraft, roles: e.target.value })} className="w-full px-3 py-2.5 border border-[#cdccd5] rounded-lg text-sm focus:outline-none" /></Field>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-5"><button onClick={() => setModal(null)} className="py-3 rounded-xl border border-[#cdccd5] text-sm font-semibold">Cancel</button><button onClick={() => { setPrefs(prefsDraft); setModal(null); flash("Preferences saved"); }} className="py-3 rounded-xl bg-[#03012d] text-white text-sm font-bold hover:bg-[#353457]">Save</button></div>
              </>
            )}
            {modal === "tips" && (<><h2 className="text-2xl font-bold mb-4">Quick Tips</h2><ul className="space-y-3">{quickTips.map(t => <li key={t} className="flex items-center gap-3 text-sm"><BadgeCheck size={20} className="text-[#353457] shrink-0" /> {t}</li>)}</ul></>)}
            {modal === "activity" && (<><h2 className="text-2xl font-bold mb-4">Recent Activity</h2><ul className="space-y-3">{activity.map(a => <li key={a.id} className="flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-[#f1f1f5] flex items-center justify-center shrink-0">{activityIcon(a.kind)}</span><span className="flex-1 min-w-0"><span className="block text-sm font-bold">{a.title}</span><span className="block text-xs text-[#686781]">{a.sub}</span></span><span className="text-[11px] text-[#9a99ab]">{a.ago}</span></li>)}</ul></>)}
          </div>
        </div>
      )}

      {detailsJob && (() => { const m = matchOf(detailsJob); return (
        <div className="fixed inset-0 bg-[#03012d]/80 z-50 flex items-center justify-center p-4" onClick={() => setDetailsJob(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setDetailsJob(null)} aria-label="Close" className="absolute top-4 right-4 text-[#9a99ab] hover:text-[#03012d]"><X size={22} /></button>
            <p className="text-sm text-[#686781]">{detailsJob.company}</p>
            <h2 className="text-2xl font-extrabold">{detailsJob.title}</h2>
            <p className="text-xs text-[#686781] mt-1">{detailsJob.location} &bull; {detailsJob.jobType} &bull; {detailsJob.workSetup}</p>
            <span className={`inline-block mt-3 text-xs font-bold px-3 py-1.5 rounded-full ${tierBadge[m.tier]}`}>{m.score}% Match</span>
            <p className="text-sm text-[#686781] mt-3 leading-relaxed">{detailsJob.description}</p>
            <h3 className="font-bold text-sm mt-4 mb-1.5">Requirements</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Education:</span> {detailsJob.reqEducation.join(" or ")} <span className={detailsJob.reqEducation.includes(userProfile.education) ? "text-emerald-600" : "text-red-500"}>{detailsJob.reqEducation.includes(userProfile.education) ? "(you meet this)" : "(not a match)"}</span></p>
              {detailsJob.reqCerts.length > 0 && <p><span className="font-semibold">Certifications:</span> {detailsJob.reqCerts.map(c => <span key={c} className={userProfile.certs.includes(c) ? "text-emerald-600" : "text-red-500"}>{c}{" "}</span>)}</p>}
              <div className="flex flex-wrap gap-1.5">{detailsJob.reqSkills.map(sk => <span key={sk} className={`text-xs px-2.5 py-1 rounded-full ${userProfile.skills.includes(sk) ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{userProfile.skills.includes(sk) ? "\u2713 " : ""}{sk}</span>)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5"><button onClick={() => { saveJob(detailsJob); setDetailsJob(null); }} className="py-3 rounded-xl border border-[#cdccd5] text-sm font-semibold">Save</button><button onClick={() => { const j = detailsJob; setDetailsJob(null); likeJob(j); }} className="py-3 rounded-xl bg-[#03012d] text-white text-sm font-bold hover:bg-[#353457]">Like</button></div>
          </div>
        </div>
      ); })()}

      {warningData.show && warningData.job && (
        <div className="fixed inset-0 bg-[#03012d]/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl text-center border-t-8 border-orange-500">
            <h2 className="text-2xl font-bold mb-2">Partial Match</h2>
            <p className="text-sm text-[#686781]">You're missing {warningData.missing.length ? "these skills:" : "some of the requirements for this role."}</p>
            {warningData.missing.length > 0 && <div className="flex flex-wrap justify-center gap-1.5 mt-3">{warningData.missing.map(sk => <span key={sk} className="text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-full">{sk}</span>)}</div>}
            <div className="flex gap-4 mt-6">
              <button onClick={() => setWarningData({ show: false, missing: [], job: null })} className="flex-1 py-3 bg-gray-100 text-[#353457] rounded-xl font-bold">Cancel</button>
              <button onClick={() => { const j = warningData.job!; setWarningData({ show: false, missing: [], job: null }); applyTo(j); }} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold">Submit Anyway</button>
            </div>
          </div>
        </div>
      )}

      {notice && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#03012d] text-white text-sm font-semibold px-5 py-3 rounded-full shadow-xl z-[70]">{notice}</div>}
    </div>
  );
}
