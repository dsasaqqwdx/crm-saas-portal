// // import React from "react";
// // import Navbar from "../layouts/Navbar";
// // import Footer from "../layouts/Footer";
// // import { Check, Zap, Shield, Crown } from "lucide-react";
// // import { useWebsiteSettings } from "../hooks/useWebsiteSettings";

// // const planIcons = [
// //   <Shield size={30} className="text-secondary" />,
// //   <Zap size={30} className="text-info" />,
// //   <Crown size={30} className="text-warning" />,
// // ];

// // const planFeatures = [
// //   ["Employee Management", "Basic Attendance", "Email Support", "Single Location"],
// //   ["Payroll Processing", "Attendance + GPS", "Leave Management", "Priority Support"],
// //   ["Full Analytics", "Multi-Location Support", "Custom Letterheads", "24/7 Phone Support"],
// // ];

// // const Pricing = () => {
// //   const { data: s } = useWebsiteSettings("pricing");

// //   const plans = [
// //     { name: s.plan1Name || "Basic",      price: s.plan1Price || "10",  popular: false },
// //     { name: s.plan2Name || "Pro",        price: s.plan2Price || "25",  popular: true  },
// //     { name: s.plan3Name || "Enterprise", price: s.plan3Price || "50",  popular: false },
// //   ];

// //   return (<div className="bg-dark text-white min-vh-100">
// //       <Navbar />
// //   <div className="container py-5 mt-5">
// //         <div className="text-center mb-5">
// //    <h1 className="display-4 fw-bold">
// //             {s.title    ? s.title.split(" ").slice(0, -1).join(" ") + " "
// //               : "Simple, Scalable "}
// //  <span className="text-info">
// //               {s.title ? s.title.split(" ").slice(-1)[0] : "Pricing"}
// //             </span>
// //           </h1>
// //           <p className="text-secondary lead">
// //             {s.subtitle || "Choose the plan that fits your company's growth."}
// //           </p>
// //         </div>
// // <div className="row g-4 justify-content-center align-items-stretch">
// // {plans.map((plan, i) => (
// //  <div key={i} className="col-md-4">
// //               <div
// //                 className={`card h-100 border-0 p-4 shadow-lg ${plan.popular ? "bg-info text-dark" : "bg-secondary bg-opacity-10 text-white"}`}
// //   style={{
// //                   border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.1)",
// //                   transform: plan.popular ? "scale(1.05)" : "scale(1)",
// //                   transition: "transform 0.3s ease",
// //                   boxShadow: plan.popular ? "0 0 20px rgba(13, 202, 240, 0.2)" : "none",
// //                 }}
// //               >
// // <div className="card-body d-flex flex-column">
// // <div className="mb-3">{planIcons[i]}</div>
// // <h3 className="fw-bold">{plan.name}</h3>
// // <h2 className="display-5 fw-bold mb-4">
// //                     ${plan.price}
// //                     <small className={`fs-6 ${plan.popular ? "text-dark text-opacity-75" : "text-muted"}`}>/mo</small>
// //                   </h2>
// //  <ul className="list-unstyled mb-5 text-start flex-grow-1">
// //                     {planFeatures[i].map((feature, idx) => (
// //                       <li key={idx} className="mb-3 d-flex align-items-center small">
// //                         <Check size={16} className="me-2 flex-shrink-0" />
// //                         {feature}
// //   </li>
// //                     ))}
// //                   </ul>
// //      <button className={`btn mt-auto fw-bold py-3 rounded-pill ${plan.popular ? "btn-dark" : "btn-outline-info"}`}>
// //    {plan.name}
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// // ))}
// //         </div>
// //       </div>
// //       <Footer />
// //     </div>
// //   );
// // };

// // export default Pricing;
// import React from "react";
// import Navbar from "../layouts/Navbar";
// import { Check, Zap, Shield, Crown } from "lucide-react";
// import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
// import Footer from "../layouts/Footer";

// const planIcons = [
//   <Shield size={34} style={{ color: "#22C55E" }} />,
//   <Zap size={34} style={{ color: "#6366F1" }} />,
//   <Crown size={34} style={{ color: "#F59E0B" }} />,
// ];

