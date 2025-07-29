import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const MobileMenu = ({ navItems, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type='button'
        className='rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900'
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label='Toggle mobile menu'
      >
        {isOpen ? (
          <X className='h-5 w-5 text-gray-700 dark:text-gray-300' />
        ) : (
          <Menu className='h-5 w-5 text-gray-700 dark:text-gray-300' />
        )}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          <div
            className='fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden'
            onClick={toggleMenu}
            aria-hidden='true'
          />

          {/* Mobile menu panel */}
          <div className='fixed bottom-0 right-0 top-0 z-50 w-64 border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:hidden'>
            <div className='flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Menu
              </h2>
              <button
                type='button'
                className='rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'
                onClick={toggleMenu}
                aria-label='Close menu'
              >
                <X className='h-5 w-5 text-gray-700 dark:text-gray-300' />
              </button>
            </div>

            <nav className='p-4'>
              <ul className='space-y-4'>
                {navItems.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        currentPath === href
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'`
                      }`}
                      onClick={toggleMenu}
                      aria-current={currentPath === href ? 'page' : undefined}
                    >
                      {label}
                    </a>
                  </li>
                ))}
                <li className='border-t border-gray-200 pt-4 dark:border-gray-700'>
                  <a
                    href='/contact'
                    className='btn-primary w-full text-sm'
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
`