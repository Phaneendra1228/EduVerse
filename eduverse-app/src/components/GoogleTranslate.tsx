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
        <div className="gt-header">
          <i className="fas fa-globe"></i> LANGUAGE
        </div>
        <div id="google_translate_element"></div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .google-translate-widget {
          position: fixed;
          bottom: 24px;
          left: 24px;
          background-color: #1e293b;
          border-radius: 12px;
          padding: 16px;
          z-index: 9999;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          width: 240px;
          border: 1px solid #334155;
          font-family: 'Inter', 'Outfit', sans-serif;
        }

        .gt-header {
          color: #f8fafc;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .gt-header i {
          color: #38bdf8;
          font-size: 1.1rem;
        }

        /* Override Google Translate Default Styles */
        #google_translate_element {
          width: 100%;
        }

        /* Style the native select dropdown */
        select.goog-te-combo {
          background-color: white !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 10px 12px !important;
          width: 100% !important;
          box-sizing: border-box !important;
          color: #1e293b !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 0.95rem !important;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 16px !important;
        }

        select.goog-te-combo:focus {
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.5) !important;
        }

        /* Hide the 'Powered by Google' text that leaks out */
        .goog-logo-link {
          display: none !important;
        }
        .goog-te-gadget {
          color: transparent !important;
          font-size: 0 !important;
        }
        .goog-te-gadget .goog-te-combo {
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
