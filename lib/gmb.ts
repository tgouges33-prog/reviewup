// Google My Business API utility
// Uses the access token stored by Supabase after Google OAuth

const GMB_BASE = "https://mybusinessbusinessinformation.googleapis.com/v1";
const GMB_ACCOUNTS = "https://mybusinessaccountmanagement.googleapis.com/v1";
const GMB_PERF = "https://businessprofileperformance.googleapis.com/v1";

export async function getAccounts(accessToken: string) {
  const res = await fetch(`${GMB_ACCOUNTS}/accounts`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Impossible de récupérer les comptes GMB");
  return res.json();
}

export async function getLocations(accessToken: string, accountId: string) {
  const res = await fetch(
    `${GMB_BASE}/${accountId}/locations?readMask=name,title,storefrontAddress,websiteUri,regularHours,phoneNumbers,categories,profile`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error("Impossible de récupérer les fiches GMB");
  return res.json();
}

export async function getLocation(accessToken: string, locationName: string) {
  const res = await fetch(
    `${GMB_BASE}/${locationName}?readMask=name,title,storefrontAddress,websiteUri,regularHours,phoneNumbers,categories,profile`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error("Impossible de récupérer la fiche GMB");
  return res.json();
}

export async function updateLocation(
  accessToken: string,
  locationName: string,
  fields: Record<string, any>,
  updateMask: string
) {
  const res = await fetch(
    `${GMB_BASE}/${locationName}?updateMask=${updateMask}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? "Impossible de mettre à jour la fiche");
  }
  return res.json();
}

export async function getLocationMedia(accessToken: string, locationName: string) {
  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/${locationName}/media`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error("Impossible de récupérer les photos");
  return res.json();
}

export async function getReviews(accessToken: string, locationName: string) {
  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/${locationName}/reviews`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error("Impossible de récupérer les avis");
  return res.json();
}

export async function replyToReview(
  accessToken: string,
  reviewName: string,
  comment: string
) {
  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/${reviewName}/reply`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    }
  );
  if (!res.ok) throw new Error("Impossible de répondre à l'avis");
  return res.json();
}

export async function getLocationPerformance(accessToken: string, locationName: string) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 28);

  const params = new URLSearchParams({
    "dailyMetrics": "WEBSITE_CLICKS",
    "dailyRange.start_date.year": String(start.getFullYear()),
    "dailyRange.start_date.month": String(start.getMonth() + 1),
    "dailyRange.start_date.day": String(start.getDate()),
    "dailyRange.end_date.year": String(end.getFullYear()),
    "dailyRange.end_date.month": String(end.getMonth() + 1),
    "dailyRange.end_date.day": String(end.getDate()),
  });

  const metrics = [
    "WEBSITE_CLICKS",
    "CALL_CLICKS",
    "BUSINESS_DIRECTION_REQUESTS",
    "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
    "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
    "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
    "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
  ];

  const metricsParams = metrics.map((m) => `dailyMetrics=${m}`).join("&");
  const dateParams = [
    `dailyRange.start_date.year=${start.getFullYear()}`,
    `dailyRange.start_date.month=${start.getMonth() + 1}`,
    `dailyRange.start_date.day=${start.getDate()}`,
    `dailyRange.end_date.year=${end.getFullYear()}`,
    `dailyRange.end_date.month=${end.getMonth() + 1}`,
    `dailyRange.end_date.day=${end.getDate()}`,
  ].join("&");

  const res = await fetch(
    `${GMB_PERF}/${locationName}:fetchMultiDailyMetricsTimeSeries?${metricsParams}&${dateParams}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error("Impossible de récupérer les statistiques");
  return res.json();
}
