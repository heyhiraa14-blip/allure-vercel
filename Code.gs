/**
 * ═══════════════════════════════════════════════════════════════
 *  ALLURE SALON — Google Apps Script Backend
 *  Karachi · Hair, Skin & Bridal Studio
 * ═══════════════════════════════════════════════════════════════
 *
 *  SETUP (one time, 2 minutes):
 *  1. Paste this into Code.gs
 *  2. File > New > HTML file — name it exactly: Index
 *  3. Save. Run > setup  (authorize when asked — this creates the sheet)
 *  4. Deploy > New deployment > Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Open the /exec URL. Done.
 *
 *  UPDATED: This version automatically adds any new services to your
 *  existing Services sheet on the next page load — no manual reset needed.
 * ═══════════════════════════════════════════════════════════════
 */

const SHEET_ID_KEY     = 'ALLURE_SPREADSHEET_ID';
const SPREADSHEET_NAME = 'Allure Salon Data';

const SALON_DEFAULTS = {
  name:     'Allure Studio',
  currency: 'Rs ',
  address:  'Shop 4, 4-C Lane, Khayaban-e-Shahbaz, DHA Phase 6, Karachi',
  phone:    '+92 21 3584 5520',
  email:    'hello@allure.pk',
  hours:    'Tuesday – Sunday · 11:00 AM – 9:00 PM'
};

const IMG = {
  haircut:     'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=85&auto=format&fit=crop',
  goldFacial:  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=85&auto=format&fit=crop',
  balayage:    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=85&auto=format&fit=crop',
  bridal:      'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=900&q=85&auto=format&fit=crop',
  hydra:       'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=900&q=85&auto=format&fit=crop',
  nails:       'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=85&auto=format&fit=crop',
  spa:         'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=85&auto=format&fit=crop',
  keratin:     'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=900&q=85&auto=format&fit=crop',
  pedicure:    'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=900&q=85&auto=format&fit=crop',
  partyMakeup: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=85&auto=format&fit=crop',
  massage:     'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=900&q=85&auto=format&fit=crop',
  brow:        'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=900&q=85&auto=format&fit=crop'
};

