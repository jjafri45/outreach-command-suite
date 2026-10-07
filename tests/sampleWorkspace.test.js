const { isoDay, sampleWorkspace } = require('../src/data/sampleWorkspace');

const now = new Date('2026-10-08T12:00:00.000Z');

describe('sample workspace', () => {
  test('contains 15 to 20 prospects', () => {
    const { prospects } = sampleWorkspace(now);
    expect(prospects.length).toBeGreaterThanOrEqual(15);
    expect(prospects.length).toBeLessThanOrEqual(20);
  });

  test('every prospect has the fields the CRM needs', () => {
    for (const row of sampleWorkspace(now).prospects) {
      for (const field of [
        'id',
        'name',
        'company',
        'jobTitle',
        'status',
        'service',
        'dateAdded',
        'email',
      ]) {
        expect(row[field]).toBeTruthy();
      }
      expect(row.tags).toContain('Sample data');
      expect(Array.isArray(row.tasks)).toBe(true);
    }
  });

  test('represents every pipeline stage', () => {
    const stages = new Set(sampleWorkspace(now).prospects.map((row) => row.status));
    expect(stages).toEqual(
      new Set([
        'New',
        'Contacted',
        'Replied',
        'Interested',
        'Proposal Sent',
        'Converted',
        'Not Interested',
      ]),
    );
  });

  test('has valid dates whenever a date is present', () => {
    for (const row of sampleWorkspace(now).prospects) {
      for (const field of ['dateAdded', 'dateContacted', 'nextFollowup', 'interestedDate']) {
        if (row[field]) expect(row[field]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        if (row[field]) expect(Number.isNaN(Date.parse(row[field]))).toBe(false);
      }
    }
  });

  test('uses unique prospect IDs', () => {
    const ids = sampleWorkspace(now).prospects.map((row) => row.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('activities only reference existing prospects', () => {
    const { prospects, activities } = sampleWorkspace(now);
    const ids = new Set(prospects.map((row) => String(row.id)));
    expect(Object.keys(activities).length).toBeGreaterThan(0);
    for (const id of Object.keys(activities)) {
      expect(ids.has(id)).toBe(true);
      expect(activities[id][0].type).toBe('Message Sent');
    }
  });

  test('returns new objects for each call', () => {
    const first = sampleWorkspace(now);
    const second = sampleWorkspace(now);
    first.prospects[0].name = 'Changed';
    expect(second.prospects[0].name).toBe('Maya Patel');
  });
});

describe('isoDay', () => {
  test('formats a date as ISO day', () => expect(isoDay(0, now)).toBe('2026-10-08'));
  test('moves into the past', () => expect(isoDay(-9, now)).toBe('2026-09-29'));
  test('moves into the future', () => expect(isoDay(25, now)).toBe('2026-11-02'));
  test('rejects fractional offsets', () => expect(() => isoDay(0.5, now)).toThrow(TypeError));
  test('rejects invalid dates', () => expect(() => isoDay(0, 'invalid')).toThrow(TypeError));
});
