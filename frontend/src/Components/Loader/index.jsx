import { ClipLoader } from "react-spinners";

export default function Loader() {
      return (
            <div className="absolute inset-0 w-full h-screen flex justify-center items-center">
                  <ClipLoader color="#36d7b7" size={50} />
            </div>
      );
}
