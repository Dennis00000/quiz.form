import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import SearchBar from '../components/search/SearchBar';
import TemplateCard from '../components/templates/TemplateCard';
import { toast } from 'react-hot-toast';

const SearchPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get('q');
  const tags = searchParams.get('tags')?.split(',');
  const topic = searchParams.get('topic');
  const sort = searchParams.get('sort') || 'relevance';

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await api.get('/search', {
          params: { q: query, tags, topic, sort }
        });
        setResults(response.data);
      } catch (error) {
        toast.error(t('search.error'));
      } finally {
        setLoading(false);
      }
    };

    if (query || tags || topic) {
      fetchResults();
    }
  }, [query, tags, topic, sort, t]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <SearchBar />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">{t('common.loading')}</div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('search.noResults')}</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage; 