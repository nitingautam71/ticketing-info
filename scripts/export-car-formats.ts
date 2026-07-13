// Exports the generated car rental catalog into portable formats (SQL seeds, MongoDB,
// CSV, Elasticsearch bulk, CMS imports, standalone schemas) — mirrors
// scripts/export-cruise-formats.ts. Run scripts/generate-cars.ts first.
//
// Usage: npx tsx scripts/export-car-formats.ts

import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RENTAL_COMPANIES } from '../src/lib/cars/companies';
import { VEHICLES } from '../src/lib/cars/vehicles';
import { LOCATIONS } from '../src/lib/cars/locations';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_ROOT = join(__dirname, '..', 'src', 'data', 'generated', 'cars');
const EXPORT_ROOT = join(__dirname, '..', 'exports');

function cleanSqlValue(val: unknown): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (Array.isArray(val) || typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val)}'`;
}

function main() {
  console.log('Generating car rental export formats...');
  mkdirSync(EXPORT_ROOT, { recursive: true });

  const index = JSON.parse(readFileSync(join(DATA_ROOT, 'listings-index.json'), 'utf-8'));

  // 1. Standalone Prisma schema
  console.log('Exporting Prisma schema...');
  const prismaSchema = `// Standalone Prisma Schema for Car Rental Vertical

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model RentalCompany {
  id               String   @id
  name             String
  slug             String   @unique
  tier             String
  commissionRate   Float
  hqCountry        String
  logoUrl          String?
  description      String
  keySellingPoints String[]
  listings         CarListing[]
}

model VehicleModel {
  id           String  @id
  brand        String
  model        String
  year         Int
  category     String
  transmission String
  fuelType     String
  engine       String
  horsepower   Int
  driveType    String
  doors        Int
  seats        Int
  fuelEconomy  String
  rangeKm      Int
  priceIndex   Float
  listings     CarListing[]
}

model RentalLocation {
  id                 String  @id
  name               String
  slug               String  @unique
  type               String
  city               String
  country            String
  countryCode        String
  region             String
  lat                Float
  lon                Float
  currency           String
  airportCode        String?
  costIndex          Float
  oneWaySupported    Boolean
  crossBorderAllowed Boolean
  listings           CarListing[]
}

model CarListing {
  id                 String  @id
  slug               String  @unique
  title              String
  companyId          String
  vehicleId          String
  locationId         String
  color              String
  mileageKm          Int
  fromPricePerDayUSD Float
  ratingOverall      Float
  reviewCount        Int
  policies           Json
  insuranceOptions   Json
  aiSearchTags       String[]
  company            RentalCompany  @relation(fields: [companyId], references: [id])
  vehicle            VehicleModel   @relation(fields: [vehicleId], references: [id])
  location           RentalLocation @relation(fields: [locationId], references: [id])
}
`;
  writeFileSync(join(EXPORT_ROOT, 'car-schema.prisma'), prismaSchema);

  // 2. Standalone GraphQL schema
  console.log('Exporting GraphQL schema...');
  const gqlSchema = `# Standalone GraphQL Schema for Car Rental Vertical

type RentalCompany {
  id: ID!
  name: String!
  slug: String!
  tier: String!
  commissionRate: Float!
  hqCountry: String!
  logoUrl: String
  description: String!
  keySellingPoints: [String!]!
}

type VehicleModel {
  id: ID!
  brand: String!
  model: String!
  year: Int!
  category: String!
  transmission: String!
  fuelType: String!
  engine: String!
  horsepower: Int!
  driveType: String!
  doors: Int!
  seats: Int!
  fuelEconomy: String!
  rangeKm: Int!
}

type RentalLocation {
  id: ID!
  name: String!
  slug: String!
  type: String!
  city: String!
  country: String!
  countryCode: String!
  region: String!
  lat: Float!
  lon: Float!
  currency: String!
  airportCode: String
  oneWaySupported: Boolean!
  crossBorderAllowed: Boolean!
}

type CarSearchResult {
  id: ID!
  slug: String!
  title: String!
  companyName: String!
  brand: String!
  model: String!
  year: Int!
  category: String!
  transmission: String!
  fuelType: String!
  seats: Int!
  locationName: String!
  city: String!
  country: String!
  fromPricePerDayUSD: Float!
  ratingOverall: Float!
  reviewCount: Int!
}

type Query {
  rentalCompanies: [RentalCompany!]!
  vehicles(category: String, brand: String): [VehicleModel!]!
  locations(country: String, type: String): [RentalLocation!]!
  searchCars(
    q: String
    company: String
    country: String
    category: String
    transmission: String
    maxPricePerDay: Float
    page: Int
    limit: Int
  ): [CarSearchResult!]!
}
`;
  writeFileSync(join(EXPORT_ROOT, 'car.graphql'), gqlSchema);

  // 3. Standalone TypeScript interfaces
  console.log('Exporting TypeScript interfaces...');
  writeFileSync(join(EXPORT_ROOT, 'car-types.ts'), readFileSync(join(__dirname, '..', 'src', 'lib', 'cars', 'types.ts'), 'utf-8'));

  // 4. PostgreSQL seed
  console.log('Exporting PostgreSQL seed...');
  let pgSql = '-- PostgreSQL seed for Car Rentals database\n\n';
  pgSql += 'CREATE TABLE IF NOT EXISTS rental_companies (\n  id VARCHAR(255) PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  slug VARCHAR(255) UNIQUE NOT NULL,\n  tier VARCHAR(50),\n  commission_rate NUMERIC,\n  hq_country VARCHAR(100),\n  description TEXT\n);\n\n';
  RENTAL_COMPANIES.forEach((c) => {
    pgSql += `INSERT INTO rental_companies (id, name, slug, tier, commission_rate, hq_country, description) VALUES (${cleanSqlValue(c.id)}, ${cleanSqlValue(c.name)}, ${cleanSqlValue(c.slug)}, ${cleanSqlValue(c.tier)}, ${cleanSqlValue(c.commissionRate)}, ${cleanSqlValue(c.hqCountry)}, ${cleanSqlValue(c.description)}) ON CONFLICT (id) DO NOTHING;\n`;
  });
  pgSql += '\nCREATE TABLE IF NOT EXISTS vehicle_models (\n  id VARCHAR(255) PRIMARY KEY,\n  brand VARCHAR(100),\n  model VARCHAR(100),\n  year INT,\n  category VARCHAR(50),\n  transmission VARCHAR(20),\n  fuel_type VARCHAR(30),\n  horsepower INT,\n  doors INT,\n  seats INT,\n  price_index NUMERIC\n);\n\n';
  VEHICLES.forEach((v) => {
    pgSql += `INSERT INTO vehicle_models (id, brand, model, year, category, transmission, fuel_type, horsepower, doors, seats, price_index) VALUES (${cleanSqlValue(v.id)}, ${cleanSqlValue(v.brand)}, ${cleanSqlValue(v.model)}, ${cleanSqlValue(v.year)}, ${cleanSqlValue(v.category)}, ${cleanSqlValue(v.transmission)}, ${cleanSqlValue(v.fuelType)}, ${cleanSqlValue(v.horsepower)}, ${cleanSqlValue(v.doors)}, ${cleanSqlValue(v.seats)}, ${cleanSqlValue(v.priceIndex)}) ON CONFLICT (id) DO NOTHING;\n`;
  });
  pgSql += '\nCREATE TABLE IF NOT EXISTS rental_locations (\n  id VARCHAR(255) PRIMARY KEY,\n  name VARCHAR(255),\n  type VARCHAR(30),\n  city VARCHAR(100),\n  country VARCHAR(100),\n  country_code VARCHAR(2),\n  region VARCHAR(30),\n  lat NUMERIC,\n  lon NUMERIC,\n  currency VARCHAR(3),\n  airport_code VARCHAR(3),\n  cost_index NUMERIC\n);\n\n';
  LOCATIONS.forEach((l) => {
    pgSql += `INSERT INTO rental_locations (id, name, type, city, country, country_code, region, lat, lon, currency, airport_code, cost_index) VALUES (${cleanSqlValue(l.id)}, ${cleanSqlValue(l.name)}, ${cleanSqlValue(l.type)}, ${cleanSqlValue(l.city)}, ${cleanSqlValue(l.country)}, ${cleanSqlValue(l.countryCode)}, ${cleanSqlValue(l.region)}, ${cleanSqlValue(l.lat)}, ${cleanSqlValue(l.lon)}, ${cleanSqlValue(l.currency)}, ${cleanSqlValue(l.airportCode ?? null)}, ${cleanSqlValue(l.costIndex)}) ON CONFLICT (id) DO NOTHING;\n`;
  });
  writeFileSync(join(EXPORT_ROOT, 'cars.postgres.sql'), pgSql);

  // 5. MySQL seed
  console.log('Exporting MySQL seed...');
  let mysqlSql = '-- MySQL seed for Car Rentals database\n\n';
  mysqlSql += 'CREATE TABLE IF NOT EXISTS rental_companies (\n  id VARCHAR(255) PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  slug VARCHAR(255) UNIQUE NOT NULL,\n  tier VARCHAR(50),\n  commission_rate DECIMAL(5,2),\n  hq_country VARCHAR(100),\n  description TEXT\n);\n\n';
  RENTAL_COMPANIES.forEach((c) => {
    mysqlSql += `INSERT IGNORE INTO rental_companies (id, name, slug, tier, commission_rate, hq_country, description) VALUES (${cleanSqlValue(c.id)}, ${cleanSqlValue(c.name)}, ${cleanSqlValue(c.slug)}, ${cleanSqlValue(c.tier)}, ${cleanSqlValue(c.commissionRate)}, ${cleanSqlValue(c.hqCountry)}, ${cleanSqlValue(c.description)});\n`;
  });
  writeFileSync(join(EXPORT_ROOT, 'cars.mysql.sql'), mysqlSql);

  // 6. MongoDB JSON
  console.log('Exporting MongoDB JSON...');
  const mongoJson = index.map((l: any, i: number) => ({
    _id: { $oid: i.toString(16).padStart(24, '0') },
    slug: l.slug,
    title: l.title,
    company: l.companyName,
    brand: l.brand,
    model: l.model,
    year: l.year,
    category: l.category,
    transmission: l.transmission,
    fuelType: l.fuelType,
    seats: l.seats,
    location: l.locationName,
    city: l.city,
    country: l.country,
    fromPricePerDayUSD: l.fromPricePerDayUSD,
    rating: l.ratingOverall,
    reviewCount: l.reviewCount,
  }));
  writeFileSync(join(EXPORT_ROOT, 'cars.mongodb.json'), JSON.stringify(mongoJson, null, 2));

  // 7. CSV
  console.log('Exporting CSV...');
  let csv = 'id,slug,title,companyName,brand,model,year,category,transmission,fuelType,seats,locationName,city,country,fromPricePerDayUSD,ratingOverall,reviewCount\n';
  index.forEach((l: any) => {
    csv += `"${l.id}","${l.slug}","${l.title.replace(/"/g, '""')}","${l.companyName.replace(/"/g, '""')}","${l.brand}","${l.model.replace(/"/g, '""')}",${l.year},"${l.category}","${l.transmission}","${l.fuelType}",${l.seats},"${l.locationName.replace(/"/g, '""')}","${l.city}","${l.country}",${l.fromPricePerDayUSD},${l.ratingOverall},${l.reviewCount}\n`;
  });
  writeFileSync(join(EXPORT_ROOT, 'cars.csv'), csv);

  // 8. CMS imports (Strapi / Sanity / WordPress)
  console.log('Exporting CMS import files...');
  const strapiImport = {
    data: index.map((l: any) => ({
      title: l.title,
      slug: l.slug,
      company: l.companyName,
      brand: l.brand,
      model: l.model,
      category: l.category,
      location: l.locationName,
      country: l.country,
      pricePerDay: l.fromPricePerDayUSD,
    })),
  };
  writeFileSync(join(EXPORT_ROOT, 'cars.strapi.json'), JSON.stringify(strapiImport, null, 2));

  const sanityNdjson = index
    .map((l: any) =>
      JSON.stringify({
        _type: 'carRentalListing',
        _id: l.id.toLowerCase(),
        title: l.title,
        slug: { _type: 'slug', current: l.slug },
        company: l.companyName,
        brand: l.brand,
        model: l.model,
        category: l.category,
        location: l.locationName,
        country: l.country,
        pricePerDay: l.fromPricePerDayUSD,
      })
    )
    .join('\n');
  writeFileSync(join(EXPORT_ROOT, 'cars.sanity.ndjson'), sanityNdjson);

  const wpImport = index.map((l: any) => ({
    post_title: l.title,
    post_name: l.slug,
    post_type: 'car_rental',
    post_status: 'publish',
    meta_input: {
      company: l.companyName,
      brand: l.brand,
      model: l.model,
      category: l.category,
      location: l.locationName,
      country: l.country,
      price_per_day: l.fromPricePerDayUSD,
      rating: l.ratingOverall,
    },
  }));
  writeFileSync(join(EXPORT_ROOT, 'cars.wordpress.json'), JSON.stringify(wpImport, null, 2));

  // 9. Elasticsearch bulk documents
  console.log('Exporting Elasticsearch documents...');
  const elasticDocs =
    index
      .flatMap((l: any) => [
        JSON.stringify({ index: { _index: 'car_rentals', _id: l.id } }),
        JSON.stringify({
          title: l.title,
          slug: l.slug,
          company: l.companyName,
          brand: l.brand,
          model: l.model,
          category: l.category,
          transmission: l.transmission,
          fuel_type: l.fuelType,
          seats: l.seats,
          location: l.locationName,
          city: l.city,
          country: l.country,
          price_per_day_usd: l.fromPricePerDayUSD,
          rating: l.ratingOverall,
          tags: l.aiSearchTags,
        }),
      ])
      .join('\n') + '\n';
  writeFileSync(join(EXPORT_ROOT, 'cars.elastic.json'), elasticDocs);

  // 10. JSON Schema for API validation
  console.log('Exporting JSON Schema...');
  const jsonSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'CarRentalListing',
    type: 'object',
    properties: {
      id: { type: 'string' },
      slug: { type: 'string' },
      title: { type: 'string' },
      companyName: { type: 'string' },
      brand: { type: 'string' },
      model: { type: 'string' },
      year: { type: 'integer' },
      category: { type: 'string' },
      transmission: { type: 'string' },
      fuelType: { type: 'string' },
      seats: { type: 'integer' },
      locationName: { type: 'string' },
      country: { type: 'string' },
      fromPricePerDayUSD: { type: 'number' },
      ratingOverall: { type: 'number' },
    },
    required: ['id', 'slug', 'title', 'companyName', 'brand', 'model', 'category', 'locationName', 'country', 'fromPricePerDayUSD'],
  };
  writeFileSync(join(EXPORT_ROOT, 'car-schema.json'), JSON.stringify(jsonSchema, null, 2));

  console.log('All car rental export formats generated successfully in /exports/');
}

main();
