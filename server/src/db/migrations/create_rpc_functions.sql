-- Create RPC functions for likes
CREATE OR REPLACE FUNCTION increment_template_likes(template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE templates
  SET likes_count = COALESCE(likes_count, 0) + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_template_likes(template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE templates
  SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

-- Create RPC functions for comments
CREATE OR REPLACE FUNCTION increment_template_comments(template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE templates
  SET comments_count = COALESCE(comments_count, 0) + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_template_comments(template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE templates
  SET comments_count = GREATEST(COALESCE(comments_count, 0) - 1, 0)
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql; 