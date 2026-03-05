"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import emailjs from '@emailjs/browser';
import Navigation from '@/components/Navigation';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Initialize EmailJS (you only need to do this once)
      emailjs.init('5eLu74wM2kSgwd6fT'); // Your EmailJS public key

      // Send main contact email to you
      const result = await emailjs.send(
        'service_gk2ggy2', // Your EmailJS service ID
        'template_f6wbh0a', // Your contact email template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          to_name: 'Usama Javed',
          to_email: 'hellofromusama@gmail.com',
          subject: formData.subject || "Portfolio Inquiry",
          message: formData.message,
          reply_to: formData.email,
          time: new Date().toLocaleString()
        }
      );

      // Send auto-reply confirmation to sender
      try {
        await emailjs.send(
          'service_gk2ggy2', // Your EmailJS service ID
          'template_k0jvdur', // Your auto-reply template ID
          {
            name: formData.name,
            to_email: formData.email,
            title: formData.subject || "Portfolio Inquiry",
            reply_to: 'hellofromusama@gmail.com'
          }
        );
      } catch (autoReplyError) {
        console.log('Auto-reply failed, but main email sent:', autoReplyError);
      }

      if (result.status === 200) {
        setSubmitStatus("success");
        setTimeout(() => {
          setFormData({ name: "", email: "", subject: "", message: "" });
          setSubmitStatus("idle");
        }, 3000);
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('Email error:', error);
      setSubmitStatus("error");
      // Fallback to mailto as backup
      const subject = encodeURIComponent(formData.subject || "Portfolio Inquiry");
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoLink = `mailto:hellofromusama@gmail.com?subject=${subject}&body=${body}`;
      const link = document.createElement('a');
      link.href = mailtoLink;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("hellofromusama@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        <Navigation currentPage="contact" />

        {/* Hero Section */}
        <section className={`pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 animate-bounce-slow">
              <span className="text-6xl">✉️</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              Get In Touch
            </h1>
            <p className="text-2xl text-slate-300 mb-16">
              Let&apos;s discuss your project and bring your ideas to life
            </p>
          </div>
        </section>

      {/* Contact Form & Info */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className={`bg-slate-900/50 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/20 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{transitionDelay: '200ms'}}>
              <h2 className="text-3xl font-bold mb-8 text-blue-400">Send a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-blue-500/25"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-900/50 text-slate-400">or</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={copyEmail}
                    className="w-full border-2 border-slate-600 hover:border-blue-400 text-slate-300 hover:text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-400/10"
                  >
                    {copied ? "Email Copied!" : "Copy Email Address"}
                  </button>
                </div>

                {submitStatus === "success" && (
                  <div className="text-green-400 text-center p-4 bg-green-400/10 rounded-lg border border-green-400/20">
                    <p className="mb-2">Your email client should open with the message pre-filled!</p>
                    <p className="text-sm text-green-300">If it didn&apos;t open, you can copy the email address below.</p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="text-red-400 text-center p-4 bg-red-400/10 rounded-lg border border-red-400/20">
                    <p className="mb-2">Email client couldn&apos;t be opened automatically.</p>
                    <p className="text-sm text-red-300">Please copy the email address below and send manually.</p>
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className={`space-y-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{transitionDelay: '400ms'}}>
              <div>
                <h2 className="text-3xl font-bold mb-8 text-purple-400">Let&apos;s Connect</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  I&apos;m always interested in discussing new opportunities, innovative projects,
                  and potential collaborations. Whether you have a specific project in mind or
                  just want to connect, I&apos;d love to hear from you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">✉️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-400 mb-1">Email</h3>
                      <button
                        onClick={copyEmail}
                        className="text-slate-300 hover:text-blue-400 transition-colors text-left"
                        title="Click to copy email"
                      >
                        hellofromusama@gmail.com
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="flex items-center space-x-4 p-6 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-1">LinkedIn</h3>
                    <a
                      href="https://www.linkedin.com/in/hellofromusama/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-purple-400 transition-colors"
                    >
                      linkedin.com/in/hellofromusama
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-6 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-green-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👨‍💻</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-400 mb-1">GitHub</h3>
                    <a
                      href="https://github.com/hellofromusama"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-green-400 transition-colors"
                    >
                      github.com/hellofromusama
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-6 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-yellow-400 mb-1">Location</h3>
                    <span className="text-slate-300">Australia</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 rounded-2xl border border-blue-500/20">
                <h3 className="text-2xl font-semibold text-blue-400 mb-4">Response Time</h3>
                <p className="text-slate-300">
                  I typically respond to emails within 24 hours. For urgent inquiries,
                  feel free to mention it in your subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}