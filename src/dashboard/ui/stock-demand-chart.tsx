"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/shared/ui/button";
import { BarChart3, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import type { StockData } from "@/dashboard/types";

interface StockDemandChartProps {
  data: StockData[];
  className?: string;
  forceMobile?: boolean; // allow explicit mobile emulation regardless of viewport width
}

export function StockDemandChart({ data, className, forceMobile = false }: StockDemandChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [echartsLib, setEchartsLib] = useState<any>(null);
  // We intentionally avoid overriding colors so ECharts uses its default palette.
  // Explicit palette to keep legend and lines consistent (Stock = red, Demand = green)
  const STOCK_COLOR = '#ef4444'; // Tailwind red-500
  const DEMAND_COLOR = '#10b981'; // Tailwind emerald-500
  const [visibleLines, setVisibleLines] = useState({
    stockLevel: true,
    demand: true,
  });
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [isViewportMobile, setIsViewportMobile] = useState(false); // actual viewport media query
  const mobile = forceMobile || isViewportMobile; // unified mobile flag

  // Track viewport for responsive tweaks
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 640px)');
  const apply = (e: MediaQueryList | MediaQueryListEvent) => setIsViewportMobile('matches' in e ? e.matches : mq.matches);
    apply(mq);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Resize when forceMobile flag changes (layout width wrapper might change before media query would fire)
  useEffect(() => {
    if (!chartInstance.current) return;
    // slight delay lets DOM layout settle
    const id = setTimeout(() => {
      try { chartInstance.current?.resize(); } catch {}
    }, 30);
    return () => clearTimeout(id);
  }, [forceMobile]);


  useEffect(() => {
    const loadECharts = async () => {
      try {
        console.log("[v0] Loading ECharts...");
        const echarts = await import("echarts");
        setEchartsLib(echarts);
        console.log("[v0] ECharts loaded successfully");
      } catch (error) {
        console.error("[v0] Failed to load ECharts:", error);
      }
    };

    loadECharts();
  }, []);

  // No dynamic CSS variable color extraction needed now.

  useEffect(() => {
    if (!echartsLib || !chartRef.current || !data.length) {
      console.log("[v0] Chart not ready:", {
        echartsLib: !!echartsLib,
        chartRef: !!chartRef.current,
        dataLength: data.length,
      });
      return;
    }

    // Initialize chart if not already done
    if (!chartInstance.current) {
      chartInstance.current = echartsLib.init(chartRef.current);
      console.log("[v0] Chart instance created");
    }

    const chart = chartInstance.current;

    // Prepare data for ECharts
    const months = data.map((item) => item.month);
    const stockData = data.map((item) =>
      visibleLines.stockLevel ? item.stockLevel : null
    );
    const demandData = data.map((item) =>
      visibleLines.demand ? item.demand : null
    );

    // Find the index where projected data starts
    const projectedStartIndex = data.findIndex((item) => item.projected);

  const seriesType = chartType; // 'line' or 'bar'
  const option = {
      tooltip: {
        trigger: "axis",
    // Use default styling; minimal custom formatting
        formatter: (params: any) => {
          let result = `<div style="font-weight: 500; margin-bottom: 4px;">${params[0].axisValue}</div>`;
          params.forEach((param: any) => {
            if (
              param.seriesName === "Stock Level" &&
              visibleLines.stockLevel &&
              param.value !== null
            ) {
              result += `<div style=\"font-size: 12px; color: ${STOCK_COLOR};\">Stock Level: ${param.value.toLocaleString()} units</div>`;
            }
            if (
              param.seriesName === "Demand" &&
              visibleLines.demand &&
              param.value !== null
            ) {
              result += `<div style=\"font-size: 12px; color: ${DEMAND_COLOR};\">Demand: ${param.value.toLocaleString()} units</div>`;
            }
          });
          return result;
        },
      },
      legend: {
        show: false,
      },
      grid: {
  left: mobile ? 8 : "3%",
  right: mobile ? 8 : "4%",
  bottom: mobile ? 40 : "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: months,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
  axisLabel: { fontSize: mobile ? 10 : 12 },
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontSize: mobile ? 10 : 12,
          formatter: (value: number) => `${(value / 1000).toFixed(0)}K`,
        },
        splitLine: {
          lineStyle: {
            color: '#ddd',
            opacity: 0.4,
            type: "dashed",
          },
        },
      },
  dataZoom: mobile ? [
        { type: 'inside', xAxisIndex: 0 },
        { type: 'slider', xAxisIndex: 0, height: 16, bottom: 8, showDetail: false, brushSelect: false }
      ] : undefined,
      series: [
        {
          name: "Stock Level",
          type: seriesType,
          data: stockData,
          ...(seriesType === 'line'
            ? { lineStyle: { width: 2, color: STOCK_COLOR }, symbol: 'circle', symbolSize: mobile ? 3 : 4 }
            : { itemStyle: { color: STOCK_COLOR }, barGap: '20%', barWidth: mobile ? 10 : 14 }),
          itemStyle: seriesType === 'line' ? { color: STOCK_COLOR } : { color: STOCK_COLOR },
          emphasis: { focus: 'series' },
          connectNulls: false,
        },
        {
          name: "Demand",
          type: seriesType,
          data: demandData,
          ...(seriesType === 'line'
            ? { lineStyle: { width: 2, color: DEMAND_COLOR }, symbol: 'circle', symbolSize: mobile ? 3 : 4 }
            : { itemStyle: { color: DEMAND_COLOR }, barGap: '20%', barWidth: mobile ? 10 : 14 }),
          itemStyle: seriesType === 'line' ? { color: DEMAND_COLOR } : { color: DEMAND_COLOR },
          emphasis: { focus: 'series' },
          connectNulls: false,
        },
  // Projection separator removed per request (dashed vertical line eliminated)
      ],
    };

    chart.setOption(option, true);
    console.log("[v0] Chart option set successfully");

    // Handle resize
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, visibleLines, echartsLib, chartType, mobile]);

  // Observe size changes of container (including parent) to trigger chart resize for better fit
  useEffect(() => {
    if (!chartRef.current || !chartInstance.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      try { chartInstance.current?.resize(); } catch {}
    });
    ro.observe(chartRef.current);
    if (chartRef.current.parentElement) ro.observe(chartRef.current.parentElement);
    return () => ro.disconnect();
  }, [echartsLib]);


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        console.log("[v0] Chart disposed");
      }
    };
  }, []);

  const toggleLine = (dataKey: keyof typeof visibleLines) => {
    setVisibleLines((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
    console.log("[v0] Toggled line:", dataKey);
  };

  if (!echartsLib) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Stock vs Demand Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            Loading chart...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className ? `w-full ${className}` : 'w-full'}>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-base sm:text-lg">Stock vs Demand Forecast</CardTitle>
          {/* Mobile toggle row (separate line) */}
          <div className="flex sm:hidden justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChartType(t => t === 'line' ? 'bar' : 'line')}
              className="gap-2"
              aria-label={chartType === 'line' ? 'Switch to bar chart view' : 'Switch to line chart view'}
            >
              {chartType === 'line' ? <BarChart3 className="h-4 w-4" /> : <LineChart className="h-4 w-4" />}
              <span>{chartType === 'line' ? 'Bar' : 'Line'}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop / tablet control bar */}
        <div className="hidden sm:flex mb-3 items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground select-none">
            <button
              type="button"
              onClick={() => toggleLine('stockLevel')}
              aria-pressed={visibleLines.stockLevel}
              className={`flex items-center gap-2 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring rounded-sm ${visibleLines.stockLevel ? 'opacity-100' : 'opacity-40'}`}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STOCK_COLOR }} />
              <span>{visibleLines.stockLevel ? 'Stock Level' : 'Stock Hidden'}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleLine('demand')}
              aria-pressed={visibleLines.demand}
              className={`flex items-center gap-2 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring rounded-sm ${visibleLines.demand ? 'opacity-100' : 'opacity-40'}`}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: DEMAND_COLOR }} />
              <span>{visibleLines.demand ? 'Demand' : 'Demand Hidden'}</span>
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChartType(t => t === 'line' ? 'bar' : 'line')}
            className="gap-2"
            aria-label={chartType === 'line' ? 'Switch to bar chart view' : 'Switch to line chart view'}
          >
            {chartType === 'line' ? <BarChart3 className="h-4 w-4" /> : <LineChart className="h-4 w-4" />}
            <span>{chartType === 'line' ? 'Bar View' : 'Line View'}</span>
          </Button>
        </div>
  <div ref={chartRef} style={{ width: '100%', height: mobile ? 300 : 400 }} />

  <div className="flex justify-center space-x-6 mt-4">
          <button
            onClick={() => toggleLine("stockLevel")}
            className={`flex items-center space-x-2 text-sm transition-opacity hover:opacity-80 ${
              visibleLines.stockLevel ? "opacity-100" : "opacity-50"
            }`}
          >
            <div className="w-3 h-0.5" style={{ backgroundColor: STOCK_COLOR }} />
            <span>Stock Level</span>
          </button>
          <button
            onClick={() => toggleLine("demand")}
            className={`flex items-center space-x-2 text-sm transition-opacity hover:opacity-80 ${
              visibleLines.demand ? "opacity-100" : "opacity-50"
            }`}
          >
            <div className="w-3 h-0.5" style={{ backgroundColor: DEMAND_COLOR }} />
            <span>Demand</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
