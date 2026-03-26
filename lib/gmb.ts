// Google My Business API utility
// Uses the access token stored by Supabase after Google OAuth

const GMB_BASE = "https://mybusinessbusinessinformation.googleapis.com/v1";
const GMB_ACCOUNTS = "https://mybusinessaccountmanagement.googleapis.com/v1";

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
