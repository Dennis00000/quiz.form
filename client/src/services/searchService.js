import { supabase } from '../lib/supabase';

class SearchService {
  async searchTemplates(query, filters = {}) {
    let searchQuery = supabase
      .from('templates')
      .select(`
        *,
        user:users(name),
        tags:template_tags(tag:tags(name)),
        likes:template_likes(count),
        _count { responses:template_responses(count) }
      `)
      .textSearch('fts', query, {
        type: 'websearch',
        config: 'english'
      });

    // Apply filters
    if (filters.topic) {
      searchQuery = searchQuery.eq('topic', filters.topic);
    }
    if (filters.tag) {
      searchQuery = searchQuery.contains('tags', [{ name: filters.tag }]);
    }
    if (filters.author) {
      searchQuery = searchQuery.eq('user_id', filters.author);
    }

    const { data, error } = await searchQuery
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data;
  }

  async getPopularTags(limit = 20) {
    const { data, error } = await supabase
      .from('tags')
      .select('name, template_count')
      .order('template_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async getPopularTemplates(limit = 5) {
    const { data, error } = await supabase
      .from('templates')
      .select(`
        *,
        user:users(name),
        _count { responses:template_responses(count) }
      `)
      .order('response_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}

export default new SearchService(); 