// id, name, category, description, price, duration, image, featured
const SERVICES_SEED = [
  // HAIR
  ['S01','Cut & Blow-dry','Hair','Consultation, wash, precision cut and finish. Includes a proper chat about your hair type.',3500,'50 min',IMG.haircut,'TRUE'],
  ['S02','Balayage & Toner','Hair','Hand-painted colour for a soft, grown-in look. Includes a bond treatment and toner.',18000,'2.5 hrs',IMG.balayage,'TRUE'],
  ['S03','Global Hair Colour','Hair','Full-head single-tone colour with ammonia-free formula and aftercare wash.',12000,'2 hrs',IMG.balayage,'FALSE'],
  ['S04','Highlights & Lowlights','Hair','Foil highlights for depth and dimension. Toner and blow-dry included.',15000,'2.5 hrs',IMG.balayage,'FALSE'],
  ['S05','Keratin Smoothening','Hair','Formaldehyde-free smoothening that lasts three to four months.',22000,'3 hrs',IMG.keratin,'FALSE'],
  ['S06','Hair Spa & Repair','Hair','Deep-conditioning ritual with steam, scalp massage and bond-repair mask.',4500,'60 min',IMG.keratin,'FALSE'],
  ['S07','Party Hairstyling','Hair','Blow-dry, curls, updo or sleek styling for events, mehndis and dinners.',5500,'45 min',IMG.haircut,'FALSE'],

  // SKIN
  ['S08','Signature Facial','Skin','Deep cleanse, extraction and a hydrating mask suited to your skin. Gentle, not aggressive.',6500,'60 min',IMG.goldFacial,'TRUE'],
  ['S09','HydraGlow Facial','Skin','Hyaluronic infusion for an instant dewy finish. Good before events or shoots.',8500,'50 min',IMG.hydra,'FALSE'],
  ['S10','24K Gold Facial','Skin','Gold-leaf mask that lifts, brightens and gives a subtle glow. Popular before weddings.',9500,'70 min',IMG.goldFacial,'FALSE'],
  ['S11','Anti-Aging Facial','Skin','Peptide and collagen treatment targeting fine lines and firmness.',11000,'75 min',IMG.goldFacial,'FALSE'],
  ['S12','Acne Clear Facial','Skin','Gentle deep-cleanse for congested or acne-prone skin. No harsh extraction.',7500,'60 min',IMG.hydra,'FALSE'],

  // MAKEUP
  ['S13','HD Party Makeup','Makeup','Camera-ready HD base, lashes and light contour for dinners and events.',12000,'60 min',IMG.partyMakeup,'FALSE'],
  ['S14','Soft Glam / Natural Makeup','Makeup','Barely-there base with soft eyes. Great for daytime functions and shoots.',8000,'45 min',IMG.partyMakeup,'FALSE'],

  // BRIDAL
  ['S15','Bridal Makeup & Hair','Bridal','Full bridal look with airbrush base, lashes, draping and hair styling. Trial included.',75000,'3 hrs',IMG.bridal,'TRUE'],
  ['S16','Engagement Makeup','Bridal','Soft-glam engagement look with hair styling and dupatta setting.',35000,'2 hrs',IMG.bridal,'FALSE'],
  ['S17','Walima Reception Makeup','Bridal','Reception-ready full glam with HD base, hair styling and jewellery setting.',45000,'2.5 hrs',IMG.bridal,'FALSE'],
  ['S18','Mehndi / Mayun Makeup','Bridal','Colourful, fresh mehndi look with light base and floral hair styling.',25000,'1.5 hrs',IMG.bridal,'FALSE'],

  // NAILS
  ['S19','Gel Nails (Full Set)','Nails','Extensions shaped and painted your way. Lasts three to four weeks.',4500,'90 min',IMG.nails,'TRUE'],
  ['S20','Acrylic Extensions','Nails','Durable acrylic tips in your preferred shape and length. Polish included.',6000,'2 hrs',IMG.nails,'FALSE'],
  ['S21','Nail Art & Design','Nails','Hand-painted art, chrome, French or minimal designs. Priced per nail.',2500,'45 min',IMG.nails,'FALSE'],
  ['S22','Mani & Pedi','Nails','Soak, shape, cuticle care, massage and polish. The basics, done well.',3500,'60 min',IMG.pedicure,'FALSE'],

  // SPA
  ['S23','Full Body Massage','Spa','Warm oil aromatherapy massage. Our most requested treatment on Saturday evenings.',9000,'90 min',IMG.spa,'TRUE'],
  ['S24','Head & Shoulder Massage','Spa','Warm oil scalp and shoulder massage — great if you have had a long week.',2800,'40 min',IMG.massage,'FALSE'],
  ['S25','Body Scrub & Polish','Spa','Full-body exfoliation with sea salt and warm oils. Leaves skin soft and bright.',7500,'60 min',IMG.spa,'FALSE'],
  ['S26','Body Wrap Detox','Spa','Detoxifying clay wrap with a light massage. Great before weddings.',10000,'75 min',IMG.spa,'FALSE'],

  // GROOMING
  ['S27','Threading & Waxing','Grooming','Eyebrows, upper lip, chin or full face. Quick, precise, hygienic.',800,'20 min',IMG.brow,'FALSE'],
  ['S28','Full Face Threading','Grooming','Complete face threading — brows, lip, chin, sides. Includes a cooling gel finish.',1200,'30 min',IMG.brow,'FALSE']
];

// code, title, description, discount, minOrder, expiry, active
const COUPONS_SEED = [
  ['FIRST500','Rs 500 off your first visit','Applies to any service over Rs 3,000. One code per new client.','Rs 500',3000,'31 DEC 2026','TRUE'],
  ['GLOW15','15% off all facials','Valid on any facial, including HydraGlow and Signature.','15%',5000,'31 DEC 2026','TRUE'],
  ['BRIDAL50','Rs 5,000 off bridal packages','For complete bridal packages booked at least one month in advance.','Rs 5,000',60000,'31 DEC 2026','TRUE'],
  ['WEEKDAY10','10% off on weekdays','Tuesday to Thursday, any service. Our quietest days — you get our full attention.','10%',0,'31 DEC 2026','TRUE'],
  ['SPA1000','Rs 1,000 off spa rituals','On full body massages above Rs 8,000. Bundle a facial for an extra Rs 500 off.','Rs 1,000',8000,'31 DEC 2026','TRUE'],
  ['REFER500','Rs 500 each on referral','Refer a friend and you both get Rs 500 off. Currently paused.','Rs 500',0,'31 DEC 2026','FALSE']
];

