const serviceSupabase = require('../config/serviceSupabase');

const templateController = {
  // Public routes
  async getAllTemplates(req, res) {
    try {
      const { data, error } = await serviceSupabase
        .from('templates')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      res.json(data);
    } catch (error) {
      console.error('Error getting templates:', error);
      res.status(500).json({
        error: { message: 'Failed to get templates', status: 500 }
      });
    }
  },

  async getTemplate(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await serviceSupabase
        .from('templates')
        .select('*, user:users(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({
          error: { message: 'Template not found', status: 404 }
        });
      }

      res.json(data);
    } catch (error) {
      console.error('Error getting template:', error);
      res.status(500).json({
        error: { message: 'Failed to get template', status: 500 }
      });
    }
  },

  // Protected routes
  async createTemplate(req, res) {
    try {
      const { title, description, topic, questions } = req.body;
      const userId = req.user.userId;

      const { data, error } = await serviceSupabase
        .from('templates')
        .insert([
          {
            title,
            description,
            topic,
            questions,
            user_id: userId,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating template:', error);
      res.status(500).json({
        error: { message: 'Failed to create template', status: 500 }
      });
    }
  },

  async updateTemplate(req, res) {
    try {
      const { id } = req.params;
      const { title, description, topic, questions } = req.body;
      const userId = req.user.userId;

      // Check ownership
      const { data: template, error: checkError } = await serviceSupabase
        .from('templates')
        .select('user_id')
        .eq('id', id)
        .single();

      if (checkError || !template) {
        return res.status(404).json({
          error: { message: 'Template not found', status: 404 }
        });
      }

      if (template.user_id !== userId) {
        return res.status(403).json({
          error: { message: 'Not authorized to update this template', status: 403 }
        });
      }

      const { data, error } = await serviceSupabase
        .from('templates')
        .update({ title, description, topic, questions })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json(data);
    } catch (error) {
      console.error('Error updating template:', error);
      res.status(500).json({
        error: { message: 'Failed to update template', status: 500 }
      });
    }
  },

  async deleteTemplate(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      // Check ownership
      const { data: template, error: checkError } = await serviceSupabase
        .from('templates')
        .select('user_id')
        .eq('id', id)
        .single();

      if (checkError || !template) {
        return res.status(404).json({
          error: { message: 'Template not found', status: 404 }
        });
      }

      if (template.user_id !== userId) {
        return res.status(403).json({
          error: { message: 'Not authorized to delete this template', status: 403 }
        });
      }

      const { error } = await serviceSupabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting template:', error);
      res.status(500).json({
        error: { message: 'Failed to delete template', status: 500 }
      });
    }
  },

  // Admin routes
  async approveTemplate(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await serviceSupabase
        .from('templates')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json(data);
    } catch (error) {
      console.error('Error approving template:', error);
      res.status(500).json({
        error: { message: 'Failed to approve template', status: 500 }
      });
    }
  },

  // Response functions
  async submitResponse(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const { answers } = req.body;

      // Check if template exists and is active
      const { data: template, error: templateError } = await serviceSupabase
        .from('templates')
        .select('status')
        .eq('id', id)
        .single();

      if (templateError || !template) {
        return res.status(404).json({
          error: { message: 'Template not found', status: 404 }
        });
      }

      if (template.status !== 'active') {
        return res.status(400).json({
          error: { message: 'Template is not active', status: 400 }
        });
      }

      const { data, error } = await serviceSupabase
        .from('responses')
        .insert([{
          template_id: id,
          user_id: userId,
          answers
        }])
        .select('*, user:users(name)')
        .single();

      if (error) throw error;

      res.status(201).json(data);
    } catch (error) {
      console.error('Error submitting response:', error);
      res.status(500).json({
        error: { message: 'Failed to submit response', status: 500 }
      });
    }
  },

  async getResponses(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      // Check if user owns the template or is admin
      const { data: template, error: templateError } = await serviceSupabase
        .from('templates')
        .select('user_id')
        .eq('id', id)
        .single();

      if (templateError || !template) {
        return res.status(404).json({
          error: { message: 'Template not found', status: 404 }
        });
      }

      if (template.user_id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          error: { message: 'Not authorized to view responses', status: 403 }
        });
      }

      const { data, error } = await serviceSupabase
        .from('responses')
        .select('*, user:users(name)')
        .eq('template_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(data);
    } catch (error) {
      console.error('Error getting responses:', error);
      res.status(500).json({
        error: { message: 'Failed to get responses', status: 500 }
      });
    }
  },

  // Like functions
  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      // Check if like exists
      const { data: existingLike, error: checkError } = await serviceSupabase
        .from('likes')
        .select()
        .eq('template_id', id)
        .eq('user_id', userId)
        .single();

      if (checkError && !checkError.message.includes('No rows found')) {
        throw checkError;
      }

      if (existingLike) {
        // Unlike
        const { error: deleteError } = await serviceSupabase
          .from('likes')
          .delete()
          .eq('template_id', id)
          .eq('user_id', userId);

        if (deleteError) throw deleteError;
      } else {
        // Like
        const { error: insertError } = await serviceSupabase
          .from('likes')
          .insert([{
            template_id: id,
            user_id: userId
          }]);

        if (insertError) throw insertError;
      }

      // Get updated like count
      const { count, error: countError } = await serviceSupabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('template_id', id);

      if (countError) throw countError;

      res.json({
        liked: !existingLike,
        likes: count
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      res.status(500).json({
        error: { message: 'Failed to toggle like', status: 500 }
      });
    }
  },

  // Comment functions
  async addComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const { content } = req.body;

      const { data, error } = await serviceSupabase
        .from('comments')
        .insert([{
          template_id: id,
          user_id: userId,
          content
        }])
        .select('*, user:users(name)')
        .single();

      if (error) throw error;

      res.status(201).json(data);
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({
        error: { message: 'Failed to add comment', status: 500 }
      });
    }
  },

  async deleteComment(req, res) {
    try {
      const { id, commentId } = req.params;
      const userId = req.user.userId;

      // Check if user owns the comment or is admin
      const { data: comment, error: checkError } = await serviceSupabase
        .from('comments')
        .select('user_id')
        .eq('id', commentId)
        .eq('template_id', id)
        .single();

      if (checkError || !comment) {
        return res.status(404).json({
          error: { message: 'Comment not found', status: 404 }
        });
      }

      if (comment.user_id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          error: { message: 'Not authorized to delete this comment', status: 403 }
        });
      }

      const { error } = await serviceSupabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('template_id', id);

      if (error) throw error;

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({
        error: { message: 'Failed to delete comment', status: 500 }
      });
    }
  }
};

module.exports = templateController; 