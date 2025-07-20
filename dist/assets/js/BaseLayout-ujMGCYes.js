import { b as createAstro, c as createComponent, a as renderTemplate, f as renderSlot, g as renderHead, u as unescapeHTML, e as addAttribute } from './astro/server-0R90AftL.js';
import 'kleur/colors';
import 'clsx';
/* empty css                        */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://tariqdude.github.io");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, description = "Professional digital solutions and web development services for modern businesses", canonical } = Astro2.props;
  const canonicalURL = new URL(canonical ?? Astro2.url.pathname, Astro2.site);
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-37fxchfa> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/WebsiteTest/favicon.svg"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', "><!-- Basic SEO Meta Tags --><title>", '</title><meta name="description"', '><meta name="keywords" content="web development, digital solutions, web design, e-commerce, digital marketing, responsive design, custom websites, business solutions"><meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"><meta name="author" content="Digital Solutions"><link rel="canonical"', '><!-- Business Meta Tags --><meta name="business.hours" content="Mo-Fr 09:00-18:00"><meta name="business.phone" content="(555) 123-4567"><meta name="business.area" content="Nationwide Digital Services"><meta name="geo.region" content="US"><meta name="geo.placename" content="Digital Agency"><!-- Enhanced SEO Meta Tags --><meta name="subject" content="Digital Solutions & Web Development"><meta name="copyright" content="\xA9 2025 Digital Solutions"><meta name="abstract" content="Professional digital solutions and web development services for modern businesses seeking online growth."><meta name="topic" content="Web Development & Digital Services"><meta name="summary" content="Leading provider of custom web development, digital marketing, and e-commerce solutions for businesses."><meta name="classification" content="Technology Services"><meta name="designer" content="Digital Solutions"><meta name="reply-to" content="info@digitalsolutions.com"><meta name="owner" content="Digital Solutions"><meta name="url"', '><meta name="identifier-URL"', '><meta name="directory" content="submission"><meta name="category" content="Digital Services"><meta name="coverage" content="Worldwide"><meta name="distribution" content="Global"><meta name="rating" content="Safe For Kids"><!-- Open Graph Meta Tags --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:site_name" content="Midwest Climate Solutions"><meta property="og:locale" content="en_US"><!-- Twitter Card Meta Tags --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:url"', '><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><!-- Structured Data - Enhanced Local Business Schema --><script type="application/ld+json">', `<\/script><!-- Enhanced Security Headers --><meta http-equiv="X-Content-Type-Options" content="nosniff"><meta http-equiv="X-Frame-Options" content="SAMEORIGIN"><meta http-equiv="X-XSS-Protection" content="1; mode=block"><meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin"><meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://www.clarity.ms;"><!-- Enhanced PWA and Mobile Meta Tags --><link rel="manifest" href="/WebsiteTest/site.webmanifest"><meta name="theme-color" content="#3b82f6"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="Digital Solutions"><meta name="msapplication-TileColor" content="#3b82f6"><meta name="msapplication-config" content="/WebsiteTest/browserconfig.xml"><!-- Enhanced Google Analytics 4 --><script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"><\/script><script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID', {
        send_page_view: true,
        page_title: document.title,
        content_group1: 'HVAC Services',
        business_type: 'HVAC_Commercial',
        cookie_flags: 'SameSite=Strict;Secure',
        anonymize_ip: false,
        allow_google_signals: true,
        custom_map: {'custom_parameter_1': 'business_type'}
      });
      
      // Enhanced event tracking for Core Web Vitals
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        content_group: 'HVAC_Website'
      });
      
      // Track user engagement time
      let engagementStartTime = Date.now();
      window.addEventListener('beforeunload', function() {
        const engagementTime = Date.now() - engagementStartTime;
        gtag('event', 'user_engagement', {
          engagement_time_msec: engagementTime
        });
      });
    <\/script><!-- Microsoft Clarity with Enhanced Configuration --><script>
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "CLARITY_PROJECT_ID");
      
      // Enhanced clarity tracking
      if (typeof clarity !== 'undefined') {
        clarity('set', 'page_type', 'hvac_landing');
        clarity('set', 'business_category', 'commercial_services');
      }
    <\/script><!-- Hotjar Tracking Code --><script>
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:3500000,hjsv:6}; // Replace with actual Hotjar ID
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    <\/script><!-- Performance Preconnections --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://cdnjs.cloudflare.com"><link rel="preconnect" href="https://images.unsplash.com"><link rel="preconnect" href="https://www.google-analytics.com"><link rel="preconnect" href="https://www.googletagmanager.com"><link rel="preconnect" href="https://www.clarity.ms"><link rel="preconnect" href="https://static.hotjar.com"><!-- DNS Prefetch for additional performance --><link rel="dns-prefetch" href="https://fonts.googleapis.com"><link rel="dns-prefetch" href="https://cdnjs.cloudflare.com"><link rel="dns-prefetch" href="https://images.unsplash.com"><link rel="dns-prefetch" href="https://www.recaptcha.net"><link rel="dns-prefetch" href="https://maps.googleapis.com"><!-- Enhanced Font Loading --><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"><!-- Font Awesome Icons --><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer"><!-- Critical CSS for Performance --><!-- Service Worker Registration --><script>
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/WebsiteTest/sw.js');
      }
    <\/script><!-- Analytics and Error Tracking --><script>
      // Global analytics object for tracking
      window.analytics = {
        trackEvent: function(category, action, label) {
          if (typeof gtag !== 'undefined') {
            gtag('event', action, {
              event_category: category,
              event_label: label
            });
          }
        },
        trackPhoneCall: function(source) {
          this.trackEvent('Contact', 'phone_call', source);
        },
        trackFormSubmit: function(formType) {
          this.trackEvent('Form', 'submit', formType);
        },
        trackError: function(error, context) {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
              description: error,
              fatal: false,
              custom_map: { context: context }
            });
          }
        }
      };
      
      // Global error handling
      window.addEventListener('error', function(e) {
        window.analytics?.trackError(e.message, e.filename + ':' + e.lineno);
      });
      
      window.addEventListener('unhandledrejection', function(e) {
        window.analytics?.trackError('Unhandled Promise Rejection: ' + e.reason, 'promise');
      });
    <\/script>`, "</head> <body data-astro-cid-37fxchfa> ", " </body></html>"])), addAttribute(Astro2.generator, "content"), title, addAttribute(description, "content"), addAttribute(canonicalURL, "href"), addAttribute(canonicalURL, "content"), addAttribute(canonicalURL, "content"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(`${Astro2.site}WebsiteTest/og-image.jpg`, "content"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(`${Astro2.site}WebsiteTest/og-image.jpg`, "content"), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${canonicalURL}#digitalagency`,
        "name": "Digital Solutions",
        "alternateName": "Digital Agency",
        "url": canonicalURL.toString(),
        "logo": {
          "@type": "ImageObject",
          "url": `${Astro2.site}WebsiteTest/logo.png`
        },
        "description": description,
        "foundingDate": "2020",
        "slogan": "Digital Growth, Delivered",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Tech Avenue",
          "addressLocality": "Digital City",
          "addressRegion": "CA",
          "postalCode": "90210",
          "addressCountry": "US"
        },
        "telephone": "(555) 123-4567",
        "email": "info@digitalsolutions.com",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
          }
        ],
        "serviceArea": {
          "@type": "Country",
          "name": "United States"
        },
        "priceRange": "$$$",
        "paymentAccepted": ["Credit Card", "PayPal", "Bank Transfer"],
        "currenciesAccepted": "USD",
        "areaServed": {
          "@type": "Country",
          "name": "United States"
        },
        "makesOffer": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Web Development Services"
            },
            "price": "2999.00",
            "priceCurrency": "USD"
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "89"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Michael R."
            },
            "datePublished": "2024-03-15",
            "reviewBody": "Outstanding web development service. Professional team delivered exactly what we needed on time and within budget.",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            }
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${canonicalURL}#website`,
        "url": canonicalURL.toString(),
        "name": "Digital Solutions",
        "publisher": {
          "@id": `${canonicalURL}#digitalagency`
        }
      }
    ]
  })), renderHead(), renderSlot($$result, $$slots["default"]));
}, "C:/Users/Boss/Documents/GitHub/WebsiteTest/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
