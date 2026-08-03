import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { useTranslation } from '../../hooks/useTranslation';
import { CategoryCard } from '../ui/CategoryCard';

import { activeGovernmentCategories } from '../../data/yamlLoader';

interface Category {
  category: string;
  slug: string;
  description: string;
  icon: string;
}

export default function GovernmentActivitySection({
  title,
  description,
}: {
  title?: string;
  description?: string;
} = {}) {
  const { t } = useTranslation();
  const categories = activeGovernmentCategories as Category[];

  return (
    <Section id="government">
      <Heading
        level={2}
        className="mb-0 text-2xl font-extrabold tracking-tight text-primary-800 md:text-3xl"
      >
        {title || t('governmentActivity.title')}
      </Heading>
      <p className="mt-3 mb-8 max-w-2xl text-base leading-relaxed text-gray-600">
        {description || t('governmentActivity.description')}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map(category => (
          <CategoryCard
            key={category.slug}
            to={`/government/${category.slug}`}
            icon={category.icon}
            title={category.category}
            description={category.description}
          />
        ))}
      </div>
    </Section>
  );
}