// const planFeatures = [
//   ["Employee Management", "Basic Attendance", "Email Support", "Single Location"],
//   ["Payroll Processing", "Attendance + GPS", "Leave Management", "Priority Support"],
//   ["Full Analytics", "Multi-Location Support", "Custom Letterheads", "24/7 Phone Support"],
// ];

// const Pricing = () => {
//   const { data: s } = useWebsiteSettings("pricing");

//   const plans = [
//     { name: s.plan1Name || "Basic", price: s.plan1Price || "10", popular: false },
//     { name: s.plan2Name || "Pro", price: s.plan2Price || "25", popular: true },
//     { name: s.plan3Name || "Enterprise", price: s.plan3Price || "50", popular: false },
//   ];

//   return (
//     <div
//       style={{
//         background: "#0F172A",
//         color: "#E2E8F0",
//         minHeight: "100vh",
//       }}
//     >
//       <Navbar />

//       <div className="container"  style={{ paddingTop: "140px", paddingBottom: "80px" }}>
//         <div className="text-center mb-5">
//           <h1 className="fw-bold display-4" style={{fontFamily: "'Ubuntu', sans-serif",}}>
//             {s.title
//               ? s.title.split(" ").slice(0, -1).join(" ") + " "
//               : "Simple & Smart "}
//             <span style={{ color: "#6366F1" ,fontFamily: "'Ubuntu', sans-serif",}}>
//               {s.title ? s.title.split(" ").slice(-1)[0] : "Pricing"}
//             </span>
//           </h1>

//           <p className="lead text-light opacity-75" style={{fontFamily: "'Ubuntu', sans-serif",}}>
//             {s.subtitle || "Choose a plan that grows with your business"}
//           </p>
//         </div>
//         <div className="row g-4 justify-content-center">
//           {plans.map((plan, i) => (
//             <div key={i} className="col-lg-4 col-md-6 col-sm-12 g-5">
//               <div
//                 className="h-100 p-4 rounded-4"
//                 style={{
//                   background: "#1E293B",
//                   border: plan.popular
//                     ? "1px solid #6366F1"
//                     : "1px solid rgba(255,255,255,0.08)",
//                   transform: plan.popular ? "scale(1.05)" : "scale(1)",
//                   transition: "all 0.3s ease",
//                   boxShadow: plan.popular
//                     ? "0 0 25px rgba(99,102,241,0.35)"
//                     : "0 10px 25px rgba(0,0,0,0.2)",
//                   position: "relative",
//                   cursor:"pointer"
//                 }}
//                           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = "translateY(-8px)";
//             e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = "translateY(0)";
//             e.currentTarget.style.boxShadow = "none";
//           }}
//               >
//                 {plan.popular && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: -12,
//                       right: 20,
//                       background: "#6366F1",
//                       padding: "5px 14px",
//                       borderRadius: "999px",
//                       fontSize: 12,
//                       fontWeight: 600,
//                     }}
//                   >
//                     Most Popular
//                   </div>
//                 )}

//                 <div className="d-flex flex-column h-100">
//                   <div className="mb-3" style={{fontFamily: "'Ubuntu', sans-serif",}}>{planIcons[i]}</div>
//                   <h3 className="fw-bold" style={{fontFamily: "'Ubuntu', sans-serif",}}>{plan.name}</h3>
//                   <h2 className="display-5 fw-bold mb-4">
//                     ${plan.price}
//                     <span className="fs-6 opacity-75" style={{fontFamily: "'Ubuntu', sans-serif",}}> /month</span>
//                   </h2>
//                   <ul className="list-unstyled flex-grow-1">
//                     {planFeatures[i].map((feature, idx) => (
//                       <li
//                         key={idx}
//                         className="mb-3 d-flex align-items-center"
//                         style={{ fontSize: 14 ,fontFamily: "'Ubuntu', sans-serif",}}
//                       >
//                         <Check
//                           size={18}
//                           className="me-2"
//                           style={{ color: "#22C55E" }}
//                         />
//                         {feature}
//                       </li>
//                     ))}
//                   </ul>

//                   <button
//                     className="btn fw-bold mt-auto py-3 rounded-pill"
//                     style={{
//                       background: plan.popular ? "#6366F1" : "transparent",
//                       border: "1px solid #6366F1",
//                       color: "#fff",
//                       transition: "0.3s",
//                       fontFamily: "'Ubuntu', sans-serif",
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.target.style.background = "#6366F1")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.target.style.background = plan.popular
//                         ? "#6366F1"
//                         : "transparent")
//                     }
//                   >
//                     Choose {plan.name}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//      <Footer/>
//     </div>
//   );
// };

// export default Pricing;
// import React from "react";
// import Navbar from "../layouts/Navbar";
// import Footer from "../layouts/Footer";
// import { Check, Zap, Shield, Crown } from "lucide-react";
// import { useWebsiteSettings } from "../hooks/useWebsiteSettings";

// const planIcons = [
//   <Shield size={30} className="text-secondary" />,
//   <Zap size={30} className="text-info" />,
//   <Crown size={30} className="text-warning" />,
// ];

// const planFeatures = [
//   ["Employee Management", "Basic Attendance", "Email Support", "Single Location"],
//   ["Payroll Processing", "Attendance + GPS", "Leave Management", "Priority Support"],
//   ["Full Analytics", "Multi-Location Support", "Custom Letterheads", "24/7 Phone Support"],
// ];

// const Pricing = () => {
//   const { data: s } = useWebsiteSettings("pricing");

//   const plans = [
//     { name: s.plan1Name || "Basic",      price: s.plan1Price || "10",  popular: false },
//     { name: s.plan2Name || "Pro",        price: s.plan2Price || "25",  popular: true  },
//     { name: s.plan3Name || "Enterprise", price: s.plan3Price || "50",  popular: false },
//   ];

//   return (<div className="bg-dark text-white min-vh-100">
//       <Navbar />
//   <div className="container py-5 mt-5">
//         <div className="text-center mb-5">
//    <h1 className="display-4 fw-bold">
//             {s.title    ? s.title.split(" ").slice(0, -1).join(" ") + " "
//               : "Simple, Scalable "}
//  <span className="text-info">
//               {s.title ? s.title.split(" ").slice(-1)[0] : "Pricing"}
//             </span>
//           </h1>
//           <p className="text-secondary lead">
//             {s.subtitle || "Choose the plan that fits your company's growth."}
//           </p>
//         </div>
// <div className="row g-4 justify-content-center align-items-stretch">
// {plans.map((plan, i) => (
//  <div key={i} className="col-md-4">
//               <div
//                 className={card h-100 border-0 p-4 shadow-lg ${plan.popular ? "bg-info text-dark" : "bg-secondary bg-opacity-10 text-white"}}
//   style={{
//                   border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.1)",
//                   transform: plan.popular ? "scale(1.05)" : "scale(1)",
//                   transition: "transform 0.3s ease",
//                   boxShadow: plan.popular ? "0 0 20px rgba(13, 202, 240, 0.2)" : "none",
//                 }}
//               >
// <div className="card-body d-flex flex-column">
// <div className="mb-3">{planIcons[i]}</div>
// <h3 className="fw-bold">{plan.name}</h3>
// <h2 className="display-5 fw-bold mb-4">
//                     ${plan.price}
//                     <small className={fs-6 ${plan.popular ? "text-dark text-opacity-75" : "text-muted"}}>/mo</small>
//                   </h2>
//  <ul className="list-unstyled mb-5 text-start flex-grow-1">
//                     {planFeatures[i].map((feature, idx) => (
//                       <li key={idx} className="mb-3 d-flex align-items-center small">
//                         <Check size={16} className="me-2 flex-shrink-0" />
//                         {feature}
//   </li>
//                     ))}
//                   </ul>
//      <button className={btn mt-auto fw-bold py-3 rounded-pill ${plan.popular ? "btn-dark" : "btn-outline-info"}}>
//    {plan.name}
//                   </button>
//                 </div>
//               </div>
//             </div>
// ))}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Pricing;
import React from "react";
import Navbar from "../layouts/Navbar";
import { Check, Zap, Shield, Crown } from "lucide-react";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
import Footer from "../layouts/Footer";

const planIcons = [
  <Shield size={34} style={{ color: "#22C55E" }} />,
  <Zap size={34} style={{ color: "var(--primary)" }} />,
  <Crown size={34} style={{ color: "#F59E0B" }} />,
];

const planFeatures = [
  ["Employee Management", "Basic Attendance", "Email Support", "Single Location"],
  ["Payroll Processing", "Attendance + GPS", "Leave Management", "Priority Support"],
  ["Full Analytics", "Multi-Location Support", "Custom Letterheads", "24/7 Phone Support"],
];

const Pricing = () => {
  const { data: s } = useWebsiteSettings("pricing");

  const plans = [
    { name: s.plan1Name || "Basic", price: s.plan1Price || "10", popular: false },
    { name: s.plan2Name || "Pro", price: s.plan2Price || "25", popular: true },
    { name: s.plan3Name || "Enterprise", price: s.plan3Price || "50", popular: false },
  ];

  return (
    <div
      style={{
        background: "var(--bg)",
        color: "#E2E8F0",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <div className="container"  style={{ paddingTop: "140px", paddingBottom: "80px" }}>
        <div className="text-center mb-5">
          <h1 className="fw-bold display-4" style={{fontFamily: "'Ubuntu', sans-serif",}}>
            {s.title
              ? s.title.split(" ").slice(0, -1).join(" ") + " "
              : "Simple & Smart "}
            <span style={{ color: "var(--primary)" ,fontFamily: "'Ubuntu', sans-serif",}}>
              {s.title ? s.title.split(" ").slice(-1)[0] : "Pricing"}
            </span>
          </h1>

          <p className="lead text-light opacity-75" style={{fontFamily: "'Ubuntu', sans-serif",}}>
            {s.subtitle || "Choose a plan that grows with your business"}
          </p>
        </div>
        <div className="row g-4 justify-content-center">
          {plans.map((plan, i) => (
            <div key={i} className="col-lg-4 col-md-6 col-sm-12 g-5">
              <div
                className="h-100 p-4 rounded-4"
                style={{
                  background: "var(--surface)",
                  border: plan.popular
                    ? "1px solid #6366F1"
                    : "1px solid rgba(255,255,255,0.08)",
                  transform: plan.popular ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.3s ease",
                  boxShadow: plan.popular
                    ? "0 0 25px rgba(99,102,241,0.35)"
                    : "0 10px 25px rgba(0,0,0,0.2)",
                  position: "relative",
                  cursor:"pointer"
                }}
                          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      right: 20,
                      background: "var(--primary)",
                      padding: "5px 14px",
                      borderRadius: "999px",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="d-flex flex-column h-100">
                  <div className="mb-3" style={{fontFamily: "'Ubuntu', sans-serif",}}>{planIcons[i]}</div>
                  <h3 className="fw-bold" style={{fontFamily: "'Ubuntu', sans-serif",}}>{plan.name}</h3>
                  <h2 className="display-5 fw-bold mb-4">
                    ${plan.price}
                    <span className="fs-6 opacity-75" style={{fontFamily: "'Ubuntu', sans-serif",}}> /month</span>
                  </h2>
                  <ul className="list-unstyled flex-grow-1">
                    {planFeatures[i].map((feature, idx) => (
                      <li
                        key={idx}
                        className="mb-3 d-flex align-items-center"
                        style={{ fontSize: 14 ,fontFamily: "'Ubuntu', sans-serif",}}
                      >
                        <Check
                          size={18}
                          className="me-2"
                          style={{ color: "#22C55E" }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="btn fw-bold mt-auto py-3 rounded-pill"
                    style={{
                      background: plan.popular ? "var(--primary)" : "transparent",
                      border: "1px solid #6366F1",
                      color: "#fff",
                      transition: "0.3s",
                      fontFamily: "'Ubuntu', sans-serif",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "var(--primary)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = plan.popular
                        ? "var(--primary)"
                        : "transparent")
                    }
                  >
                    Choose {plan.name}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
     <Footer/>
    </div>
  );
};

export default Pricing;