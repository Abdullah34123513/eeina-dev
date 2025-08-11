// components/LoadingOverlay.jsx
export default function LoadingOverlay() {
      return (
            <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-xl">Loading...</div>
            </div>
      );
}
