import { IoEllipsisVertical} from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { MdOutlineAdd } from "react-icons/md";
export default function ModuleControlButtons() {
  return (
    <div className="float-end">
      <GreenCheckmark />
      <MdOutlineAdd className="fs-4" />
      <IoEllipsisVertical className="fs-4" />
    </div> );}