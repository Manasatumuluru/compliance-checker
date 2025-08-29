import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'compliance-checker-api' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})

// List rules (optional filters: ?jurisdiction=TX&industry=retail)
app.get('/rules', async (req, res) => {
  try {
    const { jurisdiction, industry } = req.query
    const where: any = {}

    if (jurisdiction && typeof jurisdiction === 'string') where.jurisdiction = jurisdiction
    if (industry && typeof industry === 'string') where.industry = industry

    const rules = await prisma.rule.findMany({
      where,
      orderBy: [{ jurisdiction: 'asc' }, { category: 'asc' }, { code: 'asc' }],
    })

    res.json(rules)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch rules' })
  }
})

// Determine applicable rules for a business profile
app.post('/check', async (req, res) => {
  try {
    const { state, industry, employees, name } = req.body as {
      state: string; industry: string; employees: number; name?: string
    }

    if (!state || !industry || !employees) {
      return res.status(400).json({ error: 'state, industry, and employees are required' })
    }

    // Save the business profile (optional, useful for history/analytics)
    const business = await prisma.business.create({
      data: { name: name || 'Untitled Business', state, industry, employees },
    })

    // Match rules by (industry OR "all") + employee range + jurisdiction (federal or state)
    const rules = await prisma.rule.findMany({
      where: {
        AND: [
          {
            OR: [
              { industry },          // exact industry
              { industry: 'all' },   // universal rules
            ],
          },
          { minEmployees: { lte: employees } },
          { maxEmployees: { gte: employees } },
          {
            OR: [
              { jurisdiction: 'federal' },
              { jurisdiction: state },
            ],
          },
        ],
      },
      orderBy: [{ jurisdiction: 'asc' }, { category: 'asc' }, { code: 'asc' }],
    })

    // Link the matches (optional for audit/history)
    if (rules.length) {
      await prisma.complianceCheck.createMany({
        data: rules.map(r => ({ businessId: business.id, ruleId: r.id })),
        skipDuplicates: true,
      })
    }

    res.json({ business, count: rules.length, rules })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Compliance check failed' })
  }
})
