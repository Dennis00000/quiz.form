require('dotenv').config();
const db = require('../config/database');
const users = require('./seeds/001_users');
const templates = require('./seeds/002_templates');

async function seed() {
  try {
    // Insert users
    for (const user of users) {
      await db.query(
        `INSERT INTO users (id, name, email, password_hash, role, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO NOTHING`,
        [user.id, user.name, user.email, user.password_hash, user.role, user.status]
      );
    }

    // Insert templates and related data
    for (const template of templates) {
      const { id, title, description, topic, is_public, questions, tags } = template;
      
      // Insert template
      await db.query(
        `INSERT INTO templates (id, user_id, title, description, topic, is_public)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, users[0].id, title, description, topic, is_public]
      );

      // Insert questions
      for (const [index, question] of questions.entries()) {
        await db.query(
          `INSERT INTO questions (template_id, title, type, validation, order_index, show_in_table)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, question.title, question.type, question.validation, index, question.show_in_table]
        );
      }

      // Insert tags
      for (const tagName of tags) {
        // Create tag if it doesn't exist
        const { rows: [tag] } = await db.query(
          `INSERT INTO tags (name) VALUES ($1)
           ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
           RETURNING id`,
          [tagName]
        );

        // Link tag to template
        await db.query(
          `INSERT INTO template_tags (template_id, tag_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [id, tag.id]
        );
      }
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await db.pool.end();
  }
}

seed(); 