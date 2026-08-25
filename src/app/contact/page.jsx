'use client';

import { useState, useEffect } from 'react';
import { Sparkles, MapPin, Phone, Mail, Clock, MessageSquare, HelpCircle, ChevronDown, Building2, FileCheck } from 'lucide-react';
import { contentList, contentObject, contentText, useSiteData } from '@/lib/siteDataContext';

export default function ContactPage() {
  const siteData = useSiteData();
  const content = contentObject(siteData.content);
  const contact = contentObject(content.contact);
  const faqs = contentList(contact.faqs);

  const badge = contentText(contact.badge) || 'Direct Foundry WhatsApp Concierge';
  const heading = contentText(contact.heading) || 'Request a Custom Quote';
  const subtitle = contentText(contact.subtitle) || 'Connect directly with our master metalsmiths.';
  const formTitle = contentText(contact.formTitle) || 'Project Specification Form';
  const formDescription = contentText(contact.formDescription) || 'Submit your inquiry below.';
  const whatsappNumber = contentText(contact.whatsappNumber) || '94755654663';
  const whatsappButtonLabel = contentText(contact.whatsappButtonLabel) || 'Send Inquiry via WhatsApp';
  const showroomTitle = contentText(contact.showroomTitle) || 'Flagship Studio & Foundry';
  const showroomAddress = contentText(contact.showroomAddress) || '742 Artisan Foundry Row, Colombo 03';
  const showroomPhone = contentText(contact.showroomPhone) || '075 565 4663';
  const showroomEmail = contentText(contact.showroomEmail) || 'inquiries@aureliabrass.com';
  const showroomHours = contentText(contact.showroomHours) || 'Monday – Friday: 9:00 AM – 6:00 PM IST';

  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', inquiryType: 'Custom Brass Fabrication', finishPreference: 'Satin Brushed Brass', budgetRange: 'LKR 100,000 - LKR 500,000', projectDetails: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const product = params.get('product');
      const finish = params.get('finish');
      if (product) {
        setFormData((prev) => ({
          ...prev,
          inquiryType: 'Catalog Product Purchase',
          projectDetails: `Inquiring about product: ${product}`
        }));
      }
      if (finish) {
        setFormData((prev) => ({
          ...prev,
          finishPreference: finish,
          projectDetails: `Inquiring about finish swatch: ${finish}`
        }));
      }
    }
  }, []);

  const common = contentObject(content.common);
  const brandTitle = contentText(common.websiteTitle) || 'Aurelia Brass';

  const handleSubmit = (e) => {
    e.preventDefault();
    const brandUpper = brandTitle.toUpperCase();
    const msg = `*NEW INQUIRY - ${brandUpper}*\n\nFull Name: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\nInquiry Type: ${formData.inquiryType}\nPreferred Finish: ${formData.finishPreference}\nBudget Range: ${formData.budgetRange}\n\nProject Details:\n${formData.projectDetails}\n\n---\nSent via ${brandTitle} Web Studio`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div data-preview-page-key="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-800/10 dark:bg-[#d4af37]/10 border border-amber-800/30 dark:border-[#d4af37]/30 text-[#b8860b] dark:text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" data-preview-static="header-icon" />
          <span data-preview-field-path="contact.badge">{badge}</span>
        </div>
        <h1 data-preview-field-path="contact.heading" className="font-serif-luxury text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">{heading}</h1>
        <p data-preview-field-path="contact.subtitle" className="text-sm sm:text-base text-slate-600 dark:text-[#a3a8b5]">{subtitle}</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Form Section */}
        <div className="lg:col-span-7 bg-white dark:bg-[#131720] border border-amber-800/30 dark:border-[#d4af37]/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="border-b border-amber-800/20 dark:border-[#d4af37]/20 pb-4">
            <h2 data-preview-field-path="contact.formTitle" className="font-serif-luxury text-2xl font-bold text-slate-900 dark:text-white">{formTitle}</h2>
            <p data-preview-field-path="contact.formDescription" className="text-xs text-slate-500 dark:text-[#a3a8b5] mt-1 font-medium">{formDescription}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5"><span data-preview-static="field-label">Full Name </span><span className="text-[#b8860b] dark:text-[#d4af37]" data-preview-static="req-asterisk">*</span></label>
                <input type="text" required placeholder="e.g. Eleanor Vance" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0b0d12] border border-amber-800/30 dark:border-[#d4af37]/30 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" data-preview-static="text-input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5"><span data-preview-static="field-label">Business / Personal Email </span><span className="text-[#b8860b] dark:text-[#d4af37]" data-preview-static="req-asterisk">*</span></label>
                <input type="email" required placeholder="e.g. eleanor@vancedesign.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0b0d12] border border-amber-800/30 dark:border-[#d4af37]/30 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" data-preview-static="text-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5"><span data-preview-static="field-label">Phone / WhatsApp </span><span className="text-[#b8860b] dark:text-[#d4af37]" data-preview-static="req-asterisk">*</span></label>
                <input type="tel" required placeholder="075 565 4663" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0b0d12] border border-amber-800/30 dark:border-[#d4af37]/30 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" data-preview-static="text-input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5"><span data-preview-static="field-label">Inquiry Purpose</span></label>
                <select value={formData.inquiryType} onChange={(e) => setFormData({...formData, inquiryType: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0b0d12] border border-amber-800/30 dark:border-[#d4af37]/30 text-sm text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" data-preview-static="select-input">
                  <option data-preview-static="opt-1">Custom Brass Fabrication</option>
                  <option data-preview-static="opt-2">Trade Program / Architect Pricing</option>
                  <option data-preview-static="opt-3">Catalog Product Purchase</option>
                  <option data-preview-static="opt-4">Sample Swatch Request</option>
                  <option data-preview-static="opt-5">Showroom Consultation</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5"><span data-preview-static="field-label">Preferred Finish</span></label>
                <select value={formData.finishPreference} onChange={(e) => setFormData({...formData, finishPreference: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0b0d12] border border-amber-800/30 dark:border-[#d4af37]/30 text-sm text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" data-preview-static="select-input">
                  <option data-preview-static="fin-1">Polished Mirror Gold</option>
                  <option data-preview-static="fin-2">Satin Brushed Brass</option>
                  <option data-preview-static="fin-3">Vintage Antique Patina</option>
                  <option data-preview-static="fin-4">Raw Hammered Brass</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5"><span data-preview-static="field-label">Budget Range (LKR)</span></label>
                <select value={formData.budgetRange} onChange={(e) => setFormData({...formData, budgetRange: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0b0d12] border border-amber-800/30 dark:border-[#d4af37]/30 text-sm text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" data-preview-static="select-input">
                  <option data-preview-static="bud-1">Under LKR 100,000</option>
                  <option data-preview-static="bud-2">LKR 100,000 - LKR 500,000</option>
                  <option data-preview-static="bud-3">LKR 500,000 - LKR 1,500,000</option>
                  <option data-preview-static="bud-4">LKR 1,500,000+ (Commercial Scope)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5"><span data-preview-static="field-label">Message / Specifications </span><span className="text-[#b8860b] dark:text-[#d4af37]" data-preview-static="req-asterisk">*</span></label>
              <textarea required rows={4} placeholder="Describe your project..." value={formData.projectDetails} onChange={(e) => setFormData({...formData, projectDetails: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0b0d12] border border-amber-800/30 dark:border-[#d4af37]/30 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" data-preview-static="textarea-input" />
            </div>
            <button 
              type="submit" 
              className="w-full py-4.5 px-6 rounded-[22px] bg-[#029e63] hover:bg-[#028b57] text-white font-bold text-base transition-all flex items-center justify-center gap-3 cursor-pointer border-0 shadow-lg shadow-emerald-950/10"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 fill-white text-transparent" data-preview-static="whatsapp-icon" />
              </div>
              <span data-preview-field-path="contact.whatsappButtonLabel" className="text-sm font-bold tracking-wide">
                {whatsappButtonLabel}
              </span>
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#131720] border border-amber-800/20 dark:border-[#d4af37]/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-[#b8860b] dark:text-[#d4af37]">
              <Building2 className="w-6 h-6" data-preview-static="showroom-icon" />
              <h3 data-preview-field-path="contact.showroomTitle" className="font-serif-luxury text-xl font-bold text-slate-900 dark:text-white">{showroomTitle}</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#a3a8b5]" data-preview-static="showroom-desc">Visit our showroom to touch finish swatches, consult with metalsmiths, and view our live casting workshop.</p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37] shrink-0 mt-0.5" data-preview-static="map-pin-icon" />
                <span data-preview-field-path="contact.showroomAddress" className="text-slate-900 dark:text-white font-medium">{showroomAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37] shrink-0" data-preview-static="phone-icon" />
                <span data-preview-field-path="contact.showroomPhone" className="text-slate-900 dark:text-white font-medium">{showroomPhone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37] shrink-0" data-preview-static="mail-icon" />
                <span data-preview-field-path="contact.showroomEmail" className="text-slate-900 dark:text-white font-medium">{showroomEmail}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37] shrink-0 mt-0.5" data-preview-static="clock-icon" />
                <span data-preview-field-path="contact.showroomHours" className="text-slate-900 dark:text-white font-medium">{showroomHours}</span>
              </div>
              <div className="flex items-center gap-3 pt-1 border-t border-slate-100 dark:border-white/5">
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" data-preview-static="whatsapp-tag-icon" />
                <span className="text-slate-500 dark:text-gray-400" data-preview-static="whatsapp-label">WhatsApp: </span>
                <span data-preview-field-path="contact.whatsappNumber" className="text-emerald-700 dark:text-emerald-400 font-bold">{whatsappNumber}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-[#131720] dark:to-[#1b212d] border border-amber-800/30 dark:border-[#d4af37]/30 rounded-3xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <FileCheck className="w-5 h-5 text-[#b8860b] dark:text-[#d4af37]" data-preview-static="promise-icon" />
              <h4 className="font-serif-luxury text-lg font-bold text-slate-900 dark:text-white" data-preview-static="promise-title">Trade Concierge Promise</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-[#a3a8b5] font-medium">
              <li className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-[#b8860b] dark:text-[#d4af37]" data-preview-static="bullet-icon-1" /><span data-preview-static="promise-point-1">Instant WhatsApp Response from Master Metalsmith</span></li>
              <li className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-[#b8860b] dark:text-[#d4af37]" data-preview-static="bullet-icon-2" /><span data-preview-static="promise-point-2">Complimentary 2D CAD Spec Verification</span></li>
              <li className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-[#b8860b] dark:text-[#d4af37]" data-preview-static="bullet-icon-3" /><span data-preview-static="promise-point-3">Express Islandwide &amp; Global Courier Delivery</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto space-y-8 pt-10 border-t border-amber-800/20 dark:border-[#d4af37]/20">
        <div className="text-center space-y-2">
          <div className="text-[#b8860b] dark:text-[#d4af37] text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4" data-preview-static="faq-badge-icon" />
            <span data-preview-static="faq-badge-title">Frequently Asked Questions</span>
          </div>
          <h2 className="font-serif-luxury text-3xl font-bold text-slate-900 dark:text-white" data-preview-static="faq-section-heading">Common Inquiries &amp; Trade Information</h2>
        </div>
        <div data-preview-list-path="contact.faqs" className="space-y-4">
          {faqs.map((rawFaq, index) => {
            const faq = contentObject(rawFaq);
            const question = contentText(faq.q);
            const answer = contentText(faq.a);
            return (
              <details 
                key={index} 
                open={true}
                data-preview-item-path={`contact.faqs[${index}]`} 
                className="group bg-white dark:bg-[#131720] border border-amber-800/20 dark:border-[#d4af37]/20 rounded-2xl overflow-clip shadow-md"
              >
                <summary className="w-full p-5 text-left font-serif-luxury text-base font-bold text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer list-none select-none">
                  <span data-preview-field-path={`contact.faqs[${index}].q`}>{question}</span>
                  <ChevronDown className="w-5 h-5 text-[#b8860b] dark:text-[#d4af37] transition-transform duration-200 group-open:rotate-180" data-preview-static="chevron-icon" />
                </summary>
                <p data-preview-field-path={`contact.faqs[${index}].a`}
                  className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-[#a3a8b5] leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                  {answer}
                </p>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  );
}

