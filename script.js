// ============================================
// CONSTANTS & CONFIG
// ============================================
const AUTHOR_NAME = "Trần Trọng Kim";
const AUTHOR_PHONE = "0964567806";

const STUDENT_STATUS = {
  ACTIVE: { id: 'active', label: 'Đang học', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  DROPPED: { id: 'dropped', label: 'Bỏ học', color: 'text-red-600', bg: 'bg-red-50' },
  TRANSFERRED: { id: 'transferred', label: 'Chuyển trường', color: 'text-amber-600', bg: 'bg-amber-50' },
  MOVED_CLASS: { id: 'moved_class', label: 'Chuyển lớp', color: 'text-blue-600', bg: 'bg-blue-50' }
};

const QUALITY_CRITERIA = [
  { id: 'patriotism', name: 'Yêu nước' },
  { id: 'humanity', name: 'Nhân ái' },
  { id: 'diligence', name: 'Chăm chỉ' },
  { id: 'honesty', name: 'Trung thực' },
  { id: 'responsibility', name: 'Trách nhiệm' }
];

const GENERAL_COMPETENCIES = [
  { id: 'self_control', name: 'Tự chủ & Tự học' },
  { id: 'communication', name: 'Giao tiếp & Hợp tác' },
  { id: 'problem_solving', name: 'Giải quyết vấn đề & Sáng tạo' }
];

const SPECIFIC_COMPETENCIES = [
  { id: 'lang', name: 'Ngôn ngữ' },
  { id: 'math', name: 'Tính toán' },
  { id: 'sci', name: 'Khoa học' },
  { id: 'tech', name: 'Công nghệ' },
  { id: 'it', name: 'Tin học' },
  { id: 'art', name: 'Thẩm mĩ' },
  { id: 'phys', name: 'Thể chất' }
];

const SUBJECT_TO_COMPETENCY_MAP = {
  'Tiếng Việt': 'lang',
  'Toán': 'math',
  'Khoa học': 'sci',
  'Tự nhiên và Xã hội': 'sci',
  'Công nghệ': 'tech',
  'Tin học': 'it',
  'Mĩ thuật': 'art',
  'Âm nhạc': 'art',
  'Giáo dục Thể chất': 'phys'
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const normalizeYearNameToPair = (name) => {
  const nums = String(name || '').match(/\d{4}/g);
  return nums && nums.length >= 2 ? [parseInt(nums[0], 10), parseInt(nums[1], 10)] : null;
};

const normalizeMonthNameToNumber = (name) => {
  const s = String(name || '').toLowerCase().trim();
  const digitMatch = s.match(/(\d{1,2})/);
  if (digitMatch) {
    const num = parseInt(digitMatch[1], 10);
    if (num >= 1 && num <= 12) return num;
  }

  const vn = {
    'tháng một':1, 'tháng hai':2, 'tháng ba':3, 'tháng tư':4, 'tháng năm':5, 'tháng sáu':6,
    'tháng bảy':7, 'tháng tám':8, 'tháng chín':9, 'tháng mười':10, 'tháng mười một':11, 'tháng mười hai':12,
    'tháng 1':1, 'tháng 2':2, 'tháng 3':3, 'tháng 4':4, 'tháng 5':5, 'tháng 6':6, 'tháng 7':7, 'tháng 8':8, 'tháng 9':9, 'tháng 10':10, 'tháng 11':11, 'tháng 12':12
  };
  for (const k in vn) if (s.includes(k)) return vn[k];

  const en = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  for (let i = 0; i < en.length; i++) if (s.includes(en[i])) return i + 1;
  return null;
};

const filterComments = (text) => {
  if (!text) return text;
  const replacements = [
    [/(?:co|thầy|giáo\s+viên)\s+(?:muốn|yêu cầu|mong|hy vọng)\s+em/gi, 'Em hãy'],
    [/(?:co|thầy|giáo\s+viên)\s+khuyến khích\s+em/gi, 'Em hãy'],
    [/(?:co|thầy|giáo\s+viên)\s+tin\s+(?:rằng\s+)?em/gi, 'Em có khả năng'],
    [/(?:co|thầy|giáo\s+viên)\s+(?:nói|bảo)\s+em/gi, 'Em'],
    [/(?:co|thầy|giáo\s+viên)\s+hy vọng\s+em/gi, 'Em hãy'],
    [/(?:co|thầy|giáo\s+viên)\s+nhận\s+xét/gi, ''],
    [/(?:co|thầy|giáo\s+viên)\s+khen/gi, ''],
    [/,\s*(?:co|thầy|giáo\s+viên)(?:\s+[^!.?]*)?(?=[!.?])/gi, ''],
  ];

  let filtered = text;
  replacements.forEach(([pattern, replacement]) => {
    filtered = filtered.replace(pattern, replacement);
  });

  return filtered.replace(/\bco\b/g, '').replace(/\bthầy\b/g, '').replace(/\bgiáo\s+viên\b/gi, '')
    .replace(/\bco\s+giáo\b/gi, '').replace(/\bthầy\s+giáo\b/gi, '').replace(/\s+/g, ' ').trim()
    .replace(/^[,\s]+/, '');
};

const copyToClipboard = (text) => {
  const tempInput = document.createElement("textarea");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
};

// ============================================
// REACT COMPONENTS
// ============================================
const { useState, useEffect, useRef } = React;

const ZaloIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.507 11.23c-.156-.464-.34-.916-.548-1.353-.207-.436-.45-.858-.72-1.26a10.023 10.023 0 0 0-1.077-1.378 10.662 10.662 0 0 0-1.428-1.265 11.996 11.996 0 0 0-1.742-1.082A13.437 13.437 0 0 0 14.885 4.1a14.897 14.897 0 0 0-2.264-.474c-.38-.046-.763-.075-1.147-.087-.384-.012-.767-.008-1.15.012-.383.02-.764.055-1.145.105-.38.05-.758.115-1.134.195a14.864 14.864 0 0 0-2.22.65c-.358.13-.71.277-1.054.44a11.905 11.905 0 0 0-1.928 1.157 10.323 10.323 0 0 0-1.547 1.455c-.23.272-.44.558-.626.858a9.146 9.146 0 0 0-.825 2.022 9.146 9.146 0 0 0-.256 2.115c.01.353.04.706.087 1.055.048.35.114.697.198 1.04.084.343.187.68.307 1.01.12.33.256.654.407.97.15.316.315.626.494.927.18.3.37.593.578.877.207.284.426.56.654.825l-.578 2.316c-.052.207-.063.424-.032.636.03.21.096.413.195.6a1.442 1.442 0 0 0 .61.624c.24.13.51.196.78.196a1.517 1.517 0 0 0 .584-.117l3.522-1.507c.394.135.795.247 1.202.333.407.086.82.147 1.236.183.416.036.834.048 1.253.036.418-.012.836-.048 1.25-.108a14.892 14.892 0 0 0 2.417-.63 12.01 12.01 0 0 0 2.15-1.045 10.323 10.323 0 0 0 1.763-1.42 9.074 9.074 0 0 0 1.233-1.69 8.72 8.72 0 0 0 .864-2.128 9.052 9.052 0 0 0 .04-2.227z" />
  </svg>
);

const Toast = ({ message, type, icon }) => (
  <div className={`fixed top-6 right-6 z-[200] toast ${type === 'success' ? 'bg-emerald-50 border-emerald-300' : type === 'error' ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'} border-2 rounded-xl p-4 shadow-2xl max-w-sm`}>
    <div className="flex items-start gap-4">
      <span className="text-2xl mt-1">{icon}</span>
      <div className="flex-1">
        <p className={`font-black text-sm ${type === 'success' ? 'text-emerald-900' : type === 'error' ? 'text-red-900' : 'text-blue-900'} uppercase tracking-wide`}>
          {type === 'success' ? 'Thành công' : type === 'error' ? 'Lỗi' : 'Thông báo'}
        </p>
        <p className={`text-sm mt-1 ${type === 'success' ? 'text-emerald-700' : type === 'error' ? 'text-red-700' : 'text-blue-700'}`}>
          {message}
        </p>
      </div>
    </div>
  </div>
);

const EditableCell = ({ value, onSave, className, isDraft, disabled }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = (textarea.scrollHeight + 2) + 'px';
    }
  };

  useEffect(() => {
    setLocalValue(value || '');
    const timer = setTimeout(adjustHeight, 0);
    return () => clearTimeout(timer);
  }, [value]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setLocalValue(newVal);
    adjustHeight();
    onSave(newVal);
  };

  return (
    <textarea
      ref={textareaRef}
      disabled={disabled}
      className={`${className} ${isDraft ? 'bg-yellow-50 shadow-inner' : ''} ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-50 focus:bg-white'} overflow-hidden whitespace-pre-wrap break-words min-h-[40px] p-2 rounded transition-colors w-full resize-none`}
      rows={1}
      value={localValue}
      onChange={handleChange}
    />
  );
};

