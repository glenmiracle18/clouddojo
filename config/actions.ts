"use server";

import {
  type Variant,
  cancelSubscription,
  createCheckout,
  getPrice,
  getProduct,
  getSubscription,
  listPrices,
  listProducts,
  updateSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";

import {
  LsSubscriptionPlan,
  LsUserSubscription,
  LsWebhookEvent,
  VariantType,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import { webhookHasData, webhookHasMeta } from "./typeguards";
import { configureLemonSqueezy } from "./lemonsqueezy";
import { getSignedInUserOrThrow } from "@/lib/utils/database_utils";
import prisma from "@/lib/prisma";

/**
 * Create a Lemon Squeezy checkout for a specific product variant and return its URL.
 *
 * @param variantId - The Lemon Squeezy variant ID to create a checkout for
 * @param embed - When true, request an embeddable checkout experience
 * @returns The checkout URL if available, otherwise `undefined`
 */
export async function getCheckoutURL(variantId: number, embed = false) {
  configureLemonSqueezy();

  // Get the signed in user or throw an error.
  const user = await getSignedInUserOrThrow();

  const checkout = await createCheckout(
    process.env.LEMONSQUEEZY_STORE_ID!,
    variantId,
    {
      checkoutOptions: {
        embed,
        media: false,
        logo: !embed,
      },
      checkoutData: {
        email: user.email,
        custom: {
          userId: user.userId,
          clerkUserId: user.userId,
        },
      },
      productOptions: {
        enabledVariants: [variantId],
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/`,
        receiptButtonText: "Go to Dashboard",
        receiptThankYouNote:
          "Thank you for signing up to Clouddojo.tech! Lets get you ready for the certification exams",
      },
    },
  );

  return checkout.data?.data.attributes.url;
}

/**
 * Synchronizes subscription product variants from Lemon Squeezy into the local Plans database.
 *
 * Upserts subscription variants as local subscription plans; non-subscription variants are ignored.
 *
 * @returns The array of subscription plans as stored in the database after synchronization
 */
export async function syncPlans() {
  // must configure Lemon Squeezy before using it.
  configureLemonSqueezy();

  // Fetch all the variants from the database.
  const productVariants: LsSubscriptionPlan[] =
    await prisma.lsSubscriptionPlan.findMany();

  /**
   * Upserts a subscription plan variant into the database and appends the resulting record to the in-memory productVariants array.
   *
   * @param variant - Subscription plan data to create or update; must include `variantId` to match existing records.
   */
  async function _addVariant(
    variant: Omit<LsSubscriptionPlan, "id" | "createdAt" | "updatedAt">,
  ) {
    // eslint-disable-next-line no-console -- allow
    console.log(`Syncing variant ${variant.name} with the database...`);

    // Sync the variant with the plan in the database.
    const newVariant = await prisma.lsSubscriptionPlan.upsert({
      where: { variantId: variant.variantId },
      create: variant,
      update: variant,
    });

    /* eslint-disable no-console -- allow */
    console.log(`${variant.name} synced with the database...`);

    productVariants.push(newVariant);
  }

  // Fetch products from the Lemon Squeezy store.
  const products = await listProducts({
    filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
    include: ["variants"],
  });

  // log
  console.log(
    `Found ${products.data?.data.length} products in the Lemon Squeezy store.`,
  );

  // Loop through all the variants.
  const allVariants = products.data?.included as Variant["data"][] | undefined;

  // for...of supports asynchronous operations, unlike forEach.
  if (allVariants) {
    for (const v of allVariants) {
      const variant = v.attributes;

      // Skip draft variants or if there's more than one variant, skip the default
      // variant. See https://docs.lemonsqueezy.com/api/variants
      if (
        variant.status === "draft" ||
        (allVariants.length !== 1 && variant.status === "pending")
      ) {
        // `return` exits the function entirely, not just the current iteration.
        continue;
      }

      // Fetch the Product name.
      const productName =
        (await getProduct(variant.product_id)).data?.data.attributes.name ?? "";

      // Fetch the Price object.
      const variantPriceObject = await listPrices({
        filter: {
          variantId: v.id,
        },
      });

      const currentPriceObj = variantPriceObject.data?.data.at(0);
      const isUsageBased =
        currentPriceObj?.attributes.usage_aggregation !== null;
      const interval =
        currentPriceObj?.attributes.renewal_interval_unit ?? null;
      const intervalCount =
        currentPriceObj?.attributes.renewal_interval_quantity ?? null;
      const trialInterval =
        currentPriceObj?.attributes.trial_interval_unit ?? null;
      const trialIntervalCount =
        currentPriceObj?.attributes.trial_interval_quantity ?? null;

      const price = isUsageBased
        ? currentPriceObj?.attributes.unit_price_decimal
        : currentPriceObj.attributes.unit_price;

      const priceString = price !== null ? (price?.toString() ?? "") : "";

      const isSubscription =
        currentPriceObj?.attributes.category === "subscription";

      // If not a subscription, skip it.
      if (!isSubscription) {
        continue;
      }

      /**
       * Convert a LemonSqueezy license length unit string into the corresponding VariantType.
       *
       * @param unit - The license length unit from LemonSqueezy (e.g., `"days"`, `"months"`, `"years"`).
       * @returns The matching `VariantType`: `"DAYS"`, `"MONTHS"`, or `"YEARS"`.
       * @throws Error if `unit` is not one of the expected values.
       */
      function mapLicenseUnitToVariantType(unit: string): VariantType {
        switch (unit) {
          case "days":
            return "DAYS";
          case "months":
            return "MONTHS";
          case "years":
            return "YEARS";
          default:
            throw new Error(`Unknown license_length_unit: ${unit}`);
        }
      }

      await _addVariant({
        name: variant.name,
        description: variant.description ?? null,
        price: priceString,
        interval,
        intervalCount,
        isUsageBased,
        productId: variant.product_id,
        productName,
        variantId: parseInt(v.id, 10),
        trialInterval,
        trialIntervalCount,
        features: [],
        individual: false,
        variantType: mapLicenseUnitToVariantType(variant.license_length_unit),
        team: false,
      });
    }
  }

  return productVariants;
}

/**
 * Retrieve subscription plans from the database, ensuring they are synchronized with LemonSqueezy.
 *
 * Ensures local plan records are up-to-date by calling synchronization before querying. Each returned
 * plan includes a guaranteed `features` array (defaults to `[]`) and a numeric `sort` key parsed from `price`.
 *
 * @returns An array of subscription plans augmented with `features` and a numeric `sort` value.
 * @throws Error if synchronization or database retrieval fails.
 */
export async function fetchPlans() {
  try {
    await syncPlans();
    const plans = await prisma.lsSubscriptionPlan.findMany({
      orderBy: {
        price: "asc",
      },
    });

    if (!plans.length) {
      await syncPlans();
      return await prisma.lsSubscriptionPlan.findMany({
        orderBy: {
          price: "asc",
        },
      });
    }

    return plans.map((plan) => ({
      ...plan,
      features: plan.features || [],
      sort: parseFloat(plan.price || "0"),
    }));
  } catch (error) {
    throw new Error(`Failed to fetch plans: ${error}`);
  }
}

/**
 * This action will store a webhook event in the database.
 * @param eventName - The name of the event.
 * @param body - The body of the event.
 */
export async function storeWebhookEvent(
  eventName: string,
  body: LsWebhookEvent["body"],
) {
  const event = await prisma.lsWebhookEvent.create({
    data: {
      eventName,
      processed: false,
      body: JSON.parse(JSON.stringify(body)),
    },
  });

  return event;
}

/**
 * Process a stored LemonSqueezy webhook event and persist resulting subscription, order, or license changes.
 *
 * Handles events contained in the provided stored webhook record; for subscription events this upserts the corresponding
 * user subscription and records any processing error on the webhook event, then marks the webhook as processed.
 *
 * @param webhookEvent - The stored webhook event record to process (lsWebhookEvent)
 */
export async function processWebhookEvent(webhookEvent: LsWebhookEvent) {
  configureLemonSqueezy();

  let processingError = "";
  const eventBody = webhookEvent.body;

  if (!webhookHasMeta(eventBody)) {
    processingError = "Event body is missing the 'meta' property.";
  } else if (webhookHasData(eventBody)) {
    if (webhookEvent.eventName.startsWith("subscription_payment_")) {
      // Save subscription invoices; eventBody is a SubscriptionInvoice
      // Not implemented.
    } else if (webhookEvent.eventName.startsWith("subscription_")) {
      // Save subscription events; obj is a Subscription
      const attributes = eventBody.data.attributes;
      const variantId = `${attributes.variant_id}`;

      // We assume that the Plan table is up to date.
      const plan = await prisma.lsSubscriptionPlan.findMany({
        where: {
          variantId: parseInt(variantId, 10),
        },
      });

      if (plan.length < 1) {
        processingError = `Plan with variantId ${variantId} not found.`;
      } else {
        // Update the subscription in the database.

        const priceId = attributes.first_subscription_item.price_id;

        // Get the price data from Lemon Squeezy.
        const priceData = await getPrice(priceId);
        if (priceData.error) {
          processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.`;
        }

        const isUsageBased = attributes.first_subscription_item.is_usage_based;
        const price = isUsageBased
          ? priceData.data?.data.attributes.unit_price_decimal
          : priceData.data?.data.attributes.unit_price;

        // Debug: Log the URLs object to see its structure
        console.log(
          "Webhook URLs object:",
          JSON.stringify(attributes.urls, null, 2),
        );

        // Safely access URL fields with proper null handling
        const urls = attributes.urls as any;
        const billingPortalUrl = urls?.customer_portal ?? null;
        const updatePaymentMethodUrl = urls?.update_payment_method ?? null;

        const updateData = {
          lemonSqueezyId: eventBody.data.id,
          orderId: attributes.order_id as number,
          name: attributes.user_name as string,
          email: attributes.user_email as string,
          status: attributes.status as string,
          statusFormatted: attributes.status_formatted as string,
          renewsAt: attributes.renews_at as string,
          endsAt: attributes.ends_at as string,
          trialEndsAt: attributes.trial_ends_at as string,
          billingPortalUrl,
          updatePaymentMethodUrl,
          price: price?.toString() ?? "",
          isPaused: false,
          subscriptionItemId: `${attributes.first_subscription_item.id}`,
          isUsageBased: attributes.first_subscription_item.is_usage_based,
          userId: eventBody.meta.custom_data.user_id,
          planId: plan[0].id,
        };

        console.log("Adding new Subscription to user in db");

        // Create/update subscription in the database.
        try {
          await prisma.lsUserSubscription.upsert({
            where: {
              lemonSqueezyId: updateData.lemonSqueezyId,
            },
            create: updateData,
            update: updateData,
          });
        } catch (error) {
          processingError = `Failed to upsert Subscription #${updateData.lemonSqueezyId} to the database.`;
          console.error(error);
        }
      }
    } else if (webhookEvent.eventName.startsWith("order_")) {
      // Save orders; eventBody is a "Order"
      /* Not implemented */
    } else if (webhookEvent.eventName.startsWith("license_")) {
      // Save license keys; eventBody is a "License key"
      /* Not implemented */
    }

    // Update the webhook event in the database.
    await prisma.lsWebhookEvent.update({
      where: {
        id: webhookEvent.id,
      },
      data: {
        processed: true,
        processingError,
      },
    });

    revalidatePath("/");
  }
}

/**
 * Retrieve subscriptions belonging to the currently signed-in user.
 *
 * @returns The list of `lsUserSubscription` records for the user, each including its related `subscriptionPlan`.
 */
export async function getUserSubscriptions() {
  // Get the signed in user or throw an error.
  const user = await getSignedInUserOrThrow();

  const userSubscriptions = await prisma.lsUserSubscription.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      subscriptionPlan: true,
    },
  });

  // console.log("User Subscriptions data:", userSubscriptions);

  return userSubscriptions;
}

