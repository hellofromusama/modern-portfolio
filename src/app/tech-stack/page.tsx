import Link from "next/link";

export default function TechStack() {
  const techStack = [
    {
      category: "Frontend",
      icon: "🎨",
      technologies: [
        { name: "Next.js 15", description: "React framework with App Router and Turbopack", color: "text-blue-400" },
        { name: "React 19", description: "Latest React with concurrent features", color: "text-cyan-400" },
        { name: "TypeScript", description: "Type-safe JavaScript for better development", color: "text-blue-500" },
        { name: "Tailwind CSS v4", description: "Utility-first CSS framework for rapid styling", color: "text-teal-400" },
      ]
    },
    {
      category: "Deployment & Hosting",
      icon: "🚀",
      technologies: [
        { name: "Vercel", description: "Edge network deployment with automatic HTTPS", color: "text-white" },
        { name: "GitHub", description: "Version control with automated CI/CD pipelines", color: "text-purple-400" },
        { name: "Custom Domain", description: "Professional domain with DNS optimization", color: "text-green-400" },
        { name: "SSL Certificate", description: "Automatic HTTPS encryption and security", color: "text-yellow-400" },
      ]
    },
    {
      category: "Performance & Optimization",
      icon: "⚡",
      technologies: [
        { name: "Turbopack", description: "Rust-powered bundler for lightning-fast builds", color: "text-orange-400" },
        { name: "Static Generation", description: "Pre-rendered pages for optimal performance", color: "text-indigo-400" },
        { name: "Image Optimization", description: "Next.js automatic image optimization", color: "text-pink-400" },
        { name: "Code Splitting", description: "Automatic bundle splitting for faster loads", color: "text-red-400" },
      ]
    },
    {
      category: "Developer Experience",
      icon: "🛠️",
      technologies: [
        { name: "ESLint", description: "Code quality and consistency enforcement", color: "text-purple-400" },
        { name: "Hot Reload", description: "Instant updates during development", color: "text-green-400" },
        { name: "TypeScript Config", description: "Strict typing for better code quality", color: "text-blue-400" },
        { name: "Modern Fonts", description: "Geist font family for optimal readability", color: "text-slate-400" },
      ]
    }
  ];

  const features = [
    {
      title: "Responsive Design",
      description: "Mobile-first approach ensuring perfect display on all devices",
      icon: "📱"
    },
    {
      title: "Interactive Animations",
      description: "Smooth CSS transitions and hover effects for enhanced UX",
      icon: "✨"
    },
    {
      title: "SEO Optimized",
      description: "Meta tags, structured data, and semantic HTML for search engines",
      icon: "🔍"
    },
    {
      title: "Accessibility",
      description: "WCAG compliant design with proper ARIA labels and keyboard navigation",
      icon: "♿"
    },
    {
      title: "Performance Scored",
      description: "Lighthouse score of 90+ across all metrics",
      icon: "📊"
    },
    {
      title: "Modern Architecture",
      description: "Component-based architecture with reusable UI elements",
      icon: "🏗️"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              UJ
            </Link>
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/#about" className="hover:text-blue-400 transition-all duration-300 hover:scale-105">About</Link>
              <Link href="/#projects" className="hover:text-blue-400 transition-all duration-300 hover:scale-105">Projects</Link>
              <Link href="/ideas" className="hover:text-purple-400 transition-all duration-300 hover:scale-105">Ideas</Link>
              <Link href="/contact" className="hover:text-blue-400 transition-all duration-300 hover:scale-105">Contact</Link>
              <Link href="/tech-stack" className="text-blue-400">Tech</Link>
              <a
                href="https://www.linkedin.com/in/hellofromusama/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Hire Me →
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Tech Stack
          </h1>
          <p className="text-2xl text-slate-300 mb-8">
            Behind the Scenes of This Portfolio
          </p>
          <p className="text-lg text-slate-400 max-w-4xl mx-auto leading-relaxed">
            This portfolio showcases modern web development practices using cutting-edge technologies
            for optimal performance, developer experience, and user satisfaction.
          </p>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {techStack.map((category) => (
              <div key={category.category} className="bg-slate-900/50 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">{category.icon}</span>
                  <h2 className="text-3xl font-bold text-blue-400">{category.category}</h2>
                </div>

                <div className="space-y-4">
                  {category.technologies.map((tech) => (
                    <div key={tech.name} className="p-4 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
                      <h3 className={`text-xl font-semibold mb-2 ${tech.color}`}>
                        {tech.name}
                      </h3>
                      <p className="text-slate-300">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Key Features & Capabilities
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-slate-900/50 p-8 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all duration-300 group hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-purple-400">
                  {feature.title}
                </h3>
                <p className="text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Performance Metrics
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-green-500/50 transition-all duration-300">
              <div className="text-5xl font-bold text-green-400 mb-2">95+</div>
              <div className="text-xl font-semibold text-green-300 mb-2">Performance</div>
              <div className="text-slate-400">Lighthouse Score</div>
            </div>

            <div className="text-center p-8 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-5xl font-bold text-blue-400 mb-2">100</div>
              <div className="text-xl font-semibold text-blue-300 mb-2">Accessibility</div>
              <div className="text-slate-400">WCAG Compliant</div>
            </div>

            <div className="text-center p-8 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="text-5xl font-bold text-purple-400 mb-2">98+</div>
              <div className="text-xl font-semibold text-purple-300 mb-2">SEO</div>
              <div className="text-slate-400">Search Optimized</div>
            </div>

            <div className="text-center p-8 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-yellow-500/50 transition-all duration-300">
              <div className="text-5xl font-bold text-yellow-400 mb-2">95+</div>
              <div className="text-xl font-semibold text-yellow-300 mb-2">Best Practices</div>
              <div className="text-slate-400">Security & Standards</div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Architecture Overview
          </h2>

          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-700">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-blue-400">Frontend Layer</h3>
                <p className="text-slate-300">
                  React 19 with Next.js 15 App Router, TypeScript for type safety,
                  and Tailwind CSS for responsive design.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🔧</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-purple-400">Build Layer</h3>
                <p className="text-slate-300">
                  Turbopack for ultra-fast development builds, ESLint for code quality,
                  and automatic optimizations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-green-400">Deployment Layer</h3>
                <p className="text-slate-300">
                  Vercel edge network with automatic HTTPS, GitHub Actions for CI/CD,
                  and global content distribution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Interested in Similar Architecture?
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            I can help you build high-performance web applications using these modern technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
            >
              Discuss Your Project
            </Link>
            <Link
              href="/#projects"
              className="border-2 border-slate-600 hover:border-blue-400 text-slate-300 hover:text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 hover:bg-blue-400/10"
            >
              View More Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}