const SectionBox = ({ label, items, selectedId, onSelect, onEdit, onDelete, onAdd, type }) => (
  <div className="bg-white p-4 rounded-xl border-2 border-slate-300 shadow-sm flex flex-col gap-2 flex-1 min-w-[200px]">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
      <div className="flex gap-1">
        {selectedId && !['system_comp'].includes(type) && (
          <>
            <button onClick={() => onEdit(items.find(i => i.id === selectedId))} className="p-1 text-blue-500 hover:bg-blue-50 rounded text-xs">✏️</button>
            <button onClick={() => onDelete(selectedId)} className="p-1 hover:text-red-600 text-xs">🗑️</button>
          </>
        )}
        {!['system_comp'].includes(type) && <button onClick={onAdd} className="p-1 text-indigo-500 text-xs">➕</button>}
      </div>
    </div>
    <select value={selectedId || ''} onChange={(e) => onSelect(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold outline-none cursor-pointer hover:bg-white transition-all">
      <option value="">-- {label} --</option>
      {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
    </select>
  </div>
);

const LoginForm = ({ email, setEmail, password, setPassword, onLogin, toast }) => (
  <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh" }}>
    <div style={{ background:"#ffffff", padding:"35px", borderRadius:"12px", width:"320px", boxShadow:"0 10px 25px rgba(0,0,0,0.15)", border:"1px solid #eee" }}>
      <h3 style={{ textAlign:"center", fontSize:"20px", fontWeight:"bold", marginBottom:"20px", color:"#4f46e5" }}>Đăng nhập giáo viên</h3>
      <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} style={{ width:"100%", padding:"10px", marginBottom:"12px", borderRadius:"6px", border:"1px solid #ccc", fontSize:"14px", boxSizing:"border-box" }} />
      <input type="password" placeholder="Mật khẩu" value={password} onChange={(e)=>setPassword(e.target.value)} style={{ width:"100%", padding:"10px", marginBottom:"12px", borderRadius:"6px", border:"1px solid #ccc", fontSize:"14px", boxSizing:"border-box" }} />
      <button onClick={onLogin} style={{ width:"100%", padding:"10px", background:"#4f46e5", color:"white", border:"none", borderRadius:"6px", fontWeight:"bold", cursor:"pointer" }}>Đăng nhập</button>
      {toast && <Toast {...toast} />}
    </div>
  </div>
);

// ============================================
// MAIN APP COMPONENT
// ============================================
const App = () => {
  // Auth & UI
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAuthValid, setIsAuthValid] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [toast, setToast] = useState(null);

  // Data
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [months, setMonths] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentData, setStudentData] = useState({});
  const [draftData, setDraftData] = useState({});

  // Selection
  const [selectedYearId, setSelectedYearId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedMonthId, setSelectedMonthId] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');
  const [selectedCriteriaId, setSelectedCriteriaId] = useState('');

  // View
  const [viewMode, setViewMode] = useState('subject');
  const [systemMode, setSystemMode] = useState('smas');
  const [showLevel, setShowLevel] = useState(true);
  const [showNote, setShowNote] = useState(true);

  // Modal
  const [modalType, setModalType] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copySuccess, setCopySuccess] = useState(null);
  const [statusModalStudent, setStatusModalStudent] = useState(null);
  const [showMoveTargetSelect, setShowMoveTargetSelect] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

  // Drag
  const [draggedStudentId, setDraggedStudentId] = useState(null);
  const [dragOverStudentId, setDragOverStudentId] = useState(null);

  const showToast = (message, type = 'info', icon = 'ℹ️', duration = 4000) => {
    setToast({ message, type, icon });
    setTimeout(() => setToast(null), duration);
  };

  // ===== AUTH =====
  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      showToast("Sai email hoặc mật khẩu", "error", "❌");
    }
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      showToast("Đã đăng xuất", "success", "✅");
    } catch (e) {
      showToast("Lỗi đăng xuất", "error", "❌");
    }
  };

  const handleChangeName = async () => {
    const newName = prompt("Nhập tên mới");
    if(!newName) return;
    try {
      await user.updateProfile({displayName: newName});
      showToast("Đổi tên thành công", "success", "✅");
    } catch (e) {
      showToast("Lỗi đổi tên", "error", "❌");
    }
  };

  const handleChangePassword = async () => {
    const newPass = prompt("Nhập mật khẩu mới");
    if(!newPass) return;
    try {
      await user.updatePassword(newPass);
      showToast("Đổi mật khẩu thành công", "success", "✅");
    } catch (e) {
      showToast("Lỗi đổi mật khẩu", "error", "❌");
    }
  };

  // ===== EFFECTS =====
  useEffect(() => {
    const _v = (s) => btoa(unescape(encodeURIComponent(s)));
    if (_v(AUTHOR_NAME) !== "VHLhuqduIFRy4buNbmcgS2lt" || _v(AUTHOR_PHONE) !== "MDk2NDU2NzgwNg==") {
      setIsAuthValid(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !isAuthValid) return;
    try {
      const unsubYears = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years')
        .onSnapshot(s => setYears(s.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))));
      const unsubCla = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('classes')
        .onSnapshot(s => setClasses(s.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => a.name.localeCompare(b.name, 'vi', { numeric: true }))));
      const unsubMon = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('months')
        .onSnapshot(s => setMonths(s.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))));
      const unsubSub = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('subjects')
        .onSnapshot(s => setSubjects(s.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => a.name.localeCompare(b.name, 'vi'))));
      return () => { unsubYears(); unsubCla(); unsubMon(); unsubSub(); };
    } catch (e) {
      console.error('Data load error:', e);
    }
  }, [user, isAuthValid]);

  useEffect(() => {
    if (!years.length || selectedYearId || !isAuthValid) return;
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const start = month >= 8 ? year : year - 1;
    const end = month >= 8 ? year + 1 : year;
    const found = years.find(y => {
      const pair = normalizeYearNameToPair(y.name);
      return pair && pair[0] === start && pair[1] === end;
    });
    if (found) setSelectedYearId(found.id);
  }, [years, isAuthValid]);

  useEffect(() => {
    if (!months.length || selectedMonthId || !isAuthValid) return;
    const currentMonth = new Date().getMonth() + 1;
    const found = months.find(m => normalizeMonthNameToNumber(m.name) === currentMonth);
    if (found) setSelectedMonthId(found.id);
  }, [months, isAuthValid]);

  useEffect(() => {
    if (!user || !classes.length || !subjects.length || sessionReady) return;
    const key = `teacher_${user.uid}_session`;
    const saved = localStorage.getItem(key);
    if (!saved) {
      setSessionReady(true);
      return;
    }
    try {
      const data = JSON.parse(saved);
      if (data.selectedClassId && classes.find(x => x.id === data.selectedClassId)) setSelectedClassId(data.selectedClassId);
      if (data.selectedSubId && subjects.find(x => x.id === data.selectedSubId)) setSelectedSubId(data.selectedSubId);
      if (data.systemMode) setSystemMode(data.systemMode);
    } catch (e) {
      console.error("Session load error:", e);
    }
    setSessionReady(true);
  }, [user, classes, subjects]);

  useEffect(() => {
    if (!user || !sessionReady) return;
    const key = `teacher_${user.uid}_session`;
    localStorage.setItem(key, JSON.stringify({ selectedClassId, selectedSubId, systemMode }));
  }, [user, selectedClassId, selectedSubId, systemMode, sessionReady]);

  useEffect(() => {
    if (!user || !selectedClassId || !selectedYearId || !isAuthValid) { 
      setStudents([]); 
      return; 
    }
    try {
      return db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
        .collection('classes').doc(selectedClassId).collection('students')
        .onSnapshot((snap) => {
          const list = snap.docs.map(d => ({ id: d.id, status: 'active', ...d.data() }));
          list.sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
            return (a.createdAt || 0) - (b.createdAt || 0);
          });
          setStudents(list);
        });
    } catch (e) {
      console.error('Students load error:', e);
    }
  }, [user, selectedClassId, selectedYearId, isAuthValid]);

  useEffect(() => {
    if (!user || !selectedMonthId || !selectedClassId || !selectedYearId || !isAuthValid) { 
      setStudentData({}); 
      setDraftData({}); 
      return; 
    }
    const isSubject = viewMode === 'subject';
    const isVnEduSubMode = systemMode === 'vnedu' && viewMode !== 'subject';
    if (isSubject && !selectedSubId) { setStudentData({}); setDraftData({}); return; }
    if (isVnEduSubMode && !selectedCriteriaId) { setStudentData({}); setDraftData({}); return; }

    const systemSuffix = systemMode === 'vnedu' ? '_vnedu' : '';
    let key = "";
    if (isSubject) {
      key = `${selectedYearId}_${selectedSubId}_${selectedMonthId}_${selectedClassId}${systemSuffix}`;
    } else if (isVnEduSubMode) {
      key = `${selectedYearId}_${viewMode}_vnedu_${selectedCriteriaId}_${selectedMonthId}_${selectedClassId}`;
    } else {
      key = `${selectedYearId}_${viewMode}_${selectedMonthId}_${selectedClassId}`;
    }
    
    try {
      return db.collection('artifacts').doc(appId).collection('public').doc('data').collection('comments').doc(key)
        .collection('entries').onSnapshot((snap) => {
          const data = {};
          snap.forEach(doc => { data[doc.id] = doc.data(); });
          setStudentData(data);
          setDraftData({});
        });
    } catch (e) {
      console.error('Student data load error:', e);
    }
  }, [user, selectedSubId, selectedCriteriaId, selectedMonthId, selectedClassId, selectedYearId, viewMode, isAuthValid, systemMode]);

  // ===== FUNCTIONS =====
  const saveApiKey = (key) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setShowApiKeyModal(false);
    showToast('API Key đã lưu thành công', 'success', '🔑', 3000);
  };

  const updateDraft = (studentId, field, value) => {
    const stu = students.find(s => s.id === studentId);
    if (stu?.status !== 'active') return;

    setDraftData(prev => {
      const currentStudentDraft = prev[studentId] || {};
      const currentStoredData = studentData[studentId] || {};
      let finalValue = value;
      if (field.startsWith('level')) {
        const currentLevel = currentStudentDraft[field] !== undefined ? currentStudentDraft[field] : (currentStoredData[field] || "");
        if (currentLevel === value) finalValue = "";
      }
      return { ...prev, [studentId]: { ...currentStudentDraft, [field]: finalValue } };
    });
  };

  const handleUpdateStatus = async (studentId, status) => {
    if (status === 'moved_class') {
      setShowMoveTargetSelect(true);
      return;
    }
    try {
      await db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
        .collection('classes').doc(selectedClassId).collection('students').doc(studentId).update({ status });
      setStatusModalStudent(null);
      showToast('Cập nhật trạng thái thành công', 'success', '✅', 3000);
    } catch (e) { 
      console.error(e); 
      showToast('Lỗi cập nhật trạng thái: ' + e.message, 'error', '❌', 4000);
    }
  };

  const handleMoveStudentToClass = async (targetClassId) => {
    if (!statusModalStudent || !targetClassId || isMoving) return;
    setIsMoving(true);
    try {
      const batch = db.batch();
      const newStudentRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
        .collection('classes').doc(targetClassId).collection('students').doc();
      batch.set(newStudentRef, {
        name: statusModalStudent.name,
        status: 'active',
        createdAt: statusModalStudent.createdAt || Date.now(),
        movedFrom: selectedClassId
      });
      const oldStudentRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
        .collection('classes').doc(selectedClassId).collection('students').doc(statusModalStudent.id);
      batch.delete(oldStudentRef);
      await batch.commit();
      setStatusModalStudent(null);
      setShowMoveTargetSelect(false);
      showToast('Di chuyển học sinh thành công', 'success', '✅', 3000);
    } catch (e) { 
      console.error("Lỗi di chuyển học sinh:", e); 
      showToast('Lỗi di chuyển: ' + e.message, 'error', '❌', 4000);
    } finally { setIsMoving(false); }
  };

    const handleDragStart = (e, studentId) => {
    setDraggedStudentId(studentId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, studentId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedStudentId && draggedStudentId !== studentId) {
      setDragOverStudentId(studentId);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverStudentId(null);
  };

  const handleDrop = async (e, targetStudentId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedStudentId || draggedStudentId === targetStudentId) {
      setDraggedStudentId(null);
      setDragOverStudentId(null);
      return;
    }

    const draggedIndex = students.findIndex(s => s.id === draggedStudentId);
    const targetIndex = students.findIndex(s => s.id === targetStudentId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedStudentId(null);
      setDragOverStudentId(null);
      return;
    }

    const newList = [...students];
    const draggedStudent = newList[draggedIndex];
    
    newList.splice(draggedIndex, 1);
    newList.splice(targetIndex, 0, draggedStudent);

    try {
      const batch = db.batch();
      newList.forEach((stu, i) => {
        const ref = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
          .collection('classes').doc(selectedClassId).collection('students').doc(stu.id);
        batch.update(ref, { order: i });
      });
      await batch.commit();
      showToast('Sắp xếp học sinh thành công', 'success', '✅', 2000);
    } catch (e) { 
      console.error("Lỗi sắp xếp:", e); 
      showToast('Lỗi sắp xếp: ' + e.message, 'error', '❌', 4000);
    } finally {
      setDraggedStudentId(null);
      setDragOverStudentId(null);
    }
  };

  const handleSaveAllToFirebase = async () => {
    const studentIds = Object.keys(draftData);
    if (studentIds.length === 0) return;
    setIsSaving(true);
    try {
      const systemSuffix = systemMode === 'vnedu' ? '_vnedu' : '';
      const isVnEduSubMode = systemMode === 'vnedu' && viewMode !== 'subject';
      let key = "";
      if (viewMode === 'subject') key = `${selectedYearId}_${selectedSubId}_${selectedMonthId}_${selectedClassId}${systemSuffix}`;
      else if (isVnEduSubMode) key = `${selectedYearId}_${viewMode}_vnedu_${selectedCriteriaId}_${selectedMonthId}_${selectedClassId}`;
      else key = `${selectedYearId}_${viewMode}_${selectedMonthId}_${selectedClassId}`;

      const docRefCheck = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('comments').doc(key);
      const entriesSnap = await docRefCheck.collection('entries').limit(1).get();

      if (!entriesSnap.empty) {
        const first = entriesSnap.docs[0].data();
        if (first.owner && first.owner !== user.uid) {
          const ok = window.confirm(`⚠️ Môn này đang do "${first.ownerName || 'giáo viên khác'}" phụ trách.\n\nBạn có muốn nhận quyền để chỉnh sửa không?`);
          if (!ok) {
            setIsSaving(false);
            return;
          }
        }
      }

      const batch = db.batch();
      for (const sId of studentIds) {
        const docRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('comments').doc(key)
          .collection('entries').doc(sId);
        const updates = draftData[sId];
        batch.set(docRef, {
          ...updates,
          owner: user.uid,
          ownerName: user.displayName || user.email,
          lastModified: new Date().toISOString()
        }, { merge: true });

        if (viewMode === 'subject' && updates.level !== undefined) {
          const subjectName = subjects.find(s => s.id === selectedSubId)?.name;
          const targetCompId = SUBJECT_TO_COMPETENCY_MAP[subjectName];
          if (targetCompId) {
            let compKey = "";
            let compField = "level";
            let compLevelValue = updates.level === 'H' ? 'Đ' : updates.level;
            if (systemMode === 'smas') {
              compKey = `${selectedYearId}_specific_${selectedMonthId}_${selectedClassId}`;
              compField = `level_${targetCompId}`;
            } else {
              compKey = `${selectedYearId}_specific_vnedu_${targetCompId}_${selectedMonthId}_${selectedClassId}`;
              compField = "level";
            }
            const compDocRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('comments').doc(compKey)
              .collection('entries').doc(sId);
            batch.set(compDocRef, { 
              [compField]: compLevelValue,
              lastModified: new Date().toISOString()
            }, { merge: true });
          }
        }
      }
      await batch.commit();
      setDraftData({});
      showToast(`Đã lưu ${studentIds.length} học sinh thành công`, 'success', '✅', 3000);
    } catch (error) { 
      console.error(error); 
      showToast('Lỗi lưu dữ liệu: ' + error.message, 'error', '❌', 4000);
    } finally { setIsSaving(false); }
  };

  
  // ===== HELPER FUNCTIONS =====
  function beautifyComment(level, comment) {
  if (!comment) return comment;

  comment = comment.trim();

  // ===== MỨC T → khen tích cực hơn =====
  if (level === "T") {
    const boosts = [
      " Em thể hiện rất tốt, đáng khen.",
      " Em duy trì phong độ học tập rất tốt.",
      " Em có nhiều điểm nổi bật, rất đáng ghi nhận."
    ];

    if (!/(rất tốt|nổi bật|đáng khen)/i.test(comment)) {
      comment += boosts[Math.floor(Math.random() * boosts.length)];
    }
  }

  // ===== MỨC H/D → khen + động viên nhẹ =====
  if (level === "H" || level === "Đ") {
    const encourages = [
      " Em sẽ tiến bộ hơn nếu tiếp tục cố gắng.",
      " Em hoàn toàn có thể làm tốt hơn trong thời gian tới.",
      " Em có tiềm năng và sẽ tiến bộ rõ rệt nếu nỗ lực thêm."
    ];

    if (!/(tiến bộ|có thể|tiềm năng)/i.test(comment)) {
      comment += encourages[Math.floor(Math.random() * encourages.length)];
    }
  }

  // ===== MỨC C → tránh tiêu cực, thêm động viên =====
  if (level === "C") {
    const supports = [
      " Em cần cố gắng hơn, chắc chắn sẽ tiến bộ.",
      " Nếu kiên trì luyện tập, em sẽ cải thiện tốt hơn.",
      " Em nên nỗ lực hơn để đạt kết quả tốt hơn."
    ];

    if (!/(tiến bộ|cải thiện)/i.test(comment)) {
      comment += supports[Math.floor(Math.random() * supports.length)];
    }
  }

  return comment;
}

