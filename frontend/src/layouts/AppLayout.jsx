import React,{useState} from "react";
import Sidebar from "./Sidebar";
import {Menu,Bell} from "lucide-react";
import {useNotifications} from "../context/NotificationContext";
import logo from "../assets/logo.png";

const AppLayout=({children})=>{
const [mobileOpen,setMobileOpen]=useState(false);
const [sidebarCollapsed,setSidebarCollapsed]=useState(false);
const {letterCount,notifications}=useNotifications();
const totalUnread=notifications.filter(n=>!n.read).length;

return(
<div className="app-shell">
<Sidebar
mobileOpen={mobileOpen}
onMobileClose={()=>setMobileOpen(false)}
onCollapse={setSidebarCollapsed}
/>
<div className={`app-main${sidebarCollapsed?" sidebar-collapsed":""}`}>
<div className="mobile-topbar">
<button className="mobile-menu-btn" onClick={()=>setMobileOpen(true)}>
<Menu size={22}/>
</button>
<div style={{display:"flex",alignItems:"center",gap:"8px",flex:1}}>
<img src={logo} alt="logo" style={{width:28,height:28,borderRadius:6,objectFit:"cover",background:"#fff",padding:2}}/>
<span className="brand">Shnoor</span>
</div>
{totalUnread>0&&(
<div style={{position:"relative",padding:"4px"}}>
<Bell size={20} color="#fff"/>
<span style={{position:"absolute",top:0,right:0,background:"#ef4444",color:"#fff",borderRadius:"50%",
fontSize:"9px",fontWeight:"800",width:"15px",height:"15px",display:"flex",alignItems:"center",justifyContent:"center"}}>
{totalUnread>9?"9":totalUnread}
</span>
</div>
)}
</div>

<div className="page-content">
{children}
</div>
</div>
</div>
);
};

export default AppLayout;