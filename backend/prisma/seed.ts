import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * ~60 demo rules covering:
 * - Jurisdictions: federal + TX, NY, CA, FL, IL, WA, MA
 * - Industries: retail, construction, hospitality, healthcare, finance,
 *   education, transportation, technology, manufacturing, agriculture, all
 * - Mixed employee thresholds
 */
async function main() {
  console.log("🌱 Seeding ~60 rules (multi-industry + multi-state)…");

  const rules = [
    // ======== FEDERAL (universal / ALL) ========
    { code: "fed-poster-001", category: "Labor Posters", jurisdiction: "federal", industry: "all", minEmployees: 1,  maxEmployees: 9999, description: "Display required federal labor law posters (FLSA, FMLA, EEOC, OSHA)." },
    { code: "fed-i9-001",     category: "Employment Verification", jurisdiction: "federal", industry: "all", minEmployees: 1,  maxEmployees: 9999, description: "Complete Form I-9 for all new hires; retain per USCIS rules." },
    { code: "fed-fica-001",   category: "Payroll Taxes", jurisdiction: "federal", industry: "all", minEmployees: 1,  maxEmployees: 9999, description: "Withhold and remit FICA (Social Security & Medicare) taxes." },
    { code: "fed-futa-001",   category: "Payroll Taxes", jurisdiction: "federal", industry: "all", minEmployees: 1,  maxEmployees: 9999, description: "Pay Federal Unemployment (FUTA) taxes as applicable." },
    { code: "fed-osha-000",   category: "Workplace Safety", jurisdiction: "federal", industry: "all", minEmployees: 1,  maxEmployees: 9999, description: "Maintain a safe workplace under OSHA General Duty Clause." },
    { code: "fed-eeoc-001",   category: "Employment", jurisdiction: "federal", industry: "all", minEmployees: 15, maxEmployees: 9999, description: "EEOC anti-discrimination laws apply at 15+ employees." },
    { code: "fed-aca-001",    category: "Benefits", jurisdiction: "federal", industry: "all", minEmployees: 50, maxEmployees: 9999, description: "ALEs (50+ FTEs) must offer ACA-compliant health coverage." },
    { code: "fed-flsa-ot-001",category: "Wage & Hour", jurisdiction: "federal", industry: "all", minEmployees: 1,  maxEmployees: 9999, description: "Comply with FLSA overtime & minimum wage for non-exempt staff." },
    { code: "fed-records-001",category: "Recordkeeping", jurisdiction: "federal", industry: "all", minEmployees: 1,  maxEmployees: 9999, description: "Maintain payroll and personnel records for required periods." },
    { code: "fed-osha-logs-001",category: "Workplace Safety", jurisdiction: "federal", industry: "all", minEmployees: 11, maxEmployees: 9999, description: "Keep OSHA 300/300A/301 logs for most employers with 11+ employees." },

    // ======== FEDERAL (industry specific) ========
    { code: "fed-osha-const-001", category: "Workplace Safety", jurisdiction: "federal", industry: "construction", minEmployees: 1, maxEmployees: 9999, description: "Follow OSHA construction standards (fall protection, PPE, ladders)." },
    { code: "fed-osha-hosp-001",  category: "Workplace Safety", jurisdiction: "federal", industry: "hospitality",  minEmployees: 1, maxEmployees: 9999, description: "Housekeeping/chemicals/ergonomics safety under OSHA." },
    { code: "fed-fda-001",        category: "Food Safety",       jurisdiction: "federal", industry: "hospitality",  minEmployees: 1, maxEmployees: 9999, description: "Comply with FDA Food Code (as adopted by state/local authorities)." },
    { code: "fed-ada-001",        category: "Accessibility",     jurisdiction: "federal", industry: "hospitality",  minEmployees: 1, maxEmployees: 9999, description: "Provide ADA-compliant public accommodations." },
    { code: "fed-hipaa-001",      category: "Privacy",           jurisdiction: "federal", industry: "healthcare",   minEmployees: 1, maxEmployees: 9999, description: "Comply with HIPAA Privacy & Security Rules for PHI." },
    { code: "fed-sec-aml-001",    category: "Financial Compliance", jurisdiction: "federal", industry: "finance",   minEmployees: 1, maxEmployees: 9999, description: "Maintain AML/KYC program where applicable (SEC/FinCEN)." },
    { code: "fed-ferpa-001",      category: "Privacy",           jurisdiction: "federal", industry: "education",    minEmployees: 1, maxEmployees: 9999, description: "Protect student records under FERPA (access, disclosure rules)." },
    { code: "fed-dot-hos-001",    category: "Transportation",    jurisdiction: "federal", industry: "transportation", minEmployees: 1, maxEmployees: 9999, description: "DOT Hours of Service & driver qualification files for CMV drivers." },
    { code: "fed-nist-001",       category: "Cybersecurity",     jurisdiction: "federal", industry: "tech",         minEmployees: 1, maxEmployees: 9999, description: "Adopt baseline security controls (NIST best practices) — strong recommendation." },

    // ======== TEXAS (TX) ========
    { code: "tx-retail-tax-001",     category: "Tax & Filings",   jurisdiction: "TX", industry: "retail",        minEmployees: 1,  maxEmployees: 9999, description: "Texas Sales & Use Tax permit and periodic filings." },
    { code: "tx-tabc-001",           category: "Licensing",       jurisdiction: "TX", industry: "hospitality",   minEmployees: 1,  maxEmployees: 9999, description: "Maintain TABC license to sell/serve alcohol." },
    { code: "tx-food-001",           category: "Food Safety",     jurisdiction: "TX", industry: "hospitality",   minEmployees: 1,  maxEmployees: 9999, description: "Certified food handlers & handwashing signage." },
    { code: "tx-const-comp-001",     category: "Insurance",       jurisdiction: "TX", industry: "construction",  minEmployees: 5,  maxEmployees: 9999, description: "Workers’ comp expected for construction employers with 5+ staff." },
    { code: "tx-occup-permit-001",   category: "Licensing",       jurisdiction: "TX", industry: "retail",        minEmployees: 1,  maxEmployees: 9999, description: "Local city/county occupancy & signage permits (check locality)." },
    { code: "tx-health-license-001", category: "Licensing",       jurisdiction: "TX", industry: "healthcare",    minEmployees: 1,  maxEmployees: 9999, description: "TX health facilities licensing (DSHS) where applicable." },
    { code: "tx-ag-weights-001",     category: "Agriculture",     jurisdiction: "TX", industry: "agriculture",   minEmployees: 1,  maxEmployees: 9999, description: "Comply with state weights & measures for farm direct sales." },

    // ======== NEW YORK (NY) ========
    { code: "ny-sales-001",        category: "Tax & Filings",    jurisdiction: "NY", industry: "retail",        minEmployees: 1,  maxEmployees: 9999, description: "Obtain NY Certificate of Authority for sales tax; file returns." },
    { code: "ny-paidleave-001",    category: "Leave",            jurisdiction: "NY", industry: "all",           minEmployees: 1,  maxEmployees: 9999, description: "Provide NY Paid Family Leave coverage (insurance or approved self-insured)." },
    { code: "ny-harass-001",       category: "Training",         jurisdiction: "NY", industry: "all",           minEmployees: 1,  maxEmployees: 9999, description: "Annual sexual harassment prevention training + policy." },
    { code: "ny-wage-notice-001",  category: "Wage & Hour",      jurisdiction: "NY", industry: "all",           minEmployees: 1,  maxEmployees: 9999, description: "Wage Theft Prevention Act: hire notice + pay stub details." },
    { code: "ny-health-license-001",category: "Licensing",       jurisdiction: "NY", industry: "healthcare",    minEmployees: 1,  maxEmployees: 9999, description: "Healthcare entities must register with NYS DOH/OPMC where applicable." },
    { code: "ny-dfs-fin-001",      category: "Licensing",        jurisdiction: "NY", industry: "finance",       minEmployees: 1,  maxEmployees: 9999, description: "Register with NY Dept. of Financial Services for covered activities." },

    // ======== CALIFORNIA (CA) ========
    { code: "ca-privacy-001",      category: "Privacy",          jurisdiction: "CA", industry: "all",           minEmployees: 50, maxEmployees: 9999, description: "CCPA/CPRA obligations if thresholds met (data volume/revenue)." },
    { code: "ca-sickleave-001",    category: "Leave",            jurisdiction: "CA", industry: "all",           minEmployees: 1,  maxEmployees: 9999, description: "Statewide paid sick leave minimums; check stronger local ordinances." },
    { code: "ca-calosha-001",      category: "Workplace Safety", jurisdiction: "CA", industry: "construction",  minEmployees: 1,  maxEmployees: 9999, description: "Cal/OSHA construction standards (stricter than federal in areas)." },
    { code: "ca-mealrest-001",     category: "Wage & Hour",      jurisdiction: "CA", industry: "retail",        minEmployees: 1,  maxEmployees: 9999, description: "Provide compliant meal/rest breaks; premium pay for misses." },
    { code: "ca-minwage-001",      category: "Wage & Hour",      jurisdiction: "CA", industry: "all",           minEmployees: 1,  maxEmployees: 9999, description: "Observe CA minimum wage + local city/county rates." },
    { code: "ca-health-lic-001",   category: "Licensing",        jurisdiction: "CA", industry: "healthcare",    minEmployees: 1,  maxEmployees: 9999, description: "CA DHCS/CDPH licensing & enrollment requirements." },
    { code: "ca-tech-privacy-001", category: "Privacy",          jurisdiction: "CA", industry: "tech",          minEmployees: 1,  maxEmployees: 9999, description: "Post do-not-sell/share links & honor consumer rights (if in scope)." },
    { code: "ca-manufacturing-001",category: "Environmental",    jurisdiction: "CA", industry: "manufacturing", minEmployees: 1,  maxEmployees: 9999, description: "AQMD permits for emissions; hazardous materials reporting." },

    // ======== FLORIDA (FL) ========
    { code: "fl-sales-001",       category: "Tax & Filings",     jurisdiction: "FL", industry: "retail",        minEmployees: 1,  maxEmployees: 9999, description: "Register for FL sales tax; file returns via DOR e-services." },
    { code: "fl-abt-lic-001",     category: "Licensing",         jurisdiction: "FL", industry: "hospitality",   minEmployees: 1,  maxEmployees: 9999, description: "ABT license to sell alcohol; maintain food handling compliance." },
    { code: "fl-reemployment-001",category: "Payroll Taxes",     jurisdiction: "FL", industry: "all",           minEmployees: 1,  maxEmployees: 9999, description: "Florida reemployment (state unemployment) tax reporting." },
    { code: "fl-ag-produce-001",  category: "Agriculture",       jurisdiction: "FL", industry: "agriculture",   minEmployees: 1,  maxEmployees: 9999, description: "Fresh produce handlers comply with state inspection/labeling." },
    { code: "fl-edu-lic-001",     category: "Licensing",         jurisdiction: "FL", industry: "education",     minEmployees: 1,  maxEmployees: 9999, description: "Private schools/child care need Dept. of Education/DCF licensing." },

    // ======== ILLINOIS (IL) ========
    { code: "il-sales-001",       category: "Tax & Filings",     jurisdiction: "IL", industry: "retail",        minEmployees: 1,  maxEmployees: 9999, description: "Retailers’ Occupation Tax via MyTax Illinois." },
    { code: "il-paidleave-001",   category: "Leave",             jurisdiction: "IL", industry: "all",           minEmployees: 1,  maxEmployees: 9999, description: "IL Paid Leave for All Workers Act (or stronger local ordinances)." },
    { code: "il-harass-001",      category: "Training",          jurisdiction: "IL", industry: "all",           minEmployees: 1,  maxEmployees: 9999, description: "Annual sexual harassment training under IHRA." },
    { code: "il-food-001",        category: "Food Safety",       jurisdiction: "IL", industry: "hospitality",   minEmployees: 1,  maxEmployees: 9999, description: "Certified Food Protection Manager on shift; food code compliance." },
    { code: "il-manufacturing-001",category: "Environmental",    jurisdiction: "IL", industry: "manufacturing", minEmployees: 1,  maxEmployees: 9999, description: "IEPA permits for air/water; hazardous waste manifests." },

    // ======== WASHINGTON (WA) ========
    { code: "wa-sales-001",      category: "Tax & Filings",      jurisdiction: "WA", industry: "retail",        minEmployees: 1,  maxEmployees: 9999, description: "Register with DOR for sales & B&O tax; file excise returns." },
    { code: "wa-lni-comp-001",   category: "Insurance",          jurisdiction: "WA", industry: "all",           minEmployees: 1,  maxEmployees: 9999, description: "Workers’ comp through WA L&I (state fund) and reporting." },
    { code: "wa-pfml-001",       category: "Leave",              jurisdiction: "WA", industry: "all",           minEmployees: 1,  maxEmployees: 9999, description: "Paid Family & Medical Leave — wage reporting & premiums." },
    { code: "wa-tech-privacy-001",category: "Privacy",           jurisdiction: "WA", industry: "tech",          minEmployees: 1,  maxEmployees: 9999, description: "Comply with Washington privacy laws for consumer data (if in scope)." },
    { code: "wa-trans-001",      category: "Transportation",     jurisdiction: "WA", industry: "transportation",minEmployees: 1,  maxEmployees: 9999, description: "State permits for intrastate carriers where required." },

    // ======== MASSACHUSETTS (MA) ========
    { code: "ma-sales-001",       category: "Tax & Filings",     jurisdiction: "MA", industry: "retail",        minEmployees: 1,  maxEmployees: 9999, description: "Sales tax registration; file via MassTaxConnect." },
    { code: "ma-earned-sick-001", category: "Leave",             jurisdiction: "MA", industry: "all",           minEmployees: 11, maxEmployees: 9999, description: "Paid Earned Sick Time for employers with 11+ employees." },
    { code: "ma-hospitality-001", category: "Wage & Hour",       jurisdiction: "MA", industry: "hospitality",   minEmployees: 1,  maxEmployees: 9999, description: "Tip pooling/tip credit & Sunday/holiday premium rules (if applicable)." },
    { code: "ma-edu-001",         category: "Safety",            jurisdiction: "MA", industry: "education",     minEmployees: 1,  maxEmployees: 9999, description: "Emergency preparedness drills & CORI background checks (schools)." },
    { code: "ma-manufacturing-001",category: "Workplace Safety", jurisdiction: "MA", industry: "manufacturing", minEmployees: 1,  maxEmployees: 9999, description: "Machine guarding/lockout-tagout; state poster requirements." },

    // ======== EXTRA INDUSTRY COVERAGE (TECH, MANUFACTURING, AGRICULTURE) ========
    { code: "tech-sec-001",       category: "Cybersecurity",     jurisdiction: "federal", industry: "tech",     minEmployees: 1,  maxEmployees: 9999, description: "Implement security program (access control, encryption, incident response)." },
    { code: "mfg-safety-001",     category: "Workplace Safety",  jurisdiction: "federal", industry: "manufacturing", minEmployees: 1, maxEmployees: 9999, description: "OSHA machine guarding & LOTO; SDS for chemicals; training." },
    { code: "ag-osha-001",        category: "Workplace Safety",  jurisdiction: "federal", industry: "agriculture",  minEmployees: 1, maxEmployees: 9999, description: "Agricultural safety (tractor ROPS, chemical handling, housing where applicable)." },
  ];

  for (const r of rules) {
    await prisma.rule.upsert({
      where: { code: r.code },
      update: {},
      create: r,
    });
  }

  console.log("✅ Seeded ~60 rules.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
