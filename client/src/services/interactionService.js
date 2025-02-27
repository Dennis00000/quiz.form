import { supabase } from '../lib/supabase';

class InteractionService {
  async getTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('name, count')
      .order('count', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async likeTemplate(templateId) {
    const { data, error } = await supabase
      .from('template_likes')
      .insert([{ template_id: templateId }]);

    if (error) throw error;
    return data;
  }

  async unlikeTemplate(templateId) {
    const { error } = await supabase
      .from('template_likes')
      .delete()
      .match({ template_id: templateId });

    if (error) throw error;
  }

  async addComment(templateId, content) {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ template_id: templateId, content }]);

    if (error) throw error;
    return data[0];
  }

  async getComments(templateId) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users(name, avatar_url)
      `)
      .eq('template_id', templateId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  async deleteComment(commentId) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .match({ id: commentId });

    if (error) throw error;
  }
}

export default new InteractionService(); 