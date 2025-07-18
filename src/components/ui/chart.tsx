import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
export const THEMES = {
  light: {
    backgroundColor: 'white',
    textColor: '#1f2937',
    gridColor: '#e5e7eb',
    lineColor: '#10b981',
    areaColor: 'rgba(16, 185, 129, 0.1)',
    pointColor: '#10b981',
    pointBorderColor: 'white',
    pointBackgroundColor: '#10b981',
    barColor: '#10b981',
    barBorderColor: 'white',
    barBackgroundColor: '#10b981',
    barHoverColor: '#059669',
    barHoverBorderColor: 'white',
    barHoverBackgroundColor: '#059669',
    barActiveColor: '#047857',
    barActiveBorderColor: 'white',
    barActiveBackgroundColor: '#047857',
    barInactiveColor: '#d1fae5',
    barInactiveBorderColor: 'white',
    barInactiveBackgroundColor: '#d1fae5',
    barSelectedColor: '#10b981',
    barSelectedBorderColor: 'white',
    barSelectedBackgroundColor: '#10b981',
    barUnselectedColor: '#d1fae5',
    barUnselectedBorderColor: 'white',
    barUnselectedBackgroundColor: '#d1fae5',
    barDisabledColor: '#d1fae5',
    barDisabledBorderColor: 'white',
    barDisabledBackgroundColor: '#d1fae5',
    barFocusColor: '#10b981',
    barFocusBorderColor: 'white',
    barFocusBackgroundColor: '#10b981',
    barHoverFocusColor: '#059669',
    barHoverFocusBorderColor: 'white',
    barHoverFocusBackgroundColor: '#059669',
    barActiveFocusColor: '#047857',
    barActiveFocusBorderColor: 'white',
    barActiveFocusBackgroundColor: '#047857',
    barInactiveFocusColor: '#d1fae5',
    barInactiveFocusBorderColor: 'white',
    barInactiveFocusBackgroundColor: '#d1fae5',
    barSelectedFocusColor: '#10b981',
    barSelectedFocusBorderColor: 'white',
    barSelectedFocusBackgroundColor: '#10b981',
    barUnselectedFocusColor: '#d1fae5',
    barUnselectedFocusBorderColor: 'white',
    barUnselectedFocusBackgroundColor: '#d1fae5',
    barDisabledFocusColor: '#d1fae5',
    barDisabledFocusBorderColor: 'white',
    barDisabledFocusBackgroundColor: '#d1fae5'
  },
  dark: {
    backgroundColor: '#1f2937',
    textColor: 'white',
    gridColor: '#374151',
    lineColor: '#10b981',
    areaColor: 'rgba(16, 185, 129, 0.1)',
    pointColor: '#10b981',
    pointBorderColor: '#1f2937',
    pointBackgroundColor: '#10b981',
    barColor: '#10b981',
    barBorderColor: '#1f2937',
    barBackgroundColor: '#10b981',
    barHoverColor: '#059669',
    barHoverBorderColor: '#1f2937',
    barHoverBackgroundColor: '#059669',
    barActiveColor: '#047857',
    barActiveBorderColor: '#1f2937',
    barActiveBackgroundColor: '#047857',
    barInactiveColor: '#d1fae5',
    barInactiveBorderColor: '#1f2937',
    barInactiveBackgroundColor: '#d1fae5',
    barSelectedColor: '#10b981',
    barSelectedBorderColor: '#1f2937',
    barSelectedBackgroundColor: '#10b981',
    barUnselectedColor: '#d1fae5',
    barUnselectedBorderColor: '#1f2937',
    barUnselectedBackgroundColor: '#d1fae5',
    barDisabledColor: '#d1fae5',
    barDisabledBorderColor: '#1f2937',
    barDisabledBackgroundColor: '#d1fae5',
    barFocusColor: '#10b981',
    barFocusBorderColor: '#1f2937',
    barFocusBackgroundColor: '#10b981',
    barHoverFocusColor: '#059669',
    barHoverFocusBorderColor: '#1f2937',
    barHoverFocusBackgroundColor: '#059669',
    barActiveFocusColor: '#047857',
    barActiveFocusBorderColor: '#1f2937',
    barActiveFocusBackgroundColor: '#047857',
    barInactiveFocusColor: '#d1fae5',
    barInactiveFocusBorderColor: '#1f2937',
    barInactiveFocusBackgroundColor: '#d1fae5',
    barSelectedFocusColor: '#10b981',
    barSelectedFocusBorderColor: '#1f2937',
    barSelectedFocusBackgroundColor: '#10b981',
    barUnselectedFocusColor: '#d1fae5',
    barUnselectedFocusBorderColor: '#1f2937',
    barUnselectedFocusBackgroundColor: '#d1fae5',
    barDisabledFocusColor: '#d1fae5',
    barDisabledFocusBorderColor: '#1f2937',
    barDisabledFocusBackgroundColor: '#d1fae5'
  }
};

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    }: any,
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !(payload as any[])?.length) {
        return null
      }

      const [item] = payload as any[]
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value = itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload as any[])}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !(payload as any[])?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {(payload as any[]).map((item: any, index: number) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || (item as any).payload?.fill || item.color; // ensure item is cast as any

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
      hideIcon?: boolean
      nameKey?: string
      payload?: any
      verticalAlign?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!(payload as any[])?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {(payload as any[]).map((item: any) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
