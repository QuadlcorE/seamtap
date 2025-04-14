"use client";

import React, { useState, useEffect, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFamilies } from "@/lib/serverlogic";
// import { Family } from "../../../../prisma/generated/client";
// import { Family } from "@prisma/client";
import { Family } from "../../../../prisma/generated/client";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";


export default function AddCustomer({ variant = "default" }) {
  const router = useRouter();
  // State for forms
  const [customerForm, setCustomerForm] = useState({
    user_id: "",
    name: "",
    family_id: "",
  });

  // State to store families
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);

  // State to handle submission loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hidden button to trigger closing the drawer
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Fetch families when component mounts
  useEffect(() => {
    const loadFamilies = async () => {
      try {
        const familiesData = await getFamilies();
        setFamilies(familiesData || []);
      } catch (error) {
        console.error("Error loading families:", error);
        toast.error("Failed to load families");
      } finally {
        setLoading(false);
      }
    };

    loadFamilies();
  }, []);

  // Function to handle form submission
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/addCustomers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: customerForm.name,
          family_id: customerForm.family_id || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add customer");
      }

      toast.success("Customer added successfully", {
        duration: 5000,
        position: "top-center",
      });
      setCustomerForm({ user_id: "", name: "", family_id: "" });

      // Programmatically close the drawer
      closeButtonRef.current?.click();
      router.refresh();

    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("Failed to add customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {variant == "quickaction" ? (
          <Button variant='outline' className='w-full justify-start' size='sm'>
            Add New Customer
          </Button>
        ) : (
          <Button className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Add New Customer
          </Button>
        )}

        {/* <Button variant="outline" className="w-full justify-start" size="sm">
          Add New Customer
        </Button> */}
      </DrawerTrigger>
      <DrawerContent className='p-6 space-y-6 max-w-6xl mx-auto'>
        <form onSubmit={handleAddCustomer} className='max-w-4xl mx-auto'>
          <DrawerHeader>
            <DrawerTitle>Add New Customer</DrawerTitle>
            <DrawerDescription>
              Create a new customer record in the system.
            </DrawerDescription>
          </DrawerHeader>
          <div className='p-4 space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='customer-name'>Name *</Label>
              <Input
                id='customer-name'
                placeholder='Enter customer name'
                value={customerForm.name}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='customer-family'>Family (Optional)</Label>
              <Select
                value={customerForm.family_id}
                onValueChange={(value) =>
                  setCustomerForm({ ...customerForm, family_id: value })
                }
              >
                <SelectTrigger id='customer-family'>
                  <SelectValue
                    placeholder={
                      loading ? "Loading families..." : "Select a family"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {families.length > 0 ? (
                    families.map((family) => (
                      <SelectItem
                        key={family.family_id}
                        value={family.family_id.toString()}
                      >
                        {family.family_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value='no-families' disabled>
                      {loading ? "Loading..." : "No families available"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DrawerFooter>
            <Button type='submit'>
              {isSubmitting ? (
                <>
                  {" "}
                  <Loader2 className='animate-spin mr-2' /> Submitting...
                </>
              ) : (
                "Add Customer"
              )}
            </Button>
            <DrawerClose asChild>
              <div>
                <Button className='w-full' variant='outline'>
                  Cancel
                </Button>
                <button
                  className='hidden'
                  ref={closeButtonRef}
                  type='button'
                  aria-hidden='true'
                />
              </div>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
