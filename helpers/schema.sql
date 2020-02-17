DROP TABLE IF EXISTS public.places;
DROP TABLE IF EXISTS public.timings;
DROP TYPE IF EXISTS "prayers";
DROP TYPE IF EXISTS "status";

CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE "prayers" AS ENUM ('FAJR', 'DHUHR', 'ASR', 'MAGHRIB', 'ISHA', 'JUMUAH');
CREATE TYPE "status" AS ENUM ('ACTIVE', 'INACTIVE');

CREATE TABLE public.places (
	id text PRIMARY KEY DEFAULT uuid_generate_v4(),
	"name" text NOT NULL,
	street_address VARCHAR(10),
	zip_code VARCHAR(10),
	city VARCHAR(10),
	state VARCHAR(2),
	country VARCHAR(2),
	point geometry NOT NULL,
	"status" status DEFAULT 'ACTIVE',
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.timings (
	id SERIAL PRIMARY KEY,
	"name" prayers NOT NULL,
	"time" timestamptz NOT NULL,
	place_id text REFERENCES places(id) NOT NULL,
	updated_at timestamptz NOT NULL DEFAULT now()
);