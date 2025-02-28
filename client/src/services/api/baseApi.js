import { supabase } from '../../config/supabase';

/**
 * Base API service with common methods for Supabase interactions
 */
class BaseApiService {
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Get all records with optional query parameters
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Records
   */
  async getAll(options = {}) {
    const {
      select = '*',
      filters = {},
      order = { column: 'created_at', ascending: false },
      limit = 100,
      page = 0
    } = options;

    try {
      let query = supabase
        .from(this.tableName)
        .select(select);
        
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
      
      // Apply ordering
      query = query.order(order.column, { ascending: order.ascending });
      
      // Apply pagination
      if (limit > 0) {
        query = query.range(page * limit, (page + 1) * limit - 1);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Get a single record by ID
   * @param {string} id - Record ID
   * @param {string} select - Fields to select
   * @returns {Promise<Object>} - Record
   */
  async getById(id, select = '*') {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(select)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${this.tableName} by ID:`, error);
      throw error;
    }
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>} - Created record
   */
  async create(data) {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      
      return result;
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing record
   * @param {string} id - Record ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} - Updated record
   */
  async update(id, data) {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return result;
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a record
   * @param {string} id - Record ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      throw error;
    }
  }
}

export default BaseApiService; 