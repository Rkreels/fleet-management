import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, MapPin, LogIn, LogOut, Fuel, FileText, Bell, CheckCircle, Truck, Navigation, Scan } from 'lucide-react';
import { toast } from 'react-toastify';

interface DriverAppViewProps {
  open: boolean;
  onClose: () => void;
}

const DriverAppView: React.FC<DriverAppViewProps> = ({ open, onClose }) => {
  const [screen, setScreen] = useState<'home' | 'login' | 'dashboard' | 'fuel' | 'km' | 'trip'>('home');
  const [loggedIn, setLoggedIn] = useState(false);
  const [empId, setEmpId] = useState('');
  const [kmPhoto, setKmPhoto] = useState<string | null>(null);
  const [fuelPhoto, setFuelPhoto] = useState<string | null>(null);
  const [tripPhoto, setTripPhoto] = useState<string | null>(null);
  const [loginTime, setLoginTime] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraMode, setCameraMode] = useState<'km' | 'fuel' | 'trip' | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [currentFileMode, setCurrentFileMode] = useState<'km' | 'fuel' | 'trip' | null>(null);

  const startCamera = useCallback(async (mode: 'km' | 'fuel' | 'trip') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setCameraMode(mode);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      toast.error('Camera access denied. Please allow camera permission.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraMode(null);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current && cameraMode) {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth || 320;
      canvasRef.current.height = videoRef.current.videoHeight || 240;
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      if (cameraMode === 'km') setKmPhoto(dataUrl);
      if (cameraMode === 'fuel') setFuelPhoto(dataUrl);
      if (cameraMode === 'trip') setTripPhoto(dataUrl);
      stopCamera();
      toast.success('Photo captured!');
    }
  }, [cameraMode, stopCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentFileMode) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (currentFileMode === 'km') setKmPhoto(dataUrl);
      if (currentFileMode === 'fuel') setFuelPhoto(dataUrl);
      if (currentFileMode === 'trip') setTripPhoto(dataUrl);
      toast.success('File uploaded!');
    };
    reader.readAsDataURL(file);
    setCurrentFileMode(null);
  };

  const handleLogin = () => {
    if (!empId.trim()) { toast.error('Enter Employee ID'); return; }
    if (!kmPhoto) { toast.error('Capture KM reading photo first'); return; }
    setLoggedIn(true);
    setLoginTime(new Date().toLocaleTimeString());
    setScreen('dashboard');
    toast.success('Login successful! Location captured.');
  };

  const handleLogout = () => {
    if (!kmPhoto) { toast.error('Capture KM reading photo for logout'); return; }
    toast.success('Logout recorded. Trip data saved.');
    setLoggedIn(false);
    setScreen('home');
    setEmpId('');
    setKmPhoto(null);
    setFuelPhoto(null);
    setTripPhoto(null);
    setLoginTime(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative"
          >
            {/* Phone frame */}
            <div className="w-80 bg-[#0f1923] rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-700">
              <div className="bg-white rounded-[2rem] overflow-hidden" style={{ height: 620 }}>
                {/* Status bar */}
                <div className="bg-[#0f1923] px-6 py-2 flex justify-between items-center">
                  <span className="text-white text-xs font-semibold">9:41 AM</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 border border-white rounded-sm"><div className="w-3 h-full bg-green-400 rounded-sm"></div></div>
                  </div>
                </div>

                <div className="h-full overflow-y-auto bg-slate-50">
                  {/* Camera overlay */}
                  {cameraMode && (
                    <div className="absolute inset-0 z-50 bg-black flex flex-col rounded-[2rem] overflow-hidden">
                      <video ref={videoRef} className="flex-1 object-cover" autoPlay playsInline muted />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="p-4 flex justify-center gap-4 bg-black">
                        <button onClick={stopCamera} className="px-4 py-2 bg-slate-700 text-white rounded-full text-sm">Cancel</button>
                        <button onClick={capturePhoto} className="w-14 h-14 bg-white rounded-full border-4 border-[#f97316] flex items-center justify-center">
                          <Camera size={20} className="text-[#0f1923]" />
                        </button>
                      </div>
                    </div>
                  )}

                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

                  {screen === 'home' && (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="w-20 h-20 rounded-2xl bg-[#f97316] flex items-center justify-center mb-4 shadow-lg">
                        <Truck size={36} className="text-white" />
                      </div>
                      <h1 className="text-xl font-bold text-[#0f1923] mb-1">SKM Driver App</h1>
                      <p className="text-slate-500 text-sm mb-8">Fleet Management System</p>
                      <button
                        onClick={() => setScreen('login')}
                        className="w-full py-4 bg-[#f97316] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#ea6c0a] transition-all"
                      >
                        Driver Login
                      </button>
                    </div>
                  )}

                  {screen === 'login' && (
                    <div className="p-5 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <button onClick={() => setScreen('home')} className="text-slate-500 hover:text-slate-800">←</button>
                        <h2 className="font-bold text-[#0f1923]">Driver Login</h2>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Employee ID</label>
                        <input
                          value={empId}
                          onChange={e => setEmpId(e.target.value)}
                          placeholder="EMP-001"
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/40"
                        />
                      </div>

                      <div className="bg-slate-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-slate-600 mb-2">KM Reading Photo (Required)</p>
                        {kmPhoto ? (
                          <div className="relative">
                            <img src={kmPhoto} alt="KM reading" className="w-full h-28 object-cover rounded-lg" />
                            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                              <CheckCircle size={14} className="text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => startCamera('km')}
                              className="flex flex-col items-center gap-1 py-3 bg-[#0f1923] text-white rounded-xl text-xs font-medium"
                            >
                              <Camera size={18} />
                              Camera
                            </button>
                            <button
                              onClick={() => { setCurrentFileMode('km'); fileRef.current?.click(); }}
                              className="flex flex-col items-center gap-1 py-3 bg-[#f97316] text-white rounded-xl text-xs font-medium"
                            >
                              <Upload size={18} />
                              Upload
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3">
                        <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                        <p className="text-xs text-blue-700">GPS location will be captured automatically on login</p>
                      </div>

                      <button
                        onClick={handleLogin}
                        className="w-full py-4 bg-[#f97316] text-white rounded-2xl font-bold shadow-lg hover:bg-[#ea6c0a] transition-all"
                      >
                        Login & Start Trip
                      </button>
                    </div>
                  )}

                  {screen === 'dashboard' && loggedIn && (
                    <div className="p-4 space-y-3">
                      <div className="bg-gradient-to-r from-[#0f1923] to-[#1a2535] rounded-2xl p-4 text-white">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-[#f97316] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">RK</span>
                          </div>
                          <div>
                            <p className="font-bold">Rajan Kumar</p>
                            <p className="text-slate-400 text-xs">EMP-001 · TN 09 AB 1234</p>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <div><p className="text-slate-400">Login Time</p><p className="font-semibold">{loginTime}</p></div>
                          <div><p className="text-slate-400">Status</p><p className="text-green-400 font-semibold">● On Duty</p></div>
                          <div><p className="text-slate-400">KM</p><p className="font-semibold">48,320</p></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { icon: Fuel, label: 'Fuel Entry', color: 'bg-orange-500', action: () => setScreen('fuel') },
                          { icon: Navigation, label: 'KM Update', color: 'bg-blue-500', action: () => setScreen('km') },
                          { icon: FileText, label: 'Trip Sheet', color: 'bg-green-500', action: () => setScreen('trip') },
                          { icon: Bell, label: 'Alerts', color: 'bg-red-500', action: () => toast.info('2 new alerts') },
                        ].map(item => (
                          <button
                            key={item.label}
                            onClick={item.action}
                            className={`${item.color} text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-90 transition-all active:scale-95`}
                          >
                            <item.icon size={24} />
                            <span className="text-xs font-semibold">{item.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <h3 className="font-semibold text-slate-800 text-sm mb-2">Today's Summary</h3>
                        <div className="space-y-2">
                          {[
                            { label: 'Distance', value: '0 km' },
                            { label: 'Fuel Used', value: '0 L' },
                            { label: 'Trips', value: '0' },
                          ].map(s => (
                            <div key={s.label} className="flex justify-between text-xs">
                              <span className="text-slate-500">{s.label}</span>
                              <span className="font-semibold text-slate-800">{s.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                      >
                        <LogOut size={18} />
                        Logout & End Trip
                      </button>
                    </div>
                  )}

                  {screen === 'fuel' && (
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => setScreen('dashboard')} className="text-slate-500 hover:text-slate-800">←</button>
                        <h2 className="font-bold text-[#0f1923]">Fuel Entry</h2>
                      </div>
                      <div className="bg-slate-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-slate-600 mb-2">Fuel Bill Photo</p>
                        {fuelPhoto ? (
                          <div className="relative">
                            <img src={fuelPhoto} alt="Fuel bill" className="w-full h-28 object-cover rounded-lg" />
                            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1"><CheckCircle size={14} className="text-white" /></div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => startCamera('fuel')} className="flex flex-col items-center gap-1 py-3 bg-[#0f1923] text-white rounded-xl text-xs font-medium">
                              <Camera size={18} />Camera
                            </button>
                            <button onClick={() => { setCurrentFileMode('fuel'); fileRef.current?.click(); }} className="flex flex-col items-center gap-1 py-3 bg-[#f97316] text-white rounded-xl text-xs font-medium">
                              <Upload size={18} />Upload
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-2">
                        <Scan size={16} className="text-orange-600" />
                        <p className="text-xs text-orange-700">AI will auto-extract fuel amount, cost & KM from bill</p>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'KM Reading', placeholder: 'Auto-detected from photo' },
                          { label: 'Fuel Amount (L)', placeholder: 'Auto-extracted' },
                          { label: 'Fuel Cost (₹)', placeholder: 'Auto-extracted' },
                        ].map(f => (
                          <div key={f.label}>
                            <label className="text-xs font-semibold text-slate-600 block mb-1">{f.label}</label>
                            <input placeholder={f.placeholder} className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/40" />
                          </div>
                        ))}
                      </div>
                      <button onClick={() => { toast.success('Fuel entry submitted!'); setScreen('dashboard'); }} className="w-full py-3 bg-[#f97316] text-white rounded-2xl font-bold hover:bg-[#ea6c0a] transition-all">
                        Submit Fuel Entry
                      </button>
                    </div>
                  )}

                  {screen === 'km' && (
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => setScreen('dashboard')} className="text-slate-500 hover:text-slate-800">←</button>
                        <h2 className="font-bold text-[#0f1923]">KM Update</h2>
                      </div>
                      <div className="bg-slate-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-slate-600 mb-2">Dashboard KM Photo</p>
                        {kmPhoto ? (
                          <div className="relative">
                            <img src={kmPhoto} alt="KM reading" className="w-full h-28 object-cover rounded-lg" />
                            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1"><CheckCircle size={14} className="text-white" /></div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => startCamera('km')} className="flex flex-col items-center gap-1 py-3 bg-[#0f1923] text-white rounded-xl text-xs font-medium">
                              <Camera size={18} />Camera
                            </button>
                            <button onClick={() => { setCurrentFileMode('km'); fileRef.current?.click(); }} className="flex flex-col items-center gap-1 py-3 bg-[#f97316] text-white rounded-xl text-xs font-medium">
                              <Upload size={18} />Upload
                            </button>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Current KM Reading</label>
                        <input placeholder="AI auto-detected: 48,320" className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/40" />
                      </div>
                      <button onClick={() => { toast.success('KM reading updated!'); setScreen('dashboard'); }} className="w-full py-3 bg-[#f97316] text-white rounded-2xl font-bold hover:bg-[#ea6c0a] transition-all">
                        Update KM Reading
                      </button>
                    </div>
                  )}

                  {screen === 'trip' && (
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => setScreen('dashboard')} className="text-slate-500 hover:text-slate-800">←</button>
                        <h2 className="font-bold text-[#0f1923]">Trip Sheet</h2>
                      </div>
                      <div className="bg-slate-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-slate-600 mb-2">Trip Sheet Photo</p>
                        {tripPhoto ? (
                          <div className="relative">
                            <img src={tripPhoto} alt="Trip sheet" className="w-full h-28 object-cover rounded-lg" />
                            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1"><CheckCircle size={14} className="text-white" /></div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => startCamera('trip')} className="flex flex-col items-center gap-1 py-3 bg-[#0f1923] text-white rounded-xl text-xs font-medium">
                              <Camera size={18} />Camera
                            </button>
                            <button onClick={() => { setCurrentFileMode('trip'); fileRef.current?.click(); }} className="flex flex-col items-center gap-1 py-3 bg-[#f97316] text-white rounded-xl text-xs font-medium">
                              <Upload size={18} />Upload
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'From Location', placeholder: 'Chennai' },
                          { label: 'To Location', placeholder: 'Bangalore' },
                          { label: 'Load Description', placeholder: 'Goods description' },
                          { label: 'Freight Amount (₹)', placeholder: '25,000' },
                        ].map(f => (
                          <div key={f.label}>
                            <label className="text-xs font-semibold text-slate-600 block mb-1">{f.label}</label>
                            <input placeholder={f.placeholder} className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/40" />
                          </div>
                        ))}
                      </div>
                      <button onClick={() => { toast.success('Trip sheet submitted!'); setScreen('dashboard'); }} className="w-full py-3 bg-[#f97316] text-white rounded-2xl font-bold hover:bg-[#ea6c0a] transition-all">
                        Submit Trip Sheet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
              aria-label="Close driver app"
            >
              <X size={16} className="text-slate-700" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DriverAppView;