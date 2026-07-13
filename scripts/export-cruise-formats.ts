import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CRUISE_LINES } from '../src/lib/cruises/cruise-lines';
import { SHIPS } from '../src/lib/cruises/ships';
import { PORTS } from '../src/lib/cruises/ports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_ROOT = join(__dirname, '..', 'src', 'data', 'generated', 'cruises');
const EXPORT_ROOT = join(__dirname, '..', 'exports');

function cleanSqlValue(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (Array.isArray(val) || typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${val.toString()}'`;
}

function main() {
  console.log('Generating export formats...');
  mkdirSync(EXPORT_ROOT, { recursive: true });

  // Load index data
  const indexRaw = readFileSync(join(DATA_ROOT, 'packages-index.json'), 'utf-8');
  const index = JSON.parse(indexRaw);

  // 1. Standalone Prisma Schema
  console.log('Exporting Prisma schema...');
  const prismaSchema = `// Standalone Prisma Schema for Cruise Vertical

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model CruiseLine {
  id               String   @id
  name             String
  slug             String   @unique
  logoUrl          String?
  category         String[]
  riverCruise      Boolean
  expeditionCruise Boolean
  adultsOnly       Boolean
  luxuryLevel      String
  commissionRate   Float
  hqCountry        String
  description      String
  keySellingPoints String[]
  ships            Ship[]
}

model Ship {
  id                String   @id
  cruiseLineId      String
  cruiseLineName    String
  name              String
  shipClass         String?
  launchYear        Int
  lastRenovation    Int?
  passengerCapacity Int
  crewSize          Int
  tonnage           Float
  lengthMeters      Float
  decks             Int
  totalCabins       Int
  maxOccupancy      Int
  averageAge        Float
  rating            Float
  description       String
  features          String[]
  cruiseLine        CruiseLine @relation(fields: [cruiseLineId], references: [id])
}

model CruisePort {
  id                 String   @id
  name               String
  code               String
  city               String
  country            String
  countryCode        String
  region             String
  lat                Float
  lon                Float
  overview           String
  history            String?
  thingsToDo         String[]
  topAttractions     String[]
  restaurants        String[]
  shopping           String[]
  beaches            String[]
  museums            String[]
  walkingTours       String[]
  transportation     String
  estimatedBudgetUSD Float
  accessibility      String
  safety             String
  currency           String
  languages          String[]
  timeZone           String
  visaSummary        String
}
`;
  writeFileSync(join(EXPORT_ROOT, 'cruise-schema.prisma'), prismaSchema);

  // 2. Standalone GraphQL Schema
  console.log('Exporting GraphQL schema...');
  const gqlSchema = `# Standalone GraphQL Schema for Cruise Vertical

type CruiseLine {
  id: ID!
  name: String!
  slug: String!
  logoUrl: String
  category: [String!]!
  riverCruise: Boolean!
  expeditionCruise: Boolean!
  adultsOnly: Boolean!
  luxuryLevel: String!
  commissionRate: Float!
  hqCountry: String!
  description: String!
  keySellingPoints: [String!]!
}

type ShipSpecs {
  name: String!
  shipClass: String
  launchYear: Int!
  lastRenovation: Int
  passengerCapacity: Int!
  crewSize: Int!
  tonnage: Float!
  lengthMeters: Float!
  decks: Int!
  totalCabins: Int!
  maxOccupancy: Int!
  averageAge: Float!
  rating: Float!
}

type Ship {
  id: ID!
  cruiseLineId: ID!
  cruiseLineName: String!
  specs: ShipSpecs!
  description: String!
  features: [String!]!
}

type CruisePort {
  id: ID!
  name: String!
  code: String!
  city: String!
  country: String!
  countryCode: String!
  region: String!
  lat: Float!
  lon: Float!
  overview: String!
  history: String
  thingsToDo: [String!]!
  topAttractions: [String!]!
  restaurants: [String!]!
  shopping: [String!]!
  beaches: [String!]!
  museums: [String!]!
  walkingTours: [String!]!
  transportation: String!
  estimatedBudgetUSD: Float!
  accessibility: String!
  safety: String!
  currency: String!
  languages: [String!]!
  timeZone: String!
  visaSummary: String!
}

type Query {
  cruiseLines: [CruiseLine!]!
  ships(cruiseLineId: ID): [Ship!]!
  ports(region: String): [CruisePort!]!
  searchCruises(
    destination: String
    duration: String
    cruiseLine: String
    maxPrice: Float
  ): [CruiseSearchResult!]!
}

type CruiseSearchResult {
  id: ID!
  slug: String!
  title: String!
  cruiseLineName: String!
  shipName: String!
  destination: String!
  departurePortName: String!
  arrivalPortName: String!
  durationNights: Int!
  categories: [String!]!
  fromPriceUSD: Float!
  ratingOverall: Float!
  reviewCount: Int!
}
`;
  writeFileSync(join(EXPORT_ROOT, 'cruise.graphql'), gqlSchema);

  // 3. Standalone TypeScript interfaces
  console.log('Exporting TypeScript interfaces...');
  const tsContent = readFileSync(join(__dirname, '..', 'src', 'lib', 'cruises', 'types.ts'), 'utf-8');
  writeFileSync(join(EXPORT_ROOT, 'cruise-types.ts'), tsContent);

  // 4. PostgreSQL Seed
  console.log('Exporting PostgreSQL seed...');
  let pgSql = '-- PostgreSQL seed for Cruises database\n\n';
  
  // Insert CruiseLines
  pgSql += 'CREATE TABLE IF NOT EXISTS cruise_lines (\n  id VARCHAR(255) PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  slug VARCHAR(255) UNIQUE NOT NULL,\n  river_cruise BOOLEAN,\n  expedition_cruise BOOLEAN,\n  adults_only BOOLEAN,\n  luxury_level VARCHAR(50),\n  commission_rate NUMERIC,\n  hq_country VARCHAR(100),\n  description TEXT\n);\n\n';
  CRUISE_LINES.forEach((c) => {
    pgSql += `INSERT INTO cruise_lines (id, name, slug, river_cruise, expedition_cruise, adults_only, luxury_level, commission_rate, hq_country, description) VALUES (${cleanSqlValue(c.id)}, ${cleanSqlValue(c.name)}, ${cleanSqlValue(c.slug)}, ${cleanSqlValue(c.riverCruise)}, ${cleanSqlValue(c.expeditionCruise)}, ${cleanSqlValue(c.adultsOnly)}, ${cleanSqlValue(c.luxuryLevel)}, ${cleanSqlValue(c.commissionRate)}, ${cleanSqlValue(c.hqCountry)}, ${cleanSqlValue(c.description)}) ON CONFLICT (id) DO NOTHING;\n`;
  });

  // Insert Ships
  pgSql += '\nCREATE TABLE IF NOT EXISTS ships (\n  id VARCHAR(255) PRIMARY KEY,\n  cruise_line_id VARCHAR(255),\n  name VARCHAR(255),\n  tonnage INT,\n  passenger_capacity INT,\n  crew_size INT,\n  launch_year INT\n);\n\n';
  SHIPS.forEach((s) => {
    pgSql += `INSERT INTO ships (id, cruise_line_id, name, tonnage, passenger_capacity, crew_size, launch_year) VALUES (${cleanSqlValue(s.id)}, ${cleanSqlValue(s.cruiseLineId)}, ${cleanSqlValue(s.specs.name)}, ${cleanSqlValue(s.specs.tonnage)}, ${cleanSqlValue(s.specs.passengerCapacity)}, ${cleanSqlValue(s.specs.crewSize)}, ${cleanSqlValue(s.specs.launchYear)}) ON CONFLICT (id) DO NOTHING;\n`;
  });
  writeFileSync(join(EXPORT_ROOT, 'cruises.postgres.sql'), pgSql);

  // 5. MySQL Seed
  console.log('Exporting MySQL seed...');
  let mysqlSql = '-- MySQL seed for Cruises database\n\n';
  mysqlSql += 'CREATE TABLE IF NOT EXISTS cruise_lines (\n  id VARCHAR(255) PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  slug VARCHAR(255) UNIQUE NOT NULL,\n  river_cruise BOOLEAN,\n  expedition_cruise BOOLEAN,\n  adults_only BOOLEAN,\n  luxury_level VARCHAR(50),\n  commission_rate DECIMAL(5,2),\n  hq_country VARCHAR(100),\n  description TEXT\n);\n\n';
  CRUISE_LINES.forEach((c) => {
    mysqlSql += `INSERT IGNORE INTO cruise_lines (id, name, slug, river_cruise, expedition_cruise, adults_only, luxury_level, commission_rate, hq_country, description) VALUES (${cleanSqlValue(c.id)}, ${cleanSqlValue(c.name)}, ${cleanSqlValue(c.slug)}, ${cleanSqlValue(c.riverCruise)}, ${cleanSqlValue(c.expeditionCruise)}, ${cleanSqlValue(c.adultsOnly)}, ${cleanSqlValue(c.luxuryLevel)}, ${cleanSqlValue(c.commissionRate)}, ${cleanSqlValue(c.hqCountry)}, ${cleanSqlValue(c.description)});\n`;
  });
  writeFileSync(join(EXPORT_ROOT, 'cruises.mysql.sql'), mysqlSql);

  // 6. MongoDB JSON
  console.log('Exporting MongoDB JSON...');
  const mongoJson = index.map((p: any) => ({
    _id: { $oid: p.id.replace('PKG-CRUISE-', '').toLowerCase().padEnd(24, '0').slice(0, 24) },
    slug: p.slug,
    title: p.title,
    cruiseLineName: p.cruiseLineName,
    shipName: p.shipName,
    destination: p.destination,
    departurePortName: p.departurePortName,
    arrivalPortName: p.arrivalPortName,
    durationNights: p.durationNights,
    fromPriceUSD: p.fromPriceUSD,
    ratingOverall: p.ratingOverall,
    reviewCount: p.reviewCount
  }));
  writeFileSync(join(EXPORT_ROOT, 'cruises.mongodb.json'), JSON.stringify(mongoJson, null, 2));

  // 7. CSV
  console.log('Exporting CSV...');
  let csv = 'id,slug,title,cruiseLineName,shipName,destination,departurePortName,arrivalPortName,durationNights,fromPriceUSD,ratingOverall,reviewCount\n';
  index.forEach((p: any) => {
    csv += `"${p.id}","${p.slug}","${p.title.replace(/"/g, '""')}","${p.cruiseLineName.replace(/"/g, '""')}","${p.shipName.replace(/"/g, '""')}","${p.destination}","${p.departurePortName}","${p.arrivalPortName}",${p.durationNights},${p.fromPriceUSD},${p.ratingOverall},${p.reviewCount}\n`;
  });
  writeFileSync(join(EXPORT_ROOT, 'cruises.csv'), csv);

  // 8. Strapi / Sanity / WordPress Imports
  console.log('Exporting CMS import files...');
  
  // Strapi import
  const strapiImport = {
    data: index.map((p: any) => ({
      title: p.title,
      slug: p.slug,
      cruiseLine: p.cruiseLineName,
      ship: p.shipName,
      destination: p.destination,
      durationNights: p.durationNights,
      price: p.fromPriceUSD
    }))
  };
  writeFileSync(join(EXPORT_ROOT, 'cruises.strapi.json'), JSON.stringify(strapiImport, null, 2));

  // Sanity NDJSON dataset
  const sanityNdjson = index.map((p: any) => JSON.stringify({
    _type: 'cruisePackage',
    _id: p.id.toLowerCase(),
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    cruiseLine: p.cruiseLineName,
    ship: p.shipName,
    destination: p.destination,
    duration: p.durationNights,
    price: p.fromPriceUSD
  })).join('\n');
  writeFileSync(join(EXPORT_ROOT, 'cruises.sanity.ndjson'), sanityNdjson);

  // WordPress Import JSON
  const wpImport = index.map((p: any) => ({
    post_title: p.title,
    post_name: p.slug,
    post_type: 'cruise',
    post_status: 'publish',
    meta_input: {
      cruise_line: p.cruiseLineName,
      ship_name: p.shipName,
      destination: p.destination,
      duration_nights: p.durationNights,
      starting_price: p.fromPriceUSD,
      rating: p.ratingOverall
    }
  }));
  writeFileSync(join(EXPORT_ROOT, 'cruises.wordpress.json'), JSON.stringify(wpImport, null, 2));

  // 9. Elasticsearch Index Documents
  console.log('Exporting Elasticsearch documents...');
  const elasticDocs = index.flatMap((p: any) => [
    JSON.stringify({ index: { _index: 'cruises', _id: p.id } }),
    JSON.stringify({
      title: p.title,
      slug: p.slug,
      cruise_line: p.cruiseLineName,
      ship: p.shipName,
      destination: p.destination,
      duration_nights: p.durationNights,
      price_usd: p.fromPriceUSD,
      rating: p.ratingOverall,
      tags: p.aiSearchTags
    })
  ]).join('\n') + '\n';
  writeFileSync(join(EXPORT_ROOT, 'cruises.elastic.json'), elasticDocs);

  // 10. JSON Schema for API validation
  console.log('Exporting JSON Schema...');
  const jsonSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'CruisePackage',
    type: 'object',
    properties: {
      id: { type: 'string' },
      slug: { type: 'string' },
      title: { type: 'string' },
      cruiseLineName: { type: 'string' },
      shipName: { type: 'string' },
      destination: { type: 'string' },
      durationNights: { type: 'integer' },
      fromPriceUSD: { type: 'number' },
      ratingOverall: { type: 'number' }
    },
    required: ['id', 'slug', 'title', 'cruiseLineName', 'shipName', 'destination', 'durationNights', 'fromPriceUSD']
  };
  writeFileSync(join(EXPORT_ROOT, 'cruise-schema.json'), JSON.stringify(jsonSchema, null, 2));

  console.log('All export formats generated successfully in /exports/');
}

main();
