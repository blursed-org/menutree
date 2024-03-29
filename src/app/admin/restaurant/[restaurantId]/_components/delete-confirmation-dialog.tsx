"use client";

import { AiOutlineLoading3Quarters as Loading } from "react-icons/ai";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Restaurant } from "@prisma/client";

import { deleteRestaurantById } from "@/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface IDeleteConfirmationDialogProps {
  restaurant: Restaurant;
}

export function DeleteConfirmationDialog({
  restaurant,
}: IDeleteConfirmationDialogProps) {
  const formSchema = z.object({
    restaurantName: z
      .string()
      .refine(
        (value) => value === restaurant.name,
        "Please confirm that you are typing the restaurant name correctly!",
      ),
    confirmation: z
      .string()
      .toLowerCase()
      .refine(
        (value) => value === "delete my restaurant",
        "Please confirm that you want to delete your restaurant!",
      ),
  });

  type DeleteConfirmationFormSchemaType = z.infer<typeof formSchema>;

  const form = useForm<DeleteConfirmationFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: "",
      confirmation: "",
    },
  });

  async function onSubmit() {
    try {
      await deleteRestaurantById(restaurant.id);
      toast.success("Restaurant deleted successfully");
    } catch (err) {
      toast.error("Failed to delete restaurant");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent className="w-[480px]">
        <DialogHeader>
          <DialogTitle>Delete Restaurant</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            restaurant from our servers.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="restaurantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Enter the restaurant name <b>{restaurant.name}</b> to
                    continue:
                  </FormLabel>
                  <FormControl>
                    <Input disabled={form.formState.isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    To verify, type <b>delete my restaurant</b> below:
                  </FormLabel>
                  <FormControl>
                    <Input disabled={form.formState.isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-1 justify-between">
              <DialogClose disabled={form.formState.isSubmitting} asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loading className="mr-2 size-4 animate-spin" />
                )}
                Delete
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
