"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldDescription,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Loader2, Save, UserCircle, Mail } from "lucide-react";
import { api } from "~/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must not be longer than 50 characters.",
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialName: string;
  email: string;
}

export function ProfileForm({ initialName, email }: ProfileFormProps) {
  const utils = api.useUtils();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: initialName,
    },
  });

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: async () => {
      // Invalidate and refetch user profile
      await utils.user.getProfile.invalidate();

      // Refresh server components (NavUser, etc.)
      router.refresh();

      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully!",
        position: "top-right",
      });
    },
    onError: (error) => {
      toast.error("Update Failed", {
        description: error.message || "Failed to update profile. Please try again.",
        position: "top-right",
      });
    },
  });

  function onSubmit(data: ProfileFormValues) {
    updateProfile.mutate(data);
  }

  return (
    <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name" className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          Full Name
        </FieldLabel>
        <Input
          id="name"
          placeholder="Enter your full name"
          {...register("name")}
          disabled={updateProfile.isPending}
        />
        <FieldDescription>
          This is your public display name.
        </FieldDescription>
        <FieldError errors={errors.name ? [errors.name] : []} />
      </Field>

      {/* Email Field (Read-only) */}
      <Field>
        <FieldLabel htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Address
        </FieldLabel>
        <Input
          id="email"
          type="email"
          value={email}
          disabled
          className="bg-muted"
        />
        <FieldDescription>
          Contact support to change your email address.
        </FieldDescription>
      </Field>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          form="profile-form"
          disabled={updateProfile.isPending || !isDirty}
        >
          {updateProfile.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
