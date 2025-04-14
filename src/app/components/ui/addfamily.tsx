"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddFamily({ variant = "default"}) {
  // State for forms
  const [familyForm, setFamilyForm] = useState({
    family_name: "",
  });

  const router = useRouter();

  // State to handle submission loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hidden button to trigger closing the drawer
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Function to handle form submission
  const handleAddFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/addFamily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: familyForm.family_name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add family");
      }

      toast.success("Family added successfully", {
        duration: 5000,
        position: "top-center",
      });
      setFamilyForm({ family_name: "" });

      // Programmatically close the drawer
      closeButtonRef.current?.click();
      router.refresh();
    } catch (error) {
      console.error("Error adding family:", error);
      toast.error("Failed to add family");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {variant == "quickaction" ? (
          <Button variant="outline" className="w-full justify-start" size="sm">
            Add New Family
          </Button>
        ) : (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Family
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="p-6 space-y-6 max-w-6xl mx-auto">
        <form onSubmit={handleAddFamily} className="max-w-4xl mx-auto">
          <DrawerHeader>
            <DrawerTitle>Add New Family</DrawerTitle>
            <DrawerDescription>
              Create a new family record in the system.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="family-name">Family Name *</Label>
              <Input
                id="family-name"
                placeholder="Enter family name"
                value={familyForm.family_name}
                onChange={(e) =>
                  setFamilyForm({
                    ...familyForm,
                    family_name: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>
          <DrawerFooter>
            <Button type="submit">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Submitting...
                </>
              ) : (
                "Add Family"
              )}
            </Button>
            <DrawerClose asChild>
              <div>
                <Button className="w-full" variant="outline">
                  Cancel
                </Button>
                <button
                  className="hidden"
                  ref={closeButtonRef}
                  type="button"
                  aria-hidden="true"
                />
              </div>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
