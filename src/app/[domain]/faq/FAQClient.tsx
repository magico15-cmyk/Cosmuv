"use client";

import React, { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How do I place an order?",
    answer: "Placing an order is extremely simple. Just browse our products, click 'Order Now', and fill out the brief form with your name, phone number, and delivery address. That's it! No credit card or online payment is required."
  },
  {
    question: "When will I receive my order?",
    answer: "We pride ourselves on fast delivery. Most local orders are processed immediately and delivered directly to your door within 24 to 48 hours."
  },
  {
    question: "Can I inspect the product before paying?",
    answer: "Yes, absolutely! Because we operate on a Cash on Delivery (COD) basis, you have the full right to inspect your package when the courier arrives. You only pay if you are completely satisfied with the product."
  },
  {
    question: "What is your return/exchange policy?",
    answer: "We want you to love your purchase. If the product is defective or not as described, you can simply refuse to pay for it upon delivery. If you encounter issues shortly after purchasing, please contact our support team and we will arrange an exchange quickly and hassle-free."
  },
  {
    question: "Is my personal information secure?",
    answer: "100% secure. We only collect the basic details necessary to deliver your order (Name, Phone Number, and Address). We never share or sell your data to third parties."
  }
];

export default function FAQClient({ store }: { store: any }) {
  const primaryColor = store?.primary_color || '#f899a2';
  const guaranteeColor = store?.guarantee_color || '#1fb6ff';
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div dir="ltr">
        <TopBar />
      </div>
      <div dir={store?.language === 'ar' || store?.store_rtl ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col bg-gray-50">
        <Header store={store} />

        <main className="flex-1 w-full max-w-[800px] mx-auto px-5 py-12 md:py-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            <div className="border-b border-gray-100 px-8 py-10 md:p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <HelpCircle size={32} color={primaryColor} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Everything you need to know about ordering, shipping, and our policies.
              </p>
            </div>

            <div className="p-8 md:p-12">
              <div className="space-y-4">
                {faqs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div 
                      key={index} 
                      className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                        isOpen ? 'border-gray-300 shadow-sm bg-white' : 'border-gray-100 bg-gray-50 hover:bg-gray-100/50'
                      }`}
                    >
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                      >
                        <span className={`text-lg font-semibold pr-4 transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                          {faq.question}
                        </span>
                        <ChevronDown 
                          size={20} 
                          className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                        />
                      </button>
                      <div 
                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="text-gray-600 leading-relaxed text-[16px]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 text-center bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
                <p className="text-gray-600 mb-6">
                  We're here to help. Send us an email and we'll get back to you as soon as possible.
                </p>
                <a 
                  href={store?.store_email ? `mailto:${store.store_email}` : '#'}
                  className="inline-flex items-center justify-center font-bold text-white rounded-lg px-8 py-3 transition-opacity hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  Contact Support
                </a>
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --primary-pink: ${primaryColor};
          --star-pink: ${primaryColor};
          --guarantee-color: ${guaranteeColor};
        }
        
        .wave-1 path { fill: ${primaryColor}; opacity: 0.4; }
        .wave-2 path { fill: ${primaryColor}; opacity: 1; }
        .wave-3 path { fill: ${primaryColor}; opacity: 0.7; }
      `}} />
    </>
  );
}