/* ═══════════════════════════════════════════════════════════════
   WEB APP ENTRY
   ═══════════════════════════════════════════════════════════════ */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Allure — Hair, Skin & Bridal Studio, Karachi')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ═══════════════════════════════════════════════════════════════
   HTTP API — used by the Vercel frontend
   ═══════════════════════════════════════════════════════════════ */
function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents
      ? JSON.parse(e.postData.contents)
      : {};

    const action = String(body.action || '').trim();

    let result;
    if (action === 'getInitialData') {
      result = getInitialData();
    } else if (action === 'checkCoupon') {
      result = checkCoupon(body.code);
    } else if (action === 'submitContact') {
      result = submitContact(body.payload || {});
    } else {
      result = { ok: false, message: 'Unknown API action.' };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        message: 'API error: ' + (e && e.message ? e.message : e)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* ═══════════════════════════════════════════════════════════════
   SETUP — run once manually from the Apps Script editor
   ═══════════════════════════════════════════════════════════════ */
function setup() {
  const ss = getOrCreateSpreadsheet();
  ensureSheets(ss);
  syncServices(ss);
  syncCoupons(ss);
  Logger.log('✅ Setup complete. Spreadsheet ID: ' + ss.getId());
  Logger.log('   URL: ' + ss.getUrl());
}

/* ═══════════════════════════════════════════════════════════════
   SPREADSHEET HANDLING
   ═══════════════════════════════════════════════════════════════ */
function getOrCreateSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  const existingId = props.getProperty(SHEET_ID_KEY);

  if (existingId) {
    try {
      return SpreadsheetApp.openById(existingId);
    } catch (e) {
      // Fall through and recreate
    }
  }

  const ss = SpreadsheetApp.create(SPREADSHEET_NAME);
  props.setProperty(SHEET_ID_KEY, ss.getId());
  return ss;
}

function ensureSheets(ss) {
  // SALON
  let salon = ss.getSheetByName('Salon');
  if (!salon) {
    salon = ss.insertSheet('Salon');
    salon.appendRow(['key', 'value']);
    salon.appendRow(['name', SALON_DEFAULTS.name]);
    salon.appendRow(['currency', SALON_DEFAULTS.currency]);
    salon.appendRow(['address', SALON_DEFAULTS.address]);
    salon.appendRow(['phone', SALON_DEFAULTS.phone]);
    salon.appendRow(['email', SALON_DEFAULTS.email]);
    salon.appendRow(['hours', SALON_DEFAULTS.hours]);
    salon.setColumnWidth(1, 140);
    salon.setColumnWidth(2, 500);
  }

  // SERVICES
  let services = ss.getSheetByName('Services');
  if (!services) {
    services = ss.insertSheet('Services');
    services.appendRow(['id','name','category','description','price','duration','image','featured']);
    SERVICES_SEED.forEach(function (row) { services.appendRow(row); });
    services.setColumnWidth(1, 60);
    services.setColumnWidth(2, 220);
    services.setColumnWidth(3, 100);
    services.setColumnWidth(4, 420);
    services.setColumnWidth(5, 90);
    services.setColumnWidth(6, 90);
    services.setColumnWidth(7, 340);
    services.setColumnWidth(8, 90);
  }

  // COUPONS
  let coupons = ss.getSheetByName('Coupons');
  if (!coupons) {
    coupons = ss.insertSheet('Coupons');
    coupons.appendRow(['code','title','description','discount','minOrder','expiry','active']);
    COUPONS_SEED.forEach(function (row) { coupons.appendRow(row); });
    coupons.setColumnWidth(1, 110);
    coupons.setColumnWidth(2, 240);
    coupons.setColumnWidth(3, 420);
    coupons.setColumnWidth(4, 100);
    coupons.setColumnWidth(5, 100);
    coupons.setColumnWidth(6, 130);
    coupons.setColumnWidth(7, 80);
  }

  // CONTACTS
  let contacts = ss.getSheetByName('Contacts');
  if (!contacts) {
    contacts = ss.insertSheet('Contacts');
    contacts.appendRow(['timestamp','name','phone','email','service','message']);
    contacts.setColumnWidth(1, 160);
    contacts.setColumnWidth(2, 180);
    contacts.setColumnWidth(3, 160);
    contacts.setColumnWidth(4, 220);
    contacts.setColumnWidth(5, 220);
    contacts.setColumnWidth(6, 400);
  }
}

