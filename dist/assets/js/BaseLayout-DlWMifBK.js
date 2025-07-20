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
  const { title, description = "Professional HVAC, construction, and general contracting services for commercial and residential projects", canonical } = Astro2.props;
  const canonicalURL = new URL(canonical ?? Astro2.url.pathname, Astro2.site);
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-37fxchfa> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/WebsiteTest/favicon.svg"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', "><!-- Basic SEO Meta Tags --><title>", '</title><meta name="description"', '><meta name="keywords" content="HVAC services, construction, general contracting, commercial HVAC, heating, cooling, air conditioning, construction projects, building contractors, renovation, plumbing, electrical, roofing"><meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"><meta name="author" content="Midwest Construction & HVAC Solutions"><link rel="canonical"', '><!-- Business Meta Tags --><meta name="business.hours" content="Mo-Fr 07:00-18:00, Sa 08:00-16:00"><meta name="business.phone" content="(555) 123-4567"><meta name="business.area" content="Great Lakes Region HVAC & Construction"><meta name="geo.region" content="US-IL, US-IN, US-MI, US-WI, US-OH"><meta name="geo.placename" content="Midwest Construction & HVAC"><!-- Enhanced SEO Meta Tags --><meta name="subject" content="HVAC Construction & General Contracting"><meta name="copyright" content="\xA9 2025 Midwest Construction & HVAC Solutions"><meta name="abstract" content="Professional HVAC installation, construction, and general contracting services for commercial and residential projects."><meta name="topic" content="HVAC Services & Construction"><meta name="summary" content="Leading provider of commercial HVAC systems, construction services, and general contracting throughout the Great Lakes region."><meta name="classification" content="Construction & HVAC Services"><meta name="designer" content="Midwest Construction & HVAC Solutions"><meta name="reply-to" content="info@midwestconstructionhvac.com"><meta name="owner" content="Midwest Construction & HVAC Solutions"><meta name="url"', '><meta name="identifier-URL"', '><meta name="directory" content="submission"><meta name="category" content="HVAC & Construction Services"><meta name="coverage" content="Great Lakes Region"><meta name="distribution" content="Regional"><meta name="rating" content="Safe For Kids"><!-- Open Graph Meta Tags --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:site_name" content="Midwest Construction & HVAC Solutions"><meta property="og:locale" content="en_US"><!-- Twitter Card Meta Tags --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:url"', '><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><!-- Structured Data - Enhanced Local Business Schema --><script type="application/ld+json">', `<\/script><!-- Enhanced Security Headers --><meta http-equiv="X-Content-Type-Options" content="nosniff"><meta http-equiv="X-Frame-Options" content="SAMEORIGIN"><meta http-equiv="X-XSS-Protection" content="1; mode=block"><meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin"><meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://www.clarity.ms;"><!-- Enhanced PWA and Mobile Meta Tags --><link rel="manifest" href="/WebsiteTest/site.webmanifest"><meta name="theme-color" content="#3b82f6"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="Digital Solutions"><meta name="msapplication-TileColor" content="#3b82f6"><meta name="msapplication-config" content="/WebsiteTest/browserconfig.xml"><!-- Enhanced Google Analytics 4 --><script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"><\/script><script>
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
        "@type": ["GeneralContractor", "HVACBusiness"],
        "@id": `${canonicalURL}#hvaccontractor`,
        "name": "Midwest Construction & HVAC Solutions",
        "alternateName": "Midwest HVAC & Construction",
        "url": canonicalURL.toString(),
        "logo": {
          "@type": "ImageObject",
          "url": `${Astro2.site}WebsiteTest/logo.png`
        },
        "description": description,
        "foundingDate": "2003",
        "slogan": "Building Excellence, Delivering Comfort",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "456 Industrial Drive",
          "addressLocality": "Metroville",
          "addressRegion": "IL",
          "postalCode": "60601",
          "addressCountry": "US"
        },
        "telephone": "(555) 123-4567",
        "email": "info@midwestconstructionhvac.com",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "07:00",
            "closes": "18:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Saturday"],
            "opens": "08:00",
            "closes": "16:00"
          }
        ],
        "serviceArea": [
          {
            "@type": "State",
            "name": "Illinois"
          },
          {
            "@type": "State",
            "name": "Indiana"
          },
          {
            "@type": "State",
            "name": "Michigan"
          },
          {
            "@type": "State",
            "name": "Wisconsin"
          },
          {
            "@type": "State",
            "name": "Ohio"
          }
        ],
        "priceRange": "$$-$$$",
        "paymentAccepted": ["Credit Card", "Check", "Financing", "Cash"],
        "currenciesAccepted": "USD",
        "areaServed": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": "41.8781",
            "longitude": "-87.6298"
          },
          "geoRadius": "160934"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "HVAC & Construction Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Commercial HVAC Installation"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "General Construction"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Emergency HVAC Repair"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Building Renovation"
              }
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "156"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Sarah L."
            },
            "datePublished": "2024-11-10",
            "reviewBody": "Outstanding HVAC installation for our new office building. Professional team completed the project on time and under budget. Our energy costs dropped 40%!",
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
