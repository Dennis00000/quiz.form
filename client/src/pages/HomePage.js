import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import supabase from '../config/supabase';
import SearchBar from '../components/search/SearchBar';
import TemplateCard from '../components/templates/TemplateCard';
import { toast } from 'react-hot-toast';

const HomePage = () => {
  const { t } = useTranslation();
  const [latestTemplates, setLatestTemplates] = useState([]);
  const [popularTemplates, setPopularTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      // Fetch latest templates
      const { data: latest, error: latestError } = await supabase
        .from('templates')
        .select(`
          *,
          users:user_id (id, name),
          likes (count)
        `)
        .eq('privacy', 'public')
        .order('created_at', { ascending: false })
        .limit(6);

      if (latestError) throw latestError;

      // Fetch popular templates
      const { data: popular, error: popularError } = await supabase
        .from('templates')
        .select(`
          *,
          users:user_id (id, name),
          likes (count)
        `)
        .eq('privacy', 'public')
        .order('likes_count', { ascending: false })
        .limit(6);

      if (popularError) throw popularError;

      setLatestTemplates(latest);
      setPopularTemplates(popular);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error(t('errors.fetchTemplates'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {t('home.welcome')}
        </h1>
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {t('home.latestTemplates')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {t('home.popularTemplates')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage; 