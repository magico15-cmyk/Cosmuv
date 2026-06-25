-- Function to seed all 6 default pages for a specific store
CREATE OR REPLACE FUNCTION seed_pages_for_store(p_store_id UUID)
RETURNS void AS $$
DECLARE
    about_content TEXT := '<div style="text-align: center;"><h1 style="font-size: 2.5em; font-weight: bold; margin-bottom: 0.5em; color: #111827;">About Us</h1><p style="font-size: 1.1em; color: #4b5563; max-width: 600px; margin: 0 auto 2em auto;">We are dedicated to bringing you the highest quality products with an unmatched shopping experience.</p></div><h2>Our Story</h2><p>Founded with a simple mission: to make premium products accessible to everyone without compromising on quality or service. We realized that shopping online should be straightforward, reliable, and trustworthy.</p><p>Every product we offer is carefully curated and rigorously checked to ensure it meets our high standards. We believe in transparency and building long-lasting relationships with our customers.</p><h2>Why Choose Us</h2><ul><li><strong>Fast Delivery:</strong> 24 to 48 hours for local shipments.</li><li><strong>Cash on Delivery:</strong> Inspect your product before paying.</li><li><strong>Quality Guarantee:</strong> 100% satisfaction or your money back.</li></ul>';
    shipping_content TEXT := '<div style="text-align: center;"><h1 style="font-size: 2.5em; font-weight: bold; margin-bottom: 0.5em; color: #111827;">Shipping & Delivery</h1><p style="font-size: 1.1em; color: #4b5563; max-width: 600px; margin: 0 auto 2em auto;">Fast, reliable delivery directly to your door. Inspect your order before you pay.</p></div><h3>Fast Processing & Dispatch</h3><p>We know you''re excited to receive your order. Once your order is confirmed, our team immediately begins processing it. Orders are typically dispatched within hours, ensuring the fastest possible delivery to your location.</p><h3>24 to 48 Hours Local Delivery</h3><p>We partner with the best local delivery services to ensure your package arrives quickly and safely. For most local areas, you can expect your order to be delivered within <strong>24 to 48 hours</strong>.</p><h3>Cash on Delivery (COD)</h3><p>Your trust is our top priority. We operate strictly on a <strong>Cash on Delivery (COD)</strong> basis. This means you do not need to pay anything online.</p><ul><li><strong>No upfront payments</strong> required.</li><li><strong>Inspect before you pay.</strong> You have the right to check your product at the door.</li><li><strong>Pay the courier in cash</strong> only when you are 100% satisfied.</li></ul>';
    faq_content TEXT := '<div style="text-align: center;"><h1 style="font-size: 2.5em; font-weight: bold; margin-bottom: 0.5em; color: #111827;">Frequently Asked Questions</h1><p style="font-size: 1.1em; color: #4b5563; max-width: 600px; margin: 0 auto 2em auto;">Everything you need to know about ordering, shipping, and our policies.</p></div><h3>How do I place an order?</h3><p>Placing an order is extremely simple. Just browse our products, click "Order Now", and fill out the brief form with your name, phone number, and delivery address. That''s it! No credit card or online payment is required.</p><h3>When will I receive my order?</h3><p>We pride ourselves on fast delivery. Most local orders are processed immediately and delivered directly to your door within 24 to 48 hours.</p><h3>Can I inspect the product before paying?</h3><p>Yes, absolutely! Because we operate on a Cash on Delivery (COD) basis, you have the full right to inspect your package when the courier arrives. You only pay if you are completely satisfied with the product.</p><h3>What is your return/exchange policy?</h3><p>We want you to love your purchase. If the product is defective or not as described, you can simply refuse to pay for it upon delivery. If you encounter issues shortly after purchasing, please contact our support team and we will arrange an exchange quickly and hassle-free.</p><h3>Is my personal information secure?</h3><p>100% secure. We only collect the basic details necessary to deliver your order (Name, Phone Number, and Address). We never share or sell your data to third parties.</p>';
    privacy_content TEXT := '<div style="text-align: center;"><h1 style="font-size: 2.5em; font-weight: bold; margin-bottom: 0.5em; color: #111827;">Privacy Policy & Confidentiality</h1><p style="font-size: 1.1em; color: #4b5563; max-width: 600px; margin: 0 auto 2em auto;">Your privacy is critically important to us.</p></div><h3>Information Collection</h3><p>We only collect the information necessary to fulfill your order, such as your full name, active mobile number, and detailed shipping address. This ensures a smooth and fast delivery process.</p><h3>How We Use Your Information</h3><p>The information we collect is used exclusively for order processing, delivery, and customer support. We may occasionally contact you via WhatsApp or phone to verify your order details before dispatching it.</p><h3>Data Security</h3><p>We take security seriously. Your personal information is kept strictly confidential and is never shared, sold, or rented to any third parties under any circumstances. We implement strict internal measures to ensure your data remains safe.</p>';
    contact_content TEXT := '<div style="text-align: center;"><h1 style="font-size: 2.5em; font-weight: bold; margin-bottom: 0.5em; color: #111827;">Contact Us</h1><p style="font-size: 1.1em; color: #4b5563; max-width: 600px; margin: 0 auto 2em auto;">We''re here to help! Get in touch with our support team.</p></div><p>If you have any questions, concerns, or need help with your order, please do not hesitate to contact us. We aim to respond to all inquiries as quickly as possible.</p><ul><li><strong>Phone / WhatsApp:</strong> [Your Phone Number]</li><li><strong>Email:</strong> [Your Email Address]</li><li><strong>Operating Hours:</strong> Monday - Saturday (9:00 AM - 6:00 PM)</li></ul><p><em>Tip: For the fastest response regarding an existing order, please message us on WhatsApp with your Order ID or the phone number you used to place the order.</em></p>';
    terms_content TEXT := '<div style="text-align: center;"><h1 style="font-size: 2.5em; font-weight: bold; margin-bottom: 0.5em; color: #111827;">Terms and Conditions</h1><p style="font-size: 1.1em; color: #4b5563; max-width: 600px; margin: 0 auto 2em auto;">Welcome to our website. By accessing and placing an order on this store, you agree to comply with and be bound by the following terms.</p></div><h3>1. General Conditions</h3><p>By agreeing to these Terms, you represent that you are at least the age of majority in your state or province of residence. We reserve the right to refuse service to anyone for any reason at any time.</p><h3>2. Cash on Delivery (COD) & Pricing</h3><p>All prices listed on our store are inclusive of applicable taxes unless stated otherwise. We strictly operate on a Cash on Delivery (COD) basis. Payment must be made in full to the courier representative at the exact moment of delivery. Orders will not be handed over to the customer until the full cash amount is collected by the delivery agent.</p><h3>3. Order Verification</h3><p>Once you submit an order, our support team will contact you to verify your details. Unverified or unreachable phone numbers will result in the automatic cancellation of the order.</p><h3>4. Accuracy of Information</h3><p>You agree to provide current, complete, and accurate purchase and shipping information. We are not responsible for delivery failures resulting from incorrect information provided by the buyer.</p>';
