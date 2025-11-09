import { IoEllipsisVertical} from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { MdOutlineAdd } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
export default function ModuleControlButtons(
  { moduleId, deleteModule, editModule }: 
  { moduleId: string; deleteModule: (moduleId: string) => void; editModule: (moduleId: string) => void } ) {
  return (
    <div className="float-end">
      <FaPencil onClick={() => editModule(moduleId)} className="text-primary me-3" />
      <FaTrash className="text-danger me-2 mb-1" onClick={() => deleteModule(moduleId)}/>
      <GreenCheckmark />
      <MdOutlineAdd className="fs-4" />
      <IoEllipsisVertical className="fs-4" />
    </div> );}