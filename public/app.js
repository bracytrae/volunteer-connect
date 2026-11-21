const grid = document.querySelector('#opportunity-grid');
const searchInput = document.querySelector('#search');
const status = document.querySelector('#notification');
let opportunities = [];

function showMessage(message, isError = false) {
  status.textContent = message;
  status.classList.toggle('error', isError);
  status.hidden = false;
  window.setTimeout(() => { status.hidden = true; }, 4000);
}

async function api(endpoint, options = {}) {
  const response = await fetch(`/api${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Request failed.');
  return result;
}

function dateLabel(value) {
  const datePart = String(value).slice(0, 10);
  const date = new Date(`${datePart}T12:00:00`);
  return Number.isNaN(date.getTime()) ? datePart : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderOpportunities() {
  const term = searchInput.value.trim().toLowerCase();
  const matches = opportunities.filter((o) =>
    [o.title, o.organization, o.description, o.location, o.category]
      .some((value) => value.toLowerCase().includes(term))
  );
  grid.replaceChildren();
  if (!matches.length) {
    grid.append(el('p', 'muted', 'No matching opportunities. Try another search.'));
    return;
  }

  for (const opportunity of matches) {
    const card = el('article', 'opportunity-card');
    card.append(el('span', 'category', opportunity.category));
    card.append(el('h3', '', opportunity.title));
    card.append(el('p', 'organization', opportunity.organization));
    card.append(el('p', 'description', opportunity.description));
    const details = el('div', 'event-details');
    details.append(el('span', '', `📅 ${dateLabel(opportunity.event_date)}`));
    details.append(el('span', '', `📍 ${opportunity.location}`));
    card.append(details);
    const button = el('button', 'primary-button', opportunity.registered ? '✓ Registered' : 'Register for event');
    button.type = 'button';
    button.disabled = opportunity.registered;
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        await api('/registrations', { method: 'POST', body: JSON.stringify({ opportunityId: opportunity.id }) });
        showMessage(`Registered for ${opportunity.title}!`);
        await refresh();
      } catch (error) {
        button.disabled = false;
        showMessage(error.message, true);
      }
    });
    card.append(button);
    grid.append(card);
  }
}

function renderDashboard(data) {
  document.querySelector('#student-name').textContent = data.student?.name || 'Demo Student';
  document.querySelector('#registered-count').textContent = data.registrations.length;
  document.querySelector('#total-hours').textContent = data.totalHours.toFixed(2);

  const registrations = document.querySelector('#registrations-list');
  registrations.replaceChildren();
  if (!data.registrations.length) {
    registrations.append(el('p', 'muted', 'No registrations yet. Explore the opportunities below!'));
  } else {
    for (const r of data.registrations) {
      const row = el('div', 'registration-row');
      row.append(el('strong', '', r.title));
      row.append(el('small', '', `${dateLabel(r.event_date)} • ${r.location}`));
      registrations.append(row);
    }
  }

  const select = document.querySelector('#hours-event');
  const previousValue = select.value;
  select.replaceChildren(new Option('Select an event', ''));
  for (const r of data.registrations) {
    select.append(new Option(r.title, String(r.opportunity_id)));
  }
  if ([...select.options].some((opt) => opt.value === previousValue)) select.value = previousValue;
  document.querySelector('#hours-form button').disabled = data.registrations.length === 0;

  const activity = document.querySelector('#activity-list');
  activity.replaceChildren();
  if (!data.hourLogs.length) {
    activity.append(el('p', 'muted', 'No service hours logged yet.'));
  } else {
    for (const log of data.hourLogs) {
      const row = el('div', 'activity-row');
      row.append(el('strong', '', `${log.hours} hour(s) • ${log.title}`));
      row.append(el('small', '', dateLabel(log.service_date)));
      activity.append(row);
    }
  }
}

async function refresh() {
  const [list, dashboard] = await Promise.all([api('/opportunities'), api('/dashboard')]);
  opportunities = list.opportunities;
  renderOpportunities();
  renderDashboard(dashboard);
}

searchInput.addEventListener('input', renderOpportunities);
document.querySelector('#hours-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  const opportunityId = Number(document.querySelector('#hours-event').value);
  const hours = Number(document.querySelector('#hours-amount').value);
  button.disabled = true;
  try {
    await api('/hours', { method: 'POST', body: JSON.stringify({ opportunityId, hours }) });
    document.querySelector('#hours-amount').value = '';
    showMessage('Volunteer hours saved successfully!');
    await refresh();
  } catch (error) {
    button.disabled = false;
    showMessage(error.message, true);
  }
});

refresh().catch((error) => {
  grid.replaceChildren(el('p', 'muted', 'Could not load opportunities. Check the server and database.'));
  document.querySelector('#registrations-list').replaceChildren(el('p', 'muted', 'Could not load the dashboard.'));
  showMessage(error.message, true);
});
