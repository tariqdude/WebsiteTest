import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const MobileMenu = ({ navItems, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMenu}
            aria-hidden="true"
          />
          
          {/* Mobile menu panel */}
          <div className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 md:hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Menu
              </h2>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-4">
                {navItems.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        currentPath === href
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={toggleMenu}
                      aria-current={currentPath === href ? 'page' : undefined}
                    >
                      {label}
                    </a>
                  </li>
                ))}
                <li className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href="/contact"
                    className="btn-primary text-sm w-full"
                    onClick={toggleMenu}
                  >
                    Get Started
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default MobileMenu;
