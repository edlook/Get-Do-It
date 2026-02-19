
-- Create task status enum
CREATE TYPE public.task_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  budget_from INTEGER,
  budget_to INTEGER,
  city TEXT NOT NULL DEFAULT '',
  address TEXT,
  deadline DATE,
  status task_status NOT NULL DEFAULT 'open',
  responses_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Everyone can view open tasks
CREATE POLICY "Open tasks are viewable by everyone"
ON public.tasks FOR SELECT
USING (status = 'open' OR auth.uid() = user_id);

-- Authenticated users can create tasks
CREATE POLICY "Users can create tasks"
ON public.tasks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update own tasks
CREATE POLICY "Users can update own tasks"
ON public.tasks FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete own tasks
CREATE POLICY "Users can delete own tasks"
ON public.tasks FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
