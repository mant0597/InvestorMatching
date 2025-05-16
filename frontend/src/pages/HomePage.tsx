import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LineChart, Users, Zap, Search, MessageCircle, Calendar, Briefcase, CheckCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-10 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Connect Startups with <span className="text-teal-400">Investors</span>
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                InnovaConnect brings together promising startups and investors for mutual growth. Find your perfect match in the innovation ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-teal-400 hover:bg-teal-500 transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-md">
                    <h3 className="font-semibold text-teal-300 mb-1">EcoFlow Technologies</h3>
                    <p className="text-sm text-gray-300">Sustainable energy solutions</p>
                    <div className="mt-2 flex justify-between text-xs text-gray-400">
                      <span>Seed Stage</span>
                      <span>$800K</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-md">
                    <h3 className="font-semibold text-teal-300 mb-1">HealthPulse</h3>
                    <p className="text-sm text-gray-300">AI-powered health monitoring</p>
                    <div className="mt-2 flex justify-between text-xs text-gray-400">
                      <span>Series A</span>
                      <span>$3M</span>
                    </div>
                  </div>
                  <div className="bg-teal-500/20 border border-teal-500/30 p-4 rounded-md">
                    <h3 className="font-semibold text-white mb-1">Logistix.AI</h3>
                    <p className="text-sm text-gray-200">Supply chain optimization</p>
                    <div className="mt-2 flex justify-between text-xs text-gray-200">
                      <span>Series A</span>
                      <span>$4.5M</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 px-4 py-2 rounded-md text-sm font-bold transform rotate-2">
                New Match!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How InnovaConnect Works</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform streamlines the process of connecting startups with investors, making fundraising and investment more efficient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-teal-600 dark:text-teal-500 mb-5">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Find Matches</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use powerful search filters to discover startups or investors that match your specific criteria and goals.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-teal-600 dark:text-teal-500 mb-5">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Connect & Chat</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Initiate conversations through our secure messaging system to discuss opportunities and exchange information.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-teal-600 dark:text-teal-500 mb-5">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Schedule Meetings</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Set up virtual or in-person meetings to dive deeper into potential partnerships and investment opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-teal-600 dark:text-teal-500 mb-2">500+</div>
              <p className="text-gray-700 dark:text-gray-300">Active Startups</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-600 dark:text-teal-500 mb-2">200+</div>
              <p className="text-gray-700 dark:text-gray-300">Investors</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-600 dark:text-teal-500 mb-2">$50M+</div>
              <p className="text-gray-700 dark:text-gray-300">Funding Facilitated</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-600 dark:text-teal-500 mb-2">20+</div>
              <p className="text-gray-700 dark:text-gray-300">Industries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Success Stories</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Hear from startups and investors who have found success through InnovaConnect.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.pexels.com/photos/6551144/pexels-photo-6551144.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Sarah Johnson"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Sarah Johnson</h4>
                  <p className="text-gray-600 dark:text-gray-400">Founder, HealthPulse</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "InnovaConnect helped us find the perfect investors who not only provided funding but also brought valuable expertise in our industry. We closed our Series A round in half the time we expected."
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.pexels.com/photos/5984629/pexels-photo-5984629.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Michael Chang"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Michael Chang</h4>
                  <p className="text-gray-600 dark:text-gray-400">Angel Investor</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "The filtering tools on InnovaConnect save me countless hours. I can quickly find startups that match my investment criteria, and the platform's messaging system makes it easy to establish initial contact."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-700 dark:bg-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Connect?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
            Join InnovaConnect today and discover the perfect match for your startup or investment portfolio.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-teal-800 bg-white hover:bg-gray-100 transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-teal-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;