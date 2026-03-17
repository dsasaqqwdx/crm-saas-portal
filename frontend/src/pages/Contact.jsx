import React, { useState } from "react";
import Navbar from "../layouts/Navbar";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted Locally:", formData);
        alert(`Thank you, ${formData.name}! Your message has been received (Demo Mode).`);
        setFormData({
            name: "",
            email: "",
            message: ""
        });
    };

    return (
        <div className="bg-dark text-white min-vh-100">
            <Navbar />

            <div className="container py-5 mt-5">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-5">
                        <h1 className="display-4 fw-bold mb-4">
                            Get in <span className="text-info">Touch</span>
                        </h1>
                        <p className="text-secondary mb-5 lead">
                            Have questions about our HR modules?
                            Our team is ready to help your business scale.
                        </p>

                        <div className="d-flex flex-column gap-4">
                            <div className="d-flex align-items-center p-3 rounded-3 bg-secondary bg-opacity-10 border border-secondary border-opacity-25">
                                <div className="bg-info bg-opacity-20 p-3 rounded-circle me-3 text-info">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold text-white">Call Support</h6>
                                    <p className="text-info small mb-0 fw-semibold">+91 98765 43210</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center p-3 rounded-3 bg-secondary bg-opacity-10 border border-secondary border-opacity-25">
                                <div className="bg-info bg-opacity-20 p-3 rounded-circle me-3 text-info">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold text-white">Email Us</h6>
                                    <p className="text-info small mb-0 fw-semibold">support@shnoor.com</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center p-3 rounded-3 bg-secondary bg-opacity-10 border border-secondary border-opacity-25">
                                <div className="bg-info bg-opacity-20 p-3 rounded-circle me-3 text-info">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold text-white">Headquarters</h6>
                                    <p className="text-secondary small mb-0 text-white-50">Business Bay, Dubai / Kuppam, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: The Form */}
                    <div className="col-lg-7">
                        <div
                            className="card bg-secondary bg-opacity-10 border-0 p-4 p-md-5 shadow-lg"
                            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-info text-uppercase">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control bg-dark border-secondary text-white py-2 shadow-none"
                                            placeholder="K Aswin"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-info text-uppercase">Email</label>
                                        <input
                                            type="email"
                                            className="form-control bg-dark border-secondary text-white py-2 shadow-none"
                                            placeholder="aswin@shnoor.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold text-info text-uppercase">Message</label>
                                        <textarea
                                            className="form-control bg-dark border-secondary text-white shadow-none"
                                            rows="5"
                                            placeholder="Tell us about your requirements..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-info w-100 fw-bold py-3 d-flex align-items-center justify-content-center rounded-pill shadow-sm"
                                        >
                                            <Send size={18} className="me-2" />
                                            Send Message
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;