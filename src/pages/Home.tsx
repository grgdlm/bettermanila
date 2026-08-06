import { useTranslation } from 'react-i18next';
import Hero from '../components/sections/Hero';
import UpcomingHolidays from '../components/home/UpcomingHolidays';
import ServicesSection from '../components/home/ServicesSection';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        keywords={t('seo.home.keywords')}
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
