import prisma from '@/lib/prisma';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Clerk Webhook: create or delete a user in the database by Clerk ID
export async function POST(req: Request) {
    try {
        // Parse the Clerk Webhook event
        const evt = (await req.json()) as WebhookEvent;

        const { id: clerkUserId } = evt.data;
        if (!clerkUserId)
            return NextResponse.json(
                { error: 'No user ID provided' },
                { status: 400 },
            );

        // Create or delete a user in the database based on the Clerk Webhook event
        let user = null;
        switch (evt.type) {
            case 'user.created': {
                const { email_addresses = [] } = evt.data;
                const email = email_addresses?.[0]?.email_address ?? '';

                if (!email)
                    return NextResponse.json(
                        { error: 'No email provided' },
                        { status: 400 },
                    );

                user = await prisma.user.upsert({
                    where: {
                        userId: clerkUserId,
                    },
                    update: {
                        userId: clerkUserId,
                        email,
                    },
                    create: {
                        userId: clerkUserId,
                        email: email,
                        firstName: evt.data.first_name!,
                        lastName: evt.data.last_name!,

                    },
                });
                break;
            }
            case 'user.deleted': {
                user = await prisma.user.delete({
                    where: {
                        userId: clerkUserId,
                    },
                });
                break;
            }
            default:
                break;
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}