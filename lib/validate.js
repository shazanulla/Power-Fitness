// Validates enquiries, free-trial bookings and class bookings sent from the website.
const site = require('../data/site.json');

const TYPES = ['enquiry', 'trial', 'class'];
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function todayInGymTz() {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: site.gym.timezone || 'Asia/Kolkata' });
  return fmt.format(new Date()); // YYYY-MM-DD
}

function daysFromToday(isoDate) {
  const a = Date.parse(todayInGymTz() + 'T00:00:00Z');
  const b = Date.parse(isoDate + 'T00:00:00Z');
  return Math.round((b - a) / 86400000);
}

function validateSubmission(body) {
  const errors = {};
  const type = TYPES.includes(body.type) ? body.type : 'enquiry';

  const data = {
    type,
    name: clean(body.name, 80),
    phone: clean(body.phone, 20).replace(/[^\d+\s-]/g, ''),
    email: clean(body.email, 120),
    age: clean(body.age, 3),
    gender: clean(body.gender, 20),
    plan: clean(body.plan, 40),
    program: clean(body.program, 40),
    trainer: clean(body.trainer, 40),
    date: clean(body.date, 10),
    time: clean(body.time, 10),
    classId: clean(body.classId, 40),
    message: clean(body.message, 1000),
  };

  if (data.name.length < 2) errors.name = 'Please enter your full name.';
  const digits = data.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) errors.phone = 'Please enter a valid 10-digit mobile number.';
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Please enter a valid email address.';
  if (data.age && (!/^\d+$/.test(data.age) || +data.age < 12 || +data.age > 90)) errors.age = 'Age should be between 12 and 90.';
  if (data.plan && !site.plans.some((p) => p.id === data.plan)) errors.plan = 'Please choose a valid plan.';
  if (data.program && !site.programs.some((p) => p.id === data.program)) errors.program = 'Please choose a valid program.';
  if (data.trainer && !site.trainers.some((t) => t.id === data.trainer)) errors.trainer = 'Please choose a valid trainer.';

  if (type === 'trial' || type === 'class') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(data.date))) {
      errors.date = 'Please pick a date.';
    } else {
      const d = daysFromToday(data.date);
      if (d < 0 || d > 14) errors.date = 'Please pick a date within the next two weeks.';
    }
  }
  if (type === 'trial' && !/^\d{2}:\d{2}$/.test(data.time)) errors.time = 'Please pick a time slot.';

  if (type === 'class') {
    const cls = site.classes.find((c) => c.id === data.classId);
    if (!cls) {
      errors.classId = 'Please choose a valid class.';
    } else if (!errors.date) {
      const day = DAY_KEYS[new Date(data.date + 'T00:00:00Z').getUTCDay()];
      if (!cls.days.includes(day)) errors.date = `${cls.title} does not run on that day.`;
      data.time = cls.time;
      data.className = cls.title;
      data.trainer = cls.trainer;
    }
  }

  // Drop empty fields to keep records tidy.
  for (const k of Object.keys(data)) if (data[k] === '') delete data[k];
  return { data, errors };
}

module.exports = { validateSubmission, clean };
