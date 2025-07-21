
-- Add status field to interns table
ALTER TABLE public.interns ADD COLUMN status text NOT NULL DEFAULT 'Active';

-- Add constraint to ensure status is one of the allowed values
ALTER TABLE public.interns ADD CONSTRAINT interns_status_check 
CHECK (status IN ('Active', 'Completed', 'Revoked'));
