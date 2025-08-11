import { ClipLoader } from "react-spinners";

export default function Loader() {
      return (
            <div className="absolute inset-0 w-full h-screen flex justify-center items-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
                  <div className="text-center">
                        <div className="relative mb-6">
                              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
                              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                        </div>
                        <h3 className="text-xl font-semibold gradient-text font-display">Loading...</h3>
                        <p className="text-neutral-500 mt-2">Preparing something delicious</p>
                  </div>
            </div>
      );
}
