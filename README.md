# Sanandem

**Supporting open research towards medicine equality**

[![License: CC0-1.0](https://img.shields.io/badge/License-CC0%201.0-lightgrey.svg)](http://creativecommons.org/publicdomain/zero/1.0/)

## ⚠️ CRITICAL MEDICAL DISCLAIMER

**THIS PLATFORM IS EXCLUSIVELY FOR RESEARCH PURPOSES AND SHOULD NOT BE USED AS MEDICAL ADVICE IN ANY CASE.**

- **Always consult qualified health professionals** for medical decisions
- **Never use this data to self-diagnose** or modify your treatment
- **This is not a substitute for professional medical advice**, diagnosis, or treatment
- **In case of medical emergency**, contact your doctor or emergency services immediately

The data provided here is crowdsourced, anonymized, and intended solely for research into medication effects and disparities.

---

## Overview

Sanandem is an open-source web platform dedicated to advancing equality in medicine by collecting, visualizing, and sharing anonymized data about medication effects and side effects across diverse populations.

### The Problem

Historically, medical research has suffered from systemic biases:
- Clinical trials have disproportionately included male subjects
- Medication dosages are often standardized without considering biological diversity
- Side effects experienced by women and marginalized groups are frequently understudied
- There is a significant gap in understanding how medications affect different demographics

### Our Solution

Sanandem provides:
1. **Anonymous Data Collection**: Users can submit their experiences with medications, including both positive and negative effects
2. **Advanced Visualization Tools**: Interactive charts and graphs reveal patterns in how different populations experience medication effects
3. **Open Research Platform**: All anonymized data is available for researchers to study medication safety and efficacy across demographics
4. **Community-Driven Insights**: Empowering individuals to contribute to medical knowledge while maintaining complete privacy

## Philosophy & Goals

Sanandem is grounded in feminist and social justice literature that highlights health disparities:

- **Invisible Women** by Caroline Criado Perez documents how data gaps affect women's health
- Research showing that women are **more likely to experience adverse drug reactions** than men
- Studies demonstrating that **pain in women is often undertreated** compared to men with similar conditions
- The historical exclusion of women from clinical trials until the 1990s
- Ongoing disparities in how different ethnic groups respond to medications

Our goals are to:
- **Illuminate disparities** in medication effects across gender, age, and other demographics
- **Provide researchers** with rich, anonymized datasets for studying medication safety
- **Encourage movement** toward more inclusive medical research and testing
- **Empower individuals** to share their experiences and contribute to scientific knowledge
- **Advocate for equity** in healthcare by making data-driven insights accessible

## Features

### Data Submission
- Submit anonymized reports about medication effects
- Include information about age, gender (optional), and severity of effects
- Contribute positive and negative experiences with medications
- No personal identifiable information (PII) is collected

### Visualization Dashboard
- Interactive network graphs showing relationships between medications and side effects
- Statistical analysis by demographics
- Real-time data exploration tools
- Severity distribution charts
- Trend analysis over time

### Research Tools
- Open access to anonymized datasets
- API for programmatic data access (coming soon)
- Export functionality for researchers
- Integration with existing pharmacovigilance frameworks

## Technical Stack

- **Frontend**: SvelteKit 2.x with Svelte 5
- **Visualization**: D3.js, ECharts, LayerChart
- **Database**: PostgreSQL via Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Authentication**: Oslo.js for secure session management
- **Deployment**: Node.js adapter for production

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mitchlabeetch/Sanandem.git
cd Sanandem
```

2. Install dependencies:
```bash
cd sanandem
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

### Running the Admin Panel

```bash
cd sanadmin
npm install
npm run dev
```

## Project Structure

```
Sanandem/
├── sanandem/          # Main web application
│   ├── src/
│   │   ├── lib/       # Reusable components and utilities
│   │   ├── routes/    # SvelteKit routes/pages
│   │   └── stories/   # Storybook component stories
│   └── static/        # Static assets
├── sanadmin/          # Admin dashboard
└── docs/              # Additional documentation
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Key areas where we need help:
- Adding more visualization types
- Improving data anonymization
- Translating the interface into more languages
- Writing documentation
- Testing and bug reports

## Privacy & Ethics

- **No PII Collection**: We do not collect names, email addresses, or any identifying information
- **Data Anonymization**: All submissions are anonymized before storage
- **Open Data**: Anonymized data is made available for legitimate research
- **Informed Consent**: Users are informed about how their data will be used
- **Right to Research**: We believe in open science and transparent research

## License

This project is released under [CC0 1.0 Universal](LICENSE) - dedicated to the public domain.

## Related Reading

To understand the context and importance of this work, we recommend:

### Feminist & Social Justice Literature
- **Invisible Women** by Caroline Criado Perez - Data bias in a world designed for men
- **Doing Harm** by Maya Dusenbery - How bad medicine and lazy science leave women dismissed
- **The Pain Gap** by Anushay Hossain - How sexism affects women's health
- **Medical Apartheid** by Harriet Washington - The dark history of medical experimentation on Black Americans

### Academic Research
- "Sex and gender differences in pharmacology" (2020) - British Journal of Pharmacology
- "Adverse drug reactions: an analysis by sex and age" - Pharmacoepidemiology and Drug Safety
- "Women's health and clinical trials" - Journal of Internal Medicine
- "Racial and ethnic disparities in medication safety" - American Journal of Public Health

## Acknowledgments

This project stands on the shoulders of:
- Activists fighting for healthcare equity
- Researchers documenting medical disparities
- Open-source contributors who believe in accessible technology
- Every individual who shares their experience to advance medical knowledge

## Contact & Support

- **Issues**: [GitHub Issues](https://github.com/mitchlabeetch/Sanandem/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mitchlabeetch/Sanandem/discussions)

---

**Remember**: This platform is for research only. Always consult healthcare professionals for medical advice.
