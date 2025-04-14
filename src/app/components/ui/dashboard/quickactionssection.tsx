"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddCustomer from "../addcustomer";
import AddFamily from "../addfamily";
import { Toaster } from "@/components/ui/sonner";
import AddMeasurement from "../addmeasurement";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you can perform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Add New Customer Drawer */}
        <AddCustomer variant="quickaction" />

        {/* Add New Family Drawer */}
        <AddFamily variant="quickaction"/>
        {/* Record Measurement Drawer */}
        <AddMeasurement />
      </CardContent>
      <Toaster />
    </Card>
  );
}
