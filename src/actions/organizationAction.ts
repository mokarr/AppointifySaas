'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { organizationSchema } from '@/models/Schema';

export const getOrganizations = async () => {
  const data = await db.select().from(organizationSchema);
  return data;
};

export const getOrganization = async (userId: string) => {
  const data = await db
    .select()
    .from(organizationSchema)
    .where(eq(organizationSchema.id, userId))
    .limit(1); // Fetch only one record since we're checking for existence

  return data.length > 0 ? data[0] : null; // Return the organization if found, otherwise return null
};

export const addOrganization = async (
  id: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  stripeSubscriptionPriceId: string,
  stripeSubscriptionStatus: string,
  stripeSubscriptionCurrentPeriodEnd: number,
) => {
  await db.insert(organizationSchema).values({
    id,
    stripeCustomerId,
    stripeSubscriptionId,
    stripeSubscriptionPriceId,
    stripeSubscriptionStatus,
    stripeSubscriptionCurrentPeriodEnd,
  });
};

// export const deleteTodo = async (id: number) => {
//   await db.delete(organizationSchema).where(eq(organizationSchema.id, id));

//   revalidatePath('/');
// };
