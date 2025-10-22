"use client";
import React from "react";
import { usePathname } from "next/navigation";


export default function Breadcrumb({ course }: { course: { name: string } | undefined; }) {
 const pathname = usePathname();
 const segments = pathname.split("/").filter(s => s);
 const courseIndex = segments.indexOf("Courses");
 const futureSegs = segments.slice(courseIndex + 2);
 return (
   <span>
     Course {course?.name} &gt; {pathname.split("/").pop()}
   </span>
 );
}