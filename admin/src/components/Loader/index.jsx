import { ClipLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <ClipLoader color="#36d7b7" size={50} />
    </div>
  );
}