BEGIN
    -- Insert About Us
    INSERT INTO store_pages (store_id, title, slug, content, is_published)
    VALUES (p_store_id, 'About Us', 'about-us', about_content, true)
    ON CONFLICT DO NOTHING;
    
    -- Insert Shipping & Delivery
    INSERT INTO store_pages (store_id, title, slug, content, is_published)
    VALUES (p_store_id, 'Shipping & Delivery', 'shipping', shipping_content, true)
    ON CONFLICT DO NOTHING;
    
    -- Insert FAQ
    INSERT INTO store_pages (store_id, title, slug, content, is_published)
    VALUES (p_store_id, 'FAQ', 'faq', faq_content, true)
    ON CONFLICT DO NOTHING;
    
    -- Insert Privacy Policy
    INSERT INTO store_pages (store_id, title, slug, content, is_published)
    VALUES (p_store_id, 'Privacy Policy & Confidentiality', 'privacy-policy-confidentiality', privacy_content, true)
    ON CONFLICT DO NOTHING;
    
    -- Insert Contact Us
    INSERT INTO store_pages (store_id, title, slug, content, is_published)
    VALUES (p_store_id, 'Contact Us', 'contact-us', contact_content, true)
    ON CONFLICT DO NOTHING;
    
    -- Insert Terms and Conditions
    INSERT INTO store_pages (store_id, title, slug, content, is_published)
    VALUES (p_store_id, 'Terms and Conditions', 'terms-and-conditions', terms_content, true)
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Trigger function
CREATE OR REPLACE FUNCTION trigger_seed_default_store_pages()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM seed_pages_for_store(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Hook trigger to stores table
DROP TRIGGER IF EXISTS on_store_created_seed_pages ON stores;
CREATE TRIGGER on_store_created_seed_pages
    AFTER INSERT ON stores
    FOR EACH ROW
    EXECUTE FUNCTION trigger_seed_default_store_pages();

-- Backfill missing pages for all existing stores
DO $$ 
DECLARE
    store_record RECORD;
BEGIN
    FOR store_record IN SELECT id FROM stores LOOP
        PERFORM seed_pages_for_store(store_record.id);
    END LOOP;
END $$;
