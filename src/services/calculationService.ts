import type { ProjectDetails, CalculationResult, DeadlineResult, RemedyStep } from '../types';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function getDaysRemaining(deadline: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function calculateDeadlines(details: ProjectDetails): DeadlineResult[] {
  const { state, projectType, lastFurnishingDate, role } = details;

  if (!lastFurnishingDate) {
    throw new Error('Last furnishing date is required');
  }

  const deadlines: DeadlineResult[] = [];

  if (projectType === 'Federal') {
    const filingDeadline = addDays(lastFurnishingDate, 90);
    deadlines.push({
      title: 'Miller Act Bond Claim Filing',
      date: filingDeadline,
      daysRemaining: getDaysRemaining(filingDeadline),
      requirement: '90 days from last furnishing to file Miller Act bond claim.',
      type: 'primary',
    });

    const suitDeadline = addMonths(lastFurnishingDate, 12);
    deadlines.push({
      title: 'Lawsuit Filing Deadline',
      date: suitDeadline,
      daysRemaining: getDaysRemaining(suitDeadline),
      requirement: '1 year from last furnishing to file suit to enforce your bond claim.',
      type: 'secondary',
    });
  } else if (projectType === 'Public') {
    if (role !== 'General Contractor') {
      const noticeDeadline = addDays(lastFurnishingDate, 30);
      deadlines.push({
        title: 'Preliminary Notice',
        date: noticeDeadline,
        daysRemaining: getDaysRemaining(noticeDeadline),
        requirement: 'Send preliminary notice to public entity and general contractor within 30 days.',
        type: 'secondary',
      });
    }

    if (state === 'Texas') {
      const filingDeadline = addMonths(lastFurnishingDate, 2);
      deadlines.push({
        title: 'Payment Bond Claim Filing',
        date: filingDeadline,
        daysRemaining: getDaysRemaining(filingDeadline),
        requirement: '2nd month after each month in which labor or materials are provided.',
        type: 'primary',
      });

      const suitDeadline = addMonths(lastFurnishingDate, 12);
      deadlines.push({
        title: 'Lawsuit Filing Deadline',
        date: suitDeadline,
        daysRemaining: getDaysRemaining(suitDeadline),
        requirement: '1 year from last furnishing to file suit to enforce your claim.',
        type: 'secondary',
      });
    } else if (state === 'California') {
      const filingDeadline = addDays(lastFurnishingDate, 90);
      deadlines.push({
        title: 'Payment Bond Claim Filing',
        date: filingDeadline,
        daysRemaining: getDaysRemaining(filingDeadline),
        requirement: '90 days from project completion or cessation.',
        type: 'primary',
      });

      const suitDeadline = addMonths(filingDeadline, 6);
      deadlines.push({
        title: 'Lawsuit Filing Deadline',
        date: suitDeadline,
        daysRemaining: getDaysRemaining(suitDeadline),
        requirement: '6 months to file suit after recording claim.',
        type: 'secondary',
      });
    } else {
      const filingDeadline = addDays(lastFurnishingDate, 90);
      deadlines.push({
        title: 'Payment Bond Claim Filing',
        date: filingDeadline,
        daysRemaining: getDaysRemaining(filingDeadline),
        requirement: '90 days from last furnishing (typical). Varies by state - consult local statutes.',
        type: 'primary',
      });

      const suitDeadline = addMonths(lastFurnishingDate, 12);
      deadlines.push({
        title: 'Lawsuit Filing Deadline',
        date: suitDeadline,
        daysRemaining: getDaysRemaining(suitDeadline),
        requirement: '1 year from last furnishing to file suit.',
        type: 'secondary',
      });
    }
  } else {
    if (role !== 'General Contractor') {
      const noticeDeadline = addDays(lastFurnishingDate, 30);
      deadlines.push({
        title: 'Preliminary Notice',
        date: noticeDeadline,
        daysRemaining: getDaysRemaining(noticeDeadline),
        requirement: `Send preliminary notice to property owner and general contractor within 30 days in ${state}.`,
        type: 'secondary',
      });
    }

    if (state === 'Texas') {
      const filingDeadline = addMonths(lastFurnishingDate, 4);
      deadlines.push({
        title: "Mechanic's Lien Filing",
        date: filingDeadline,
        daysRemaining: getDaysRemaining(filingDeadline),
        requirement: '4th month after each month in which labor or materials are provided.',
        type: 'primary',
      });

      const suitDeadline = addMonths(filingDeadline, 12);
      deadlines.push({
        title: 'Lawsuit Filing Deadline',
        date: suitDeadline,
        daysRemaining: getDaysRemaining(suitDeadline),
        requirement: '1 year from filing to file suit to enforce your lien.',
        type: 'secondary',
      });
    } else if (state === 'California') {
      const filingDeadline = addDays(lastFurnishingDate, 90);
      deadlines.push({
        title: "Mechanic's Lien Filing",
        date: filingDeadline,
        daysRemaining: getDaysRemaining(filingDeadline),
        requirement: '90 days from project completion or cessation.',
        type: 'primary',
      });

      const suitDeadline = addDays(filingDeadline, 90);
      deadlines.push({
        title: 'Lawsuit Filing Deadline',
        date: suitDeadline,
        daysRemaining: getDaysRemaining(suitDeadline),
        requirement: '90 days to file suit after recording claim.',
        type: 'secondary',
      });
    } else if (state === 'Florida') {
      const filingDeadline = addDays(lastFurnishingDate, 90);
      deadlines.push({
        title: "Mechanic's Lien Filing",
        date: filingDeadline,
        daysRemaining: getDaysRemaining(filingDeadline),
        requirement: '90 days from last furnishing or completion.',
        type: 'primary',
      });

      const suitDeadline = addMonths(filingDeadline, 12);
      deadlines.push({
        title: 'Lawsuit Filing Deadline',
        date: suitDeadline,
        daysRemaining: getDaysRemaining(suitDeadline),
        requirement: '1 year from recording to file suit to enforce your lien.',
        type: 'secondary',
      });
    } else {
      const filingDeadline = addDays(lastFurnishingDate, 90);
      deadlines.push({
        title: "Mechanic's Lien Filing",
        date: filingDeadline,
        daysRemaining: getDaysRemaining(filingDeadline),
        requirement: '90 days from last furnishing (typical). Varies by state.',
        type: 'primary',
      });

      const suitDeadline = addMonths(filingDeadline, 12);
      deadlines.push({
        title: 'Lawsuit Filing Deadline',
        date: suitDeadline,
        daysRemaining: getDaysRemaining(suitDeadline),
        requirement: '1 year from filing to enforce. Varies by state.',
        type: 'secondary',
      });
    }
  }

  return deadlines;
}

function generateRemedies(details: ProjectDetails, deadlines: DeadlineResult[]): RemedyStep[] {
  const { state, projectType, role } = details;
  const remedies: RemedyStep[] = [];

  const primaryDeadline = deadlines.find(d => d.type === 'primary');
  if (!primaryDeadline) {
    return remedies;
  }

  const affidavitDeadline = addDays(primaryDeadline.date, -10);
  const suitDeadline = deadlines.find(d => d.title.includes('Lawsuit'));

  if (projectType === 'Federal') {
    remedies.push({
      order: 1,
      title: 'Send Miller Act Notice',
      description: `Based on your ${state} federal project role, you must send the Miller Act Notice to the general contractor within 90 days of last furnishing. Send notice immediately if not already done.`,
    });

    remedies.push({
      order: 2,
      title: 'Prepare Bond Claim',
      description: `If payment is not received by ${affidavitDeadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, prepare your Miller Act bond claim form with all required documentation.`,
    });

    remedies.push({
      order: 3,
      title: 'File Bond Claim & Suit',
      description: `File your bond claim by ${primaryDeadline.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}. If still unpaid, you must file suit to enforce by ${suitDeadline?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`,
    });
  } else if (projectType === 'Public') {
    if (role !== 'General Contractor') {
      remedies.push({
        order: 1,
        title: 'Send Preliminary Notice',
        description: `Send preliminary notice to the public entity and general contractor immediately. This is required in most states for public projects.`,
      });
    }

    remedies.push({
      order: 2,
      title: 'Prepare Payment Bond Claim',
      description: `If payment is not received by ${affidavitDeadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, prepare your payment bond claim with all required documentation.`,
    });

    remedies.push({
      order: 3,
      title: 'File Bond Claim & Suit',
      description: `File your payment bond claim by ${primaryDeadline.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}. If still unpaid, you must file suit to enforce by ${suitDeadline?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`,
    });
  } else {
    if (role !== 'General Contractor') {
      remedies.push({
        order: 1,
        title: 'Send Preliminary Notice',
        description: `In ${state}, send preliminary notice to the property owner and general contractor immediately if not already sent. This preserves your lien rights.`,
      });
    }

    remedies.push({
      order: 2,
      title: 'Prepare Lien Affidavit',
      description: `If payment is not received by ${affidavitDeadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, prepare your mechanic's lien affidavit with accurate amounts and dates.`,
    });

    remedies.push({
      order: 3,
      title: 'File Lien & Suit',
      description: `File your mechanic's lien by ${primaryDeadline.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}. If still unpaid, you must file suit to enforce by ${suitDeadline?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`,
    });
  }

  return remedies;
}

export function calculateLienDeadlines(details: ProjectDetails): CalculationResult {
  const deadlines = calculateDeadlines(details);
  const remedies = generateRemedies(details, deadlines);

  return {
    projectDetails: details,
    deadlines,
    remedies,
    calculatedAt: new Date(),
  };
}

export function validateProjectDetails(details: Partial<ProjectDetails>): string[] {
  const errors: string[] = [];

  if (!details.projectName || details.projectName.trim() === '') {
    errors.push('Project name is required');
  }

  if (!details.state) {
    errors.push('Project state is required');
  }

  if (!details.role) {
    errors.push('Your role is required');
  }

  if (!details.contractWith) {
    errors.push('Contract party is required');
  }

  if (!details.projectType) {
    errors.push('Project type is required');
  }

  if (!details.firstFurnishingDate) {
    errors.push('Date of notice recorded is required');
  }

  if (!details.lastFurnishingDate) {
    errors.push('Date of last performance is required');
  }

  if (details.firstFurnishingDate && details.lastFurnishingDate) {
    if (details.firstFurnishingDate > details.lastFurnishingDate) {
      errors.push('Date of last performance must be after date of notice recorded');
    }
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (details.firstFurnishingDate) {
    const firstDate = new Date(details.firstFurnishingDate);
    firstDate.setHours(0, 0, 0, 0);
    if (firstDate > now) {
      errors.push('Date of notice recorded cannot be in the future');
    }
  }

  if (details.lastFurnishingDate) {
    const lastDate = new Date(details.lastFurnishingDate);
    lastDate.setHours(0, 0, 0, 0);
    if (lastDate > now) {
      errors.push('Date of last performance cannot be in the future');
    }
  }

  return errors;
}
