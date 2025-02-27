import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import StatsCard from './StatsCard';
import UserList from './UserList';
import {
  UsersIcon,
  DocumentIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center">{t('common.loading')}</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('admin.dashboard')}
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title={t('admin.totalUsers')}
          value={stats.userCount}
          icon={UsersIcon}
          color="blue"
        />
        <StatsCard
          title={t('admin.activeUsers')}
          value={stats.activeUsers}
          icon={UserGroupIcon}
          color="green"
        />
        <StatsCard
          title={t('admin.totalTemplates')}
          value={stats.templateCount}
          icon={DocumentIcon}
          color="purple"
        />
        <StatsCard
          title={t('admin.totalResponses')}
          value={stats.responseCount}
          icon={ClipboardDocumentListIcon}
          color="yellow"
        />
      </div>

      <UserList />
    </div>
  );
};

export default Dashboard; 