import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { MdBlockFlipped } from "react-icons/md";
export default function Cross() {
  return (
    <span className="me-1 position-relative">
      <MdBlockFlipped style={{ top: "2px" }} className="text-grey me-1 position-absolute fs-5" />
      <FaCircle className="text-white me-1 fs-6" />
    </span>);}