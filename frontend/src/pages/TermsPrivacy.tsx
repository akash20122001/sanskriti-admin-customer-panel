import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Scale, Shield, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function TermsPrivacy() {
    const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();

    const handleBackToHome = () => {
        if (isAuthenticated && user) {
            // Navigate to appropriate dashboard based on role
            const dashboardPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/customer/dashboard';
            navigate(dashboardPath);
        } else {
            // Not logged in, go to login page
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={handleBackToHome}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Home</span>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold font-display text-gray-900 mb-2">
                        Terms & Privacy
                    </h1>
                    <p className="text-gray-600">
                        Please read our terms and conditions and privacy policy carefully
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('terms')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all ${activeTab === 'terms'
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Scale className="w-5 h-5" />
                        Terms & Conditions
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all ${activeTab === 'privacy'
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Shield className="w-5 h-5" />
                        Privacy Policy
                    </button>
                </div>

                {/* Content Card */}
                <Card className="shadow-xl">
                    <CardContent className="p-8">
                        {activeTab === 'terms' ? <TermsContent /> : <PrivacyContent />}
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
        </div>
    );
}

function TermsContent() {
    return (
        <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms and Conditions</h2>

            <Section title="1. Acceptance of Terms">
                <p>
                    Welcome to Sanskriti the Antique. We provide our professional services to you subject to the following conditions.
                    If you visit or utilize our services at our website, you accept these terms and conditions. Please read them carefully.
                    When you use any current or future service from Sanskriti the Antique, whether or not included on our website, you will
                    also be subject to the guidelines and conditions applicable to such specific service.
                </p>
            </Section>

            <Section title="2. Electronic Communications">
                <p>
                    When you visit our website or send e-mails to us, you are communicating with us electronically. You consent to receive
                    communications from us electronically. We will communicate with you by e-mail or by posting notices on this site. You
                    agree that all agreements, notices, disclosures, and other communications provided to you electronically satisfy any
                    legal requirement that such communications be in writing.
                </p>
            </Section>

            <Section title="3. Website Access and Use">
                <p>
                    We grant you a limited permission to access and make personal use of this site. This permission does not include:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Any resale or commercial use of this site or its contents.</li>
                    <li>Any collection and use of service listings, descriptions, or price strategy data.</li>
                    <li>Any derivative use of this site or its contents.</li>
                    <li>Any downloading or copying of account information for the benefit of another merchant.</li>
                    <li>Any use of data mining, robots, or similar data gathering and extraction tools.</li>
                    <li>This site may not be reproduced, duplicated, copied, sold, or otherwise exploited for any commercial purpose without express written consent.</li>
                </ul>
            </Section>

            <Section title="4. Trademark and Copyright">
                <p>
                    All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads,
                    data compilations, and software, is the property of Sanskriti the Antique or its content suppliers. The compilation of
                    all content on this site is our exclusive property. Sanskriti the Antique reserves the right to take legal action against
                    any violation of its trademarks. Please note that for services involving third-party platforms or vendors, we assume no
                    liability regarding the design or trademark of those specific external products or entities, though we reserve the right
                    to remove such content from our inventory or website at our discretion.
                </p>
            </Section>

            <Section title="5. Account Responsibility">
                <p>
                    In providing account management services, you are responsible for maintaining the confidentiality of your account and
                    password and for restricting access to your computer. You agree to accept responsibility for all activities that occur
                    under your account. While we assist in resolving breaches, Sanskriti the Antique will not be held liable for any breach
                    by a third party with respect to your registered account. We reserve the right to refuse service, terminate accounts, or
                    edit content in our sole discretion.
                </p>
            </Section>

            <Section title="6. User-Generated Content">
                <p>
                    Visitors may post reviews or comments as long as the content is not illegal, obscene, threatening, defamatory, or
                    infringing on intellectual property rights. By posting content, you grant Sanskriti the Antique a nonexclusive,
                    royalty-free, perpetual, and irrevocable right to use, reproduce, modify, and display such content worldwide. You
                    represent that you own the rights to the content you post and will indemnify Sanskriti the Antique for all claims
                    resulting from content you supply.
                </p>
            </Section>

            <Section title="7. Service Accuracy and Pricing">
                <p>
                    Regarding our price strategy and ads optimization, we attempt to be as accurate as possible. However, we do not warrant
                    that service descriptions or other content are error-free.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li><strong>Pricing:</strong> All prices for services are in Indian rupees.</li>
                    <li><strong>Discretion:</strong> Prices and services may change at our discretion or upon any prevailing law in force.</li>
                    <li><strong>Risk:</strong> For any physical items related to inventory management, the risk of loss passes to you upon our delivery to the carrier pursuant to a shipment contract.</li>
                </ul>
            </Section>

            <Section title="8. Third-Party Links">
                <p>
                    Our website may contain links to "Linked Sites" that are not under our control. Sanskriti the Antique is not responsible
                    for the contents of any Linked Site or any changes or updates therein. These links are provided only as a convenience,
                    and their inclusion does not imply endorsement.
                </p>
            </Section>

            <Section title="9. Provision of Inventory and Vendor Liability">
                <p>
                    As we provide inventory to our sellers, it is explicitly stated that many products are designed by various vendors.
                    Sanskriti the Antique bears no liability whatsoever regarding the design or trademark of these vendor-supplied products.
                    However, we reserve the right to remove any article or post from our website and inventory at our sole discretion if a
                    violation is identified.
                </p>
            </Section>

            <Section title="10. Risk of Loss and Shipment">
                <p>
                    For all inventory items managed or purchased through our platform, the risk of loss passes to the recipient/seller upon
                    our delivery to the carrier, pursuant to a shipment contract. While we strive for accuracy in product descriptions, we
                    do not warrant that such descriptions are error-free; the sole remedy for a product not being as described is its return
                    in unused condition.
                </p>
            </Section>

            <Section title="11. Account Management and Security">
                <p>
                    Sellers and clients are responsible for maintaining the confidentiality of their accounts and passwords. In your capacity
                    as a user of our account management services, you agree to accept responsibility for all activities occurring under your
                    account. If a breach occurs by a third party, Sanskriti the Antique will not be held liable, though we request immediate
                    notification via email to assist in resolving the matter.
                </p>
            </Section>

            <Section title="12. Permitted Use and Commercial Restrictions">
                <p>
                    We grant a limited, non-exclusive permission to access our platform. However, users are prohibited from:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Any resale or commercial use of the site or its contents without express written consent.</li>
                    <li>Collecting or using service listings, descriptions, or pricing data for the benefit of another merchant.</li>
                    <li>Reproducing, duplicating, or exploiting any portion of the site for commercial purposes.</li>
                </ul>
            </Section>
        </div>
    );
}

function PrivacyContent() {
    return (
        <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Policy</h2>

            <Section title="1. Governance">
                <p>
                    Your visit to our website and use of our services is governed by this Privacy Policy to help you understand our practices.
                </p>
            </Section>

            <Section title="2. Data Collection and Electronic Interaction">
                <p>
                    By communicating with us electronically, you consent to our collection of information necessary to provide account
                    management and inventory management services. This includes communications via e-mail and notices posted on the site.
                </p>
            </Section>

            <Section title="3. Data Compilation">
                <p>
                    All data compilations and software used to optimize your ads or manage your inventory are the property of Sanskriti the
                    Antique or its software suppliers.
                </p>
            </Section>

            <Section title="4. Account Security">
                <p>
                    We prioritize the confidentiality of your account. In the event of a security breach, please inform us via email
                    immediately so we may assist in resolving the matter.
                </p>
            </Section>

            <Section title="5. Third-Party Interactions">
                <p>
                    We are not responsible for the privacy practices or transmissions received from any Linked Sites provided for your
                    convenience. We encourage users to verify the accuracy of information and the privacy standards of third parties
                    independently.
                </p>
            </Section>

            <Section title="6. Data Collection for Inventory and Account Services">
                <p>
                    Your visit to Sanskriti the Antique and the use of our account and inventory management services are governed by this
                    Privacy Policy. We collect and manage data to provide optimized services, and all such data compilations and software
                    are the exclusive property of Sanskriti the Antique or its suppliers.
                </p>
            </Section>

            <Section title="7. Third-Party Links">
                <p>
                    Our platform may contain links to "Linked Sites" not under our control. We are not responsible for the privacy practices
                    or content of these external sites, and we encourage users to verify the accuracy of information on those sites
                    independently.
                </p>
            </Section>

            <Section title="8. User-Generated Content and Privacy">
                <p>
                    When you post reviews or comments, you represent that you own the rights to that content and that it does not infringe
                    on the privacy or intellectual property rights of others. By posting, you grant us a worldwide, perpetual right to use
                    and modify that content.
                </p>
            </Section>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
            <div className="text-gray-700 leading-relaxed space-y-3">
                {children}
            </div>
        </div>
    );
}