/* ═══════════════════════════════════════════════════════════════
   SYNC — add any missing services/coupons by id/code
   ═══════════════════════════════════════════════════════════════ */
function syncServices(ss) {
  try {
    const sheet = ss.getSheetByName('Services');
    if (!sheet) return;

    const values = sheet.getDataRange().getValues();
    const existingIds = {};
    for (let i = 1; i < values.length; i++) {
      const id = String(values[i][0] || '').trim();
      if (id) existingIds[id] = true;
    }

    let added = 0;
    SERVICES_SEED.forEach(function (row) {
      if (!existingIds[row[0]]) {
        sheet.appendRow(row);
        added++;
      }
    });
    if (added > 0) Logger.log('syncServices: added ' + added + ' new services');
  } catch (e) {
    Logger.log('syncServices error: ' + e);
  }
}

function syncCoupons(ss) {
  try {
    const sheet = ss.getSheetByName('Coupons');
    if (!sheet) return;

    const values = sheet.getDataRange().getValues();
    const existingCodes = {};
    for (let i = 1; i < values.length; i++) {
      const code = String(values[i][0] || '').trim().toUpperCase();
      if (code) existingCodes[code] = true;
    }

    let added = 0;
    COUPONS_SEED.forEach(function (row) {
      if (!existingCodes[row[0].toUpperCase()]) {
        sheet.appendRow(row);
        added++;
      }
    });
    if (added > 0) Logger.log('syncCoupons: added ' + added + ' new coupons');
  } catch (e) {
    Logger.log('syncCoupons error: ' + e);
  }
}

/* ═══════════════════════════════════════════════════════════════
   READ HELPERS
   ═══════════════════════════════════════════════════════════════ */
function sheetToObjects(sheet) {
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(function (h) { return String(h).trim(); });
  const out = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    let hasData = false;
    for (let k = 0; k < row.length; k++) {
      if (row[k] !== '' && row[k] !== null && row[k] !== undefined) { hasData = true; break; }
    }
    if (!hasData) continue;

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    out.push(obj);
  }
  return out;
}

function readSalon(ss) {
  const sheet = ss.getSheetByName('Salon');
  const rows = sheetToObjects(sheet);
  const salon = {
    name:     SALON_DEFAULTS.name,
    currency: SALON_DEFAULTS.currency,
    address:  SALON_DEFAULTS.address,
    phone:    SALON_DEFAULTS.phone,
    email:    SALON_DEFAULTS.email,
    hours:    SALON_DEFAULTS.hours
  };
  rows.forEach(function (r) {
    const key = String(r.key || '').trim();
    const val = r.value;
    if (key) salon[key] = val;
  });
  return salon;
}

function readServices(ss) {
  const sheet = ss.getSheetByName('Services');
  const rows = sheetToObjects(sheet);
  return rows.map(function (r) {
    return {
      id:          String(r.id || ''),
      name:        String(r.name || ''),
      category:    String(r.category || ''),
      description: String(r.description || ''),
      price:       Number(r.price) || 0,
      duration:    String(r.duration || ''),
      image:       String(r.image || ''),
      featured:    String(r.featured).toUpperCase() === 'TRUE'
    };
  });
}

