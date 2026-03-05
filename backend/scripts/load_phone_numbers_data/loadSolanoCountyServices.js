import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import connectDB from '../../db/index.js'
import Service from '../../models/county-service.model.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function loadCountyServices() {
  try {
    // Connect to database
    await connectDB()
    console.log('✓ Connected to database')

    // Read JSON file
    const jsonPath = path.join(__dirname, '../../db/phone_numbers_data/solano-county-services.json')
    const fileContent = fs.readFileSync(jsonPath, 'utf8')
    const servicesData = JSON.parse(fileContent)

    if (!Array.isArray(servicesData)) {
      throw new Error('JSON file must contain an array of services')
    }

    console.log(`📋 Loaded ${servicesData.length} services from JSON`)

    // Delete existing Solano County records
    const deleteResult = await Service.deleteMany({ county: 'SOLANO', state: 'CA' })
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing Solano County records`)

    // Validate and prepare services
    const validServices = []
    const errors = []

    for (let i = 0; i < servicesData.length; i++) {
      const service = servicesData[i]

      // Validate required fields
      if (!service.county || !service.state || !service.serviceName || !service.phone) {
        errors.push(`Service ${i}: Missing required fields (county, state, serviceName, phone)`)
        continue
      }

      // Build service object
      const serviceObj = {
        county: service.county,
        state: service.state,
        serviceName: service.serviceName,
        phone: service.phone,
        description: service.description || '',
        priority: service.priority || 5,
        citySpecific: service.citySpecific || false,
        isShortCode: service.isShortCode || false
      }

      validServices.push(serviceObj)
    }

    if (errors.length > 0) {
      console.warn('⚠️  Validation errors:')
      errors.forEach(err => console.warn(`   - ${err}`))
    }

    console.log(`✓ Validated ${validServices.length} services`)

    // Batch insert with error handling
    const batchSize = 50
    let insertedCount = 0
    let duplicateCount = 0

    for (let i = 0; i < validServices.length; i += batchSize) {
      const batch = validServices.slice(i, i + batchSize)

      try {
        const result = await Service.insertMany(batch, { ordered: false })
        insertedCount += result.length
        console.log(`✓ Inserted batch ${Math.floor(i / batchSize) + 1}: ${result.length} services`)
      } catch (error) {
        // Handle duplicate key errors
        if (error.code === 11000) {
          console.warn(`⚠️  Some duplicates in batch ${Math.floor(i / batchSize) + 1}, continuing...`)
          duplicateCount += batch.length - (error.result?.insertedCount || 0)

          // Try inserting one by one to skip duplicates
          for (const service of batch) {
            try {
              await Service.insertMany([service], { ordered: false })
              insertedCount++
            } catch (singleError) {
              if (singleError.code !== 11000) {
                throw singleError
              }
              duplicateCount++
            }
          }
        } else {
          throw error
        }
      }
    }

    // Get final count
    const finalCount = await Service.countDocuments({ county: 'SOLANO', state: 'CA' })

    console.log('\n📊 Load Summary:')
    console.log(`   Total Services: ${servicesData.length}`)
    console.log(`   Successfully Inserted: ${insertedCount}`)
    console.log(`   Duplicates Skipped: ${duplicateCount}`)
    console.log(`   Final Database Count: ${finalCount}`)

    if (finalCount > 0) {
      console.log(`\n✅ Solano County services loaded successfully!`)
    } else {
      console.warn('⚠️  No services were inserted into the database')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error loading services:', error.message)
    console.error(error)
    process.exit(1)
  }
}

loadCountyServices()
