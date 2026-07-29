import { useTranslation } from 'react-i18next';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left section with title and search */}
          <div className="animate-fade-in">
            <Text transform="uppercase">Welcome to</Text>
            <Heading>{import.meta.env.VITE_GOVERNMENT_NAME}</Heading>
            <Text>{t('hero.subtitle')}</Text>
          </div>
        </div>
      </div>
    </div>
  );
}
