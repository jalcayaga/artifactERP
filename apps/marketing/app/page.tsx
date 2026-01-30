
import Header from '../components/Header';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import ParticleBackground from '../components/ParticleBackground';

export default function Home() {
    return (
        <>
            <ParticleBackground />
            <Header />
            <main>
                <Hero />
                <SocialProof />
                <HowItWorks />
                <Services />
                <Pricing />
                <Contact />
            </main>
            <Chatbot />
            <Footer />
        </>
    );
}
