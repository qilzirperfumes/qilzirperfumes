import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <div className="contact-page section-padding container min-h-screen">
      <div className="text-center mb-16 animate-fade-up">
        <h1 className="font-heading text-5xl mb-4">Contact Us</h1>
        <p className="text-mutted max-w-xl mx-auto">We invite you to reach out for personalized fragrance styling, order inquiries, or any questions about the Qilzir experience.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info bg-surface text-center animate-fade-up delay-100">
           <Mail className="contact-icon" />
           <h3 className="font-heading text-xl mb-2">Email</h3>
           <p className="text-mutted text-sm mb-4">Our concierge is available 24/7</p>
           <a href="mailto:qilzirperfumes@gmail.com" className="text-gold font-bold text-sm tracking-widest uppercase hover:text-black">qilzirperfumes@gmail.com</a>
        </div>
        
        <div className="contact-info bg-surface text-center animate-fade-up delay-200">
           <Phone className="contact-icon" />
           <h3 className="font-heading text-xl mb-2">Phone</h3>
           <p className="text-mutted text-sm mb-4">Mon-Fri, 9am - 6pm (IST)</p>
           <a href="tel:+919789392728" className="text-gold font-bold text-sm tracking-widest uppercase hover:text-black">+91 9789 392 728</a>
        </div>

        <div className="contact-info bg-surface text-center animate-fade-up delay-300">
           <MapPin className="contact-icon" />
           <h3 className="font-heading text-xl mb-2">Boutique</h3>
           <p className="text-mutted text-sm mb-4">Visit our store</p>
           <span className="text-gold font-bold text-sm tracking-widest uppercase">10/8 PANDIYAN NAGAR MELUR</span>
        </div>
      </div>

      <div className="contact-form-container mt-20 max-w-2xl mx-auto animate-fade-up delay-400">
         <h2 className="font-heading text-3xl mb-8 text-center">Send a Message</h2>
         <form className="contact-form">
            <div className="form-group grid-2">
               <input type="text" placeholder="First Name *" required />
               <input type="text" placeholder="Last Name *" required />
            </div>
            <div className="form-group">
               <input type="email" placeholder="Email Address *" required />
            </div>
            <div className="form-group">
               <input type="text" placeholder="Order Number (Optional)" />
            </div>
            <div className="form-group">
               <textarea rows="6" placeholder="Your Message *" required style={{ resize: 'none' }}></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full mt-4">Send Inquiry</button>
         </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .contact-grid {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(1, 1fr);
        }
        @media (min-width: 768px) {
          .contact-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .contact-info {
           padding: 3rem 2rem;
           transition: transform 0.3s ease;
        }
        .contact-info:hover {
           transform: translateY(-5px);
           box-shadow: var(--shadow-md);
        }
        .contact-icon {
           color: var(--color-gold);
           width: 32px;
           height: 32px;
           margin: 0 auto 1.5rem;
        }
        .contact-form {
           display: flex;
           flex-direction: column;
           gap: 1.5rem;
        }
        .form-group.grid-2 {
           display: grid;
           gap: 1.5rem;
           grid-template-columns: repeat(1, 1fr);
        }
        @media (min-width: 768px) {
           .form-group.grid-2 {
              grid-template-columns: repeat(2, 1fr);
           }
        }
        .contact-form-container {
           background: #fff;
           padding: 3rem;
           border: 1px solid #EBE9E4;
           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
           border-radius: 4px;
        }
        .max-w-xl { max-width: 36rem; }
        .max-w-2xl { max-width: 42rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .mt-4 { margin-top: 1rem; }
        .mt-8 { margin-top: 2rem; }
        .mt-20 { margin-top: 5rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-16 { margin-bottom: 4rem; }
        .w-full { width: 100%; }
        .min-h-screen { min-height: 100vh; }
      `}} />
    </div>
  );
};

export default Contact;
