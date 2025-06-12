import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-8">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
        <div className="text-gray-500 text-center text-sm mb-1">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-700">Trip Expense Tracker</span>. All rights reserved.
        </div>
        <div className="flex text-center items-center text-sm text-gray-400">
          Made with
          <span className="mx-1 font-bold text-pink-600">Vaibhav Sathe</span>
          <span className="text-red-500 text-lg" aria-label="love" role="img">❤</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer