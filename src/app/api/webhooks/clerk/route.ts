import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

import {
  createUser,
  deleteUser,
  updateUser,
} from "@/lib/actions/user.actions";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;

    // CREATE
    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        image_url,
        first_name,
        last_name,
        username,
      } = evt.data;

      const email = email_addresses[0]?.email_address;

      if (!email) {
        return NextResponse.json(
          { error: "User email is missing" },
          { status: 400 }
        );
      }

      const user = {
        clerkId: id,
        email,
        username: username ?? "",
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        photo: image_url,
      };

      const newUser = await createUser(user);

      if (newUser) {
        const client = await clerkClient();

        await client.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id.toString(),
          },
        });
      }

      return NextResponse.json(
        { message: "OK", user: newUser },
        { status: 200 }
      );
    }

    // UPDATE
    if (eventType === "user.updated") {
      const {
        id,
        image_url,
        first_name,
        last_name,
        username,
      } = evt.data;

      const user = {
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        username: username ?? "",
        photo: image_url,
      };

      const updatedUser = await updateUser(id, user);

      return NextResponse.json(
        { message: "OK", user: updatedUser },
        { status: 200 }
      );
    }

    // DELETE
    if (eventType === "user.deleted") {
      const { id } = evt.data;

      if (!id) {
        return NextResponse.json(
          { error: "Clerk user ID is missing" },
          { status: 400 }
        );
      }

      const deletedUser = await deleteUser(id);

      return NextResponse.json(
        { message: "OK", user: deletedUser },
        { status: 200 }
      );
    }

    console.log(`Unhandled Clerk webhook event: ${eventType}`);

    return NextResponse.json(
      { message: "Event ignored" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing Clerk webhook:", error);

    return NextResponse.json(
      { error: "Webhook verification or processing failed" },
      { status: 400 }
    );
  }
}