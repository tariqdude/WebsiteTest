import React from 'react';

const CallToAction = () => {
  return (
    <div className="bg-blue-600 text-white p-8 text-center rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
      <p className="text-lg mb-6">Contact us today to discuss your project and see how we can help.</p>
      <a href="/contact" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
        Contact Us
      </a>
    </div>
  );
};

export default CallToAction;