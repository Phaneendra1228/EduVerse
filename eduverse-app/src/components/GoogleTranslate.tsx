"use client";

import React, { useEffect, useState } from "react";

export default function GoogleTranslate() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already there to avoid duplicates on re-renders
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { 
            pageLanguage: "en"
          },
          "google_translate_element"
        );
      };
      
      setIsScriptLoaded(true);
    }
  }, []);

  return (
    <>
      <div className="google-translate-widget">
        <i className="fas fa-globe gt-icon"></i>
        <div id="google_translate_element"></div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .google-translate-widget {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background-color: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(8px);
          border-radius: 50px;
          padding: 6px 14px;
          z-index: 9999;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          width: auto;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .google-translate-widget:hover {
          background-color: rgba(30, 41, 59, 1);
        }

        @media (max-width: 768px) {
          .google-translate-widget {
            position: fixed;
            bottom: 80px; /* Above mobile nav if any */
            left: 16px;
          }
        }

        .gt-icon {
          color: #38bdf8;
          font-size: 1.1rem;
        }

        /* Override Google Translate Default Styles */
        #google_translate_element {
          display: flex;
          align-items: center;
          height: 24px;
          overflow: hidden; /* Bulletproof way to hide the "Powered by Google" text below the select */
        }

        /* Style the native select dropdown */
        select.goog-te-combo {
          background-color: transparent !important;
          border: none !important;
          color: #f8fafc !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 0.85rem !important;
          font-weight: 500 !important;
          cursor: pointer;
          outline: none !important;
          width: auto !important;
          height: 24px !important;
          line-height: 24px !important;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          padding: 0 16px 0 0 !important;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f8fafc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right center !important;
          background-size: 14px !important;
        }

        select.goog-te-combo option {
          background-color: #1e293b;
          color: white;
        }

        /* Hide the 'Powered by Google' text that leaks out */
        .goog-logo-link, .goog-logo-link img {
          display: none !important;
        }
        .goog-te-gadget {
          color: transparent !important;
          font-size: 0 !important;
          height: 24px !important;
          display: flex;
          align-items: center;
          margin: 0 !important;
        }

        /* Hide the Google top banner frame */
        body {
          top: 0 !important;
        }
        .skiptranslate iframe {
          display: none !important;
        }
        
        /* Hide tooltips and highlights */
        body .goog-tooltip { display: none !important; }
        body .goog-tooltip:hover { display: none !important; }
        body .goog-text-highlight { background: transparent !important; box-shadow: none !important; }
      `}} />
    </>
  );
}