function hasImprove(comment) {
  return /(cần|nên|cố gắng|khắc phục|rèn luyện|lưu ý)/i.test(comment);
}

function autoFixComment(level, comment) {
  if (!comment) return comment;

  comment = comment.trim();

  // T mà bị dính cải thiện → xóa
  if (level === "T" && hasImprove(comment)) {

  // Nếu có nhưng/tuy nhiên/song -> chỉ lấy vế trước
  comment = comment.split(/\bnhưng\b|\btuy nhiên\b|\bsong\b/i)[0].trim();

  // Nếu có từ cải thiện -> cắt tại vị trí đó
  comment = comment.split(/\bcần\b|\bnên\b|\bcố gắng\b|\bkhắc phục\b|\brèn luyện\b|\blưu ý\b/i)[0].trim();

  // Xóa dấu phẩy dư cuối câu
  comment = comment.replace(/[,:;]\s*$/, '').trim();

  // Nếu quá ngắn hoặc kết thúc bất thường -> thay câu mới
  if (comment.split(' ').length < 5 || /(tạo|luôn|và|nhưng)$/i.test(comment)) {
    comment = "Em học tập tích cực và thể hiện nhiều điểm nổi bật.";
  }

  if (!/[.!?]$/.test(comment)) comment += '.';
}


  // H/D mà thiếu cải thiện → thêm
  if ((level === "H" || level === "Đ") && !hasImprove(comment)) {
    comment += " Em cần cố gắng hơn để hoàn thiện kỹ năng.";
  }

  return comment;
}

  // ===== AI GENERATION (GỌI 1 LẦN, DÙNG TEXT FORMAT) =====
    // ===== AI GENERATION (GỌI 1 LẦN, DÙNG TEXT FORMAT) =====
  const runAI = async () => {
  if (!isAuthValid) return;
  if (!apiKey) {
    setShowApiKeyModal(true);
    showToast('Vui lòng cấu hình API Key trước', 'info', '⚙️', 3000);
    return;
  }

  const allTargets = students.filter(s => {
    if (s.status !== 'active') return false;
    const d = studentData[s.id] || {};
    const draft = draftData[s.id] || {};
    const comment = draft.comment !== undefined ? draft.comment : (d.comment || "");
    if (comment) return false;
    if (viewMode === 'subject') {
      const level = draft.level !== undefined ? draft.level : (d.level || "");
      return !!level;
    } else if (systemMode === 'vnedu' && viewMode !== 'subject') {
      const level = draft.level !== undefined ? draft.level : (d.level || "");
      return !!level;
    } else if (systemMode === 'smas' && viewMode !== 'subject') {
      const list = viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES);
      return list.some(c => {
        const level = draft[`level_${c.id}`] !== undefined ? draft[`level_${c.id}`] : (d[`level_${c.id}`] || "");
        return !!level;
      });
    }
    return false;
  });

  if (!allTargets.length) { 
    showToast('Không có học sinh nào cần nhận xét', 'info', '⚠️', 4000);
    return; 
  }

  setIsGenerating(true);
  showToast(`Đang tạo nhận xét cho ${allTargets.length} học sinh...`, 'info', '⏳', 2000);

  try {
    // ===== TẠO DANH SÁCH BẰNG CÁCH AN TOÀN =====
    let studentListText = "";
    allTargets.forEach((stu, idx) => {
      const d = studentData[stu.id] || {};
      const draft = draftData[stu.id] || {};
      const note = draft.note !== undefined ? draft.note : (d.note || "");
      
      let info = "N/A";
      if (viewMode === 'subject') {
        const subName = subjects.find(s => s.id === selectedSubId)?.name || "Unknown";
        const lv = draft.level !== undefined ? draft.level : (d.level || "");
        info = "Subject: " + subName + ", Level: " + lv;
      } else if (systemMode === 'vnedu' && viewMode !== 'subject') {
        const list = viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES);
        const criteriaName = list.find(c => c.id === selectedCriteriaId)?.name || "Unknown";
        const lv = draft.level !== undefined ? draft.level : (d.level || "");
        info = "Criteria: " + criteriaName + ", Level: " + lv;
      } else {
        const list = viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES);
        const details = list.map(c => {
          const lv = draft[`level_${c.id}`] !== undefined ? draft[`level_${c.id}`] : (d[`level_${c.id}`] || "");
          return lv ? (c.name + ": " + lv) : null;
        }).filter(Boolean).join(", ");
        info = details || "N/A";
      }
      
      const noteText = note ? " | Note: " + note : "";
      studentListText += (idx + 1) + ". " + stu.name + " | " + info + noteText + "\n";
    });

   const systemPrompt = `Bạn là giáo viên tiểu học tại Việt Nam, giàu kinh nghiệm và luôn nhận xét học sinh với thái độ tích cực, khích lệ và mang tính giáo dục.
=====================
QUY TẮC BẮT BUỘC:
1. Mỗi nhận xét PHẢI bắt đầu bằng "Em"
2. TUYỆT ĐỐI KHÔNG được nhắc đến tên học sinh trong câu
3. KHÔNG sử dụng các từ: "cô", "thầy", "giáo viên"
4. Mỗi học sinh phải có nhận xét KHÁC NHAU
5. Nhận xét phải CỤ THỂ (nêu rõ kỹ năng, biểu hiện học tập), KHÔNG chung chung
6. Tự động sửa lỗi chính tả, ngữ pháp trước khi viết
7. Câu phải hoàn chỉnh ngữ pháp, không được dang dở.
8. Không kết thúc câu bằng các từ rời như: "tạo", "luôn", "và", "nhưng", "cần", "nên", "biết", "có", "được"..
9. Mỗi câu phải đọc tự nhiên như giáo viên viết thật.

=====================
QUY TẮC MỨC ĐÁNH GIÁ (CỰC KỲ QUAN TRỌNG - KHÔNG ĐƯỢC SAI):

- Nếu mức = T:
  → CHỈ được khen
  → TUYỆT ĐỐI KHÔNG chứa các từ/cụm: "cần", "nên", "cố gắng", "khắc phục", "rèn luyện", "lưu ý"
  → Không được có ý cải thiện dưới bất kỳ hình thức nào

- Nếu mức = H hoặc Đ:
  → BẮT BUỘC có 2 ý:
     (1) Khen
     (2) Hướng cải thiện rõ ràng
  → PHẢI chứa ít nhất 1 trong các từ: "cần", "nên", "cố gắng", "rèn luyện"

- Nếu mức = C:
  → BẮT BUỘC có:
     (1) Nêu vấn đề cụ thể
     (2) Cách khắc phục cụ thể

❗ Nếu sai quy tắc mức đánh giá → câu trả lời bị coi là KHÔNG HỢP LỆ.

=====================
ĐỊNH DẠNG TRẢ VỀ (BẮT BUỘC):
Mỗi dòng đúng format:
[StudentName]|||[Comment]

KHÔNG thêm giải thích, KHÔNG thêm ký tự dư, chỉ trả về đúng định dạng trên.`;


   const userInstruction = `${aiPrompt ? "Yêu cầu bổ sung: " + aiPrompt + "\n\n" : ""}Danh sách học sinh:
${studentListText}

Viết nhận xét theo đúng định dạng:
[StudentName]|||[Comment]

LƯU Ý:
- Mỗi học sinh một nhận xét khác nhau
- Không được nhắc tên trong nội dung nhận xét
- Phải tuân thủ tuyệt đối quy tắc mức đánh giá
- Không viết chung chung (tránh kiểu: chăm ngoan, học tốt, có tiến bộ...)
`;

    console.log('📢 Calling Gemini API...');

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: userInstruction }] }], 
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { 
          temperature: 0.5,
          maxOutputTokens: 4000
        }
      })
    });

    const result = await res.json();
    
    if (result.error) {
      const errorMsg = result.error.message || "";
      console.error('❌ Error:', errorMsg);
      
      if (errorMsg.includes("401") || errorMsg.includes("Invalid API Key")) {
        showToast('API Key invalid!', "error", "🔑", 5000);
        setShowApiKeyModal(true);
      } else if (errorMsg.includes("429") || errorMsg.includes("quota")) {
        showToast('API quota exceeded!', "error", "📊", 5000);
      } else {
        showToast('Error: ' + errorMsg, "error", "❌", 5000);
      }
      setIsGenerating(false);
      return;
    }

    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (!responseText) {
      showToast('No response from AI', 'error', '❌', 4000);
      setIsGenerating(false);
      return;
    }

    // ===== PARSE RESPONSE (TÌM TÊN HỌC SINH TRONG DANH SÁCH) =====
    const lines = responseText.split('\n').filter(line => line.includes('|||'));
    const updates = {};
    let successCount = 0;

    lines.forEach(line => {
      const parts = line.split('|||');
      if (parts.length >= 2) {
        const nameOrId = parts[0].trim();
        let comment = parts.slice(1).join('|||').trim();
        
        // Tìm học sinh theo tên
        const student = allTargets.find(s => 
          s.name === nameOrId || 
          s.id === nameOrId ||
          s.name.includes(nameOrId) ||
          nameOrId.includes(s.name)
        );
        
        if (student && comment && comment.length > 0) {

  // Xóa tên học sinh khỏi comment
  comment = comment.replace(new RegExp(`^${student.name}[,.\\s]*`, 'gi'), '');
  comment = comment.replace(new RegExp(`\\b${student.name}\\b`, 'gi'), '');

  comment = filterComments(comment).trim();

  // ===== LẤY LEVEL =====
  const d = studentData[student.id] || {};
  const draft = draftData[student.id] || {};
  let level = "";

  if (viewMode === 'subject' || systemMode === 'vnedu') {
    level = draft.level !== undefined ? draft.level : (d.level || "");
  }

  // ===== FIX LEVEL =====
  comment = autoFixComment(level, comment);

  // ===== CHECK ĐỘ DÀI =====
  if (comment.length > 10) {
    updates[student.id] = comment;
    successCount++;
  }
}
      }
    });

    if (successCount === 0) {
      console.error('Cannot parse comments:', responseText);
      showToast('Cannot parse comments', 'error', '❌', 4000);
      setIsGenerating(false);
      return;
    }

    // ===== CẬP NHẬT DRAFT DATA =====
    setDraftData(prev => {
      const updated = { ...prev };
      for (const sId of Object.keys(updates)) {
        updated[sId] = {
          ...(prev[sId] || {}),
          comment: updates[sId]
        };
      }
      return updated;
    });

    setIsGenerating(false);
    showToast(`Success: ${successCount}/${allTargets.length} students`, 'success', '✅', 3000);
    console.log(`✅ Done: ${successCount}/${allTargets.length}`);

  } catch (e) { 
    console.error('Error:', e);
    showToast('Connection error: ' + e.message, 'error', '❌', 4000);
    setIsGenerating(false);
  }
};

  const handleSendZalo = (studentId) => {
    const d = studentData[studentId] || {};
    const draft = draftData[studentId] || {};
    const finalComment = draft.comment !== undefined ? draft.comment : (d.comment || "");
    const levelTxt = draft.level !== undefined ? draft.level : (d.level || "Đ");
    const stu = students.find(s => s.id === studentId);
    if (!stu) return;

    let label = "";
    if (systemMode === 'vnedu' && viewMode !== 'subject') {
      const list = viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES);
      label = list.find(c => c.id === selectedCriteriaId)?.name;
    } else label = viewMode === 'subject' ? subjects.find(s => s.id === selectedSubId)?.name : 'Năng lực - Phẩm chất';

    const monthName = months.find(m => m.id === selectedMonthId)?.name || 'tháng';
    const levelMap = { 'T': 'Hoàn thành tốt ⭐', 'H': 'Hoàn thành ✅', 'Đ': 'Đạt ✅', 'C': 'Cần cố gắng 📝' };
    const header = `🌸 THÔNG TIN ĐÁNH GIÁ THÁNG - ${monthName.toUpperCase()} 🌸`;
    const body = `Chào Phụ huynh em: *${stu.name.toUpperCase()}*\n\n📚 *Nội dung:* ${label}\n📊 *Mức đạt:* ${levelMap[levelTxt] || levelTxt}\n✏️ *Nhận xét:* ${finalComment || "Em học tập tích cực và có nhiều tiến bộ."}\n\n🍀 Chúc em luôn chăm ngoan và học tốt nhé!\n\n🌸Gia sư Tiểu học: https://roboki.vn/🌸`;
    const content = `${header}\n\n${body}`;

    copyToClipboard(content);
    setCopySuccess(studentId); 
    showToast(`Đã sao chép tin nhắn cho ${stu.name}`, 'success', '📋', 2000);
    setTimeout(() => setCopySuccess(null), 2000);
    window.open(`https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F`, '_blank');
  };

  const exportExcel = async () => {
    if (!students.length || !window.XLSX) {
      showToast('Không có học sinh nào để xuất', 'info', '⚠️', 3000);
      return;
    }
    try {
      const className = classes.find(c => c.id === selectedClassId)?.name || 'Lớp';
      const monthName = months.find(m => m.id === selectedMonthId)?.name || 'Tháng';
      let contentName = "";
      let dataRows = [];
      let headerColumns = ['STT', 'HỌ VÀ TÊN', 'TRẠNG THÁI'];
      
      if (viewMode === 'subject') {
        contentName = subjects.find(s => s.id === selectedSubId)?.name || "Môn học";
        headerColumns.push('MỨC ĐẠT');
      } else if (systemMode === 'vnedu') {
        const list = viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES);
        contentName = list.find(c => c.id === selectedCriteriaId)?.name || "Đánh giá";
        headerColumns.push('MỨC ĐẠT');
      } else if (systemMode === 'smas' && viewMode !== 'subject') {
        if (viewMode === 'quality') {
          contentName = "Phẩm chất";
          QUALITY_CRITERIA.forEach(c => headerColumns.push(c.name));
        } else if (viewMode === 'competency') {
          contentName = "NL Chung";
          GENERAL_COMPETENCIES.forEach(c => headerColumns.push(c.name));
        } else {
          contentName = "NL Đặc thù";
          SPECIFIC_COMPETENCIES.forEach(c => headerColumns.push(c.name));
        }
      }
      
      headerColumns.push('NHẬN XÉT CHI TIẾT');

      dataRows.push([`BẢNG NHẬN XÉT CHI TIẾT (${systemMode.toUpperCase()})`]);
      dataRows.push([`Lớp: ${className} - ${monthName}`]);
      dataRows.push([`Nội dung: ${contentName}`]);
      dataRows.push([]);
      dataRows.push(headerColumns);
      
      students.forEach((s, i) => {
        const d = studentData[s.id] || {};
        const draft = draftData[s.id] || {};
        const comment = draft.comment !== undefined ? draft.comment : (d.comment || "");
        const statusText = STUDENT_STATUS[s.status?.toUpperCase()]?.label || 'Đang học';
        
        let row = [i + 1, s.name.toUpperCase(), statusText];
        
        if (viewMode === 'subject') {
          const level = draft.level !== undefined ? draft.level : (d.level || "");
          row.push(level);
        } else if (systemMode === 'vnedu') {
          const level = draft.level !== undefined ? draft.level : (d.level || "");
          row.push(level);
        } else if (systemMode === 'smas' && viewMode !== 'subject') {
          const list = viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES);
          list.forEach(c => {
            const level = draft[`level_${c.id}`] !== undefined ? draft[`level_${c.id}`] : (d[`level_${c.id}`] || "");
            row.push(level);
          });
        }
        
        row.push(comment);
        dataRows.push(row);
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(dataRows);

      const border = { style: 'thin', color: { rgb: '000000' } };
      const borderAll = { top: border, bottom: border, left: border, right: border };
      const headerFill = { fgColor: { rgb: 'FF4472C4' } };
      const headerFont = { bold: true, color: { rgb: 'FFFFFFFF' }, size: 12 };

      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: headerColumns.length - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: headerColumns.length - 1 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: headerColumns.length - 1 } }
      ];

      for (let i = 0; i < dataRows.length; i++) {
        for (let j = 0; j < dataRows[i].length; j++) {
          const cellRef = XLSX.utils.encode_col(j) + (i + 1);
          if (!ws[cellRef]) ws[cellRef] = {};
          ws[cellRef].s = { border: borderAll };
          if (i === 4) {
            ws[cellRef].s.fill = headerFill;
            ws[cellRef].s.font = headerFont;
            ws[cellRef].s.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
          } else {
            const isFirstCol = j === 0;
            const isCenterCol = j >= 3 && j < headerColumns.length - 1;
            ws[cellRef].s.alignment = { horizontal: isFirstCol || isCenterCol ? 'center' : 'left', vertical: 'top', wrapText: true };
          }
        }
      }

      ws['!cols'] = [
        { wch: 6 }, { wch: 25 }, { wch: 18 },
        ...Array(headerColumns.length - 4).fill({ wch: 12 }),
        { wch: 60 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, "NhanXet");
      XLSX.writeFile(wb, `NhanXet_${contentName}_${className}_${monthName}.xlsx`);
      showToast(`Xuất file Excel thành công`, 'success', '📥', 3000);
    } catch (e) {
      console.error(e);
      showToast('Lỗi xuất file: ' + e.message, 'error', '❌', 4000);
    }
  };

  // ===== RENDER =====
  if (!isAuthValid) return <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-black text-center">LỖI XÁC THỰC<br/>LIÊN HỆ: 0964567806</div>;

  if (!user) {
    return <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} onLogin={handleLogin} toast={toast} />;
  }

  const draftCount = Object.keys(draftData).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-12 font-sans text-left flex flex-col w-full">
      {toast && <Toast message={toast.message} type={toast.type} icon={toast.icon} />}
      
      {/* HEADER */}
      <header className="bg-indigo-900 text-white p-1 md:p-1.5 shadow-xl border-b-2 border-indigo-700 w-full sticky top-0 z-40">
  <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-3 px-4">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-white/20 rounded-xl">
        <img src="./robot.png" className="w-7 h-7" alt="Logo" />
      </div>
      <div className="flex flex-col -mt-3">
        {/* ✅ TÊN NGƯỜI DÙNG - tự giãn/thắt */}
        <div onMouseLeave={()=>setShowUserMenu(false)} className="relative mb-1">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)} 
            className="text-[14px] font-black text-indigo-200 hover:text-white transition max-w-[200px]"
          >
            {user?.displayName || user?.email}
          </button>
          {showUserMenu && (
            <div className="absolute left-0 top-full mt-0 bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden z-50">
              <button onClick={() => { handleChangeName(); setShowUserMenu(false); }} className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-100 border-b border-slate-100 transition whitespace-nowrap">✏️ Đổi tên</button>
              <button onClick={() => { handleChangePassword(); setShowUserMenu(false); }} className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-100 border-b border-slate-100 transition whitespace-nowrap">🔑 Đổi mật khẩu</button>
              <button onClick={() => { handleLogout(); setShowUserMenu(false); }} className="w-full text-left px-3 py-2 text-[12px] font-bold text-red-600 hover:bg-red-50 transition whitespace-nowrap">🚪 Đăng xuất</button>
            </div>
          )}
        </div>

        <h1 className="text-lg md:text-xl font-black uppercase leading-none tracking-tight">ĐÁNH GIÁ THƯỜNG XUYÊN</h1>
        <span className="text-indigo-300 text-[9px] font-bold uppercase mt-0.5 italic tracking-wider">TỐI ƯU NHẬN XÉT HỌC SINH TIỂU HỌC BẰNG AI</span>
      </div>
    </div>

    <div className="flex flex-col items-center gap-3">
      <div className="flex bg-indigo-950/50 p-1 rounded-xl gap-1 items-center">
        {['smas', 'vnedu'].map(sys => (
          <button key={sys} onClick={() => { setSystemMode(sys); setSelectedCriteriaId(''); setDraftData({}); }} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase transition-all ${systemMode === sys ? 'bg-white text-indigo-900 shadow-lg' : 'text-indigo-300 hover:text-white'}`}>
            🌐 {sys}
          </button>
        ))}
        <div className="w-px h-6 bg-indigo-700 mx-1"></div>
        <div className="flex items-center gap-1.5">
          <button onClick={handleSaveAllToFirebase} disabled={isSaving || draftCount === 0} className={`flex items-center gap-2 px-4 py-2.5 rounded-l-lg text-[11px] font-black uppercase transition-all shadow-md active:scale-95 ${draftCount > 0 ? 'bg-amber-500 text-white hover:bg-amber-600 animate-pulse' : 'bg-indigo-800 text-indigo-400 opacity-50 cursor-not-allowed'}`}>
            {isSaving ? '⏳' : '💾'} Lưu ({draftCount})
          </button>
          <button onClick={() => setShowApiKeyModal(true)} className={`p-2.5 rounded-r-lg transition-all ${apiKey ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white animate-bounce'} shadow-md`}>
            ⚙️
          </button>
        </div>
      </div>
      <div className="flex bg-indigo-950/50 p-1 rounded-xl gap-1 flex-wrap justify-center">
        {['subject', 'competency', 'quality', 'specific'].map(m => (
          <button key={m} onClick={() => { setViewMode(m); setSelectedCriteriaId(''); setDraftData({}); }} className={`px-4 py-2.5 rounded-lg text-[11px] font-black uppercase transition-all ${viewMode === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-300 hover:text-white'}`}>
            {m === 'competency' ? 'NL Chung' : (m === 'subject' ? 'Môn học' : (m === 'quality' ? 'Phẩm chất' : 'NL Đặc thù'))}
          </button>
        ))}
      </div>
    </div>
  </div>
</header>

      {/* SELECTION */}
      <div className="w-full px-4 md:px-8 py-3 flex flex-wrap gap-10 items-stretch">
        <SectionBox label="📅 Năm học" items={years} selectedId={selectedYearId} onSelect={setSelectedYearId} onEdit={(item) => { setEditItem(item); setInputValue(item.name); setModalType('year'); }} onDelete={() => setConfirmDelete({ type: 'year', id: selectedYearId, name: years.find(y => y.id === selectedYearId)?.name })} onAdd={() => { setEditItem(null); setInputValue(''); setModalType('year'); }} type="year" />
        <SectionBox label="🏫 Lớp học" items={classes} selectedId={selectedClassId} onSelect={setSelectedClassId} onEdit={(item) => { setEditItem(item); setInputValue(item.name); setModalType('class'); }} onDelete={() => setConfirmDelete({ type: 'class', id: selectedClassId, name: classes.find(c => c.id === selectedClassId)?.name })} onAdd={() => { setEditItem(null); setInputValue(''); setModalType('class'); }} type="class" />
        <SectionBox label="📆 Tháng" items={months} selectedId={selectedMonthId} onSelect={setSelectedMonthId} onEdit={(item) => { setEditItem(item); setInputValue(item.name); setModalType('month'); }} onDelete={() => setConfirmDelete({ type: 'month', id: selectedMonthId, name: months.find(m => m.id === selectedMonthId)?.name })} onAdd={() => { setEditItem(null); setInputValue(''); setModalType('month'); }} type="month" />
        {viewMode === 'subject' ? (
          <SectionBox label="📚 Môn học" items={subjects} selectedId={selectedSubId} onSelect={setSelectedSubId} onEdit={(item) => { setEditItem(item); setInputValue(item.name); setModalType('subject'); }} onDelete={() => setConfirmDelete({ type: 'subject', id: selectedSubId, name: subjects.find(s => s.id === selectedSubId)?.name })} onAdd={() => { setEditItem(null); setInputValue(''); setModalType('subject'); }} type="subject" />
        ) : systemMode === 'vnedu' ? (
          <SectionBox label={viewMode === 'quality' ? '⭐ Chọn Phẩm chất' : (viewMode === 'competency' ? '🧠 Chọn NL Chung' : '👤 Chọn NL Đặc thù')} items={viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES)} selectedId={selectedCriteriaId} onSelect={setSelectedCriteriaId} onEdit={() => {}} onDelete={() => {}} onAdd={() => {}} type="system_comp" />
        ) : (
          <div className="bg-indigo-50 p-2 rounded-xl border-2 border-indigo-200 shadow-sm flex items-center justify-center font-black text-indigo-700 text-[10px] uppercase gap-2 flex-1 min-w-[140px]">
            {viewMode === 'specific' ? '⭐' : (viewMode === 'competency' ? '🧠' : '👤')}
            {viewMode === 'competency' ? 'NL CHUNG (SMAS)' : (viewMode === 'quality' ? 'PHẨM CHẤT (SMAS)' : 'NL ĐẶC THÙ (SMAS)')}
          </div>
        )}
      </div>

      {/* MAIN */}
      <main className="w-full px-4 md:px-8 flex-1">
        {selectedYearId && selectedClassId && selectedMonthId && (viewMode === 'subject' ? selectedSubId : (systemMode === 'vnedu' ? selectedCriteriaId : true)) ? (
          <div className="space-y-6 w-full">
            {/* CONTROLS */}
            <div className="bg-white rounded-2xl p-2 border-2 border-slate-300 shadow-sm flex flex-col gap-3 w-full">
              <div className="flex flex-col xl:flex-row gap-3 items-end">
                <div className="flex-1 w-full text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Hướng dẫn AI</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 text-lg">✨</span>
                    <input className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl pl-12 pr-4 py-4 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" 
                      placeholder="VD: Cộng có nhớ| tìm số chia| giải toán| khoảng 20 từ " 
                      value={aiPrompt} 
                      onChange={e => setAiPrompt(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-3 w-full xl:w-auto">
                  <button onClick={runAI} disabled={isGenerating || students.length === 0} className={`flex-1 xl:flex-none px-10 py-4 ${isGenerating ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 uppercase shadow-lg transition-all active:scale-95 disabled:opacity-50`}>
                    {isGenerating ? '⏳ Đang nhận xét...' : '✨ Nhận xét AI'}
                  </button>
                  <button onClick={() => { setEditItem(null); setBulkInput(''); setModalType('student'); }} className="p-4 bg-slate-800 text-white rounded-xl shadow-lg hover:bg-black transition-all active:scale-95 text-lg">👥</button>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-4">
                <div className="flex gap-3">
                  <button onClick={() => setShowLevel(!showLevel)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black uppercase transition-all border ${showLevel ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-200'}`}>
                    {showLevel ? '👁️' : '🚫'} Mức đạt
                  </button>
                  <button onClick={() => setShowNote(!showNote)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black uppercase transition-all border ${showNote ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-200'}`}>
                    {showNote ? '👁️' : '🚫'} Ghi chú
                  </button>
                </div>
                <button onClick={exportExcel} disabled={students.length === 0} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-[11px] font-black uppercase hover:bg-emerald-700 shadow-md">
                  📥 Xuất Excel
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl border-2 border-slate-400 shadow-2xl overflow-hidden mb-12 w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse table-fixed min-w-[1200px]">
                  <thead>
                    <tr className="bg-slate-200 border-b-2 border-slate-400">
                      <th className="p-4 text-center text-[10px] font-black uppercase w-20 border-r border-slate-400 sticky left-0 bg-slate-200 z-20">STT</th>
                      <th className="p-4 text-center text-[10px] font-black uppercase w-56 border-r border-slate-400 sticky left-20 bg-slate-200 z-20">Học sinh</th>
                      {(systemMode === 'smas' && viewMode !== 'subject') ? (
                        showLevel && (viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES)).map(c => <th key={c.id} className="p-2 text-center text-[9px] font-black uppercase border-r border-slate-400 w-20">{c.name}</th>)
                      ) : (
                        showLevel && <th className="p-4 text-center text-[10px] font-black uppercase w-32 border-r border-slate-400">Mức đạt</th>
                      )}
                      {showNote && <th className="p-4 text-center text-[10px] font-black uppercase w-48 border-r border-slate-400">Ghi chú</th>}
                      <th className="p-4 text-center text-[10px] font-black uppercase min-w-[400px]">Nhận xét</th>
                      <th className="p-4 w-20 text-center text-[10px] font-black uppercase border-l border-slate-400">Zalo</th>
                      <th className="p-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-300">
                    {students.map((stu, idx) => {
                      const d = studentData[stu.id] || {};
                      const draft = draftData[stu.id] || {};
                      const finalComment = draft.comment !== undefined ? draft.comment : (d.comment || "");
                      const finalNote = draft.note !== undefined ? draft.note : (d.note || "");
                      const isInactive = stu.status && stu.status !== 'active';
                      const statusConfig = STUDENT_STATUS[stu.status?.toUpperCase()] || STUDENT_STATUS.ACTIVE;
                      const isDragging = draggedStudentId === stu.id;
                      const isDragOver = dragOverStudentId === stu.id;

                      return (
                        <tr 
                          key={stu.id} 
                          className={`transition-all draggable-row ${isInactive ? 'bg-slate-50' : 'hover:bg-indigo-50/50'} group`}>
                          
                          <td className={`p-3 text-center border-r border-slate-400 sticky left-0 z-10 ${isInactive ? 'text-slate-300 bg-slate-50' : 'text-slate-400 bg-slate-50'}`}>
                            <span className="text-xs font-bold">{idx + 1}</span>
                          </td>
                          
                          <td className="p-3 border-r border-slate-400 text-left sticky left-20 bg-inherit z-10">
                            <button 
                              draggable
                              onDragStart={(e) => handleDragStart(e, stu.id)}
                              onDragOver={(e) => handleDragOver(e, stu.id)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, stu.id)}
                              onClick={() => setStatusModalStudent(stu)} 
                              className={`flex flex-col items-start w-full text-left group/name relative cursor-move transition-all ${draggedStudentId === stu.id ? 'opacity-50 scale-95' : ''} ${dragOverStudentId === stu.id ? 'bg-indigo-200 px-2 py-1 rounded' : ''}`}
                            >
                              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 text-white text-[11px] rounded-lg whitespace-nowrap z-50 opacity-0 group-hover/name:opacity-100 transition-opacity pointer-events-none font-bold shadow-lg">
                                Cập nhật: {d.lastModified ? new Date(d.lastModified).toLocaleDateString('vi-VN') : 'N/A'}
                              </div>
                              <span className={`font-black text-sm uppercase transition-all ${isInactive ? 'text-slate-400 line-through' : 'text-slate-800 group-hover/name:text-indigo-600'}`}>
                                {stu.name}
                              </span>
                              {isInactive && (
                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded mt-1 ${statusConfig.bg} ${statusConfig.color}`}>
                                  {statusConfig.label}
                                </span>
                              )}
                            </button>
                          </td>

                          {/* CÁC TD KHÁC GIỮ NGUYÊN */}
                          {(systemMode === 'smas' && viewMode !== 'subject') ? (
                            showLevel && (viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES)).map(c => {
                              const lvVal = draft[`level_${c.id}`] !== undefined ? draft[`level_${c.id}`] : (d[`level_${c.id}`] || "");
                              return (
                                <td key={c.id} className="p-1 border-r border-slate-400">
                                  <div className="flex justify-center gap-0.5">
                                    {['T', 'Đ', 'C'].map(lv => (
                                      <button disabled={isInactive} key={lv} onClick={() => updateDraft(stu.id, `level_${c.id}`, lv)} className={`w-5 h-6 rounded font-black text-[9px] ${lvVal === lv ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'} disabled:opacity-20`}>{lv}</button>
                                    ))}
                                  </div>
                                </td>
                              );
                            })
                          ) : (
                            showLevel && (
                              <td className="p-3 border-r border-slate-400">
                                <div className="flex justify-center gap-1">
                                  {(viewMode === 'subject' ? ['T', 'H', 'C'] : ['T', 'Đ', 'C']).map(lv => {
                                    const lvVal = draft.level !== undefined ? draft.level : (d.level || "");
                                    return (
                                      <button disabled={isInactive} key={lv} onClick={() => updateDraft(stu.id, 'level', lv)} className={`w-8 h-8 rounded-lg font-black text-[10px] ${lvVal === lv ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'} disabled:opacity-20`}>{lv}</button>
                                    );
                                  })}
                                </div>
                              </td>
                            )
                          )}
                          
                          {showNote && <td className="p-2 border-r border-slate-400 align-top"><EditableCell disabled={isInactive} value={finalNote} isDraft={draft.note !== undefined} onSave={(val) => updateDraft(stu.id, 'note', val)} className="bg-transparent text-xs font-bold text-indigo-700 outline-none" /></td>}
                          
                          <td className="p-2 text-left align-top">
                            <EditableCell disabled={isInactive} value={finalComment} isDraft={draft.comment !== undefined} onSave={(val) => updateDraft(stu.id, 'comment', val)} className="bg-transparent text-sm font-medium text-slate-700 leading-relaxed" />
                          </td>
                          
                          <td className="p-3 text-center border-l border-slate-400">
                            <button disabled={!finalComment || isInactive} onClick={() => handleSendZalo(stu.id)} className={`p-2.5 rounded-full mx-auto transition-all ${copySuccess === stu.id ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white disabled:opacity-20'}`}>
                              {copySuccess === stu.id ? '✅' : <ZaloIcon size={18} />}
                            </button>
                          </td>
                          
                          <td className="p-3 text-center"><button onClick={() => setConfirmDelete({ type: 'student', id: stu.id, name: stu.name })} className="text-slate-200 hover:text-red-500 text-lg">🗑️</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : <div className="py-32 text-center bg-white rounded-3xl border-4 border-dashed border-slate-300 font-black text-slate-300 uppercase tracking-[0.2em] text-xl">Chọn đủ dữ liệu để bắt đầu</div>}
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full px-8 py-1 bg-white border-t border-slate-200 z-50">
        <div className="flex justify-between items-center text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} • {AUTHOR_NAME} • {AUTHOR_PHONE}</div>
          <div className="text-right italic normal-case">* Thầy/Cô vui lòng kiểm tra lại dữ liệu AI trước khi lưu.</div>
        </div>
      </footer>

      {/* MODALS */}
      {statusModalStudent && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl border-t-8 border-indigo-600">
            {!showMoveTargetSelect ? (
              <>
                <h3 className="text-lg font-black uppercase text-slate-800 mb-2">Trạng thái học sinh</h3>
                <p className="text-sm font-bold text-indigo-600 uppercase mb-8">{statusModalStudent.name}</p>
                <div className="grid grid-cols-1 gap-3">
                  {Object.keys(STUDENT_STATUS).map(key => {
                    const status = STUDENT_STATUS[key];
                    return (
                      <button 
                        key={status.id}
                        onClick={() => handleUpdateStatus(statusModalStudent.id, status.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${statusModalStudent.status === status.id ? 'bg-indigo-50 border-indigo-600' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                      >
                        <div className={`p-2 rounded-xl ${statusModalStudent.status === status.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:text-indigo-600 shadow-sm'}`}>
                          {status.id === 'active' ? '✅' : status.id === 'dropped' ? '❌' : status.id === 'transferred' ? '✈️' : '➡️'}
                        </div>
                        <span className={`font-black text-xs uppercase ${statusModalStudent.status === status.id ? 'text-indigo-900' : 'text-slate-500'}`}>
                          {status.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setStatusModalStudent(null)} className="w-full mt-8 py-4 font-black text-slate-400 uppercase text-[10px]">Đóng</button>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setShowMoveTargetSelect(false)} className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 text-xl">✕</button>
                  <h3 className="text-lg font-black uppercase text-slate-800">Chọn lớp chuyển đến</h3>
                </div>
                <div className="max-h-80 overflow-y-auto space-y-2 mb-8">
                  {classes.filter(c => c.id !== selectedClassId).map(cls => (
                    <button key={cls.id} disabled={isMoving} onClick={() => handleMoveStudentToClass(cls.id)} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all">
                      <span className="font-black text-sm uppercase">{cls.name}</span>
                      <span className="text-lg">→</span>
                    </button>
                  ))}
                </div>
                {isMoving && <div className="flex items-center justify-center gap-3 py-4 text-indigo-600 font-black text-[10px] uppercase">⏳ Đang di chuyển...</div>}
                <button disabled={isMoving} onClick={() => setShowMoveTargetSelect(false)} className="w-full py-4 font-black text-slate-400 uppercase text-[10px]">Quay lại</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showApiKeyModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl border-t-8 border-emerald-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl text-2xl">🔑</div>
              <h3 className="text-xl font-black uppercase text-slate-800">API KEY GEMINI</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">Liên hệ: <a href="https://aistudio.google.com/" className="text-blue-600 underline">Vui lòng nháy vào đây lấy API Key</a></p>
            <input type="password" className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-xl mb-6 font-mono text-sm outline-none" placeholder="Nhập API Key..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
            <div className="flex gap-4">
              <button onClick={() => setShowApiKeyModal(false)} className="flex-1 py-4 font-black text-slate-400 uppercase text-[10px]">Đóng</button>
              <button onClick={() => saveApiKey(apiKey)} className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-xl uppercase text-[10px]">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {modalType && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border-t-8 border-indigo-600">
      <h3 className="text-xl font-black uppercase text-slate-800 mb-6">{editItem ? "Sửa" : "Thêm"} {modalType === 'student' ? 'Học sinh' : 'Thông tin'}</h3>
      {modalType === 'student' ? 
        <textarea autoFocus className="w-full h-64 p-4 bg-slate-50 border-2 border-slate-300 rounded-xl mb-6 font-bold outline-none" placeholder="Danh sách tên (1 tên/dòng)..." value={bulkInput} onChange={e => setBulkInput(e.target.value)}/> 
        : 
        <input autoFocus className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-xl font-bold mb-6 outline-none" value={inputValue} onChange={e => setInputValue(e.target.value)}/>
      }
      <div className="flex gap-4">
        <button onClick={() => setModalType(null)} disabled={isSaving} className="flex-1 py-4 font-black text-slate-400 uppercase text-[10px] disabled:opacity-50">Đóng</button>
        {!isSaving && <button onClick={async () => {
          try {
            setIsSaving(true);
            if (modalType === 'student') {
              const names = bulkInput.split('\n').map(n => n.trim()).filter(n => n !== '');
              const col = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
                .collection('classes').doc(selectedClassId).collection('students');
              for (const name of names) {
                await col.add({ name, status: 'active', createdAt: Date.now() });
              }
              showToast(`Đã thêm ${names.length} học sinh thành công`, 'success', '✅', 3000);
            } else {
              const colName = modalType === 'year' ? 'years' : modalType === 'class' ? 'classes' : modalType === 'month' ? 'months' : 'subjects';
              const col = db.collection('artifacts').doc(appId).collection('public').doc('data').collection(colName);
              if (editItem) {
                await col.doc(editItem.id).update({ name: inputValue });
                showToast('Cập nhật thành công', 'success', '✅', 3000);
              } else {
                await col.add({ name: inputValue, createdAt: Date.now() });
                showToast('Thêm mới thành công', 'success', '✅', 3000);
              }
            }
            setInputValue(''); 
            setBulkInput(''); 
            setModalType(null);
          } catch (e) {
            showToast('Lỗi: ' + e.message, 'error', '❌', 4000);
          } finally {
            setIsSaving(false);
          }
        }} className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-xl uppercase text-[10px]">Lưu</button>}
        {isSaving && <div className="flex-[2] py-4 bg-slate-400 text-white font-black rounded-xl uppercase text-[10px] flex items-center justify-center">⏳ Đang lưu...</div>}
      </div>
    </div>
  </div>
)}

      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl border-t-8 border-red-600">
            <h3 className="text-lg font-black mb-2 uppercase">Xác nhận xóa</h3>
            <p className="text-slate-500 text-sm mb-6">Xóa <span className="text-red-600 font-bold">"{confirmDelete.name}"</span>?</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-4 font-black text-slate-400 uppercase text-[10px]">Hủy</button>
              <button onClick={async () => {
                try {
                  if (confirmDelete.type === 'student') {
                    await db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
                      .collection('classes').doc(selectedClassId).collection('students').doc(confirmDelete.id).delete();
                  } else {
                    const colName = confirmDelete.type === 'year' ? 'years' : confirmDelete.type === 'class' ? 'classes' : confirmDelete.type === 'month' ? 'months' : 'subjects';
                    await db.collection('artifacts').doc(appId).collection('public').doc('data').collection(colName).doc(confirmDelete.id).delete();
                  }
                  setConfirmDelete(null);
                  showToast('Xóa thành công', 'success', '✅', 3000);
                } catch (e) {
                  showToast('Lỗi xóa: ' + e.message, 'error', '❌', 4000);
                }
              }} className="flex-1 py-4 bg-red-600 text-white font-black rounded-xl uppercase text-[10px]">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
