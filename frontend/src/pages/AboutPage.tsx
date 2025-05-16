import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Target, Users, Shield, Check, Briefcase } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About InnovaConnect</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Building bridges between innovative startups and strategic investors to fuel the next generation of business growth.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                InnovaConnect was founded with a clear mission: to democratize access to capital for innovative startups and provide investors with a streamlined pathway to discover promising opportunities across all sectors and stages.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                We believe that great ideas deserve the opportunity to become reality, regardless of founders' backgrounds or networks. By removing traditional barriers and leveraging technology, we're creating a more efficient, transparent, and inclusive funding ecosystem.
              </p>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                  <Rocket className="h-4 w-4 mr-1" />
                  Innovation
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <Target className="h-4 w-4 mr-1" />
                  Opportunity
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  <Users className="h-4 w-4 mr-1" />
                  Community
                </span>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-8 border border-teal-100 dark:border-teal-800">
                <Briefcase className="h-12 w-12 text-teal-600 dark:text-teal-500 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Impact</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-600 dark:text-teal-500 mt-1 mr-2" />
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">500+</span> startups have successfully connected with investors
                    </p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-600 dark:text-teal-500 mt-1 mr-2" />
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Over $50 million</span> in funding facilitated
                    </p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-600 dark:text-teal-500 mt-1 mr-2" />
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Across 20+</span> industries and sectors
                    </p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-600 dark:text-teal-500 mt-1 mr-2" />
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">30% faster</span> fundraising cycles compared to traditional methods
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How InnovaConnect Works</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform simplifies the connection between startups and investors through a transparent, efficient process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-500 mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Create Profile</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Startups and investors create detailed profiles highlighting their unique attributes and preferences.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-500 mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Discover Matches</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our algorithm suggests potential matches based on industry, funding stage, investment criteria, and more.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-500 mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Connect & Communicate</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Initiate conversations through our secure messaging platform to explore potential partnerships.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-500 mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Schedule & Invest</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Schedule meetings, share documents securely, and formalize investment relationships that drive growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Security & Trust</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              We prioritize the security and confidentiality of all interactions on our platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-teal-600 dark:text-teal-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Data Protection</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Enterprise-grade encryption and security protocols protect all data shared on our platform.
              </p>
            </div>
            
            <div className="text-center">
              <Users className="h-12 w-12 text-teal-600 dark:text-teal-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Verified Profiles</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We verify the identity and credentials of all users to maintain a trusted community.
              </p>
            </div>
            
            <div className="text-center">
              <Target className="h-12 w-12 text-teal-600 dark:text-teal-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Transparency</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Clear communication channels and documented interactions promote transparency throughout the process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-700 dark:bg-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join the InnovaConnect Community</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
            Whether you're an innovative startup seeking funding or an investor looking for the next big opportunity, InnovaConnect is your platform for meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-teal-800 bg-white hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-teal-600 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;