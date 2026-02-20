export async function generateAttendanceHash(
  wallet: string,
  eventId: string
): Promise<Uint8Array> {

  const salt = "ATTEND_SECRET";
  const data = `${wallet}-${eventId}-${salt}`;

  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(data)
  );

  // IMPORTANT: return raw bytes, NOT hex string
  return new Uint8Array(buffer);
}
