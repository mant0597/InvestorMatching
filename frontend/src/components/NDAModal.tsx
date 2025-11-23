import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X, Eraser, Check } from 'lucide-react';

interface NDAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signatureData: string) => void;
  companyName: string;
}

const NDAModal: React.FC<NDAModalProps> = ({ isOpen, onClose, onSign, companyName }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const clear = () => {
    sigCanvas.current?.clear();
    setError('');
  };

  const handleSign = () => {
    if (sigCanvas.current?.isEmpty()) {
      setError('Please provide a signature');
      return;
    }

    const signatureData = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    if (signatureData) {
      onSign(signatureData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Non-Disclosure Agreement
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300">
            <p>
              This Non-Disclosure Agreement ("Agreement") is entered into by and between the undersigned ("Recipient") and <strong>{companyName}</strong> ("Disclosing Party").
            </p>
            <p>
              1. <strong>Confidential Information.</strong> Recipient agrees that all information disclosed by Disclosing Party, including but not limited to business plans, financial data, and trade secrets, shall be considered Confidential Information.
            </p>
            <p>
              2. <strong>Non-Disclosure.</strong> Recipient agrees not to disclose, publish, or otherwise reveal any Confidential Information to any third party without the prior written consent of Disclosing Party.
            </p>
            <p>
              3. <strong>Use of Information.</strong> Recipient agrees to use the Confidential Information solely for the purpose of evaluating a potential business relationship with Disclosing Party.
            </p>
            <p>
              4. <strong>Term.</strong> This Agreement shall remain in effect for a period of two (2) years from the date of execution.
            </p>
            <p>
              By signing below, Recipient acknowledges that they have read and understood this Agreement and agree to be bound by its terms.
            </p>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sign Here
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                  className: 'w-full h-40 cursor-crosshair',
                }}
                backgroundColor="rgba(255, 255, 255, 1)"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <div className="flex justify-end mt-2">
              <button
                onClick={clear}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
              >
                <Eraser className="h-3 w-3" /> Clear Signature
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSign}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-500/20 transition-colors flex items-center gap-2"
          >
            <Check className="h-4 w-4" /> Agree & Sign
          </button>
        </div>
      </div>
    </div>
  );
};

export default NDAModal;
