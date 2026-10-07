(function (root) {
  'use strict';
  function isoDay(offset = 0, now = new Date()) {
    if (!Number.isInteger(offset)) throw new TypeError('Day offset must be an integer');
    const date = new Date(now);
    if (Number.isNaN(date.getTime())) throw new TypeError('Invalid date');
    date.setUTCDate(date.getUTCDate() + offset);
    return date.toISOString().slice(0, 10);
  }

  const people = [
    ['Maya Patel', 'Northstar Studio', 'Founder', 'New', 'Brand strategy', 1800],
    ['Theo Martin', 'Lumen Health', 'Growth Lead', 'Contacted', 'Email campaign', 3200],
    ['Aisha Khan', 'Harbor & Co.', 'Marketing Director', 'Replied', 'Website copy', 2400],
    ['Noah Williams', 'Vector Works', 'Co-founder', 'Interested', 'Sales deck', 4500],
    ['Sofia Chen', 'Brightwell Labs', 'Head of Product', 'Proposal Sent', 'Product messaging', 6000],
    ['Liam Brooks', 'Pine & Peak', 'Owner', 'Converted', 'Brand identity', 3800],
    ['Elena Rossi', 'Cedar Finance', 'Operations Director', 'Contacted', 'Content strategy', 2200],
    ['Marcus Reed', 'Atlas Talent', 'CEO', 'New', 'Lead generation', 5000],
    ['Priya Shah', 'Nexa Commerce', 'Ecommerce Manager', 'Interested', 'Lifecycle email', 2800],
    ['Owen Clark', 'Fieldnote Media', 'Publisher', 'Not Interested', 'Editorial support', 1600],
    ['Zara Ali', 'Kinetic House', 'Creative Director', 'Proposal Sent', 'Launch campaign', 7200],
    ['Ethan Moore', 'Clearpath Legal', 'Partner', 'Replied', 'Thought leadership', 3500],
    ['Mia Santos', 'Golden Hour Goods', 'Founder', 'Contacted', 'Conversion copy', 1900],
    ['Daniel Kim', 'Relay Systems', 'Revenue Lead', 'Interested', 'Outbound system', 5400],
    ['Grace Turner', 'Juniper Collective', 'Owner', 'Converted', 'Website refresh', 3100],
    ['Ibrahim Khan', 'Summit Advisory', 'Managing Director', 'New', 'Proposal writing', 2700],
    ['Nora Evans', 'Modern Table', 'Marketing Lead', 'Replied', 'Social campaign', 2100],
    ['Caleb Young', 'Orbit Freight', 'Commercial Director', 'Contacted', 'Sales enablement', 4300],
  ];

  function sampleWorkspace(now = new Date()) {
    const prospects = people.map(([name, company, jobTitle, status, service, dealValue], index) => ({
      id: index + 1,
      name, company, jobTitle, status, service,
      industry: 'Professional Services', location: 'Remote',
      email: `sample${index + 1}@example.com`, linkedinUrl: '',
      dateAdded: isoDay(-30 + index, now),
      dateContacted: status === 'New' ? '' : isoDay(-18 + index, now),
      hook: ['Warm check-in', 'Value-first', 'Curiosity', 'Direct'][index % 4],
      nextFollowup: ['Converted', 'Not Interested', 'New'].includes(status)
        ? '' : isoDay(index % 4 === 0 ? 0 : index % 5 - 2, now),
      followupCount: index % 3, followupSent: false, linkSent: false,
      leadSource: ['LinkedIn', 'Referral', 'Email', 'Event'][index % 4],
      dealValue: `$${dealValue}`, tags: ['Sample data', index % 3 === 0 ? 'Hot lead' : ''],
      tasks: index % 5 === 0 ? [{ id: `sample-task-${index}`, title: 'Prepare follow-up',
        due: isoDay(0, now), done: false, createdAt: now.toISOString() }] : [],
      customFields: {}, outcomeReason: '',
      notes: 'Sample data. Replace or clear these records when you are ready.',
      interestedDate: ['Interested', 'Proposal Sent', 'Converted'].includes(status)
        ? isoDay(-7, now) : '',
    }));
    const activities = Object.fromEntries(prospects.filter((row) => row.status !== 'New').map((row) => [
      row.id, [{ type: 'Message Sent', date: row.dateContacted || isoDay(-1, now),
        note: 'Sample outreach activity', ts: now.getTime() }],
    ]));
    return { prospects, activities };
  }

  const api = { isoDay, sampleWorkspace };
  if (root) (root.OutreachCommand ||= {}).sampleWorkspace = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : undefined);
