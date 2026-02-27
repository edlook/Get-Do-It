CREATE TABLE public.profile_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewer_ip text,
  viewed_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a view (anonymous tracking)
CREATE POLICY "Anyone can insert profile views"
  ON public.profile_views FOR INSERT
  WITH CHECK (true);

-- Profile owners can read their own view count
CREATE POLICY "Users can read own profile views"
  ON public.profile_views FOR SELECT
  USING (auth.uid() = profile_id);