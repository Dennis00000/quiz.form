import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../utils/errorHandler';

/**
 * Service for template-related API calls
 */
const templateService = {
  /**
   * Get all templates with optional filtering
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} - Templates array
   */
  async getTemplates(options = {}) {
    try {
      const {
        topic,
        is_public,
        user_id,
        search,
        sort_by = 'created_at',
        sort_order = 'desc',
        limit = 20,
        page = 1
      } = options;
      
      // Calculate offset for pagination
      const offset = (page - 1) * limit;
      
      // Start building the query
      let query = supabase
        .from('templates')
        .select(`
          *,
          profiles:user_id (name, avatar_url),
          likes_count:template_likes (count)
        `, { count: 'exact' });
      
      // Apply filters
      if (topic) {
        query = query.eq('topic', topic);
      }
      
      if (is_public !== undefined) {
        query = query.eq('is_public', is_public);
      }
      
      if (user_id) {
        query = query.eq('user_id', user_id);
      }
      
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }
      
      // Apply sorting
      query = query.order(sort_by, { ascending: sort_order === 'asc' });
      
      // Apply pagination
      query = query.range(offset, offset + limit - 1);
      
      const { data, error, count } = await query;
      
      if (error) {
        throw error;
      }
      
      return { 
        templates: data || [], 
        count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      handleSupabaseError(error, 'Failed to fetch templates');
      throw error;
    }
  },
  
  /**
   * Get a template by ID
   * @param {string} id - Template ID
   * @returns {Promise<Object>} - Template object
   */
  async getTemplate(id) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select(`
          *,
          profiles:user_id (name, avatar_url),
          likes_count:template_likes (count)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      handleSupabaseError(error, 'Failed to fetch template');
      throw error;
    }
  },
  
  /**
   * Create a new template
   * @param {Object} template - Template data
   * @returns {Promise<Object>} - Created template
   */
  async createTemplate(template) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert(template)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      handleSupabaseError(error, 'Failed to create template');
      throw error;
    }
  },
  
  /**
   * Update a template
   * @param {string} id - Template ID
   * @param {Object} updates - Template updates
   * @returns {Promise<Object>} - Updated template
   */
  async updateTemplate(id, updates) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      handleSupabaseError(error, 'Failed to update template');
      throw error;
    }
  },
  
  /**
   * Delete a template
   * @param {string} id - Template ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteTemplate(id) {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      handleSupabaseError(error, 'Failed to delete template');
      throw error;
    }
  },
  
  /**
   * Toggle like on a template
   * @param {string} templateId - Template ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Like status
   */
  async toggleLike(templateId, userId) {
    try {
      // Check if the user has already liked the template
      const { data: existingLike, error: checkError } = await supabase
        .from('template_likes')
        .select('*')
        .eq('template_id', templateId)
        .eq('user_id', userId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      let action;
      
      if (existingLike) {
        // Unlike the template
        const { error: unlikeError } = await supabase
          .from('template_likes')
          .delete()
          .eq('template_id', templateId)
          .eq('user_id', userId);
        
        if (unlikeError) {
          throw unlikeError;
        }
        
        action = 'unliked';
      } else {
        // Like the template
        const { error: likeError } = await supabase
          .from('template_likes')
          .insert({
            template_id: templateId,
            user_id: userId
          });
        
        if (likeError) {
          throw likeError;
        }
        
        action = 'liked';
      }
      
      // Get the updated like count
      const { data: likeCount, error: countError } = await supabase
        .from('template_likes')
        .select('*', { count: 'exact' })
        .eq('template_id', templateId);
      
      if (countError) {
        throw countError;
      }
      
      return {
        action,
        likes: likeCount.length
      };
    } catch (error) {
      handleSupabaseError(error, 'Failed to toggle like');
      throw error;
    }
  }
};

export default templateService; 