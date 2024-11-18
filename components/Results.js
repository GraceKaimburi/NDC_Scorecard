import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiStar, 
  FiDownload, 
  FiShare2, 
  FiExternalLink,
  FiBarChart2,
  FiAward,
  FiTrendingUp
} from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ResultsModal = ({ 
  isOpen, 
  onClose, 
  results, 
  implementationData, 
  developmentData 
}) => {
  const handleDownloadPDF = async () => {
    const element = document.getElementById('results-content');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('ndc-assessment-results.pdf');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'NDC Assessment Results',
          text: 'Check out my NDC Assessment Results',
          url: window.location.href
        });
      } else {
        // Fallback to email
        const mailtoLink = `mailto:?subject=NDC Assessment Results&body=Here are my NDC Assessment Results: ${window.location.href}`;
        window.location.href = mailtoLink;
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getRatingColor = (rating) => {
    switch(rating.toLowerCase()) {
      case 'good': return 'text-green-500';
      case 'average': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>

          <div id="results-content" className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Assessment Results</h2>

            {/* Implementation Capacity Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiBarChart2 className="mr-2 text-blue-500" />
                Implementation Capacity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(implementationData).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="capitalize">{key}</span>
                    <span className={`font-medium ${getRatingColor(value)}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Development Capacity Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiAward className="mr-2 text-blue-500" />
                Development Capacity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(developmentData).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="capitalize">{key}</span>
                    <span className={`font-medium ${getRatingColor(value)}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`w-8 h-8 ${
                      star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Recommended Resources */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiTrendingUp className="mr-2 text-blue-500" />
                Recommended Resources
              </h3>
              <div className="space-y-3">
                <a
                  href="https://ndcguide.cdkn.org/book/planningforndcimplementationaquickstartguide/measuringreportingandverification/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                >
                  <FiExternalLink className="flex-shrink-0 text-blue-500" />
                  <span>Planning for NDC Implementation: MRV Guide</span>
                </a>
                <a
                  href="https://ndcpartnership.org/knowledgeportal/climatetoolbox/enhancingndcsguidestrengtheningnationalclimateplans"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                >
                  <FiExternalLink className="flex-shrink-0 text-blue-500" />
                  <span>Enhancing NDCs: A Guide to Strengthening National Climate Plans</span>
                </a>
                <a
                  href="https://ndcguide.cdkn.org/book/planningforndcimplementationaquickstartguide/deliveringtheplan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                >
                  <FiExternalLink className="flex-shrink-0 text-blue-500" />
                  <span>Planning for NDC Implementation: QuickStart Guide</span>
                </a>
                <a
                  href="https://ndcpartnership.org/sites/default/files/2023-12/ndcinvestment-planning-guide-best-practice-brief2023.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                >
                  <FiExternalLink className="flex-shrink-0 text-blue-500" />
                  <span>NDC Investment Planning Guide</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FiDownload />
                Download PDF
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <FiShare2 />
                Share Results
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultsModal;