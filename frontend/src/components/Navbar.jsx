<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Effect to handle background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0a0b10]/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-lg">S</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight uppercase hidden sm:block">
            Shnoor
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="flex items-center text-gray-300 hover:text-white mr-4 text-sm">
            <Globe size={16} className="mr-1" />
            <span>EN</span>
          </button>
          
          <Link 
            to="/register" 
            className="px-5 py-2 border border-gray-600 rounded-lg text-white hover:bg-white hover:text-black transition-all text-sm font-semibold"
          >
            Register
          </Link>
          
          <Link 
            to="/login" 
            className="px-5 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-all text-sm font-semibold shadow-md"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#11141b] border-t border-gray-800 px-6 py-6 space-y-4 absolute w-full left-0">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={() => setIsOpen(false)}
              className="block text-gray-300 hover:text-white text-lg"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col space-y-3">
            <Link to="/register" className="text-center py-3 border border-gray-600 rounded-lg text-white">
              Register
            </Link>
            <Link to="/login" className="text-center py-3 bg-white text-black rounded-lg font-bold">
              Login
            </Link>
          </div>
        </div>
      )}
=======
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Menu, X, Globe } from 'lucide-react';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   // Effect to handle background change on scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const navLinks = [
//     { name: 'Home', path: '/' },
//     { name: 'Features', path: '/features' },
//     { name: 'Pricing', path: '/pricing' },
//     { name: 'Contact', path: '/contact' },
//   ];

//   return (
//     <nav className={`fixed w-full z-50 transition-all duration-300 ${
//       scrolled ? 'bg-[#0a0b10]/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
//     }`}>
//       <div className="container mx-auto px-6 flex justify-between items-center">
        
//         {/* Logo Section */}
//         <Link to="/" className="flex items-center space-x-2">
//           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
//             <span className="text-black font-bold text-lg">S</span>
//           </div>
//           <span className="text-white font-bold text-xl tracking-tight uppercase hidden sm:block">
//             Shnoor
//           </span>
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center space-x-8">
//           {navLinks.map((link) => (
//             <Link 
//               key={link.name} 
//               to={link.path} 
//               className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
//             >
//               {link.name}
//             </Link>
//           ))}
//         </div>

//         {/* Right Side Actions */}
//         <div className="hidden md:flex items-center space-x-4">
//           <button className="flex items-center text-gray-300 hover:text-white mr-4 text-sm">
//             <Globe size={16} className="mr-1" />
//             <span>EN</span>
//           </button>
          
//           <Link 
//             to="/register" 
//             className="px-5 py-2 border border-gray-600 rounded-lg text-white hover:bg-white hover:text-black transition-all text-sm font-semibold"
//           >
//             Register
//           </Link>
          
//           <Link 
//             to="/login" 
//             className="px-5 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-all text-sm font-semibold shadow-md"
//           >
//             Login
//           </Link>
//         </div>

//         {/* Mobile Menu Button */}
//         <div className="md:hidden">
//           <button onClick={() => setIsOpen(!isOpen)} className="text-white">
//             {isOpen ? <X size={28} /> : <Menu size={28} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu Dropdown */}
//       {isOpen && (
//         <div className="md:hidden bg-[#11141b] border-t border-gray-800 px-6 py-6 space-y-4 absolute w-full left-0">
//           {navLinks.map((link) => (
//             <Link 
//               key={link.name} 
//               to={link.path} 
//               onClick={() => setIsOpen(false)}
//               className="block text-gray-300 hover:text-white text-lg"
//             >
//               {link.name}
//             </Link>
//           ))}
//           <div className="pt-4 flex flex-col space-y-3">
//             <Link to="/register" className="text-center py-3 border border-gray-600 rounded-lg text-white">
//               Register
//             </Link>
//             <Link to="/login" className="text-center py-3 bg-white text-black rounded-lg font-bold">
//               Login
//             </Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
import React from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center me-2" style={{width:"40px",height:"40px"}}>
            <strong>S</strong>
          </div>
          <span className="fw-bold text-uppercase">Shnoor</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav mx-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/features">Features</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/pricing">Pricing</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>

          </ul>

          {/* Right side */}
          <div className="d-flex align-items-center">

            <button className="btn btn-outline-light me-3 d-flex align-items-center">
              <Globe size={16} className="me-1"/>
              EN
            </button>

            <Link to="/register" className="btn btn-outline-light me-2">
              Register
            </Link>

            <Link to="/login" className="btn btn-light">
              Login
            </Link>

          </div>

        </div>
      </div>
>>>>>>> 9c5a8010b4b016477788cc1b54819ccbe65ae531
    </nav>
  );
};

export default Navbar;