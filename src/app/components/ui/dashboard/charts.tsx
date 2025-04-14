import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart3 } from "lucide-react";
import { CustomersByFamily } from "./charts/customersbyfamily";

export default function Charts() {
  return (
    <div className="grid gap-4">
      {/* TODO: Fix charts */}
      <CustomersByFamily/>
    </div>
  );
}
