import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Users, CheckCircle, Camera } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface AddDriverModalProps {
  open: boolean;
  onClose: () => void;
  onAdd?: (data: Record<string, string>) => void;
}

const AddDriverModal: React.FC<AddDriverModalProps> = ({ open, onClose, onAdd }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Record<string, string>>();
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  const photoRef = useRef<HTMLInputElement>(null);
  const docRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDocUpload = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocs(prev => ({ ...prev, [docName]: file.name }));
      toast.success(`${docName} uploaded`);
    }
  };

  const onSubmit = (data: Record<string, string>) => {
    if (onAdd) onAdd(data);
    toast.success('Driver added successfully!');
    reset();
    setPhoto(null);
    setUploadedDocs({});
    onClose();
  };

  const handleClose = () => {
    reset();
    setPhoto(null);
    setUploadedDocs({});
    onClose();
  };

  const docFields = ['Driving License', 'Driver Insurance', 'Medical Certificate', 'Police Verification', 'Address Proof'];

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
                  <Users size={16} className="text-white" />
                </div>
                <h2 className="text-white font-bold">Add New Driver</h2>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Photo upload */}
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-[#f97316] transition-colors overflow-hidden bg-slate-50"
                  onClick={() => photoRef.current?.click()}
                >
                  {photo ? (
                    <img src={photo} alt="Driver" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={24} className="text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-700 text-sm">Driver Photo</p>
                  <button type="button" onClick={() => photoRef.current?.click()} className="text-xs text-[#f97316] hover:underline">
                    Upload photo
                  </button>
                  <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'name', label: 'Full Name', placeholder: 'Rajan Kumar' },
                  { name: 'empId', label: 'Employee ID', placeholder: 'EMP-001' },
                  { name: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210' },
                  { name: 'license', label: 'License Number', placeholder: 'TN0120240012345' },
                  { name: 'vehicle', label: 'Assigned Vehicle', placeholder: 'TN 09 AB 1234' },
                  { name: 'experience', label: 'Experience', placeholder: '5 Years' },
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
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">License Expiry</label>
                  <input type="date" {...register('licenseExpiry', { required: true })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/40" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Join Date</label>
                  <input type="date" {...register('joinDate', { required: true })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/40" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                <textarea {...register('address')} rows={2} placeholder="Full address" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/40 resize-none" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-700 text-sm mb-3">Document Upload</h3>
                <div className="space-y-2">
                  {docFields.map(doc => (
                    <div key={doc} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{doc}</p>
                        {uploadedDocs[doc] && <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={10} /> {uploadedDocs[doc]}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => docRefs.current[doc]?.click()}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${uploadedDocs[doc] ? 'bg-green-100 text-green-700' : 'bg-[#f97316] text-white hover:bg-[#ea6c0a]'}`}
                      >
                        <Upload size={12} />
                        {uploadedDocs[doc] ? 'Done' : 'Upload'}
                      </button>
                      <input ref={el => { docRefs.current[doc] = el; }} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleDocUpload(doc, e)} />
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full px-4 py-3 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all font-medium">
                Add Driver
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddDriverModal;