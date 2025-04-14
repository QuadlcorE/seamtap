"use client ";

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
import { getCustomersNoMeasurement } from "@/lib/serverlogic";
import { Customer } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";


export default function AddMeasurement({ variant = "default" }) {
  // State for forms
  const [measurementForm, setMeasurementForm] = useState({
    customer_id: "",
    chest: "",
    waist: "",
    hips: "",
    inseam: "",
    notes: "",
  });

  const router = useRouter();
  

  // State to store customers
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // State to handle submission loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hidden button to trigger closing the drawer
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Fetch customers when component mounts
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const customersData = await getCustomersNoMeasurement();
        setCustomers(customersData || []);
      } catch (error) {
        console.error("Error loading customers:", error);
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Function to handle form submission
  const handleRecordMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = {
      customer_id: measurementForm.customer_id
        ? parseInt(measurementForm.customer_id)
        : null,
      chest: measurementForm.chest ? parseFloat(measurementForm.chest) : null,
      waist: measurementForm.waist ? parseFloat(measurementForm.waist) : null,
      hips: measurementForm.hips ? parseFloat(measurementForm.hips) : null,
      inseam: measurementForm.inseam
        ? parseFloat(measurementForm.inseam)
        : null,
      notes: measurementForm.notes ? parseFloat(measurementForm.notes) : null,
    };
    console.log(dataToSubmit.customer_id);

    try {
      const response = await fetch("/api/addMeasurement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: dataToSubmit.customer_id,
          chest: dataToSubmit.chest,
          waist: dataToSubmit.waist,
          hips: dataToSubmit.hips,
          inseam: dataToSubmit.inseam,
          notes: dataToSubmit.notes,
        }),
      });
      console.log("customerID", dataToSubmit);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add Measurement");
      }

      toast.success("Measurement added successfully", {
        duration: 500,
        position: "top-center",
      });
      setMeasurementForm({
        customer_id: "",
        chest: "",
        waist: "",
        hips: "",
        inseam: "",
        notes: "",
      });

      // Programmatically close the drawer
      closeButtonRef.current?.click();
      router.refresh();
    } catch (error) {
      console.error("Error adding measurement:", error);
      toast.error("Failed to add measurement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {variant == "customer" ? (
          <Button size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add measurement
          </Button>
        ) : (
          <Button className="w-full justify-start" variant="outline" size="sm">
            Record Measurement
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="p-6 space-y-6 max-w-6xl mx-auto">
        <form onSubmit={handleRecordMeasurement} className="max-w-4xl mx-auto">
          <DrawerHeader>
            <DrawerTitle>Record Measurement</DrawerTitle>
            <DrawerDescription>
              Record measurements for a customer.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="measurement-customer">Customer *</Label>
              <Select
                value={measurementForm.customer_id}
                onValueChange={(value) =>
                  setMeasurementForm({
                    ...measurementForm,
                    customer_id: value,
                  })
                }
                required
              >
                <SelectTrigger id="measurement-customer">
                  <SelectValue
                    placeholder={
                      loading ? "loading customers" : "Select a customer"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem
                      key={customer.customer_id}
                      value={customer.customer_id.toString()}
                    >
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="measurement-chest">Chest (in)</Label>
                <Input
                  id="measurement-chest"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={measurementForm.chest}
                  onChange={(e) =>
                    setMeasurementForm({
                      ...measurementForm,
                      chest: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="measurement-waist">Waist (in)</Label>
                <Input
                  id="measurement-waist"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={measurementForm.waist}
                  onChange={(e) =>
                    setMeasurementForm({
                      ...measurementForm,
                      waist: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="measurement-hips">Hips (in)</Label>
                <Input
                  id="measurement-hips"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={measurementForm.hips}
                  onChange={(e) =>
                    setMeasurementForm({
                      ...measurementForm,
                      hips: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="measurement-inseam">Inseam (in)</Label>
                <Input
                  id="measurement-inseam"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={measurementForm.inseam}
                  onChange={(e) =>
                    setMeasurementForm({
                      ...measurementForm,
                      inseam: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="measurement-notes">Notes</Label>
              <Textarea
                id="measurement-notes"
                placeholder="Enter any additional notes"
                value={measurementForm.notes}
                onChange={(e) =>
                  setMeasurementForm({
                    ...measurementForm,
                    notes: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DrawerFooter>
            <Button type="submit">
              {isSubmitting ? (
                <>
                  {" "}
                  <Loader2 className="animate-spin mr-2" /> Submitting...{" "}
                </>
              ) : (
                "Add measurement"
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
