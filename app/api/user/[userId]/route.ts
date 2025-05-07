'use server';

import prisma from '@/lib/prisma';
import { getSignedInUserOrThrow } from '@/lib/utils/database_utils';
import { auth } from '@clerk/nextjs/server';


export const getCurrentUserProfile = async () => {
    const { userId: clerkUserId, redirectToSignIn } = await auth()

    if(!clerkUserId) return redirectToSignIn;

     const user = await prisma.user.findUnique({
          where: {
            userId: clerkUserId,
          },
          include: {
            Subscriptions: {
                include: {
                    SubscriptionPlan: true
                }
            }
        }
        });
        
        if (!user) {
          return redirectToSignIn;
        }
        
        return user
}