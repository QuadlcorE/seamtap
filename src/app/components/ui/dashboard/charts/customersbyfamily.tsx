"use client";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Import the data fetching function
import { getCustomersByFamily } from "@/lib/serverlogic"; // Adjust the path as needed

// Define the type for chart data
interface ChartDataItem {
  browser: string;
  visitors: number;
  fill: string;
}

export function CustomersByFamily() {
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);
  const [totalCustomers, setTotalCustomers] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  // Dynamic chart config based on data
  const [chartConfig, setChartConfig] = React.useState<ChartConfig>({
    visitors: {
      label: "Customers",
    }
  });

  // Fetch data when component mounts
  React.useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCustomersByFamily();
        if (data) {
          setChartData(data.chartData);
          setTotalCustomers(data.totalCustomers);
          
          // Create dynamic chart config based on the received data
          const newConfig: ChartConfig = {
            visitors: {
              label: "Customers",
            }
          };
          
          // Create color config for each family
          const colors = [
            "hsl(var(--chart-1))",
            "hsl(var(--chart-2))",
            "hsl(var(--chart-3))",
            "hsl(var(--chart-4))",
            "hsl(var(--chart-5))"
          ];
          
          // Fixed forEach with explicit typing
          data.chartData.forEach((item: ChartDataItem, index: number) => {
            newConfig[item.browser] = {
              label: item.browser.charAt(0).toUpperCase() + item.browser.slice(1),
              color: colors[index % colors.length]
            };
          });
          
          setChartConfig(newConfig);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-sm">Customers by Family</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 chart theme-light dark:theme-dark">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading data...</p>
          </div>
        ) : chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalCustomers.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Customers
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p>No customer data available</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total customers by family
        </div>
      </CardFooter>
    </Card>
  );
}