/**
 * Cancel a Lemon Squeezy subscription and update the corresponding local record.
 *
 * @param id - LemonSqueezy subscription ID to cancel
 * @returns The LemonSqueezy API response for the cancellation request
 * @throws Error if the subscription is not found locally, if the Lemon Squeezy API returns an error, or if updating the database fails
 */
export async function cancelSub(id: string) {
  configureLemonSqueezy();

  // Get user subscriptions
  const userSubscriptions = await getUserSubscriptions();

  // Check if the subscription exists
  const subscription = userSubscriptions.find(
    (sub) => sub.lemonSqueezyId === id,
  );

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`);
  }

  const cancelledSub = await cancelSubscription(id);

  if (cancelledSub.error) {
    throw new Error(cancelledSub.error.message);
  }

  // Update the db
  try {
    await prisma.lsUserSubscription.update({
      where: {
        lemonSqueezyId: id,
      },
      data: {
        status: cancelledSub.data?.data.attributes.status,
        statusFormatted: cancelledSub.data?.data.attributes.status_formatted,
        endsAt: cancelledSub.data?.data.attributes.ends_at,
      },
    });
  } catch (error) {
    throw new Error(`Failed to cancel Subscription #${id} in the database.`);
  }

  revalidatePath("/");

  return cancelledSub;
}

