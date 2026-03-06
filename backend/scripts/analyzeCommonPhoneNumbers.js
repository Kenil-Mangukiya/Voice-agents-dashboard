import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'db', 'phone_numbers_data');

// Read all JSON files
const files = fs.readdirSync(dataDir).filter(file => file.endsWith('-services.json'));

console.log(`Found ${files.length} county JSON files\n`);

// Data structure: Map of phoneNumber -> { counties: Set, services: Map }
const phoneNumberMap = new Map();

// Read all files and extract phone numbers
files.forEach(file => {
  const countyName = file.replace('-services.json', '').replace(/-/g, ' ');
  const filePath = path.join(dataDir, file);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (Array.isArray(data)) {
      data.forEach(service => {
        if (service.phone) {
          const phone = service.phone.trim();
          
          if (!phoneNumberMap.has(phone)) {
            phoneNumberMap.set(phone, {
              counties: new Set(),
              services: new Map()
            });
          }
          
          const phoneData = phoneNumberMap.get(phone);
          phoneData.counties.add(countyName);
          
          // Track services: service name -> Set of counties that use it for this phone
          if (!phoneData.services.has(service.serviceName)) {
            phoneData.services.set(service.serviceName, new Set());
          }
          phoneData.services.get(service.serviceName).add(countyName);
        }
      });
    }
  } catch (error) {
    console.error(`Error reading ${file}:`, error.message);
  }
});

// Convert to array and sort by number of counties (descending)
const phoneArray = Array.from(phoneNumberMap.entries()).map(([phone, data]) => ({
  phone,
  countiesCount: data.counties.size,
  counties: Array.from(data.counties).sort(),
  services: data.services
}));

phoneArray.sort((a, b) => b.countiesCount - a.countiesCount);

// Categorize phone numbers
const statewide = phoneArray.filter(p => p.countiesCount >= 30);
const regional = phoneArray.filter(p => p.countiesCount >= 5 && p.countiesCount < 30);
const countyPairs = phoneArray.filter(p => p.countiesCount >= 2 && p.countiesCount < 5);
const uniqueDuplicates = phoneArray.filter(p => p.countiesCount === 2);

// Display results
console.log('='.repeat(120));
console.log('PHONE NUMBER ANALYSIS REPORT - All 57 California Counties');
console.log('='.repeat(120));
console.log();

console.log(`SUMMARY STATISTICS:`);
console.log(`- Total Unique Phone Numbers: ${phoneArray.length}`);
console.log(`- Statewide Services (30+ counties): ${statewide.length}`);
console.log(`- Regional Services (5-29 counties): ${regional.length}`);
console.log(`- County Pairs (2-4 counties): ${countyPairs.length}`);
console.log(`- Unique Duplicates (exactly 2): ${uniqueDuplicates.length}`);
console.log(`- Single-County Numbers: ${phoneArray.filter(p => p.countiesCount === 1).length}`);
console.log();
console.log('='.repeat(120));
console.log();

// Display Statewide Services (30+ counties)
if (statewide.length > 0) {
  console.log('█'.repeat(120));
  console.log('STATEWIDE SERVICES (30+ COUNTIES)');
  console.log('█'.repeat(120));
  console.log();
  
  statewide.forEach((item, idx) => {
    console.log(`${idx + 1}. PHONE: ${item.phone} | APPEARS IN: ${item.countiesCount} counties`);
    console.log(`   Counties: ${item.counties.join(', ')}`);
    console.log(`   Services:`);
    item.services.forEach((countySet, serviceName) => {
      console.log(`     - ${serviceName} (${countySet.size} counties)`);
    });
    console.log();
  });
}

// Display Regional Services (5-29 counties)
if (regional.length > 0) {
  console.log('█'.repeat(120));
  console.log('REGIONAL SERVICES (5-29 COUNTIES)');
  console.log('█'.repeat(120));
  console.log();
  
  regional.forEach((item, idx) => {
    console.log(`${idx + 1}. PHONE: ${item.phone} | APPEARS IN: ${item.countiesCount} counties`);
    console.log(`   Counties: ${item.counties.join(', ')}`);
    console.log(`   Services:`);
    item.services.forEach((countySet, serviceName) => {
      console.log(`     - ${serviceName} (${countySet.size} counties)`);
    });
    console.log();
  });
}

// Display County Pairs (2-4 counties)
if (countyPairs.length > 0) {
  console.log('█'.repeat(120));
  console.log('COUNTY PAIRS / SMALL REGIONS (2-4 COUNTIES)');
  console.log('█'.repeat(120));
  console.log();
  
  countyPairs.forEach((item, idx) => {
    console.log(`${idx + 1}. PHONE: ${item.phone} | APPEARS IN: ${item.countiesCount} counties`);
    console.log(`   Counties: ${item.counties.join(', ')}`);
    console.log(`   Services:`);
    item.services.forEach((countySet, serviceName) => {
      console.log(`     - ${serviceName} (${countySet.size} counties)`);
    });
    console.log();
  });
}

// Display top unique duplicates (exactly 2 counties)
if (uniqueDuplicates.length > 0) {
  console.log('█'.repeat(120));
  console.log('UNIQUE DUPLICATES (EXACTLY 2 COUNTIES - Potential Data Issues)');
  console.log('█'.repeat(120));
  console.log(`Showing top 50 of ${uniqueDuplicates.length} exact duplicates`);
  console.log();
  
  uniqueDuplicates.slice(0, 50).forEach((item, idx) => {
    console.log(`${idx + 1}. PHONE: ${item.phone} | APPEARS IN: ${item.counties.join(', ')}`);
    console.log(`   Services:`);
    item.services.forEach((countySet, serviceName) => {
      console.log(`     - ${serviceName}`);
    });
    console.log();
  });
  
  if (uniqueDuplicates.length > 50) {
    console.log(`... and ${uniqueDuplicates.length - 50} more exact duplicates (2 counties each)`);
    console.log();
  }
}

// Save detailed report to file
const reportPath = path.join(__dirname, 'phone_numbers_analysis_report.json');
const reportData = {
  summary: {
    totalUniquePhoneNumbers: phoneArray.length,
    statewide: statewide.length,
    regional: regional.length,
    countyPairs: countyPairs.length,
    uniqueDuplicates: uniqueDuplicates.length,
    singleCounty: phoneArray.filter(p => p.countiesCount === 1).length
  },
  statewide: statewide.map(p => ({
    phone: p.phone,
    countyCount: p.countiesCount,
    counties: p.counties,
    services: Array.from(p.services.entries()).map(([name, counties]) => ({
      name,
      countyCount: counties.size,
      counties: Array.from(counties)
    }))
  })),
  regional: regional.map(p => ({
    phone: p.phone,
    countyCount: p.countiesCount,
    counties: p.counties,
    services: Array.from(p.services.entries()).map(([name, counties]) => ({
      name,
      countyCount: counties.size,
      counties: Array.from(counties)
    }))
  })),
  countyPairs: countyPairs.map(p => ({
    phone: p.phone,
    countyCount: p.countiesCount,
    counties: p.counties,
    services: Array.from(p.services.entries()).map(([name, counties]) => ({
      name,
      countyCount: counties.size,
      counties: Array.from(counties)
    }))
  }))
};

fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
console.log(`\n✅ Detailed report saved to: ${reportPath}`);
