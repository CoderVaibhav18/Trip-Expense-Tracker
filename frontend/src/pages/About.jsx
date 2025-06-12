import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 md:p-12 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4 text-center">
            About Trip Expense Tracker
          </h1>
          <p className="text-gray-600 text-lg mb-20 text-center">
            Trip Expense Tracker is your simple, modern solution for managing
            group travel expenses. Whether you’re on a road trip, vacation, or
            adventure with friends, our tool helps you keep finances transparent
            and stress-free.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <span className="text-blue-500 text-4xl mb-2 animate-bounce">
                💡
              </span>
              <h2 className="font-semibold text-lg mb-1">Easy to Use</h2>
              <p className="text-gray-500 text-center">
                Add, split, and track expenses in just a few clicks. No more
                confusion about who owes what!
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-green-500 text-4xl mb-2 animate-bounce">
                🔒
              </span>
              <h2 className="font-semibold text-lg mb-1">Secure & Private</h2>
              <p className="text-gray-500 text-center">
                Your data is safe and only visible to your group. We respect
                your privacy.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-yellow-500 text-4xl mb-2 animate-bounce">
                📱
              </span>
              <h2 className="font-semibold text-lg mb-1">Mobile Friendly</h2>
              <p className="text-gray-500 text-center">
                Works seamlessly on all devices, so you can manage expenses on
                the go.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-pink-500 text-4xl mb-2 animate-bounce">
                🚀
              </span>
              <h2 className="font-semibold text-lg mb-1">Free & Fast</h2>
              <p className="text-gray-500 text-center">
                No fees, no hassle. Start tracking your trip expenses instantly!
              </p>
            </div>
          </div>
        </div>
        {/* Animation keyframes for fade-in-up */}
        <style>
          {`
          .animate-fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
        </style>
      </div>
      <Footer />
    </div>
  );
};

export default About;
