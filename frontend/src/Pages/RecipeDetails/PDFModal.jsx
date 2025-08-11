import PropTypes from 'prop-types';

const DownloadPDFModal = ({ show, pdfUrl, onClose }) => {
      if (!show) return null;

      return (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                  <div className="bg-white p-4 rounded shadow-lg w-full max-w-3xl">
                        <div className="flex justify-between items-center mb-4">
                              <h2 className="text-xl font-semibold">Recipe PDF Preview</h2>
                              <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                                    &times;
                              </button>
                        </div>
                        <div className="w-full h-[500px] border border-gray-300">
                              {pdfUrl ? (
                                    <iframe
                                          src={pdfUrl}
                                          title="Recipe PDF Preview"
                                          className="w-full h-full"
                                          frameBorder="0"
                                    />
                              ) : (
                                    <p>Loading PDF preview...</p>
                              )}
                        </div>
                        <div className="mt-4 flex justify-end">
                              <a href={pdfUrl} download="recipe.pdf">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded mr-2">
                                          Download PDF
                                    </button>
                              </a>
                              <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded">
                                    Close
                              </button>
                        </div>
                  </div>
            </div>
      );
};

DownloadPDFModal.propTypes = {
      show: PropTypes.bool.isRequired,
      pdfUrl: PropTypes.string,
      onClose: PropTypes.func.isRequired,
};

export default DownloadPDFModal;