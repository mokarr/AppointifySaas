'use server';

import { db } from '@/libs/DB';
import { organizationSchema } from '@/models/Schema';

export const getData = async () => {
  const data = await db.select().from(organizationSchema);
  return data;
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
