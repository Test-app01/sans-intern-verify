
-- Create interns table to store intern information
CREATE TABLE public.interns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  certificate_id TEXT NOT NULL UNIQUE,
  verification_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default admin user (username: admin, password: sansmedia2024)
-- Password hash for 'sansmedia2024' using bcrypt
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('admin', '$2b$10$8K1p/a0dFlCGYGFMaLYEGePTRIPMZJGWBbFJbhUKNPPf2l3wY8dQ2');

-- Enable Row Level Security
ALTER TABLE public.interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to interns (for verification)
CREATE POLICY "Anyone can read interns for verification" 
  ON public.interns 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Create policies for admin users table (restrict access)
CREATE POLICY "Only service role can access admin_users" 
  ON public.admin_users 
  FOR ALL 
  TO service_role
  USING (true);

-- Create function to generate unique codes
CREATE OR REPLACE FUNCTION generate_unique_code(prefix TEXT DEFAULT 'SM')
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := prefix || UPPER(substring(md5(random()::text) from 1 for 4));
    
    SELECT EXISTS(
      SELECT 1 FROM public.interns 
      WHERE certificate_id = new_code OR verification_code = new_code
    ) INTO code_exists;
    
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;
