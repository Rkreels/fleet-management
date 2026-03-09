import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Scan, CheckCircle, Loader, ZoomIn } from 'lucide-react';
import { toast } from 'react-toastify';

interface AIScanResult {
  vehicleNo?: string;
  kmReading?: string;
  date?: string;
  fuelAmount?: string;
  fuelCost?: string;
  vendor?: string;
  gst?: string;
  workDesc?: string;
  totalCost?: string;
}

interface AIScanModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'fuel' | 'maintenance' | 'km' | 'trip';
  onResult?: (result: AIScanResult) => void;
}

const dummyResults: Record<string, AIScanResult> = {
  fuel: { vehicleNo: 'TN 09 AB 1234', kmReading: '48,320', date: '2026-01-15', fuelAmount: '85 L', fuelCost: '₹8,415', vendor: 'HP Petrol Pump, Chennai' },
  maintenance: { vendor: 'Sri Murugan Auto Works', workDesc: 'Engine oil change, Filter replacement, Brake pad service', totalCost: '₹12,500', gst: '₹2,250', date: '2026-01-14' },
  km: { kmReading: '48,320', date: '2026-01-15', vehicleNo: 'TN 09 AB 1234' },
  trip: { date: '2026-01-15', kmReading: '1,240 km', fuelCost: '₹9,800', totalCost: '₹24,500' },
};

const AIScanModal: React.FC<AIScanModalProps> = ({ open, onClose, mode, onResult }) => {
  const [step, setStep] = useState<'capture' | 'scanning' | 'result'>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [result, setResult] = useState<AIScanResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      toast.error('Camera access denied. Please allow camera permission.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      stopCamera();
      runScan(dataUrl);
    }
  }, [stopCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCapturedImage(dataUrl);
      runScan(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const runScan = (_dataUrl: string) => {
    setStep('scanning');
    setTimeout(() => {
      const res = dummyResults[mode];
      setResult(res);
      setStep('result');
    }, 2500);
  };

  const handleConfirm = () => {
    if (result && onResult) onResult(result);
    toast.success('AI scan data applied successfully!');
    handleClose();
  };

  const handleClose = () => {
    stopCamera();
    setStep('capture');
    setCapturedImage(null);
    setResult(null);
    onClose();
  };

  const modeLabels: Record<string, string> = {
    fuel: 'Fuel Bill Scanner',
    maintenance: 'Maintenance Bill Scanner',
    km: 'KM Reading Scanner',
    trip: 'Trip Sheet Scanner',
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-[#0f1923] to-[#1a2535]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f97316] flex items-center justify-center">
                  <Scan size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">AI Document Scanner</h2>
                  <p className="text-slate-400 text-xs">{modeLabels[mode]}</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {step === 'capture' && (
                <div className="space-y-4">
                  {cameraActive ? (
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                      <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                      <div className="absolute inset-0 border-2 border-[#f97316]/60 rounded-xl pointer-events-none">
                        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#f97316]"></div>
                        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#f97316]"></div>
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#f97316]"></div>
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#f97316]"></div>
                      </div>
                      <button
                        onClick={capturePhoto}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#f97316] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                      >
                        <Camera size={24} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
                      <ZoomIn size={40} className="mx-auto text-slate-400 mb-3" />
                      <p className="text-slate-600 font-medium mb-1">Position document in frame</p>
                      <p className="text-slate-400 text-sm">Use camera or upload an image file</p>
                    </div>
                  )}

                  <canvas ref={canvasRef} className="hidden" />

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={cameraActive ? () => { stopCamera(); } : startCamera}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0f1923] text-white rounded-lg hover:bg-[#1a2535] transition-all duration-200 font-medium text-sm"
                    >
                      <Camera size={16} />
                      {cameraActive ? 'Stop Camera' : 'Open Camera'}
                    </button>
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all duration-200 font-medium text-sm"
                    >
                      <Upload size={16} />
                      Upload File
                    </button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </div>
              )}

              {step === 'scanning' && (
                <div className="text-center py-8">
                  {capturedImage && (
                    <img src={capturedImage} alt="Captured document" className="w-full h-40 object-cover rounded-xl mb-6 opacity-60" />
                  )}
                  <div className="flex items-center justify-center mb-4">
                    <Loader size={40} className="text-[#f97316] animate-spin" />
                  </div>
                  <p className="text-slate-800 font-semibold mb-1">AI Processing...</p>
                  <p className="text-slate-500 text-sm">Extracting data from document</p>
                  <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2.5 }}
                      className="h-full bg-[#f97316] rounded-full"
                    />
                  </div>
                </div>
              )}

              {step === 'result' && result && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <CheckCircle size={20} />
                    <span className="font-semibold">AI Extraction Complete</span>
                  </div>
                  {capturedImage && (
                    <img src={capturedImage} alt="Scanned document" className="w-full h-32 object-cover rounded-xl" />
                  )}
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    {Object.entries(result).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center py-1 border-b border-slate-200 last:border-0">
                        <span className="text-slate-500 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-slate-800 font-semibold text-sm">{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => { setStep('capture'); setCapturedImage(null); setResult(null); }}
                      className="px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium text-sm"
                    >
                      Rescan
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="px-4 py-3 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all duration-200 font-medium text-sm"
                    >
                      Apply Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIScanModal;