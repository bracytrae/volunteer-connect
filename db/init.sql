-- MVP schema and seed data: automatically applied on first Docker database creation.
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS opportunities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  organization VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(150) NOT NULL,
  event_date DATE NOT NULL,
  category VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  opportunity_id INTEGER NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, opportunity_id)
);

CREATE TABLE IF NOT EXISTS service_hours (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  opportunity_id INTEGER NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  hours NUMERIC(5,2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  service_date DATE NOT NULL DEFAULT CURRENT_DATE,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO students (name, email)
VALUES ('Demo Student', 'demo@volunteerconnect.example')
ON CONFLICT (email) DO NOTHING;

INSERT INTO opportunities (title, organization, description, location, event_date, category)
VALUES
  ('Community Food Drive', 'Neighborhood Food Bank', 'Help organize donations and prepare food packages for local families.', 'Community Center', CURRENT_DATE + 7, 'Community'),
  ('Park Cleanup', 'City Parks Volunteers', 'Work with other students to collect litter and care for green spaces.', 'Riverside Park', CURRENT_DATE + 12, 'Environment'),
  ('After-School Tutoring', 'Student Learning Network', 'Support younger students with reading and basic mathematics.', 'Learning Center', CURRENT_DATE + 16, 'Education'),
  ('Winter Clothing Collection', 'Community Outreach Group', 'Sort donated coats, gloves, and warm clothing for neighbors.', 'Campus Student Center', CURRENT_DATE + 21, 'Community');