function readCoupons(ss) {
  const sheet = ss.getSheetByName('Coupons');
  const rows = sheetToObjects(sheet);
  return rows.map(function (r) {
    return {
      code:        String(r.code || '').trim().toUpperCase(),
      title:       String(r.title || ''),
      description: String(r.description || ''),
      discount:    String(r.discount || ''),
      minOrder:    Number(r.minOrder) || 0,
      expiry:      String(r.expiry || ''),
      active:      String(r.active).toUpperCase() === 'TRUE'
    };
  });
}

/* ═══════════════════════════════════════════════════════════════
   PUBLIC API — called from the client
   ═══════════════════════════════════════════════════════════════ */
function getInitialData() {
  try {
    const ss = getOrCreateSpreadsheet();
    ensureSheets(ss);

    // Auto-add any services/coupons present in code but missing from the sheet.
    // Only runs if there is a mismatch, so on steady state this is a no-op.
    const currentServices = readServices(ss);
    const currentCoupons  = readCoupons(ss);
    if (currentServices.length < SERVICES_SEED.length) syncServices(ss);
    if (currentCoupons.length  < COUPONS_SEED.length)  syncCoupons(ss);

    return {
      ok: true,
      data: {
        salon:    readSalon(ss),
        services: readServices(ss),
        coupons:  readCoupons(ss)
      }
    };
  } catch (e) {
    return {
      ok: false,
      message: 'Could not load data: ' + (e && e.message ? e.message : e)
    };
  }
}

function checkCoupon(code) {
  try {
    code = String(code || '').trim().toUpperCase();
    if (!code) {
      return { ok: false, message: 'Please enter a coupon code.' };
    }

    const ss = getOrCreateSpreadsheet();
    ensureSheets(ss);

    const coupons = readCoupons(ss);
    let found = null;
    for (let i = 0; i < coupons.length; i++) {
      if (coupons[i].code === code) { found = coupons[i]; break; }
    }

    if (!found) {
      return { ok: false, message: 'That code is invalid. Please check and try again.' };
    }
    if (!found.active) {
      return { ok: false, message: 'That code is no longer active.' };
    }

    let extra = '';
    if (found.minOrder > 0) {
      extra = ' Minimum spend ' + found.minOrder + '.';
    }
    return {
      ok: true,
      message: 'Applied — ' + found.title + '.' + extra + ' Mention it at the desk.'
    };
  } catch (e) {
    return {
      ok: false,
      message: 'Could not verify that code. Please try again.'
    };
  }
}

function submitContact(payload) {
  try {
    payload = payload || {};
    const name    = String(payload.name    || '').trim();
    const phone   = String(payload.phone   || '').trim();
    const email   = String(payload.email   || '').trim();
    const service = String(payload.service || '').trim();
    const message = String(payload.message || '').trim();

    if (!name || !phone || !email) {
      return { ok: false, message: 'Please fill in all required fields.' };
    }

    const ss = getOrCreateSpreadsheet();
    ensureSheets(ss);

    const sheet = ss.getSheetByName('Contacts');
    sheet.appendRow([
      new Date(),
      name,
      phone,
      email,
      service,
      message
    ]);

    return {
      ok: true,
      message: 'Message received — we will reply within 24 hours.'
    };
  } catch (e) {
    return {
      ok: false,
      message: 'Could not save your message right now. Please try again.'
    };
  }
}

/* ═══════════════════════════════════════════════════════════════
   (Optional) Reset — archives the current sheet and starts fresh
   ═══════════════════════════════════════════════════════════════ */
function resetDemoData() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty(SHEET_ID_KEY);
  if (id) {
    try {
      const old = SpreadsheetApp.openById(id);
      old.rename(old.getName() + ' (archived ' + new Date().toISOString() + ')');
    } catch (e) { /* ignore */ }
    props.deleteProperty(SHEET_ID_KEY);
  }
  setup();
  Logger.log('🔄 Demo data reset.');
}

/* ═══════════════════════════════════════════════════════════════
   (Optional) Menu for bound scripts
   ═══════════════════════════════════════════════════════════════ */
function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('Allure')
      .addItem('Setup / sync sheets', 'setup')
      .addToUi();
  } catch (e) {
    // Not a bound script — ignore
  }
}