/**
 * Pause a user's LemonSqueezy subscription and persist the updated status locally.
 *
 * @param id - The LemonSqueezy subscription ID to pause
 * @returns The LemonSqueezy API response for the updated (paused) subscription
 * @throws Error if the subscription with the given ID is not found or if updating the database fails
 */
export async function pauseUserSubscription(id: string) {
  configureLemonSqueezy();

  // Get user subscriptions
  const userSubscriptions = await getUserSubscriptions();

  // Check if the subscription exists
  const subscription = userSubscriptions.find(
    (sub) => sub.lemonSqueezyId === id,
  );

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`);
  }

  const returnedSub = await updateSubscription(id, {
    pause: {
      mode: "void",
    },
  });

  // Update the db
  try {
    await prisma.lsUserSubscription.update({
      where: {
        lemonSqueezyId: id,
      },
      data: {
        status: returnedSub.data?.data.attributes.status,
        statusFormatted: returnedSub.data?.data.attributes.status_formatted,
        endsAt: returnedSub.data?.data.attributes.ends_at,
        isPaused: returnedSub.data?.data.attributes.pause !== null,
      },
    });
  } catch (error) {
    throw new Error(`Failed to pause Subscription #${id} in the database.`);
  }

  revalidatePath("/");

  return returnedSub;
}

