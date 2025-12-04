import { MessageCircle, Users, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-purple-100 text-white mt-8 sm:mt-12">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-6 xs:py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 xs:gap-8 lg:gap-12">
          
          {/* Contact Section */}
          <div className="pb-6 sm:pb-0 border-b sm:border-b-0 border-purple-200">
            <h3 className="text-base xs:text-lg font-semibold mb-3 xs:mb-4 text-purple-900">Contact Us</h3>
            <div className="space-y-2.5 xs:space-y-3">
              {/* WhatsApp Number */}
              <a 
                href="https://wa.me/qr/RYAVYQPCMIZ3J1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-purple-800 hover:text-purple-600 transition-colors duration-200 group"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm">WhatsApp Support</span>
              </a>

              {/* WhatsApp Community */}
              <a 
                href="https://whatsapp.com/channel/0029Vb7GKLN8qJ01RrXnW31P" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-purple-800 hover:text-purple-600 transition-colors duration-200 group"
              >
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm">Join Our Community</span>
              </a>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/by_agnishikha?igsh=YzltaHVzd2VkOWg3" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-purple-800 hover:text-purple-600 transition-colors duration-200 group"
              >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm">Follow on Instagram</span>
              </a>
            </div>
          </div>

          {/* Policies Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-900">Policies</h3>
            <div className="space-y-3">
              <a 
                href="https://merchant.razorpay.com/policy/RlEzzPl5yMk1dX/terms" 
                className="block text-sm text-purple-800 hover:text-purple-600 transition-colors duration-200 hover:translate-x-1 transform"
              >
                Terms and Conditions
              </a>
              <a 
                href="https://merchant.razorpay.com/policy/RlEzzPl5yMk1dX/privacy" 
                className="block text-sm text-purple-800 hover:text-purple-600 transition-colors duration-200 hover:translate-x-1 transform"
              >
                Privacy Policy
              </a>
              <a 
                href="https://merchant.razorpay.com/policy/RlEzzPl5yMk1dX/refund" 
                className="block text-sm text-purple-800 hover:text-purple-600 transition-colors duration-200 hover:translate-x-1 transform"
              >
                Cancellation and Refund
              </a>
              <a 
                href="https://merchant.razorpay.com/policy/RlEzzPl5yMk1dX/shipping" 
                className="block text-sm text-purple-800 hover:text-purple-600 transition-colors duration-200 hover:translate-x-1 transform"
              >
                Shipping Policy
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-8 pt-6 border-t border-purple-200">
          <p className="text-center text-sm text-purple-800">
            © {new Date().getFullYear()} Agnishikha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;