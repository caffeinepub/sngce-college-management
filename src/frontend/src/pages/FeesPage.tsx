import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, DollarSign } from "lucide-react";
import { Degree } from "../backend";
import { useTheme } from "../contexts/ThemeContext";
import { useAllFeeStructures } from "../hooks/useQueries";

const degreeLabels: Record<string, string> = {
  bTech: "B.Tech",
  mTech: "M.Tech",
  mba: "MBA",
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function FeesPage() {
  const { data: feeStructures, isLoading } = useAllFeeStructures();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <img
          src="/assets/uploads/college1-3-1.jpg"
          alt="Campus"
          className="w-full h-full object-cover"
          style={{
            filter: isDark
              ? "brightness(0.55) saturate(0.8)"
              : "brightness(0.70) saturate(0.9)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.20)",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="glass-sm p-2 rounded-xl">
              <DollarSign size={20} className="text-foreground/70" />
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
              Fee Structure
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Detailed year-wise fee breakdown for all programs. Fees are subject
            to university revision.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3" data-ocid="fees.loading_state">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
              <div key={i} className="glass p-5 flex flex-col gap-3">
                <Skeleton className="h-5 w-48 bg-foreground/10" />
                <Skeleton className="h-4 w-32 bg-foreground/10" />
              </div>
            ))}
          </div>
        ) : !feeStructures?.length ? (
          <div
            className="glass rounded-2xl p-12 text-center"
            data-ocid="fees.empty_state"
          >
            <DollarSign
              size={40}
              className="text-muted-foreground mx-auto mb-3"
            />
            <p className="text-muted-foreground">
              Fee structure not available.
            </p>
          </div>
        ) : (
          <Accordion type="multiple" className="flex flex-col gap-3">
            {feeStructures.map((fs, i) => {
              const total = fs.yearSemesterBreakdown.reduce(
                (acc, row) => acc + row.amount,
                0,
              );
              const key = `${fs.course.branch}-${fs.course.degree}`;
              return (
                <AccordionItem
                  key={key}
                  value={`fee-${i}`}
                  className="glass border-0 rounded-2xl overflow-hidden"
                  data-ocid={`fees.item.${i + 1}`}
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-foreground/5 transition-colors [&>svg]:hidden">
                    <div className="flex items-center justify-between w-full gap-4">
                      <div className="text-left">
                        <p className="font-display font-semibold text-foreground text-base">
                          {fs.course.branch}
                        </p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {degreeLabels[fs.course.degree] ?? fs.course.degree} ·{" "}
                          {fs.course.durationYears} Years
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-foreground font-semibold text-sm">
                          {formatAmount(total)} total
                        </span>
                        <ChevronDown
                          size={16}
                          className="text-muted-foreground"
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5">
                    <div className="glass-sm rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left text-xs text-muted-foreground font-medium px-4 py-2.5">
                              Year / Semester
                            </th>
                            <th className="text-right text-xs text-muted-foreground font-medium px-4 py-2.5">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {fs.yearSemesterBreakdown.map((row) => (
                            <tr
                              key={row.yearOrSemester}
                              className="border-b border-white/5 last:border-0 hover:bg-foreground/5"
                            >
                              <td className="px-4 py-3 text-foreground">
                                {row.yearOrSemester}
                              </td>
                              <td className="px-4 py-3 text-foreground text-right font-medium">
                                {formatAmount(row.amount)}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-foreground/5">
                            <td className="px-4 py-3 font-semibold text-foreground">
                              Total
                            </td>
                            <td className="px-4 py-3 font-bold text-foreground text-right">
                              {formatAmount(total)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
}
