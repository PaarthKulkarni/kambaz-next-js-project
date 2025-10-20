import { ReactNode } from "react";
import AccountNavigation from "./Navigation";
export default function AccountLayout({ children }: Readonly<{ children: ReactNode }>) {
 return (
   <div id="wd-kambaz">
         <div className="d-flex">
           <div style ={{ width: '250px', borderRight: '1px solid #ccc' , minWidth: '200px'}}>
             <AccountNavigation />
            </div>
           <div className="flex-fill">
             {children}
             </div>
             </div>
  </div>
);}