/**
 * Resumes a paused LemonSqueezy subscription identified by its LemonSqueezy ID.
 *
 * @param id - The LemonSqueezy subscription ID to unpause
 * @returns The updated subscription response returned by the LemonSqueezy API
 * @throws If the subscription does not exist for the current user
 * @throws If updating the local database record fails
 */
export async function unpauseUserSubscription(id: string) {
  configureLemonSqueezy();

  // Get user subscriptions
  const userSubscriptions = await getUserSubscriptions();

  // Check if the subscription exists
  const subscription = userSubscriptions.find(
    (sub) => sub.lemonSqueezyId === id,
  );

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`);
  }
  const returnedSub = await updateSubscription(id, {
    pause: null,
  });

  // Update the db
  try {
    await prisma.lsUserSubscription.update({
      where: {
        lemonSqueezyId: id,
      },
      data: {
        status: returnedSub.data?.data.attributes.status,
        statusFormatted: returnedSub.data?.data.attributes.status_formatted,
        endsAt: returnedSub.data?.data.attributes.ends_at,
        isPaused: returnedSub.data?.data.attributes.pause !== null,
      },
    });
  } catch (error) {
    throw new Error(`Failed to pause Subscription #${id} in the database.`);
  }

  revalidatePath("/");

  return returnedSub;
}

/**
 * Change a user's subscription from one plan to another on Lemon Squeezy and persist the update locally.
 *
 * @param currentPlanId - The local plan ID currently associated with the user's subscription
 * @param newPlanId - The local plan ID to switch the subscription to
 * @returns The Lemon Squeezy API response for the updated subscription
 * @throws Error if the current subscription is not found for the user
 * @throws Error if the new plan ID does not exist in the database
 * @throws Error if updating the local subscription record in the database fails
 */
export async function changePlan(currentPlanId: string, newPlanId: string) {
  configureLemonSqueezy();

  // Get user subscriptions
  const userSubscriptions = await getUserSubscriptions();

  // Check if the subscription exists
  const subscription = userSubscriptions.find(
    (sub) => sub.planId === currentPlanId,
  );

  if (!subscription) {
    throw new Error(
      `No subscription with plan id #${currentPlanId} was found.`,
    );
  }

  // Get the new plan details from the database.
  const newPlan = await prisma.lsSubscriptionPlan.findFirst({
    where: {
      id: newPlanId,
    },
  });

  if (!newPlan) {
    throw new Error(`Plan #${newPlanId} not found.`);
  }

  // Send request to Lemon Squeezy to change the subscription.
  const updatedSub = await updateSubscription(subscription.lemonSqueezyId, {
    variantId: newPlan.variantId,
  });

  // Save in db
  try {
    await prisma.lsUserSubscription.update({
      where: {
        lemonSqueezyId: subscription.lemonSqueezyId,
      },
      data: {
        planId: newPlanId,
        price: newPlan.price,
        endsAt: updatedSub.data?.data.attributes.ends_at,
      },
    });
  } catch (error) {
    throw new Error(
      `Failed to update Subscription #${subscription.lemonSqueezyId} in the database.`,
    );
  }

  revalidatePath("/");

  return updatedSub;
}

/**
 * Retrieve the URLs associated with a LemonSqueezy subscription.
 *
 * @param id - The LemonSqueezy subscription ID
 * @returns The subscription's `urls` object (for example `update_payment_method` and billing portal URLs) or `undefined` if not present
 * @throws Error when the LemonSqueezy API returns an error
 */
export async function getSubscriptionURLs(id: string) {
  configureLemonSqueezy();
  const subscription = await getSubscription(id);

  if (subscription.error) {
    throw new Error(subscription.error.message);
  }

  return subscription.data?.data.attributes.urls;
}