import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Truck, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface AddVehicleModalProps {
  open: boolean;
  onClose: () => void;
  onAdd?: (data: Record<string, string>) => void;
}

const docFields = ['RC', 'FC', 'Insurance', 'Permit', 'National Permit', 'Road Tax', 'PUC'];

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ open, onClose, onAdd }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Record<string, string>>();
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  const [step, setStep] = useState<1 | 2>(1);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleDocUpload = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocs(prev => ({ ...prev, [docName]: file.name }));
      toast.success(`${docName} uploaded successfully`);
    }
  };

  const onSubmit = (data: Record<string, string>) => {
    if (step === 1) { setStep(2); return; }
    if (onAdd) onAdd(data);
    toast.success('Vehicle added successfully!');
    reset();
    setUploadedDocs({});
    setStep(1);
    onClose();
  };

  const handleClose = () => {
    reset();
    setUploadedDocs({});
    setStep(1);
    onClose();
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-[#0f1923] to-[#1a2535]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f97316] flex items-center justify-center">
                  <Truck size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold">Add New Vehicle</h2>
                  <p className="text-slate-400 text-xs">Step {step} of 2 — {step === 1 ? 'Vehicle Details' : 'Document Upload'}</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'regNo', label: 'Registration Number', placeholder: 'TN 09 AB 1234' },
                      { name: 'model', label: 'Vehicle Model', placeholder: 'Tata Prima 4028.S' },
                      { name: 'chassis', label: 'Chassis Number', placeholder: 'MAT445103...' },
                      { name: 'engine', label: 'Engine Number', placeholder: '4928CRDL...' },
                      { name: 'driver', label: 'Assigned Driver', placeholder: 'Driver name' },
                      { name: 'gpsId', label: 'GPS Device ID', placeholder: 'GPS-001' },
                      { name: 'fuelCard', label: 'Fuel Card Number', placeholder: 'FC-2024-001' },
                      { name: 'fastagId', label: 'FASTag ID', placeholder: 'FT-TN-001' },
                    ].map(field => (
                      <div key={field.name}>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{field.label}</label>
                        <input
                          {...register(field.name, { required: true })}
                          placeholder={field.placeholder}
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/40 transition-all ${errors[field.name] ? 'border-red-400' : 'border-slate-300'}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Purchase Date</label>
                    <input
                      type="date"
                      {...register('purchaseDate', { required: true })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/40"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 mb-4">Upload vehicle documents. Supported formats: PDF, JPG, PNG</p>
                  {docFields.map(doc => (
                    <div key={doc} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{doc}</p>
                        {uploadedDocs[doc] && (
                          <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                            <CheckCircle size={12} /> {uploadedDocs[doc]}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Expiry Date</label>
                            <input type="date" className="text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#f97316]/40" />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileRefs.current[doc]?.click()}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            uploadedDocs[doc] ? 'bg-green-100 text-green-700' : 'bg-[#f97316] text-white hover:bg-[#ea6c0a]'
                          }`}
                        >
                          <Upload size={12} />
                          {uploadedDocs[doc] ? 'Uploaded' : 'Upload'}
                        </button>
                        <input
                          ref={el => { fileRefs.current[doc] = el; }}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleDocUpload(doc, e)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium text-sm"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all font-medium text-sm"
                >
                  {step === 1 ? 'Next: Documents' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddVehicleModal;