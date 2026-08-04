import Hero from '../components/sections/Hero';
import UpcomingHolidays from '../components/home/UpcomingHolidays';
import ServicesSection from '../components/home/ServicesSection';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description="An independent, volunteer-built guide to City of Manila services, departments, budgets and ordinances, in plain language."
        keywords="Manila, City of Manila, city services, barangay, hotlines, business permit, transparency"
      />
      <div>
        <Hero />
        <ServicesSection />
        <GovernmentActivitySection />
        <UpcomingHolidays />
      </div>
    </>
  );
};

export default Home;
