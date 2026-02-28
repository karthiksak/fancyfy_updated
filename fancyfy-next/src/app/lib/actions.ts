"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
    // Successful login — redirect to the admin dashboard
    redirect("/admin");
}

export async function createProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const imageUrls = [
        formData.get("image1") as string,
        formData.get("image2") as string,
        formData.get("image3") as string,
        formData.get("image4") as string,
    ].filter((url) => url && url.trim() !== "");
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;

    await prisma.product.create({
        data: {
            name,
            description,
            price,
            images: JSON.stringify(imageUrls),
            category,
            inStock: status === "active"
        }
    });

    revalidatePath("/admin/products");
    redirect("/admin/products");
}


export async function deleteProduct(id: string) {
    "use server";
    try {
        await prisma.product.delete({
            where: { id }
        });
        revalidatePath("/admin/products");
    } catch (error) {
        throw error;
    }
}
