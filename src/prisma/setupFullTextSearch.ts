import { PrismaClient } from '../../generated/prisma';

class FullTextSearchSetup {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async run() {
    console.log('Setting up full-text search...');

    try {
      // Add search_vector column if it doesn't exist
      await this.prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='Vacancy' AND column_name='search_vector'
          ) THEN
            ALTER TABLE "Vacancy" ADD COLUMN search_vector tsvector;
          END IF;
        END$$;
      `);

      // Populate existing rows with search vectors
      await this.prisma.$executeRawUnsafe(`
        UPDATE "Vacancy"
        SET search_vector =
          setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
          setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
          setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C') ||
          setweight(to_tsvector('english', coalesce(array_to_string(level, ' '), '')), 'B') ||
          setweight(to_tsvector('english', coalesce(type::text, '')), 'B');
      `);

      // Create GIN index if it doesn't exist
      await this.prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename='Vacancy' AND indexname='idx_vacancies_search'
          ) THEN
            CREATE INDEX idx_vacancies_search ON "Vacancy" USING GIN(search_vector);
          END IF;
        END$$;
      `);

      // Create trigger function
      await this.prisma.$executeRawUnsafe(`
        CREATE OR REPLACE FUNCTION update_search_vector() RETURNS trigger AS $$
        BEGIN
          NEW.search_vector :=
            setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'C') ||
            setweight(to_tsvector('english', coalesce(array_to_string(NEW.level, ' '), '')), 'B') ||
            setweight(to_tsvector('english', coalesce(NEW.type::text, '')), 'B');
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);

      // Create trigger if it doesn't exist
      await this.prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname='trg_update_search_vector'
          ) THEN
            CREATE TRIGGER trg_update_search_vector
            BEFORE INSERT OR UPDATE ON "Vacancy"
            FOR EACH ROW EXECUTE FUNCTION update_search_vector();
          END IF;
        END$$;
      `);

      console.log('Full-text search setup completed!');
    } catch (err) {
      console.error('Error setting up full-text search:', err);
    } finally {
      await this.prisma.$disconnect();
      console.log('Database disconnected.');
    }
  }
}

// Run the setup
const prisma = new PrismaClient();
new FullTextSearchSetup(prisma).run().catch((err) => console.error(err));
